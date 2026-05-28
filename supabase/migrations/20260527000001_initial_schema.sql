-- ╔════════════════════════════════════════════════════════════════════╗
-- ║        SaccoFlow — Initial database schema                         ║
-- ║        For Postgres / Supabase                                     ║
-- ║                                                                    ║
-- ║   Modules:                                                         ║
-- ║     • Multi-tenant SACCOs + branches + staff                       ║
-- ║     • Members + KYC documents                                      ║
-- ║     • Savings accounts (multi-product) + contributions             ║
-- ║     • Loans (application → approval → disbursal → repayment)       ║
-- ║     • Dividends (projected, pending, paid)                         ║
-- ║     • Goals, Chamas (group savings), Referrals, Achievements       ║
-- ║     • Notifications, Communications, Audit logs                    ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- ─── Extensions ────────────────────────────────────────────────────
create extension if not exists "pgcrypto";
create extension if not exists "moddatetime"   schema extensions;
create extension if not exists "pg_trgm";   -- fuzzy search on names
-- create extension if not exists "postgis";   -- enable for branch geo-search

-- ─── ENUM types ────────────────────────────────────────────────────
create type member_status         as enum ('ACTIVE','INACTIVE','SUSPENDED','TERMINATED');
create type staff_role            as enum ('ADMIN','MANAGER','LOAN_OFFICER','ACCOUNTANT','CASHIER');
create type kyc_status            as enum ('PENDING','VERIFIED','REJECTED');
create type savings_product       as enum ('REGULAR','FIXED_DEPOSIT','HOLIDAY','EMERGENCY','GOAL');
create type txn_type              as enum ('CONTRIBUTION','WITHDRAWAL','LOAN_DISBURSEMENT','LOAN_REPAYMENT','DIVIDEND','PENALTY','FEE','INTEREST','TRANSFER');
create type txn_method            as enum ('CASH','BANK_TRANSFER','M_PESA','CHEQUE','INTERNAL','CARD');
create type txn_status            as enum ('PENDING','COMPLETED','FAILED','REVERSED');
create type loan_status           as enum ('PENDING','APPROVED','DISBURSED','REPAID','REJECTED','DEFAULTED','WRITTEN_OFF');
create type loan_risk             as enum ('LOW','MEDIUM','HIGH');
create type dividend_status       as enum ('PROJECTED','PENDING','PAID','CANCELLED');
create type notification_type     as enum ('INFO','SUCCESS','WARNING','DANGER');
create type notification_channel  as enum ('IN_APP','SMS','EMAIL','PUSH');
create type goal_status           as enum ('ACTIVE','COMPLETED','PAUSED','CANCELLED');
create type chama_role            as enum ('CHAIRPERSON','TREASURER','SECRETARY','MEMBER');
create type audit_action          as enum ('LOGIN','CREATE','UPDATE','DELETE','APPROVE','REJECT','DISBURSE','EXPORT','LOGIN_FAILED');

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║                          CORE TABLES                                ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- ─── SACCOs (multi-tenant root) ───────────────────────────────────
create table public.saccos (
    id                  uuid primary key default gen_random_uuid(),
    name                text not null,
    registration_no     text unique,
    tax_pin             text,
    short_code          text unique,                         -- e.g. "UMOJA"
    email               text,
    phone               text,
    address             text,
    logo_url            text,
    currency            char(3) default 'KES',
    timezone            text default 'Africa/Nairobi',
    language            text default 'en',

    -- Operational rules (JSONB for flexibility)
    loan_policy         jsonb default jsonb_build_object(
                            'default_rate_pct',   12,
                            'max_term_months',    48,
                            'min_amount',         5000,
                            'max_amount',         500000,
                            'late_penalty_pct',   5,
                            'savings_multiplier', 3
                        ),
    contribution_policy jsonb default jsonb_build_object(
                            'min_monthly',        500,
                            'registration_fee',   2000,
                            'frequency',          'monthly',
                            'due_day',            15
                        ),
    dividend_policy     jsonb default jsonb_build_object(
                            'annual_rate_pct',    12,
                            'frequency',          'quarterly',
                            'share_price',        500
                        ),

    created_at          timestamptz default now(),
    updated_at          timestamptz default now()
);

-- ─── Branches ────────────────────────────────────────────────────
create table public.branches (
    id          uuid primary key default gen_random_uuid(),
    sacco_id    uuid not null references public.saccos(id) on delete cascade,
    name        text not null,
    code        text not null,                       -- e.g. "NBI-WST"
    address     text,
    city        text,
    phone       text,
    -- location  geography(point),                    -- enable when postgis is on
    is_active   boolean default true,
    created_at  timestamptz default now(),
    unique (sacco_id, code)
);

