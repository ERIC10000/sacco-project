import { useState } from 'react'
import {
  BarChart3, FileText, Download, Plus, Clock, Calendar,
  Users, CreditCard, PiggyBank, TrendingUp, ShieldCheck,
  Filter, Eye, RefreshCw, X, CheckCircle, Sparkles,
} from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const reportTypes = [
  { id: 'monthly',       icon: Calendar,    title: 'Monthly Financial Report',   desc: 'Complete monthly P&L, contributions and loans', generated: 12 },
  { id: 'members',       icon: Users,       title: 'Member Statement',           desc: 'Individual member account statement',           generated: 247 },
  { id: 'loans',         icon: CreditCard,  title: 'Loan Portfolio Report',      desc: 'Active loans, repayments, defaults',            generated: 8  },
  { id: 'contributions', icon: PiggyBank,   title: 'Contribution Report',        desc: 'Member contributions breakdown',                generated: 15 },
  { id: 'audit',         icon: ShieldCheck, title: 'Audit & Compliance Report',  desc: 'Activity log for compliance',                   generated: 6  },
  { id: 'growth',        icon: TrendingUp,  title: 'Growth Analytics Report',    desc: 'Member growth and revenue trends',              generated: 4  },
]

const generatedReports = [
  { id: 'R-2451', name: 'Monthly Financial Report — May 2026',     type: 'Monthly Financial', format: 'PDF',  size: '2.4 MB', generatedBy: 'Admin',        date: '2026-05-26 09:15', status: 'ready' },
  { id: 'R-2450', name: 'Member Statement — John Kamau',           type: 'Member Statement',  format: 'PDF',  size: '184 KB', generatedBy: 'Jane Wairimu', date: '2026-05-26 08:42', status: 'ready' },
  { id: 'R-2449', name: 'Loan Portfolio — Q1 2026',                type: 'Loan Portfolio',    format: 'Excel',size: '1.2 MB', generatedBy: 'Admin',        date: '2026-05-25 14:30', status: 'ready' },
  { id: 'R-2448', name: 'Audit Log — April 2026',                  type: 'Audit & Compliance',format: 'PDF',  size: '892 KB', generatedBy: 'Mark Otieno',  date: '2026-05-25 11:15', status: 'ready' },
  { id: 'R-2447', name: 'Contribution Breakdown — April 2026',     type: 'Contribution',      format: 'Excel',size: '564 KB', generatedBy: 'Admin',        date: '2026-05-24 16:50', status: 'ready' },
  { id: 'R-2446', name: 'Member Statement — Wanjiru Muthoni',      type: 'Member Statement',  format: 'PDF',  size: '156 KB', generatedBy: 'Jane Wairimu', date: '2026-05-24 10:20', status: 'ready' },
]

const scheduledReports = [
  { id: 'S-12', name: 'Monthly Financial Report', schedule: 'Every 1st of the month at 09:00', recipients: 3, nextRun: 'Jun 01, 2026' },
  { id: 'S-13', name: 'Weekly Loan Report',       schedule: 'Every Monday at 08:00',          recipients: 2, nextRun: 'May 31, 2026' },
  { id: 'S-14', name: 'Daily Contribution Summary', schedule: 'Every day at 18:00',           recipients: 1, nextRun: 'Today at 18:00' },
]

const monthlyBreakdown = [
  { month: 'Jan', income: 380000, expenses: 120000 },
  { month: 'Feb', income: 425000, expenses: 135000 },
  { month: 'Mar', income: 398000, expenses: 128000 },
  { month: 'Apr', income: 470000, expenses: 142000 },
  { month: 'May', income: 512000, expenses: 156000 },
]

const breakdownData = [
  { name: 'Member Contributions', value: 4280000, fill: '#4f46e5' },
  { name: 'Loan Interest',        value: 890000,  fill: '#10b981' },
  { name: 'Penalties',            value: 124000,  fill: '#f59e0b' },
  { name: 'Other Income',         value: 56000,   fill: '#8b5cf6' },
]

export default function Reports() {
  const [tab, setTab]                 = useState<'templates' | 'generated' | 'scheduled'>('templates')
  const [generating, setGenerating]   = useState<string | null>(null)
  const [toast, setToast]             = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg); setTimeout(() => setToast(null), 2500)
  }

  const generate = async (id: string) => {
    setGenerating(id)
    await new Promise((r) => setTimeout(r, 1500))
    setGenerating(null)
    showToast('Report generated successfully')
  }

  return (
    <div className="space-y-6">

      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={16} />
          </div>
          <p className="text-sm font-semibold text-slate-800">{toast}</p>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Reports</h1>
          <p className="text-slate-500 text-sm mt-0.5">Generate, schedule and export financial reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <Clock size={14} />
            Schedule
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all shadow-md shadow-amber-600/30">
            <Plus size={14} />
            Custom Report
          </button>
        </div>
      </div>

      {/* Insight cards */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Monthly breakdown chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900">Income vs Expenses</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 5 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyBreakdown} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: any) => `KES ${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="income"   name="Income"   radius={[6, 6, 0, 0]} fill="#4f46e5" />
              <Bar dataKey="expenses" name="Expenses" radius={[6, 6, 0, 0]} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue breakdown */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="font-bold text-slate-900">Revenue Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Current month</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={breakdownData} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={2}>
                {breakdownData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `KES ${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {breakdownData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-bold text-slate-900">KES {(d.value / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-1.5 flex items-center gap-1">
        {([
          { v: 'templates' as const, label: 'Report Templates', count: reportTypes.length },
          { v: 'generated' as const, label: 'Generated',        count: generatedReports.length },
          { v: 'scheduled' as const, label: 'Scheduled',        count: scheduledReports.length },
        ]).map(({ v, label, count }) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === v ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${tab === v ? 'bg-white/20' : 'bg-slate-100'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'templates' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map(({ id, icon: Icon, title, desc, generated }) => (
            <div key={id} className="card p-5 hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {generated} generated
                </span>
              </div>
              <p className="text-base font-bold text-slate-900 mb-1">{title}</p>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{desc}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generate(id)}
                  disabled={generating === id}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
                >
                  {generating === id ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      Generate
                    </>
                  )}
                </button>
                <button className="px-3 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Eye size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'generated' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Recently generated</p>
            <button className="text-xs text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1">
              <Filter size={12} /> Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Report Name</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Format</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Generated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {generatedReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          r.format === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                          <p className="text-xs text-slate-500">by {r.generatedBy}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{r.type}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">{r.format}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{r.size}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{r.date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <Download size={12} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'scheduled' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Scheduled reports</p>
              <p className="text-xs text-slate-500">Automatically generated and delivered</p>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md">
              <Plus size={13} /> New schedule
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {scheduledReports.map((s) => (
              <div key={s.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.schedule} · {s.recipients} recipient{s.recipients !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Next run</p>
                  <p className="text-sm font-bold text-slate-900">{s.nextRun}</p>
                </div>
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                  <RefreshCw size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
