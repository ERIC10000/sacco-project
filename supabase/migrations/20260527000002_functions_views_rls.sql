-- ╔════════════════════════════════════════════════════════════════════╗
-- ║   Functions, views, triggers, RLS policies, realtime               ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- ─── helper: is current user staff of a given SACCO? ─────────────
create or replace function public.is_staff_of(target_sacco uuid)
returns boolean
language sql stable security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.staff_users
    where auth_user_id = auth.uid()
      and sacco_id     = target_sacco
      and is_active    = true
  );
$$;

create or replace function public.is_admin_of(target_sacco uuid)
returns boolean
language sql stable security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.staff_users
    where auth_user_id = auth.uid()
      and sacco_id     = target_sacco
      and role in ('ADMIN','MANAGER')
      and is_active    = true
  );
$$;

create or replace function public.current_member_id()
returns uuid
language sql stable security definer
set search_path = public, auth
as $$ select id from public.members where auth_user_id = auth.uid() limit 1; $$;

-- ─── Calculate dividend amount for a member ───────────────────────
create or replace function public.calculate_dividend(
    p_shares          int,
    p_annual_rate_pct numeric,
    p_share_price     numeric,
    p_period_days     int default 90        -- quarterly
)
returns numeric
language plpgsql immutable as $$
declare
    annual_value numeric;
begin
    annual_value := p_shares * p_share_price * (p_annual_rate_pct / 100.0);
    return round(annual_value * (p_period_days::numeric / 365.0), 2);
end; $$;

-- ─── Calculate loan repayment schedule values ─────────────────────
create or replace function public.calculate_loan_payment(
    p_principal     numeric,
    p_annual_rate   numeric,
    p_term_months   int
)
returns table (monthly_payment numeric, total_payable numeric)
language plpgsql immutable as $$
declare
    total numeric;
    monthly numeric;
begin
    -- Simple flat-rate interest (typical for SACCOs)
    total   := p_principal * (1 + (p_annual_rate / 100.0) * (p_term_months / 12.0));
    monthly := round(total / p_term_months, 2);
    return query select monthly, round(total, 2);
end; $$;

-- ─── Process a contribution: insert txn + update balance atomically ─
create or replace function public.process_contribution(
    p_member_id   uuid,
    p_amount      numeric,
    p_method      txn_method,
    p_reference   text,
    p_description text default 'Member contribution'
)
returns uuid
language plpgsql security definer
set search_path = public as $$
declare
    v_sacco_id  uuid;
    v_account   uuid;
    v_new_bal   numeric;
    v_txn_id    uuid;
begin
    -- Resolve SACCO + primary savings account
    select sacco_id into v_sacco_id from public.members where id = p_member_id;
    if v_sacco_id is null then raise exception 'Member % not found', p_member_id; end if;

    select id into v_account
    from public.savings_accounts
    where member_id = p_member_id and is_primary and is_active
    limit 1;

    if v_account is null then
        -- Auto-create primary savings account
        insert into public.savings_accounts (member_id, account_no, product, is_primary)
        values (p_member_id, 'SAV-' || extract(epoch from now())::bigint, 'REGULAR', true)
        returning id into v_account;
    end if;

    -- Update balance
    update public.savings_accounts
       set balance = balance + p_amount
     where id = v_account
     returning balance into v_new_bal;

    -- Insert the transaction
    insert into public.transactions (
        sacco_id, member_id, savings_account_id,
        txn_type, amount, method, reference, description,
        balance_after, status, initiated_by
    )
    values (
        v_sacco_id, p_member_id, v_account,
        'CONTRIBUTION', p_amount, p_method, p_reference, p_description,
        v_new_bal, 'COMPLETED', auth.uid()
    )
    returning id into v_txn_id;

    -- Update goal progress if there is any active goal
    update public.savings_goals
       set current_amount = current_amount + p_amount
     where member_id = p_member_id and status = 'ACTIVE';

    -- Push a notification to the member
    insert into public.notifications (member_id, title, message, type)
    values (
        p_member_id,
        'Contribution received',
        'Your contribution of KES ' || trim(trailing '0' from p_amount::text) || ' has been recorded.',
        'SUCCESS'
    );

    return v_txn_id;
end; $$;

-- ─── Approve loan: changes status, computes repayment schedule ───
create or replace function public.approve_loan(
    p_loan_id          uuid,
    p_approved_amount  numeric default null
)
returns void
language plpgsql security definer
set search_path = public as $$
declare
    v_loan     record;
    v_payment  numeric;
    v_total    numeric;
    v_amount   numeric;
    v_staff_id uuid;
