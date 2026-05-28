-- ═══════════════════════════════════════════════════════════════
--  Member approval flow — creates the view + RPCs the web
--  dashboard needs to see pending registrations and approve/reject.
--
--  Idempotent: safe to re-run.
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. View: pending registrations (used by the dashboard) ──────
drop view if exists public.v_pending_registrations cascade;

create view public.v_pending_registrations
with (security_invoker = true)   -- respects caller's RLS
as
select
    m.id,
    m.sacco_id,
    m.membership_no,
    m.first_name,
    m.last_name,
    m.phone,
    m.email,
    m.national_id,
    m.address,
    m.avatar_color,
    m.joined_at,
    m.created_at,
    extract(epoch from (now() - m.created_at))::int as seconds_waiting
from public.members m
where m.status = 'INACTIVE' and m.kyc_status = 'PENDING';

grant select on public.v_pending_registrations to anon, authenticated;

-- ─── 2. RPC: approve a pending member ─────────────────────────────
drop function if exists public.approve_member(uuid);
create function public.approve_member(p_member_id uuid)
returns void
language plpgsql security definer
set search_path = public as $$
declare
    v_member record;
    v_account_no text;
    v_sacco_name text;
begin
    select * into v_member from public.members where id = p_member_id;
    if v_member is null then raise exception 'Member % not found', p_member_id; end if;
    if v_member.status = 'ACTIVE' then return; end if;

    update public.members
       set status     = 'ACTIVE',
           kyc_status = 'VERIFIED',
           updated_at = now()
     where id = p_member_id;

    -- Open primary savings account if missing
    v_account_no := 'SAV-' || replace(v_member.membership_no, 'M-', '') || '-01';
    insert into public.savings_accounts (member_id, account_no, product, balance, shares_owned, is_primary)
    values (p_member_id, v_account_no, 'REGULAR', 0, 0, true)
    on conflict (member_id, account_no) do nothing;

    -- Welcome notification
    select name into v_sacco_name from public.saccos where id = v_member.sacco_id;
    insert into public.notifications (member_id, title, message, type)
    values (
        p_member_id,
        'Welcome to ' || coalesce(v_sacco_name, 'your SACCO') || '! 🎉',
        'Your account has been approved. Start saving today.',
        'SUCCESS'
    );
end; $$;

grant execute on function public.approve_member(uuid) to anon, authenticated;

-- ─── 3. RPC: reject a pending member ──────────────────────────────
drop function if exists public.reject_member(uuid, text);
create function public.reject_member(
    p_member_id uuid,
    p_reason    text default 'Not specified'
)
returns void
language plpgsql security definer
set search_path = public as $$
declare
    v_member record;
begin
    select * into v_member from public.members where id = p_member_id;
    if v_member is null then raise exception 'Member % not found', p_member_id; end if;

    update public.members
       set status     = 'TERMINATED',
           kyc_status = 'REJECTED',
           updated_at = now()
     where id = p_member_id;

    insert into public.notifications (member_id, title, message, type)
    values (
        p_member_id,
        'Application could not be approved',
        'Reason: ' || p_reason || '. Please contact your SACCO branch for more information.',
        'WARNING'
    );
end; $$;

grant execute on function public.reject_member(uuid, text) to anon, authenticated;

-- ─── 4. Make sure the savings_accounts table allows admin inserts ─
drop policy if exists "anon admin savings"   on public.savings_accounts;
drop policy if exists "anon admin notifs"    on public.notifications;

create policy "anon admin savings" on public.savings_accounts
  for all to anon using (true) with check (true);

create policy "anon admin notifs"  on public.notifications
  for all to anon using (true) with check (true);

alter table public.savings_accounts enable row level security;
alter table public.notifications    enable row level security;

grant all on public.savings_accounts to anon, authenticated;
grant all on public.notifications    to anon, authenticated;

-- ─── 5. Verify ─────────────────────────────────────────────────────
select '✓ View exists:' as info, count(*) as pending_count
  from public.v_pending_registrations;

select '✓ Functions:' as info, proname
  from pg_proc where proname in ('approve_member', 'reject_member');