-- ─── Staff users (admins/officers) ───────────────────────────────
create table public.staff_users (
    id              uuid primary key default gen_random_uuid(),
    auth_user_id    uuid unique references auth.users(id) on delete cascade,
    sacco_id        uuid not null references public.saccos(id) on delete cascade,
    branch_id       uuid references public.branches(id),
    first_name      text not null,
    last_name       text not null,
    email           text not null,
    phone           text,
    role            staff_role not null default 'CASHIER',
    is_active       boolean default true,
    last_login_at   timestamptz,
    created_at      timestamptz default now(),
    updated_at      timestamptz default now(),
    unique (sacco_id, email)
);

-- ─── Members ─────────────────────────────────────────────────────
create table public.members (
    id                   uuid primary key default gen_random_uuid(),
    auth_user_id         uuid unique references auth.users(id) on delete set null,
    sacco_id             uuid not null references public.saccos(id) on delete cascade,
    branch_id            uuid references public.branches(id),
    membership_no        text not null,                  -- e.g. "M-1024"
    first_name           text not null,
    last_name            text not null,
    national_id          text,
    email                text,
    phone                text not null,
    date_of_birth        date,
    gender               text check (gender in ('M','F','OTHER')),
    address              text,
    occupation           text,
    next_of_kin          jsonb,                          -- {name, relation, phone}
    profile_picture_url  text,
    avatar_color         text default 'bg-indigo-500',   -- UI hint
    status               member_status default 'ACTIVE',
    kyc_status           kyc_status default 'PENDING',
    referred_by          uuid references public.members(id),
    joined_at            timestamptz default now(),
    created_at           timestamptz default now(),
    updated_at           timestamptz default now(),
    unique (sacco_id, membership_no),
    unique (sacco_id, national_id)
);

create index members_sacco_idx        on public.members (sacco_id);
create index members_phone_idx        on public.members (phone);
create index members_name_trgm_idx    on public.members using gin ((first_name || ' ' || last_name) gin_trgm_ops);

-- ─── KYC documents ────────────────────────────────────────────────
create table public.kyc_documents (
    id          uuid primary key default gen_random_uuid(),
    member_id   uuid not null references public.members(id) on delete cascade,
    doc_type    text not null,    -- 'national_id_front', 'passport_photo', 'kra_pin'
    file_url    text not null,
    file_size   int,
    verified    boolean default false,
    verified_by uuid references public.staff_users(id),
    verified_at timestamptz,
    uploaded_at timestamptz default now()
);

-- ─── Savings accounts ─────────────────────────────────────────────
-- Each member can have multiple savings accounts (regular, fixed deposit, etc.)
create table public.savings_accounts (
    id              uuid primary key default gen_random_uuid(),
    member_id       uuid not null references public.members(id) on delete cascade,
    account_no      text not null,                    -- e.g. "SAV-1024-01"
    product         savings_product not null default 'REGULAR',
    balance         numeric(14,2) not null default 0  check (balance >= 0),
    shares_owned    int not null default 0            check (shares_owned >= 0),
    interest_rate   numeric(5,2) default 4.0,
    is_primary      boolean default true,
    is_active       boolean default true,
    opened_at       timestamptz default now(),
    closed_at       timestamptz,
    unique (member_id, account_no)
);

create index savings_accounts_member_idx on public.savings_accounts (member_id);

-- ─── Transactions (the ledger — double-entry style) ───────────────
create table public.transactions (
    id                  uuid primary key default gen_random_uuid(),
    sacco_id            uuid not null references public.saccos(id),
    member_id           uuid not null references public.members(id),
    savings_account_id  uuid references public.savings_accounts(id),
    txn_type            txn_type not null,
    amount              numeric(14,2) not null,           -- positive number; sign implied by txn_type
    method              txn_method not null,
    reference           text not null,                    -- M-Pesa code, bank ref, receipt no
    description         text,
    balance_after       numeric(14,2),                    -- snapshot after this txn
    status              txn_status not null default 'PENDING',
    initiated_by        uuid references auth.users(id),
    processed_by        uuid references public.staff_users(id),
    metadata            jsonb default '{}'::jsonb,
    occurred_at         timestamptz default now(),
    created_at          timestamptz default now(),
    updated_at          timestamptz default now()
);

create index txn_sacco_idx     on public.transactions (sacco_id, occurred_at desc);
create index txn_member_idx    on public.transactions (member_id, occurred_at desc);
create index txn_status_idx    on public.transactions (status) where status <> 'COMPLETED';
create index txn_reference_idx on public.transactions (reference);

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║                          LOAN MODULE                                ║
-- ╚════════════════════════════════════════════════════════════════════╝