begin
    select id into v_staff_id from public.staff_users where auth_user_id = auth.uid();

    select * into v_loan from public.loans where id = p_loan_id;
    if v_loan is null then raise exception 'Loan not found'; end if;
    if v_loan.status <> 'PENDING' then raise exception 'Only PENDING loans can be approved'; end if;

    v_amount := coalesce(p_approved_amount, v_loan.amount_requested);

    select monthly_payment, total_payable
      into v_payment, v_total
      from public.calculate_loan_payment(v_amount, v_loan.interest_rate, v_loan.term_months);

    update public.loans
       set status            = 'APPROVED',
           amount_approved   = v_amount,
           monthly_payment   = v_payment,
           total_payable     = v_total,
           remaining_balance = v_amount,
           approved_at       = now(),
           approved_by       = v_staff_id,
           next_payment_date = (now()::date + interval '1 month')::date
     where id = p_loan_id;

    -- Generate repayment schedule
    insert into public.loan_repayments (loan_id, installment_no, due_date, expected_amount)
    select v_loan.id,
           gs,
           ((now()::date + (gs || ' month')::interval))::date,
           v_payment
      from generate_series(1, v_loan.term_months) gs;

    -- Notify member
    insert into public.notifications (member_id, title, message, type)
    values (
        v_loan.member_id,
        'Loan approved ✅',
        'Your loan of KES ' || v_amount || ' has been approved.',
        'SUCCESS'
    );
end; $$;

-- ─── Disburse loan: transfer funds via transaction ───────────────
create or replace function public.disburse_loan(p_loan_id uuid)
returns uuid
language plpgsql security definer
set search_path = public as $$
declare
    v_loan record;
    v_txn  uuid;
    v_staff uuid;
begin
    select id into v_staff from public.staff_users where auth_user_id = auth.uid();
    select * into v_loan from public.loans where id = p_loan_id;
    if v_loan.status <> 'APPROVED' then raise exception 'Only APPROVED loans can be disbursed'; end if;

    insert into public.transactions (
        sacco_id, member_id, txn_type, amount, method, reference,
        description, status, processed_by
    ) values (
        v_loan.sacco_id, v_loan.member_id, 'LOAN_DISBURSEMENT',
        v_loan.amount_approved, 'BANK_TRANSFER',
        'DSB-' || substring(v_loan.loan_no from 4),
        v_loan.loan_no || ' disbursed', 'COMPLETED', v_staff
    ) returning id into v_txn;

    update public.loans
       set status         = 'DISBURSED',
           disbursed_at   = now(),
           disbursed_by   = v_staff
     where id = p_loan_id;

    return v_txn;
end; $$;

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║                            VIEWS                                    ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- ─── Member summary (joined member + savings + loans) ─────────────
create or replace view public.v_member_summary as
select
    m.*,
    coalesce(sa.balance, 0)         as total_savings,
    coalesce(sa.shares_owned, 0)    as shares_owned,
    (select count(*) from public.loans l
        where l.member_id = m.id and l.status = 'DISBURSED') as active_loans,
    (select sum(amount) from public.transactions t
        where t.member_id = m.id
          and t.txn_type  = 'CONTRIBUTION'
          and t.status    = 'COMPLETED')                     as lifetime_contributions
from public.members m
left join public.savings_accounts sa on sa.member_id = m.id and sa.is_primary;

-- ─── Loan portfolio with member details ──────────────────────────
create or replace view public.v_loan_portfolio as
select
    l.*,
    m.first_name || ' ' || m.last_name as member_name,
    m.membership_no                     as member_membership_no,
    m.phone                             as member_phone,
    m.avatar_color
from public.loans l
join public.members m on m.id = l.member_id;

-- ─── Monthly contributions aggregation (for charts) ──────────────
create or replace view public.v_monthly_contributions as
select
    sacco_id,
    date_trunc('month', occurred_at)::date as month,
    count(*)                                as count,
    sum(amount)                             as total_amount
  from public.transactions
 where txn_type = 'CONTRIBUTION' and status = 'COMPLETED'
group by sacco_id, date_trunc('month', occurred_at);

-- ─── Member's dividend history with payout details ───────────────
create or replace view public.v_dividend_history as
select
    dp.member_id,
    p.period_label,
    p.period_start,
    p.period_end,
    p.annual_rate_pct,
    dp.shares_at_payout,
    dp.amount,
    dp.paid_at,
    dp.status
  from public.dividend_payouts dp
  join public.dividend_periods p on p.id = dp.dividend_period_id;

-- ─── Member credit-score (creative) ───────────────────────────────
-- Score 0-1000 based on: contribution consistency + loan repayment + tenure
create or replace view public.v_member_credit_score as
select
    m.id  as member_id,
    least(
        1000,
        round(
            -- Contribution consistency (max 400)
            (coalesce((
                select count(*)
                  from public.transactions t
                 where t.member_id = m.id
                   and t.txn_type = 'CONTRIBUTION'
                   and t.status   = 'COMPLETED'
                   and t.occurred_at > now() - interval '12 months'
            ), 0) * 35)
            -- Loan repayment performance (max 350)
          + (coalesce((
                select count(*) * 50
                  from public.loans l
                 where l.member_id = m.id
                   and l.status    = 'REPAID'
            ), 0))
            -- Tenure bonus (max 250) — 1 point per day, capped
          + least(250, extract(day from now() - m.joined_at)::int)
        )
    ) as credit_score
