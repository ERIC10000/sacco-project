# 🗄 SaccoFlow — Supabase Backend

Postgres schema, RLS policies, functions, views and realtime config that
power both the **web dashboard** (`sacco-project/`) and the **Android
member app** (`mflowsacco/`).

## What's in the box

| File | Purpose |
|---|---|
| `migrations/20260527000001_initial_schema.sql` | Tables, enums, indexes, FKs, `updated_at` triggers |
| `migrations/20260527000002_functions_views_rls.sql` | Functions, views, RLS, realtime, seed achievements |

### Module overview

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Multi-tenant     │    │ Lending          │    │ Engagement       │
│ • saccos         │    │ • loans          │    │ • savings_goals  │
│ • branches       │    │ • loan_guarantors│    │ • chamas         │
│ • staff_users    │    │ • loan_repayments│    │ • achievements   │
│ • members        │    │                  │    │ • referrals      │
└──────────────────┘    └──────────────────┘    └──────────────────┘
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Money            │    │ Dividends        │    │ Operations       │
│ • savings_accounts│   │ • dividend_periods│   │ • notifications  │
│ • transactions   │    │ • dividend_payouts│   │ • communications │
│                  │    │                  │    │ • audit_logs     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

## Creative features beyond the basics

- **🎯 Savings goals** — members set targeted goals (school fees, holiday)
  and each contribution auto-credits the active goal.
- **👥 Chamas** — in-app micro-groups (a SACCO inside a SACCO) with
  rotating payouts (`chamas.rotation_order` is a `uuid[]`).
- **🏅 Achievements** — gamification system with badges
  (`first_contribution`, `12-month streak`, `debt-free`, etc.).
- **🤝 Referrals** — track who referred whom, with automatic reward
  transactions when payable.
- **📊 Credit score view** — `v_member_credit_score` computes a 0-1000
  score from contribution consistency + loan history + tenure.
- **🔥 Realtime** — `transactions`, `notifications`, `loans`,
  `savings_accounts`, and `dividend_payouts` push live updates to both
  clients (web + mobile).
- **🔐 Row Level Security** — members can only see their own data;
  staff see everything in their SACCO; admins see everything.
- **⚙️ JSONB policies** — per-SACCO loan/contribution/dividend rules
  live in JSONB columns so they're editable without schema changes.

## Setup

### 1. Create a Supabase project
1. Go to https://app.supabase.com → New project
2. Pick a region close to your users (e.g. `eu-west-1` or `us-east-1`)
3. Copy your **Project URL** and **anon key** from Settings → API

### 2. Run the migrations
The simplest way:

```bash
# Install the Supabase CLI (one-time)
npm install -g supabase

# In sacco-project/
cd sacco-project
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push
```

…or via the SQL editor in the Supabase dashboard, paste each file in
order and click **Run**.

### 3. Wire up the web dashboard
```bash
cd sacco-project
cp .env.example .env
# Fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

Pages import from `@/services/supabaseApi.ts` instead of the demo data:
```ts
import { membersApi, loansApi, dashboardApi } from '@/services/supabaseApi'

const { data: members } = await membersApi.list({ status: 'ACTIVE' })
```

### 4. Wire up the Android app

Create `local.properties` next to `gradle.properties`:

```properties
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
```

(These are injected into `BuildConfig` by `app/build.gradle.kts`.)

In Kotlin, talk to the API via the repository:
```kotlin
import com.example.mflow_sacco.data.repository.SaccoRepository
import kotlinx.coroutines.*

lifecycleScope.launch {
    SaccoRepository.signIn("john.kamau@email.com", "password")
        .onSuccess { /* navigate to home */ }
        .onFailure { Toast.makeText(this@LoginActivity, it.message, Toast.LENGTH_SHORT).show() }
}
```

## Sample queries

### "Show me a member's full picture"
```sql
select * from v_member_summary where id = '...';
```
Returns the member row + total_savings + shares_owned + active_loans + lifetime_contributions.

### "Approve a loan"
```sql
select approve_loan('<loan-id>'::uuid, 50000);
```
Updates status → APPROVED, computes monthly_payment + total_payable,
generates the full repayment schedule, and notifies the member.

### "Estimate a dividend payout"
```sql
select calculate_dividend(304, 12, 500, 90); -- shares, rate%, share price, days
-- returns 4500 (≈ KES 4,500 quarterly for 304 shares at 12%)
```

### "Members ranked by credit score"
```sql
select m.first_name, m.last_name, s.credit_score
from v_member_credit_score s
join members m on m.id = s.member_id
order by s.credit_score desc
limit 10;
```

## Edge functions (TODO)

Spots ready for serverless functions you can add later:

```
supabase/functions/
├── mpesa-stk-push/      # Initiates M-Pesa STK push via Daraja API
├── send-sms/            # AfricasTalking SMS gateway
├── compute-dividends/   # Quarterly cron: insert dividend_payouts rows
└── generate-report/     # PDF/Excel for monthly statements
```

Run with:
```bash
supabase functions deploy mpesa-stk-push
```

## Security checklist

- ✅ RLS enabled on every public table
- ✅ Members can only read their own data
- ✅ Staff scoped to their SACCO via `is_staff_of()`
- ✅ Admin operations gated by `is_admin_of()`
- ✅ All money moves through SECURITY DEFINER functions
  (`process_contribution`, `approve_loan`, `disburse_loan`) so
  balance updates and ledger writes are atomic.
- ✅ Audit trail on every privileged action
- ⚠️  Don't expose the `service_role` key anywhere client-side
