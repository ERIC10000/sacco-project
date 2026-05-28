# SaccoFlow — Web + Mobile + Supabase Integration

Two clients, one backend, full realtime sync.

```
                  ┌────────────────────────────┐
                  │       Supabase             │
                  │  (Postgres + Auth + RT)    │
                  └───────────┬────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │ REST          │ Realtime      │
              ▼ + JWT         ▼ (websocket)   ▼
   ┌──────────────────┐                 ┌──────────────────┐
   │ Web Dashboard    │                 │ Android Member   │
   │ (React + TS)     │                 │ App (Kotlin)     │
   │ supabase-js v2   │                 │ Retrofit + OkHTTP│
   │ for staff/admin  │                 │ for end users    │
   └──────────────────┘                 └──────────────────┘
```

## What's the same

- Both clients hit the **same Postgres** via Supabase's auto-generated REST API.
- Both use the **same JWT** scheme (Supabase Auth) for sign-in.
- Both subscribe to the **same realtime channels** for live updates.
- **RLS policies** enforce who can see/do what regardless of which client is calling.

## What's different

| | Web Dashboard | Android App |
|---|---|---|
| Audience | SACCO staff, admins, auditors | Members |
| Client | `@supabase/supabase-js` | Retrofit + custom interceptor |
| Auth | Email + password | Phone + password (or OTP) |
| Realtime | `subscribeToTable()` helper | (TODO — easy add with Ktor + WebSocket) |
| Scope | All members in the SACCO | Only the signed-in member's data |

## End-to-end example: making a contribution

### Web (staff records a deposit at the cashier)
```ts
import { transactionsApi } from '@/services/supabaseApi'

const txnId = await transactionsApi.recordContribution(
  memberId,          // selected member
  5000,              // amount in KES
  'M_PESA',          // method
  'QGH123ABC',       // M-Pesa code from the receipt
  'Monthly contribution May 2026',
)
```

### What happens server-side
1. `process_contribution()` SECURITY DEFINER function executes:
   - Upserts a row in `transactions` (txn_type=CONTRIBUTION, status=COMPLETED)
   - Updates `savings_accounts.balance += 5000`
   - Bumps any active `savings_goals.current_amount`
   - Inserts a `notifications` row for the member
2. Supabase Realtime broadcasts to subscribed clients

### Mobile (member's phone, automatic)
```kotlin
// In an Activity / ViewModel
supabase.realtime
    .subscribe("notifications", filter = "member_id=eq.$myId") { payload ->
        showInAppToast(payload.new.title, payload.new.message)
    }
```

→ Within milliseconds of the cashier's action, the member's phone shows
"💰 Contribution received — KES 5,000".

## File map

### Web Dashboard (`sacco-project/`)
```
src/
├── lib/supabase.ts              ← Client singleton + helpers
├── types/database.ts            ← Generated DB types
├── services/
│   ├── supabaseApi.ts           ← All API functions (live)
│   ├── api.ts                   ← Original demo client (kept for fallback)
│   └── ...other service files
└── pages/
    └── Dashboard/Dashboard.tsx  ← Reads from dashboardApi
```

### Mobile App (`mflowsacco/`)
```
app/src/main/java/com/example/mflow_sacco/
├── data/
│   ├── network/
│   │   ├── SupabaseClient.kt    ← Retrofit + OkHttp + auth interceptor
│   │   ├── SupabaseApi.kt       ← Auth & PostgREST interfaces
│   │   └── dto/Dtos.kt          ← Moshi-annotated payloads
│   └── repository/
│       └── SaccoRepository.kt   ← Suspending Result<T> facade
├── ui/...                       ← Activities/Fragments call the repository
└── data/DemoData.kt             ← Still here as a fallback
```

### Database (`sacco-project/supabase/`)
```
migrations/
├── 20260527000001_initial_schema.sql      ← Tables, enums, indexes
└── 20260527000002_functions_views_rls.sql ← Functions, views, RLS
README.md
```

## Setup in 5 minutes

```bash
# 1. Create a Supabase project at app.supabase.com

# 2. Apply the schema
cd sacco-project
npm install -g supabase
supabase link --project-ref YOUR_REF
supabase db push

# 3. Configure the web app
cp .env.example .env
# fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm install
npm run dev

# 4. Configure the Android app
cd ../mflowsacco
echo "SUPABASE_URL=https://YOUR_REF.supabase.co" >> local.properties
echo "SUPABASE_ANON_KEY=YOUR_ANON_KEY"           >> local.properties
# Open in Android Studio → Sync Gradle → Run
```

## Migration path from demo data

Both clients still ship with demo data:
- Web: `src/services/*Service.ts` (with mock arrays)
- Mobile: `data/DemoData.kt`

To switch a screen to live data, swap the import:

```diff
- import { demoMembers } from '@/data/demoData'
+ import { membersApi } from '@/services/supabaseApi'
- const members = demoMembers
+ const { data: members } = await membersApi.list({ status: 'ACTIVE' })
```

You can migrate one screen at a time — the demo data and live data
have identical shapes by design.
