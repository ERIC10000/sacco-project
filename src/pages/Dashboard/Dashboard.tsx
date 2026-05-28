import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi, registrationsApi } from '@/services/supabaseApi'
import {
  Users, CreditCard, PiggyBank, AlertCircle, FileText,
  TrendingUp, TrendingDown, ArrowRight, ArrowUpRight, Clock,
  UserPlus, Download, Calendar, MoreVertical, CheckCircle,
  X, Filter, RefreshCw, ChevronRight, Sparkles, Eye,
  Award, Activity, ArrowDownRight,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

// ─────────────────────────── DATA ───────────────────────────

const monthlyData = [
  { month: 'Jan', contributions: 380000, repayments: 210000 },
  { month: 'Feb', contributions: 425000, repayments: 245000 },
  { month: 'Mar', contributions: 398000, repayments: 230000 },
  { month: 'Apr', contributions: 470000, repayments: 280000 },
  { month: 'May', contributions: 512000, repayments: 310000 },
  { month: 'Jun', contributions: 498000, repayments: 295000 },
  { month: 'Jul', contributions: 561000, repayments: 340000 },
]

const loanData = [
  { name: 'Approved',  value: 145, fill: '#4f46e5' },
  { name: 'Pending',   value: 38,  fill: '#f59e0b' },
  { name: 'Rejected',  value: 24,  fill: '#ef4444' },
  { name: 'Disbursed', value: 135, fill: '#10b981' },
]

const memberGrowthData = [
  { month: 'Jan', value: 980 },
  { month: 'Feb', value: 1012 },
  { month: 'Mar', value: 1058 },
  { month: 'Apr', value: 1115 },
  { month: 'May', value: 1180 },
  { month: 'Jun', value: 1220 },
  { month: 'Jul', value: 1248 },
]

const sparkline = [4, 6, 5, 8, 7, 9, 12, 11, 14, 13, 16, 18]

const recentActivity = [
  { id: 1, member: 'John Kamau',      type: 'Contribution',     category: 'contribution', amount: '+KES 5,000',   time: '2 min ago',  status: 'completed', color: 'bg-indigo-500' },
  { id: 2, member: 'Wanjiru Muthoni', type: 'Loan Repayment',   category: 'loan',         amount: '+KES 12,500',  time: '18 min ago', status: 'completed', color: 'bg-violet-500' },
  { id: 3, member: 'Peter Otieno',    type: 'Loan Application', category: 'loan',         amount: 'KES 80,000',   time: '1 hr ago',   status: 'pending',   color: 'bg-amber-500' },
  { id: 4, member: 'Grace Achieng',   type: 'Contribution',     category: 'contribution', amount: '+KES 3,000',   time: '2 hrs ago',  status: 'completed', color: 'bg-indigo-500' },
  { id: 5, member: 'David Njoroge',   type: 'Loan Repayment',   category: 'loan',         amount: '+KES 8,750',   time: '3 hrs ago',  status: 'completed', color: 'bg-violet-500' },
  { id: 6, member: 'Amina Hassan',    type: 'New Member',       category: 'member',       amount: '—',            time: 'Yesterday',  status: 'new',       color: 'bg-emerald-500' },
  { id: 7, member: 'Joseph Kiprono',  type: 'Contribution',     category: 'contribution', amount: '+KES 10,000',  time: 'Yesterday',  status: 'completed', color: 'bg-indigo-500' },
  { id: 8, member: 'Mary Wambui',     type: 'Loan Application', category: 'loan',         amount: 'KES 150,000',  time: '2 days ago', status: 'approved',  color: 'bg-emerald-500' },
]

const pendingApprovals = [
  { id: 'LN-3421', member: 'Peter Otieno',    amount: 80000,  term: '12 months', purpose: 'Business expansion', risk: 'low'    },
  { id: 'LN-3422', member: 'Sarah Wanjiku',   amount: 150000, term: '24 months', purpose: 'Home improvement',   risk: 'medium' },
  { id: 'LN-3423', member: 'James Mwangi',    amount: 45000,  term: '6 months',  purpose: 'Education',          risk: 'low'    },
  { id: 'LN-3424', member: 'Lucy Akinyi',     amount: 200000, term: '36 months', purpose: 'Vehicle purchase',   risk: 'high'   },
]

const topContributors = [
  { rank: 1, name: 'Joseph Kiprono',  amount: 285000, trend: 12,  initials: 'JK' },
  { rank: 2, name: 'Mary Wambui',     amount: 242000, trend: 8,   initials: 'MW' },
  { rank: 3, name: 'David Njoroge',   amount: 198000, trend: -3,  initials: 'DN' },
  { rank: 4, name: 'Grace Achieng',   amount: 175000, trend: 15,  initials: 'GA' },
  { rank: 5, name: 'John Kamau',      amount: 152000, trend: 5,   initials: 'JK' },
]

const upcomingRepayments = [
  { id: 1, member: 'Wanjiru Muthoni', amount: 12500, dueDate: 'Today',    overdue: false, daysUntil: 0 },
  { id: 2, member: 'Peter Otieno',    amount: 8750,  dueDate: 'Tomorrow', overdue: false, daysUntil: 1 },
  { id: 3, member: 'James Mwangi',    amount: 5200,  dueDate: 'May 28',   overdue: false, daysUntil: 2 },
  { id: 4, member: 'Lucy Akinyi',     amount: 18900, dueDate: 'May 30',   overdue: false, daysUntil: 4 },
  { id: 5, member: 'Joseph Kiprono',  amount: 22000, dueDate: 'Jun 02',   overdue: false, daysUntil: 7 },
]

const kpis = [
  { label: 'Total Members',       value: '1,248',     change: '+12',    changeLabel: 'this month',       up: true,  icon: Users,        color: 'bg-indigo-50 text-indigo-600',   sparkColor: '#4f46e5' },
  { label: 'Active Loans',        value: '342',       change: '+8',     changeLabel: 'this month',       up: true,  icon: CreditCard,   color: 'bg-violet-50 text-violet-600',   sparkColor: '#7c3aed' },
  { label: 'Total Contributions', value: 'KES 4.28M', change: '+9.3%',  changeLabel: 'vs last month',    up: true,  icon: PiggyBank,    color: 'bg-emerald-50 text-emerald-600', sparkColor: '#10b981' },
  { label: 'Pending Approvals',   value: '18',        change: '-4',     changeLabel: 'from yesterday',   up: false, icon: AlertCircle,  color: 'bg-amber-50 text-amber-600',     sparkColor: '#f59e0b' },
]

const quickActions = [
  { label: 'Add Member',          icon: UserPlus,    color: 'from-indigo-500 to-indigo-600', path: '/members'       },
  { label: 'Record Contribution', icon: PiggyBank,   color: 'from-emerald-500 to-emerald-600', path: '/contributions' },
  { label: 'Process Loan',        icon: CreditCard,  color: 'from-violet-500 to-violet-600', path: '/loans'         },
  { label: 'Generate Report',     icon: FileText,    color: 'from-amber-500 to-amber-600',   path: '#'              },
]

// ─────────────────────────── HELPERS ───────────────────────────

function fmt(n: number) {
  return n >= 1000000
    ? `${(n / 1000000).toFixed(1)}M`
    : n >= 1000
    ? `${(n / 1000).toFixed(0)}K`
    : String(n)
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-3 text-xs">
      <p className="font-bold text-slate-800 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: KES {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// Mini sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80 - 10}`)
    .join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-10">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─────────────────────────── REPORT MODAL ───────────────────────────

function ReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [reportType, setReportType]   = useState('monthly')
  const [format, setFormat]           = useState('pdf')
  const [generating, setGenerating]   = useState(false)
  const [done, setDone]               = useState(false)

  if (!open) return null

  const generate = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 1800))
    setGenerating(false)
    setDone(true)
    setTimeout(() => { setDone(false); onClose() }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Generate Report</h2>
              <p className="text-xs text-slate-500">Choose your report options</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        {done ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-1">Report ready!</p>
            <p className="text-sm text-slate-500">Your download has started.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Report Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['monthly', 'quarterly', 'annual', 'custom'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setReportType(t)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                        reportType === t
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Export Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 'pdf',  label: 'PDF',   icon: '📄' },
                    { v: 'xlsx', label: 'Excel', icon: '📊' },
                    { v: 'csv',  label: 'CSV',   icon: '📋' },
                  ].map((f) => (
                    <button
                      key={f.v}
                      onClick={() => setFormat(f.v)}
                      className={`px-3 py-3 rounded-lg text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                        format === f.v
                          ? 'bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl">{f.icon}</span>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">Included data</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Members', 'Contributions', 'Loans', 'Repayments', 'Audit logs'].map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button
                onClick={generate}
                disabled={generating}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    Generate {format.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────── DASHBOARD ───────────────────────────

// Resolved at runtime from the saccos table by short_code so this works
// regardless of which UUID Supabase assigned.
import { supabase } from '@/lib/supabase'
const FALLBACK_SACCO_ID = '00000000-0000-0000-0000-000000000001'
let cachedSaccoId: string | null = null
const resolveSaccoId = async (): Promise<string> => {
  if (cachedSaccoId) return cachedSaccoId
  const { data } = await supabase
    .from('saccos').select('id').eq('short_code', 'UMOJA').limit(1).single()
  cachedSaccoId = data?.id ?? FALLBACK_SACCO_ID
  return cachedSaccoId
}

// One labeled row in the member-details modal, with optional copy button.
function DetailRow({
  label, value, copyable = false,
}: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* older browsers */ }
  }
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-semibold text-slate-900 truncate">{value}</span>
        {copyable && value !== '—' && (
          <button
            onClick={onCopy}
            title={`Copy ${label}`}
            className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold whitespace-nowrap"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [reportOpen, setReportOpen]               = useState(false)
  const [activityFilter, setActivityFilter]       = useState<'all' | 'contribution' | 'loan' | 'member'>('all')
  const [pending, setPending]                     = useState(pendingApprovals)
  const [actionToast, setActionToast]             = useState<{ message: string; type: 'success' | 'info' } | null>(null)

  // ─── Live KPIs from Supabase ───────────────────────────────────
  const [liveStats, setLiveStats] = useState<{
    totalMembers: number; activeLoans: number; totalContributions: number; pendingApprovals: number
  } | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError,   setStatsError]   = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setStatsLoading(true)
    resolveSaccoId()
      .then((id) => dashboardApi.stats(id))
      .then((s) => { if (!cancelled) { setLiveStats(s); setStatsError(null) } })
      .catch((e) => { if (!cancelled) setStatsError(e.message ?? 'Could not load stats') })
      .finally(() => { if (!cancelled) setStatsLoading(false) })
    return () => { cancelled = true }
  }, [])

  // ─── Pending member registrations (real-time) ───────────────────
  interface PendingMember {
    id: string; first_name: string; last_name: string;
    phone: string; email: string | null; national_id: string | null;
    membership_no: string; created_at: string; avatar_color: string | null;
  }
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([])
  const [selectedMember, setSelectedMember] = useState<PendingMember | null>(null)
  const [actionInFlight, setActionInFlight] = useState<'approve' | 'reject' | null>(null)

  const loadPendingMembers = async () => {
    const id = await resolveSaccoId()
    const { data } = await registrationsApi.pending(id)
    setPendingMembers((data ?? []) as any)
  }

  useEffect(() => {
    let unsub: (() => void) | undefined
    ;(async () => {
      const id = await resolveSaccoId()
      await loadPendingMembers()
      unsub = registrationsApi.subscribePending(id, () => loadPendingMembers())
    })()
    return () => { unsub?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const approveMember = async (m: PendingMember) => {
    setActionInFlight('approve')
    const { error } = await registrationsApi.approve(m.id)
    setActionInFlight(null)
    if (error) { showToast(`Approval failed: ${error.message}`, 'info'); return }
    showToast(`${m.first_name} ${m.last_name} approved`, 'success')
    setSelectedMember(null)
    loadPendingMembers()
  }

  const rejectMember = async (m: PendingMember) => {
    const reason = window.prompt(`Reject ${m.first_name}'s registration. Reason?`, 'Failed KYC')
    if (!reason) return
    setActionInFlight('reject')
    const { error } = await registrationsApi.reject(m.id, reason)
    setActionInFlight(null)
    if (error) { showToast(`Reject failed: ${error.message}`, 'info'); return }
    showToast(`${m.first_name} ${m.last_name} rejected`, 'info')
    setSelectedMember(null)
    loadPendingMembers()
  }

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60_000)
    if (mins < 1)    return 'just now'
    if (mins < 60)   return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs  < 24)   return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  /** Merge live data into the existing KPI definitions so the cards stay styled. */
  const liveKpis = useMemo(() => {
    if (!liveStats) return kpis
    const formatKES = (n: number) =>
      n >= 1_000_000 ? `KES ${(n / 1_000_000).toFixed(2)}M`
      : n >= 1_000   ? `KES ${(n / 1_000).toFixed(0)}K`
      : `KES ${n}`
    return [
      { ...kpis[0], value: liveStats.totalMembers.toLocaleString() },
      { ...kpis[1], value: liveStats.activeLoans.toLocaleString() },
      { ...kpis[2], value: formatKES(liveStats.totalContributions) },
      { ...kpis[3], value: liveStats.pendingApprovals.toString() },
    ]
  }, [liveStats])

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setActionToast({ message, type })
    setTimeout(() => setActionToast(null), 2500)
  }

  const handleApprove = (id: string) => {
    setPending((p) => p.filter((x) => x.id !== id))
    showToast(`Loan ${id} approved successfully`, 'success')
  }
  const handleReject = (id: string) => {
    setPending((p) => p.filter((x) => x.id !== id))
    showToast(`Loan ${id} rejected`, 'info')
  }

  const filteredActivity = activityFilter === 'all'
    ? recentActivity
    : recentActivity.filter((a) => a.category === activityFilter)

  const activityCounts = {
    all:           recentActivity.length,
    contribution:  recentActivity.filter((a) => a.category === 'contribution').length,
    loan:          recentActivity.filter((a) => a.category === 'loan').length,
    member:        recentActivity.filter((a) => a.category === 'member').length,
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-200">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            actionToast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
          }`}>
            <CheckCircle size={16} />
          </div>
          <p className="text-sm font-semibold text-slate-800">{actionToast.message}</p>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Here's what's happening with your SACCO today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/30"
          >
            <Download size={14} />
            Generate Report
          </button>
        </div>
      </div>

      {/* ── Smart alert banner ── */}
      <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-5 py-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
          <AlertCircle size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">
            {pending.length} loan{pending.length !== 1 ? 's' : ''} need your approval
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            Total requested: KES {pending.reduce((s, p) => s + p.amount, 0).toLocaleString()}. Review and process them below.
          </p>
        </div>
        <a href="#pending-approvals" className="hidden sm:flex text-sm font-semibold text-amber-700 hover:text-amber-800 items-center gap-1">
          Review now <ArrowRight size={14} />
        </a>
      </div>

      {/* ── Pending member registrations (live from mobile app) ── */}
      {pendingMembers.length > 0 && (
        <div className="card overflow-hidden border-indigo-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UserPlus size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">New member registrations</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {pendingMembers.length} pending admin approval · live from mobile sign-ups
                </p>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMember(m)}
                className="w-full px-5 py-3.5 hover:bg-slate-50/60 transition-colors flex items-center gap-4 text-left"
              >
                <div className={`w-10 h-10 rounded-full ${m.avatar_color ?? 'bg-indigo-500'} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                  {m.first_name[0]}{m.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{m.first_name} {m.last_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{m.membership_no}</p>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">{relativeTime(m.created_at)}</p>
                <span className="text-xs text-indigo-600 font-bold flex items-center gap-1">
                  Review <ChevronRight size={14} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Member details modal — admin sees full info + approve/reject ── */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => actionInFlight ? undefined : setSelectedMember(null)}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 px-6 pt-6 pb-16">
              <button
                onClick={() => setSelectedMember(null)}
                disabled={!!actionInFlight}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </button>
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-100 font-bold tracking-wider uppercase border border-amber-300/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" /> Pending review
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-3 leading-tight">
                {selectedMember.first_name} {selectedMember.last_name}
              </h2>
              <p className="text-indigo-100 font-mono text-sm mt-1">{selectedMember.membership_no}</p>
            </div>

            {/* Avatar overlapping the header */}
            <div className={`absolute top-[88px] left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl ${selectedMember.avatar_color ?? 'bg-indigo-500'} ring-4 ring-white text-white flex items-center justify-center text-2xl font-extrabold shadow-lg`}>
              {selectedMember.first_name[0]}{selectedMember.last_name[0]}
            </div>

            {/* Body */}
            <div className="px-6 pt-14 pb-6 space-y-4">
              <p className="text-center text-xs text-slate-400">
                Submitted {relativeTime(selectedMember.created_at)}
              </p>

              {/* Detail rows */}
              <div className="bg-slate-50 rounded-xl divide-y divide-slate-100">
                <DetailRow label="Phone"        value={selectedMember.phone}                  copyable />
                <DetailRow label="Email"        value={selectedMember.email ?? '—'} />
                <DetailRow label="National ID"  value={selectedMember.national_id ?? '—'} copyable={!!selectedMember.national_id} />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => rejectMember(selectedMember)}
                  disabled={!!actionInFlight}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {actionInFlight === 'reject' ? 'Rejecting…' : 'Reject'}
                </button>
                <button
                  onClick={() => approveMember(selectedMember)}
                  disabled={!!actionInFlight}
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {actionInFlight === 'approve' ? (
                    'Approving…'
                  ) : (
                    <>
                      <CheckCircle size={15} /> Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map(({ label, icon: Icon, color, path }) => (
          <Link
            key={label}
            to={path}
            onClick={(e) => { if (path === '#') { e.preventDefault(); setReportOpen(true) } }}
            className={`group bg-gradient-to-br ${color} text-white rounded-xl p-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon size={22} />
              <ArrowUpRight size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm font-bold">{label}</p>
            <p className="text-xs opacity-80 mt-0.5">Quick action</p>
          </Link>
        ))}
      </div>

      {/* ── KPI Cards (with sparklines, live from Supabase) ── */}
      {statsError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          ⚠️ Live data error: {statsError}. Showing cached values.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {liveKpis.map(({ label, value, change, changeLabel, up, icon: Icon, color, sparkColor }) => (
          <div key={label} className="card p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={19} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                up ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
              }`}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {change}
              </div>
            </div>
            <p className={`text-2xl font-extrabold text-slate-900 mb-0.5 ${statsLoading ? 'animate-pulse' : ''}`}>
              {value}
            </p>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {statsLoading ? 'syncing live…' : changeLabel}
            </p>
            <div className="mt-2 -mx-1 opacity-70 group-hover:opacity-100 transition-opacity">
              <Sparkline data={sparkline} color={sparkColor} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Area chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <h2 className="font-bold text-slate-900">Contributions vs Repayments</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 months</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              {['7M', '1Y', 'All'].map((p, i) => (
                <button
                  key={p}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    i === 0 ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="contrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="repay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="contributions" name="Contributions" stroke="#4f46e5" strokeWidth={2.5} fill="url(#contrib)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
              <Area type="monotone" dataKey="repayments"    name="Repayments"    stroke="#10b981" strokeWidth={2.5} fill="url(#repay)"   dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-3">
            {[
              { color: 'bg-indigo-600',   label: 'Contributions', value: 'KES 3.24M' },
              { color: 'bg-emerald-500', label: 'Repayments',    value: 'KES 1.91M' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                <div>
                  <p className="text-xs text-slate-500 leading-tight">{l.label}</p>
                  <p className="text-xs font-bold text-slate-700 leading-tight">{l.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loan status bar chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-slate-900">Loan Status</h2>
              <p className="text-xs text-slate-400 mt-0.5">Current distribution</p>
            </div>
            <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50">
              <MoreVertical size={14} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={loanData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v: any) => [`${v} loans`, '']} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {loanData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-slate-400">Total disbursed</p>
              <p className="text-sm font-bold text-slate-800">KES 12.8M</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Default rate</p>
              <p className="text-sm font-bold text-emerald-600">2.1%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pending Approvals + Top Contributors ── */}
      <div className="grid lg:grid-cols-3 gap-4" id="pending-approvals">

        {/* Pending approvals */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Pending Loan Approvals</h2>
                <p className="text-xs text-slate-400 mt-0.5">Action required</p>
              </div>
            </div>
            <Link to="/loans" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {pending.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <CheckCircle size={28} />
              </div>
              <p className="text-sm font-bold text-slate-800">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">No loans pending your approval.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {pending.map((loan) => {
                const riskColor = loan.risk === 'low'
                  ? 'bg-emerald-50 text-emerald-700'
                  : loan.risk === 'medium'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-red-50 text-red-700'

                return (
                  <div key={loan.id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {loan.member.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900 truncate">{loan.member}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${riskColor}`}>
                          {loan.risk} risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <span className="font-mono">{loan.id}</span> · {loan.purpose} · {loan.term}
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-slate-900">KES {loan.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">requested</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleReject(loan.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Reject"
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => handleApprove(loan.id)}
                        className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1"
                      >
                        <CheckCircle size={13} />
                        Approve
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Contributors */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Award size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Top Contributors</h2>
                <p className="text-xs text-slate-400 mt-0.5">This month</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {topContributors.map((c) => (
              <div key={c.rank} className="px-5 py-3 hover:bg-slate-50/60 transition-colors flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  c.rank === 1 ? 'bg-amber-100 text-amber-700' :
                  c.rank === 2 ? 'bg-slate-200 text-slate-700' :
                  c.rank === 3 ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-50 text-slate-500'
                }`}>
                  {c.rank}
                </span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                  <p className="text-xs text-slate-500">KES {c.amount.toLocaleString()}</p>
                </div>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${
                  c.trend > 0 ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {c.trend > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {Math.abs(c.trend)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Upcoming Repayments + Member Growth ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Upcoming repayments */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Upcoming Repayments</h2>
                <p className="text-xs text-slate-400 mt-0.5">Next 7 days</p>
              </div>
            </div>
            <Link to="/loans" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingRepayments.map((r) => (
              <div key={r.id} className="px-5 py-3 hover:bg-slate-50/60 transition-colors flex items-center gap-4">
                <div className="w-12 text-center">
                  <p className={`text-xs font-bold ${
                    r.daysUntil === 0 ? 'text-red-600' :
                    r.daysUntil === 1 ? 'text-amber-600' :
                    'text-slate-500'
                  }`}>
                    {r.dueDate}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {r.daysUntil === 0 ? 'Today' : `${r.daysUntil}d`}
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {r.member.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{r.member}</p>
                  <p className="text-xs text-slate-500">Loan repayment</p>
                </div>
                <p className="text-sm font-bold text-slate-900">KES {r.amount.toLocaleString()}</p>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Eye size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">Total expected</p>
            <p className="text-sm font-bold text-slate-800">
              KES {upcomingRepayments.reduce((s, r) => s + r.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Member growth */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Activity size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Member Growth</h2>
                <p className="text-xs text-slate-400 mt-0.5">Past 7 months</p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-extrabold text-slate-900">1,248</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight size={11} /> +27.3%
              </span>
              <p className="text-xs text-slate-500">vs Jan</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={memberGrowthData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="memG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, padding: '6px 10px' }}
                formatter={(v: any) => [`${v} members`, 'Total']}
              />
              <Line type="monotone" dataKey="value" stroke="url(#memG)" strokeWidth={3} dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="pt-3 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="text-xs text-slate-400">New this month</p>
              <p className="text-sm font-bold text-emerald-600">+28</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Active rate</p>
              <p className="text-sm font-bold text-slate-800">94.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Activity (with filter tabs) ── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Recent Activity</h2>
                <p className="text-xs text-slate-400 mt-0.5">Latest transactions and events</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">
                <Filter size={12} />
                Filter
              </button>
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                View all <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {([
              { key: 'all',           label: 'All' },
              { key: 'contribution',  label: 'Contributions' },
              { key: 'loan',          label: 'Loans' },
              { key: 'member',        label: 'Members' },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setActivityFilter(t.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activityFilter === t.key
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.label}
                <span className={`text-[10px] px-1.5 rounded-full ${
                  activityFilter === t.key ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {activityCounts[t.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredActivity.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-slate-400">No activity in this category</p>
            </div>
          ) : (
            filteredActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer">
                {/* Status indicator + avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                    {item.member.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${item.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{item.member}</p>
                  <p className="text-xs text-slate-500 truncate">{item.type}</p>
                </div>

                <p className={`text-sm font-bold flex-shrink-0 hidden sm:block ${
                  item.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-700'
                }`}>
                  {item.amount}
                </p>

                <div className="text-right flex-shrink-0">
                  <span className={
                    item.status === 'completed' ? 'badge-green' :
                    item.status === 'pending'   ? 'badge-amber' :
                    item.status === 'approved'  ? 'badge-blue'  :
                    'badge-blue'
                  }>
                    {item.status === 'completed' ? 'Completed' :
                     item.status === 'pending'   ? 'Pending' :
                     item.status === 'approved'  ? 'Approved' : 'New'}
                  </span>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-0.5 justify-end">
                    <Clock size={10} />
                    {item.time}
                  </p>
                </div>

                <ChevronRight size={14} className="text-slate-300 flex-shrink-0 hidden md:block" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}
