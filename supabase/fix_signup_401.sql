-- ═══════════════════════════════════════════════════════════════
--  Quick fix for HTTP 401 on member registration.
--  Paste this into the Supabase SQL Editor and run.
--  Idempotent: safe to run multiple times.
-- ═══════════════════════════════════════════════════════════════

-- 1) Drop the strict version (if it exists) and re-create a relaxed one.
drop policy if exists "demo anon signup"        on public.members;
drop policy if exists "demo anon update member" on public.members;

-- Allow anyone with the anon key to INSERT a new member row.
-- (Demo mode — tighten with a JWT-aware policy before production.)
create policy "demo anon signup" on public.members
    for insert to anon
    with check (true);

-- Allow anon to update members (so admin approve/reject works against
-- the public.members table from the dashboard during demo).
create policy "demo anon update member" on public.members
    for update to anon
    using (true)
    with check (true);

-- 2) Make sure the table-level grants are in place.
grant insert, update on public.members to anon;

-- 3) Verify by listing the policies — should see our two demo ones.
select policyname, cmd, roles
  from pg_policies
 where schemaname = 'public' and tablename = 'members'
 order by policyname;
