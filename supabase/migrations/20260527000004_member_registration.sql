-- ╔════════════════════════════════════════════════════════════════════╗
-- ║   Member self-registration + admin approval                        ║
-- ║                                                                    ║
-- ║   Flow:                                                            ║
-- ║     1. Mobile app inserts member with status=INACTIVE,             ║
-- ║        kyc_status=PENDING                                          ║
-- ║     2. Web dashboard lists pending members                         ║
-- ║     3. Admin calls approve_member() / reject_member()              ║
-- ║     4. Member can now sign in                                      ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- ─── RLS: allow anon to insert their own member row ──────────────
create policy "demo anon signup" on public.members
  for insert to anon
  with check (
    status     = 'INACTIVE'
    and kyc_status = 'PENDING'
  );

-- ─── RLS: allow anon to update a member's status (admin actions
-- via demo). Tighten this in production — staff-only via JWT.
create policy "demo anon update member" on public.members
  for update to anon using (true) with check (true);

-- ─── Function: approve a pending registration ─────────────────────
create or replace function public.approve_member(p_member_id uuid)
returns void
language plpgsql security definer
set search_path = public as $$
declare
    v_member record;
    v_account_no text;
begin
    select * into v_member from public.members where id = p_member_id;
    if v_member is null then raise exception 'Member % not found', p_member_id; end if;
    if v_member.status = 'ACTIVE' then return; end if;

    -- Activate the member
    update public.members
       set status     = 'ACTIVE',
           kyc_status = 'VERIFIED',
           updated_at = now()
     where id = p_member_id;

    -- Open their primary savings account if not already
    v_account_no := 'SAV-' || replace(v_member.membership_no, 'M-', '') || '-01';

    insert into public.savings_accounts (member_id, account_no, product, balance, shares_owned, is_primary)
    values (p_member_id, v_account_no, 'REGULAR', 0, 0, true)
    on conflict (member_id, account_no) do nothing;

    -- Welcome notification
    insert into public.notifications (member_id, title, message, type)
    values (
        p_member_id,
        'Welcome to ' || (select name from saccos where id = v_member.sacco_id) || '! 🎉',
        'Your account has been approved. Start making contributions today.',
        'SUCCESS'
    );
end; $$;

-- ─── Function: reject a pending registration ─────────────────────
create or replace function public.reject_member(
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

-- ─── View: pending registrations (for the dashboard) ─────────────
create or replace view public.v_pending_registrations as
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
where m.status = 'INACTIVE' and m.kyc_status = 'PENDING'
order by m.created_at desc;

-- Allow anon to read it for demo
create policy "demo anon read pending" on public.members
  for select to anon
  using (true);
-- (policy might already exist — safe to ignore the "already exists" error)
