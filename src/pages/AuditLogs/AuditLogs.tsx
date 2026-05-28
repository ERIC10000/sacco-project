import { useState, useMemo } from 'react'
import {
  ScrollText, Search, Download, Filter, Calendar, User,
  CheckCircle, X, Edit, Trash2, LogIn, Send, DollarSign,
  AlertCircle, Activity, Clock,
} from 'lucide-react'
import { demoAuditLogs, AuditAction } from '@/data/demoData'

const actionConfig: Record<AuditAction, { icon: any; color: string; label: string }> = {
  LOGIN:    { icon: LogIn,        color: 'bg-slate-100 text-slate-700',    label: 'Login' },
  CREATE:   { icon: CheckCircle,  color: 'bg-emerald-50 text-emerald-700', label: 'Create' },
  UPDATE:   { icon: Edit,         color: 'bg-blue-50 text-blue-700',       label: 'Update' },
  DELETE:   { icon: Trash2,       color: 'bg-red-50 text-red-700',         label: 'Delete' },
  APPROVE:  { icon: CheckCircle,  color: 'bg-emerald-50 text-emerald-700', label: 'Approve' },
  REJECT:   { icon: X,            color: 'bg-red-50 text-red-700',         label: 'Reject' },
  DISBURSE: { icon: DollarSign,   color: 'bg-violet-50 text-violet-700',   label: 'Disburse' },
  EXPORT:   { icon: Download,     color: 'bg-amber-50 text-amber-700',     label: 'Export' },
}

export default function AuditLogs() {
  const [query, setQuery]           = useState('')
  const [actionFilter, setAction]   = useState<'ALL' | AuditAction>('ALL')
  const [userFilter, setUserFilter] = useState<string>('ALL')

  const stats = useMemo(() => ({
    total:   demoAuditLogs.length,
    today:   demoAuditLogs.length, // all are today in demo
    users:   [...new Set(demoAuditLogs.map((l) => l.user))].length,
    flagged: 0,
  }), [])

  const users = [...new Set(demoAuditLogs.map((l) => l.user))]

  const filtered = demoAuditLogs.filter((l) => {
    if (actionFilter !== 'ALL' && l.action !== actionFilter) return false
    if (userFilter   !== 'ALL' && l.user !== userFilter)     return false
    if (query) {
      const q = query.toLowerCase()
      return l.user.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.resource.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Audit Logs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track every action performed in your SACCO system.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={14} />
            Export logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events',    value: stats.total,   sub: 'All time',  icon: Activity,      color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Today',           value: stats.today,   sub: 'Last 24h',  icon: Clock,         color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Active Users',    value: stats.users,   sub: 'In logs',   icon: User,          color: 'bg-violet-50 text-violet-600' },
          { label: 'Flagged Events',  value: stats.flagged, sub: 'For review',icon: AlertCircle,   color: 'bg-amber-50 text-amber-600' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={19} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mb-0.5">{value}</p>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all"
            placeholder="Search logs by user, action or detail…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          value={actionFilter}
          onChange={(e) => setAction(e.target.value as any)}
        >
          <option value="ALL">All actions</option>
          {Object.keys(actionConfig).map((a) => (
            <option key={a} value={a}>{actionConfig[a as AuditAction].label}</option>
          ))}
        </select>

        <select
          className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        >
          <option value="ALL">All users</option>
          {users.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>

        <button className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">
          <Calendar size={14} />
          Date range
        </button>
      </div>

      {/* Logs list */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <ScrollText size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">No logs match your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((log) => {
              const cfg = actionConfig[log.action]
              const Icon = cfg.icon
              return (
                <div key={log.id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-bold text-slate-900">{log.user}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{log.resource}</span>
                    </div>
                    <p className="text-sm text-slate-700">{log.details}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {log.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-mono">{log.ip}</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {log.userInitials}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-700">{filtered.length}</span> of <span className="font-bold text-slate-700">{demoAuditLogs.length}</span> events
          </p>
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Load more</button>
        </div>
      </div>
    </div>
  )
}
