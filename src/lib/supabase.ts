import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// ─── Env vars (loaded via Vite from .env) ────────────────────────
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env — ' +
    'the dashboard will run in demo mode without a backend.'
  )
}

// ─── Singleton client ────────────────────────────────────────────
export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL ?? 'http://localhost:54321',
  SUPABASE_ANON_KEY ?? 'public-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession:   true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  },
)

// ─── Auth helpers ────────────────────────────────────────────────
export const auth = {
  signIn:   (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signOut:  () => supabase.auth.signOut(),
  user:     () => supabase.auth.getUser(),
  session:  () => supabase.auth.getSession(),
  onChange: (cb: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(cb),
}

// ─── Realtime helpers ────────────────────────────────────────────
export function subscribeToTable<T extends keyof Database['public']['Tables']>(
  table: T,
  filter: string | undefined,
  onEvent: (payload: any) => void,
) {
  const ch = supabase
    .channel(`rt-${String(table)}-${Date.now()}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: String(table), filter },
      onEvent,
    )
    .subscribe()
  return () => supabase.removeChannel(ch)
}
