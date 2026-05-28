-- ╔════════════════════════════════════════════════════════════════════╗
-- ║   DEMO RLS POLICIES                                                ║
-- ║                                                                    ║
-- ║   ⚠️  TIGHTEN BEFORE PRODUCTION                                    ║
-- ║   Allows the anon key to read most tables so the apps can fetch    ║
-- ║   data without a signed-in user. When real Supabase Auth is wired, ║
-- ║   drop these policies and rely on the per-user policies in 0002.   ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- SELECT permissive policies for the anon role
create policy "demo anon read" on public.members              for select to anon using (true);
create policy "demo anon read" on public.savings_accounts     for select to anon using (true);
create policy "demo anon read" on public.transactions         for select to anon using (true);
create policy "demo anon read" on public.loans                for select to anon using (true);
create policy "demo anon read" on public.loan_repayments      for select to anon using (true);
create policy "demo anon read" on public.dividend_periods     for select to anon using (true);
create policy "demo anon read" on public.dividend_payouts     for select to anon using (true);
create policy "demo anon read" on public.notifications        for select to anon using (true);
create policy "demo anon read" on public.savings_goals        for select to anon using (true);
create policy "demo anon read" on public.saccos               for select to anon using (true);
create policy "demo anon read" on public.branches             for select to anon using (true);
create policy "demo anon read" on public.audit_logs           for select to anon using (true);

-- INSERT/UPDATE for demo writes (contributions, loan applications, mark-read)
create policy "demo anon write" on public.transactions        for insert to anon with check (true);
create policy "demo anon write" on public.loans               for insert to anon with check (true);
create policy "demo anon update" on public.notifications      for update to anon using (true) with check (true);
create policy "demo anon write" on public.savings_goals       for insert to anon with check (true);

-- Saccos/branches are also useful to authenticated users (when added)
grant usage on schema public to anon;
grant select on all tables in schema public to anon;