from public.members m;

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║                       ROW LEVEL SECURITY                            ║
-- ╚════════════════════════════════════════════════════════════════════╝

alter table public.saccos              enable row level security;
alter table public.branches            enable row level security;
alter table public.staff_users         enable row level security;
alter table public.members             enable row level security;
alter table public.kyc_documents       enable row level security;
alter table public.savings_accounts    enable row level security;
alter table public.transactions        enable row level security;
alter table public.loans               enable row level security;
alter table public.loan_guarantors     enable row level security;
alter table public.loan_repayments     enable row level security;
alter table public.dividend_periods    enable row level security;
alter table public.dividend_payouts    enable row level security;
alter table public.savings_goals       enable row level security;
alter table public.chamas              enable row level security;
alter table public.chama_members       enable row level security;
alter table public.notifications       enable row level security;
alter table public.communications      enable row level security;
alter table public.audit_logs          enable row level security;
alter table public.referrals           enable row level security;
alter table public.member_achievements enable row level security;

-- ─── Members can read their own data ─────────────────────────────
create policy "members read own"   on public.members
    for select using (auth_user_id = auth.uid() or public.is_staff_of(sacco_id));

create policy "members update own" on public.members
    for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());

-- ─── Staff have full read access to their SACCO ──────────────────
create policy "staff read everything in sacco" on public.members
    for select using (public.is_staff_of(sacco_id));

-- ─── Savings & transactions: members see own, staff see all ──────
create policy "savings read own"  on public.savings_accounts
    for select using (
        member_id in (select id from public.members where auth_user_id = auth.uid())
        or exists (select 1 from public.members m
                   where m.id = member_id and public.is_staff_of(m.sacco_id))
    );

create policy "txn read own" on public.transactions
    for select using (
        member_id in (select id from public.members where auth_user_id = auth.uid())
        or public.is_staff_of(sacco_id)
    );

create policy "txn staff insert" on public.transactions
    for insert with check (public.is_staff_of(sacco_id));

-- ─── Loans ─────────────────────────────────────────────────────────
create policy "loans read own" on public.loans
    for select using (
        member_id in (select id from public.members where auth_user_id = auth.uid())
        or public.is_staff_of(sacco_id)
    );

create policy "loans member apply" on public.loans
    for insert with check (
        member_id = public.current_member_id() and status = 'PENDING'
    );

create policy "loans staff update" on public.loans
    for update using (public.is_staff_of(sacco_id));

-- ─── Notifications: only addressee can read ──────────────────────
create policy "notif read own" on public.notifications
    for select using (
        (member_id is not null and member_id = public.current_member_id())
        or (staff_id  is not null and staff_id  in (select id from public.staff_users where auth_user_id = auth.uid()))
    );

create policy "notif mark read own" on public.notifications
    for update using (
        (member_id is not null and member_id = public.current_member_id())
        or (staff_id  is not null and staff_id  in (select id from public.staff_users where auth_user_id = auth.uid()))
    );

-- ─── Goals: only owner ─────────────────────────────────────────────
create policy "goals owner all" on public.savings_goals
    for all using (member_id = public.current_member_id())
            with check (member_id = public.current_member_id());

-- ─── Audit logs: staff read only ───────────────────────────────────
create policy "audit staff read" on public.audit_logs
    for select using (public.is_staff_of(sacco_id));

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║                          REALTIME                                   ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- Enable realtime updates on the tables members care about
alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.loans;
alter publication supabase_realtime add table public.savings_accounts;
alter publication supabase_realtime add table public.dividend_payouts;

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║                          SEED DATA                                  ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- Insert achievement catalogue (run once)
insert into public.achievements (code, title, description, icon, points) values
('first_contribution',   'First Contribution',  'Made your very first contribution',                '🥉', 100),
('streak_3_months',      '3-Month Streak',      'Contributed every month for 3 months straight',    '🔥', 250),
('streak_12_months',     'Annual Saver',        'Contributed every month for a full year',          '🏆', 1000),
('first_loan_repaid',    'Debt-Free',           'Fully repaid your first loan',                     '✅', 500),
('shares_milestone_100', '100 Shares Club',     'Reached 100 shares owned',                         '💎', 300),
('referrer_first',       'Friend Bringer',      'Referred your first new member',                   '🤝', 250),
('goal_completed',       'Goal Crusher',        'Completed a savings goal',                         '🎯', 500),
('on_time_payer',        'Punctual',            '6 consecutive on-time loan repayments',            '⏰', 300)
on conflict (code) do nothing;
