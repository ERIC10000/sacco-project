-- ═══════════════════════════════════════════════════════════════
--  Member registration — full reset & fix (v2)
--
--  Handles the case where a UMOJA SACCO already exists with a
--  different UUID than the seed script tried to use.
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Drop ALL conflicting old policies (clean slate) ──────────
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
     where schemaname = 'public' and tablename = 'members'
  loop
    execute format('drop policy if exists %I on public.members', p.policyname);
  end loop;
end $$;

-- ─── 2. Recreate sensible permissive policies for anon access ────
alter table public.members enable row level security;

create policy "anon read members"   on public.members for select to anon using (true);
create policy "anon signup members" on public.members for insert to anon with check (true);
create policy "anon update members" on public.members for update to anon using (true) with check (true);

grant select, insert, update on public.members to anon, authenticated;

-- ─── 3. Ensure a Umoja SACCO exists (reuse existing if present) ──
-- If a SACCO with short_code='UMOJA' is already there, leave it alone.
-- If not, create one with a deterministic UUID we can hard-code.
insert into public.saccos (id, name, registration_no, short_code, email, phone)
select
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Umoja Savings & Credit Cooperative',
    'CS/12345/2018', 'UMOJA',
    'info@umojasacco.co.ke', '+254 712 345 678'
where not exists (
    select 1 from public.saccos where short_code = 'UMOJA'
);

-- ─── 4. Report the SACCO id the mobile app should use ────────────
select '👉 USE THIS SACCO ID IN THE MOBILE APP:' as info,
       id::text                                    as sacco_id,
       name,
       short_code
  from public.saccos
 where short_code = 'UMOJA';

-- ─── 5. Verify the RLS policies are in place ─────────────────────
select 'Policies on members:' as info;
select policyname, cmd, roles
  from pg_policies
 where schemaname = 'public' and tablename = 'members'
 order by policyname;

-- ─── 6. Live test insert — using the REAL sacco id ───────────────
-- Wrapped in a transaction we roll back, so nothing persists.
do $$
declare
    v_sacco uuid;
    v_count int;
begin
    select id into v_sacco from public.saccos where short_code = 'UMOJA' limit 1;

    insert into public.members (
        sacco_id, membership_no, first_name, last_name, phone, status, kyc_status
    ) values (
        v_sacco, 'M-TEST01', 'Test', 'User', '+254700000000', 'INACTIVE', 'PENDING'
    );

    select count(*) into v_count from public.members where membership_no = 'M-TEST01';
    raise notice '✓ INSERT succeeded (% rows). Will rollback.', v_count;
    raise exception 'rollback_test_insert';   -- forces rollback, message ignored
exception
    when others then
        if sqlerrm = 'rollback_test_insert' then
            -- expected: we deliberately raised this to roll back
            raise notice '✓ Test row rolled back cleanly. Registration is ready.';
        else
            raise notice '✗ Test INSERT FAILED: %', sqlerrm;
            raise;
        end if;
end $$;