create table public.loans (
    id                  uuid primary key default gen_random_uuid(),
    sacco_id            uuid not null references public.saccos(id),
    member_id           uuid not null references public.members(id),
    loan_no             text not null,                        -- "LN-3401"
    amount_requested    numeric(14,2) not null check (amount_requested > 0),
    amount_approved     numeric(14,2),
    interest_rate       numeric(5,2) not null,                -- annual %
    term_months         int not null check (term_months > 0),
    monthly_payment     numeric(14,2),
    total_payable       numeric(14,2),
    remaining_balance   numeric(14,2),
    purpose             text not null,
    risk                loan_risk default 'LOW',
    status              loan_status not null default 'PENDING',
    applied_at          timestamptz default now(),
    approved_at         timestamptz,
    approved_by         uuid references public.staff_users(id),
    disbursed_at        timestamptz,
    disbursed_by        uuid references public.staff_users(id),
    rejected_at         timestamptz,
    rejection_reason    text,
    next_payment_date   date,
    metadata            jsonb default '{}'::jsonb,
    created_at          timestamptz default now(),
    updated_at          timestamptz default now(),
    unique (sacco_id, loan_no)
);

create index loans_sacco_status_idx  on public.loans (sacco_id, status);
create index loans_member_idx        on public.loans (member_id);

-- ─── Loan guarantors ─────────────────────────────────────────────
create table public.loan_guarantors (
    id              uuid primary key default gen_random_uuid(),
    loan_id         uuid not null references public.loans(id) on delete cascade,
    guarantor_id    uuid not null references public.members(id),
    amount_pledged  numeric(14,2) not null check (amount_pledged > 0),
    consented_at    timestamptz,
    created_at      timestamptz default now(),
    unique (loan_id, guarantor_id)
);

-- ─── Loan repayment schedule ─────────────────────────────────────
create table public.loan_repayments (
    id              uuid primary key default gen_random_uuid(),
    loan_id         uuid not null references public.loans(id) on delete cascade,
    installment_no  int  not null,
    due_date        date not null,
    expected_amount numeric(14,2) not null,
    paid_amount     numeric(14,2) default 0,
    paid_at         timestamptz,
    transaction_id  uuid references public.transactions(id),
    is_paid         boolean generated always as (paid_amount >= expected_amount) stored,
    unique (loan_id, installment_no)
);

create index repayments_due_date_idx on public.loan_repayments (due_date) where is_paid = false;

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║                       DIVIDENDS                                     ║
-- ╚════════════════════════════════════════════════════════════════════╝

create table public.dividend_periods (
    id              uuid primary key default gen_random_uuid(),
    sacco_id        uuid not null references public.saccos(id),
    period_label    text not null,                  -- "Q1 2026"
    period_start    date not null,
    period_end      date not null,
    annual_rate_pct numeric(5,2) not null,
    declared_at     timestamptz,
    declared_by     uuid references public.staff_users(id),
    paid_at         timestamptz,
    status          dividend_status default 'PROJECTED',
    total_paid      numeric(14,2) default 0,
    notes           text,
    created_at      timestamptz default now(),
    unique (sacco_id, period_label)
);

create table public.dividend_payouts (
    id                  uuid primary key default gen_random_uuid(),
    dividend_period_id  uuid not null references public.dividend_periods(id) on delete cascade,
    member_id           uuid not null references public.members(id),
    shares_at_payout    int  not null,
    amount              numeric(14,2) not null,
    transaction_id      uuid references public.transactions(id),
    paid_at             timestamptz,
    status              dividend_status default 'PROJECTED',
    unique (dividend_period_id, member_id)
);

create index payouts_member_idx on public.dividend_payouts (member_id);

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║          🌟 CREATIVE ADDITIONS — Goals, Chamas, Achievements         ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- ─── Savings goals (gamification + nudges) ───────────────────────
create table public.savings_goals (
    id              uuid primary key default gen_random_uuid(),
    member_id       uuid not null references public.members(id) on delete cascade,
    title           text not null,                   -- "School fees 2027"
    icon            text default '🎯',
    target_amount   numeric(14,2) not null check (target_amount > 0),
    current_amount  numeric(14,2) default 0,
    target_date     date,
    status          goal_status default 'ACTIVE',
    color           text default '#4F46E5',
    auto_deposit    jsonb,                           -- {enabled, amount, frequency}
    created_at      timestamptz default now(),
    updated_at      timestamptz default now()
);

