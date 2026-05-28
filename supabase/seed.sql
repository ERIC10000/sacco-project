-- ╔════════════════════════════════════════════════════════════════════╗
-- ║   SaccoFlow seed data — Umoja Savings & Credit Cooperative         ║
-- ║                                                                    ║
-- ║   Run AFTER the migrations.                                        ║
-- ║   Idempotent — re-run safely; uses ON CONFLICT to avoid dupes.     ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- ─── 1. SACCO ──────────────────────────────────────────────────────
insert into public.saccos (id, name, registration_no, short_code, email, phone, address)
values (
  '00000000-0000-0000-0000-000000000001',
  'Umoja Savings & Credit Cooperative',
  'CS/12345/2018',
  'UMOJA',
  'info@umojasacco.co.ke',
  '+254 712 345 678',
  'P.O. Box 4567, Westlands, Nairobi'
)
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  phone = excluded.phone;

-- ─── 2. Branch ─────────────────────────────────────────────────────
insert into public.branches (id, sacco_id, name, code, address, city, phone)
values (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Westlands HQ', 'NBI-WST',
  'Westlands Plaza, 2nd Floor', 'Nairobi', '+254 712 345 678'
)
on conflict (id) do nothing;

-- ─── 3. Members ────────────────────────────────────────────────────
insert into public.members (id, sacco_id, branch_id, membership_no, first_name, last_name,
                            national_id, email, phone, address, avatar_color, joined_at)