-- ─── Chamas (group savings within a SACCO) ───────────────────────
create table public.chamas (
    id              uuid primary key default gen_random_uuid(),
    sacco_id        uuid not null references public.saccos(id),
    name            text not null,
    description     text,
    contribution_amount numeric(14,2),               -- monthly target per member
    rotation_order  uuid[],                          -- member ids in payout order (merry-go-round)
    is_active       boolean default true,
    founded_at      timestamptz default now(),
    created_by      uuid not null references public.members(id),
    created_at      timestamptz default now()
);

create table public.chama_members (
    chama_id        uuid not null references public.chamas(id) on delete cascade,
    member_id       uuid not null references public.members(id) on delete cascade,
    role            chama_role default 'MEMBER',
    joined_at       timestamptz default now(),
    primary key (chama_id, member_id)
);

-- ─── Achievements / badges (gamification) ────────────────────────
create table public.achievements (
    id          uuid primary key default gen_random_uuid(),
    code        text unique not null,                -- "first_loan_repaid"
    title       text not null,
    description text,
    icon        text,
    points      int  default 100,
    is_active   boolean default true
);

create table public.member_achievements (
    member_id       uuid not null references public.members(id) on delete cascade,
    achievement_id  uuid not null references public.achievements(id),
    unlocked_at     timestamptz default now(),
    primary key (member_id, achievement_id)
);

-- ─── Referrals ───────────────────────────────────────────────────
create table public.referrals (
    id              uuid primary key default gen_random_uuid(),
    referrer_id     uuid not null references public.members(id),
    referee_id      uuid not null references public.members(id) unique,
    reward_amount   numeric(14,2) default 500,
    reward_paid     boolean default false,
    reward_txn_id   uuid references public.transactions(id),
    created_at      timestamptz default now()
);

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║                COMMUNICATIONS, NOTIFICATIONS, AUDIT                 ║
-- ╚════════════════════════════════════════════════════════════════════╝

create table public.notifications (
    id          uuid primary key default gen_random_uuid(),
    member_id   uuid references public.members(id) on delete cascade,
    staff_id    uuid references public.staff_users(id) on delete cascade,
    title       text not null,
    message     text not null,
    type        notification_type default 'INFO',
    action_url  text,
    is_read     boolean default false,
    read_at     timestamptz,
    created_at  timestamptz default now(),
    check ((member_id is not null) <> (staff_id is not null))   -- either-or
);

create index notif_member_idx on public.notifications (member_id, created_at desc) where is_read = false;
create index notif_staff_idx  on public.notifications (staff_id,  created_at desc) where is_read = false;

create table public.communications (
    id              uuid primary key default gen_random_uuid(),
    sacco_id        uuid not null references public.saccos(id),
    sent_by         uuid references public.staff_users(id),
    channel         notification_channel not null,
    audience_query  text,                            -- e.g. "active_members"
    subject         text,
    body            text not null,
    recipients_total int default 0,
    delivered_count  int default 0,
    failed_count     int default 0,
    cost             numeric(10,2) default 0,
    sent_at          timestamptz default now()
);

create table public.audit_logs (
    id           uuid primary key default gen_random_uuid(),
    sacco_id     uuid references public.saccos(id),
    actor_id     uuid references auth.users(id),
    actor_name   text,
    action       audit_action not null,
    resource_type text,                              -- "loan", "member", etc.
    resource_id  text,
    details      text,
    metadata     jsonb default '{}'::jsonb,
    ip_address   inet,
    user_agent   text,
    created_at   timestamptz default now()
);

create index audit_sacco_idx   on public.audit_logs (sacco_id, created_at desc);
create index audit_resource_idx on public.audit_logs (resource_type, resource_id);

-- ╔════════════════════════════════════════════════════════════════════╗
-- ║                  AUTO-UPDATING updated_at TRIGGERS                  ║
-- ╚════════════════════════════════════════════════════════════════════╝

create trigger set_updated_at_saccos       before update on public.saccos       for each row execute function extensions.moddatetime ('updated_at');
create trigger set_updated_at_staff        before update on public.staff_users  for each row execute function extensions.moddatetime ('updated_at');
create trigger set_updated_at_members      before update on public.members      for each row execute function extensions.moddatetime ('updated_at');
create trigger set_updated_at_transactions before update on public.transactions for each row execute function extensions.moddatetime ('updated_at');
create trigger set_updated_at_loans        before update on public.loans        for each row execute function extensions.moddatetime ('updated_at');
create trigger set_updated_at_goals        before update on public.savings_goals for each row execute function extensions.moddatetime ('updated_at');