values
  ('00000000-0000-0000-0000-000000001024',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1024', 'John',    'Kamau',    '24895612', 'john.kamau@email.com',    '+254 712 345 678', 'Kiambu, Kenya',  'bg-indigo-500',  '2023-03-15'),

  ('00000000-0000-0000-0000-000000001025',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1025', 'Wanjiru', 'Muthoni',  '32147895', 'wanjiru.m@email.com',     '+254 722 456 789', 'Nairobi, Kenya', 'bg-violet-500',  '2022-11-08'),

  ('00000000-0000-0000-0000-000000001026',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1026', 'Peter',   'Otieno',   '28456123', 'peter.otieno@email.com',  '+254 733 567 890', 'Kisumu, Kenya',  'bg-emerald-500', '2024-01-22'),

  ('00000000-0000-0000-0000-000000001027',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1027', 'Grace',   'Achieng',  '31254789', 'grace.a@email.com',       '+254 711 234 567', 'Mombasa, Kenya', 'bg-amber-500',   '2023-07-19'),

  ('00000000-0000-0000-0000-000000001028',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1028', 'David',   'Njoroge',  '29874561', 'david.njoroge@email.com', '+254 720 987 654', 'Nakuru, Kenya',  'bg-rose-500',    '2022-05-04'),

  ('00000000-0000-0000-0000-000000001029',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1029', 'Amina',   'Hassan',   '34512698', 'amina.hassan@email.com',  '+254 715 345 678', 'Garissa, Kenya', 'bg-blue-500',    '2025-04-12'),

  ('00000000-0000-0000-0000-000000001030',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1030', 'Joseph',  'Kiprono',  '27845963', 'joseph.k@email.com',      '+254 723 678 901', 'Eldoret, Kenya', 'bg-teal-500',    '2021-09-30'),

  ('00000000-0000-0000-0000-000000001031',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1031', 'Mary',    'Wambui',   '30214785', 'mary.wambui@email.com',   '+254 724 789 012', 'Thika, Kenya',   'bg-indigo-500',  '2022-02-14'),

  ('00000000-0000-0000-0000-000000001033',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1033', 'Lucy',    'Akinyi',   '33698521', 'lucy.akinyi@email.com',   '+254 726 901 234', 'Kakamega, Kenya','bg-violet-500',  '2023-12-01'),

  ('00000000-0000-0000-0000-000000001034',
     '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010',
     'M-1034', 'James',   'Mwangi',   '28741256', 'james.mwangi@email.com',  '+254 727 012 345', 'Nyeri, Kenya',   'bg-emerald-500', '2024-06-18')
on conflict (id) do update set
  first_name = excluded.first_name, last_name = excluded.last_name,
  phone = excluded.phone, email = excluded.email;

-- ─── 4. Savings accounts (one per member) ──────────────────────────
insert into public.savings_accounts (member_id, account_no, product, balance, shares_owned, is_primary)
values
  ('00000000-0000-0000-0000-000000001024', 'SAV-1024-01', 'REGULAR', 152000, 304, true),
  ('00000000-0000-0000-0000-000000001025', 'SAV-1025-01', 'REGULAR', 198000, 396, true),
  ('00000000-0000-0000-0000-000000001026', 'SAV-1026-01', 'REGULAR',  89000, 178, true),
  ('00000000-0000-0000-0000-000000001027', 'SAV-1027-01', 'REGULAR', 175000, 350, true),
  ('00000000-0000-0000-0000-000000001028', 'SAV-1028-01', 'REGULAR', 198000, 396, true),
  ('00000000-0000-0000-0000-000000001029', 'SAV-1029-01', 'REGULAR',  12000,  24, true),
  ('00000000-0000-0000-0000-000000001030', 'SAV-1030-01', 'REGULAR', 285000, 570, true),
  ('00000000-0000-0000-0000-000000001031', 'SAV-1031-01', 'REGULAR', 242000, 484, true),
  ('00000000-0000-0000-0000-000000001033', 'SAV-1033-01', 'REGULAR', 145000, 290, true),
  ('00000000-0000-0000-0000-000000001034', 'SAV-1034-01', 'REGULAR',  56000, 112, true)
on conflict (member_id, account_no) do update set balance = excluded.balance, shares_owned = excluded.shares_owned;

-- ─── 5. Transactions (John Kamau — primary demo member) ────────────
insert into public.transactions (sacco_id, member_id, txn_type, amount, method, reference, description, status, occurred_at, balance_after)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001024', 'CONTRIBUTION',       5000, 'M_PESA',        'QGH123ABC',  'Monthly contribution',          'COMPLETED', '2026-05-26 09:15', 152000),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001024', 'LOAN_REPAYMENT',     4444, 'BANK_TRANSFER', 'RPY-001284', 'LN-3401 monthly repayment',     'COMPLETED', '2026-05-26 08:02', 147000),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001024', 'CONTRIBUTION',       5000, 'M_PESA',        'QHJ456DEF',  'Monthly contribution',          'COMPLETED', '2026-04-26 09:00', 142000),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001024', 'DIVIDEND',           8240, 'INTERNAL',      'DIV-2026Q1', 'Q1 dividend payout',            'COMPLETED', '2026-04-15 14:30', 137000),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001024', 'LOAN_DISBURSEMENT', 50000, 'BANK_TRANSFER', 'DSB-001',    'LN-3401 disbursed',             'COMPLETED', '2026-02-15 11:20', 128760),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001024', 'CONTRIBUTION',       5000, 'M_PESA',        'QKL789GHI',  'Monthly contribution',          'COMPLETED', '2026-02-05 09:00', 78760),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001024', 'WITHDRAWAL',        10000, 'BANK_TRANSFER', 'WD-987',     'Emergency withdrawal',          'COMPLETED', '2026-01-22 16:42', 73760),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001024', 'CONTRIBUTION',       5000, 'M_PESA',        'QMN012JKL',  'Monthly contribution',          'COMPLETED', '2026-01-05 09:00', 83760)
on conflict do nothing;

-- A few transactions for other members so dashboards show variety
insert into public.transactions (sacco_id, member_id, txn_type, amount, method, reference, description, status, occurred_at)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001025', 'CONTRIBUTION', 12500, 'BANK_TRANSFER', 'BNK-558721', 'Monthly contribution', 'COMPLETED', '2026-05-26 10:00'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001027', 'CONTRIBUTION',  3000, 'M_PESA',        'QHJ456DEF',  'Monthly contribution', 'COMPLETED', '2026-05-26 11:30'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001028', 'CONTRIBUTION',  8750, 'CASH',          'RCT-2389',   'Cash deposit',         'COMPLETED', '2026-05-25 14:00'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001030', 'CONTRIBUTION', 10000, 'BANK_TRANSFER', 'BNK-558722', 'Monthly contribution', 'COMPLETED', '2026-05-25 09:00'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001031', 'CONTRIBUTION', 15000, 'M_PESA',        'QKL789GHI',  'Monthly contribution', 'COMPLETED', '2026-05-24 11:00')
on conflict do nothing;

-- ─── 6. Loans ──────────────────────────────────────────────────────
insert into public.loans (id, sacco_id, member_id, loan_no, amount_requested, amount_approved,
                          interest_rate, term_months, monthly_payment, total_payable, remaining_balance,
                          purpose, risk, status, applied_at, approved_at, disbursed_at, next_payment_date)
values
  ('00000000-0000-0000-0000-000000003401', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001024',
     'LN-3401',  50000,  50000, 12, 12, 4444, 53333, 32000, 'Medical',     'LOW',    'DISBURSED', '2026-02-10', '2026-02-12', '2026-02-15', '2026-06-15'),
  ('00000000-0000-0000-0000-000000003421', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001026',
     'LN-3421',  80000,  null,  12, 12, null,  null,  80000, 'Business expansion', 'LOW', 'PENDING',   '2026-05-24', null, null, null),
  ('00000000-0000-0000-0000-000000003422', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001034',
     'LN-3422', 150000,  null,  12, 24, null,  null, 150000, 'Home improvement',   'MEDIUM', 'PENDING','2026-05-23', null, null, null),
  ('00000000-0000-0000-0000-000000003380', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001031',
     'LN-3380',  60000,  60000, 12, 12, 5333, 64000, 0,     'Business',    'LOW',    'REPAID',    '2025-03-05', '2025-03-07', '2025-03-10', null)
on conflict (id) do update set status = excluded.status, remaining_balance = excluded.remaining_balance;

-- ─── 7. Dividend periods + payouts ────────────────────────────────
insert into public.dividend_periods (id, sacco_id, period_label, period_start, period_end, annual_rate_pct, status, paid_at)
values
  ('00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000000001', 'Q1 2026', '2026-01-01', '2026-03-31', 12, 'PAID',      '2026-04-15'),
  ('00000000-0000-0000-0000-000000004002', '00000000-0000-0000-0000-000000000001', 'Q4 2025', '2025-10-01', '2025-12-31', 12, 'PAID',      '2026-01-12'),
  ('00000000-0000-0000-0000-000000004003', '00000000-0000-0000-0000-000000000001', 'Q3 2025', '2025-07-01', '2025-09-30', 12, 'PAID',      '2025-10-18'),
  ('00000000-0000-0000-0000-000000004004', '00000000-0000-0000-0000-000000000001', 'Q2 2026', '2026-04-01', '2026-06-30', 12, 'PENDING',   null)
on conflict (id) do nothing;

insert into public.dividend_payouts (dividend_period_id, member_id, shares_at_payout, amount, status, paid_at)
values
  ('00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000001024', 290, 8240, 'PAID',    '2026-04-15'),
  ('00000000-0000-0000-0000-000000004002', '00000000-0000-0000-0000-000000001024', 240, 6920, 'PAID',    '2026-01-12'),
  ('00000000-0000-0000-0000-000000004003', '00000000-0000-0000-0000-000000001024', 205, 5840, 'PAID',    '2025-10-18'),
  ('00000000-0000-0000-0000-000000004004', '00000000-0000-0000-0000-000000001024', 304, 9120, 'PENDING', null)
on conflict (dividend_period_id, member_id) do nothing;

-- ─── 8. Notifications for John Kamau ──────────────────────────────
insert into public.notifications (member_id, title, message, type)
values
  ('00000000-0000-0000-0000-000000001024', 'Repayment due',          'KES 4,444 due on Jun 15 for LN-3401',                'WARNING'),
  ('00000000-0000-0000-0000-000000001024', 'Dividend received',      'Q1 dividend of KES 8,240 credited to your account.', 'SUCCESS'),
  ('00000000-0000-0000-0000-000000001024', 'AGM 2026',               'Annual general meeting on June 22 at 2 PM.',         'INFO'),
  ('00000000-0000-0000-0000-000000001024', 'Contribution received',  'Your KES 5,000 contribution was received.',          'SUCCESS')
on conflict do nothing;

-- ─── 9. One savings goal for John ─────────────────────────────────
insert into public.savings_goals (member_id, title, icon, target_amount, current_amount, target_date, color)
values
  ('00000000-0000-0000-0000-000000001024', 'School fees 2027', '🎓', 200000, 152000, '2027-01-15', '#4F46E5')
on conflict do nothing;
