import { useState, useMemo } from 'react'
import {
  CreditCard, Plus, Search, Download, X, CheckCircle,
  Clock, AlertCircle, TrendingUp, DollarSign, FileText,
  ChevronRight, Calendar, User, Briefcase,
} from 'lucide-react'
import { demoLoans, demoMembers, DemoLoan, LoanStatus } from '@/data/demoData'

// ─────────────────── PROCESS LOAN MODAL ───────────────────

function ProcessLoanModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (l: DemoLoan) => void }) {
  const [form, setForm] = useState({
    memberId: '', amount: '', term: '12', purpose: '', interestRate: '12',
  })
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const selectedMember = demoMembers.find((m) => m.id === form.memberId)
  const amount = Number(form.amount) || 0
  const term = Number(form.term) || 12
  const rate = Number(form.interestRate) || 12
  const monthlyPayment = amount > 0 ? Math.round((amount * (1 + (rate / 100) * (term / 12))) / term) : 0
  const totalRepayment = monthlyPayment * term

  const canProceed = step === 1
    ? form.memberId
    : step === 2
    ? form.amount && form.purpose
    : true

  const submit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    const newId = `LN-${3500 + Math.floor(Math.random() * 500)}`
    onSubmit({
      id: newId,
      memberId: form.memberId,
      memberName: selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : '',
      amount,
      approvedAmount: null,
      interestRate: rate,
      termMonths: term,
      purpose: form.purpose,
      status: 'PENDING',
      applicationDate: new Date().toISOString().split('T')[0],
      approvalDate: null,
      disbursementDate: null,
      monthlyPayment,
      remainingBalance: amount,
      risk: amount > 150000 ? 'high' : amount > 75000 ? 'medium' : 'low',
    })
    setSubmitting(false)
    setForm({ memberId: '', amount: '', term: '12', purpose: '', interestRate: '12' })
    setStep(1)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Process new loan</h2>
              <p className="text-xs text-slate-500">Step {step} of 3</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 border-b border-slate-100 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${step >= s ? 'bg-violet-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-700">Select member</p>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {demoMembers.slice(0, 8).map((m) => {
                  const selected = form.memberId === m.id
                  return (
                    <button
                      key={m.id}
                      onClick={() => setForm({ ...form, memberId: m.id })}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        selected
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full ${m.avatarColor} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                        {m.firstName[0]}{m.lastName[0]}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{m.firstName} {m.lastName}</p>
                        <p className="text-xs text-slate-500">{m.membershipNumber} · {m.activeLoans} active loan{m.activeLoans !== 1 ? 's' : ''}</p>
                      </div>
                      {selected && <CheckCircle size={18} className="text-violet-600 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-700">Loan details</p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Amount (KES) *</label>
                <input type="number" className="input" placeholder="50000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Term (months)</label>
                  <select className="input" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })}>
                    {[6, 12, 18, 24, 36, 48].map((t) => <option key={t} value={t}>{t} months</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Interest rate (%)</label>
                  <input type="number" className="input" value={form.interestRate} onChange={(e) => setForm({ ...form, interestRate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Purpose *</label>
                <select className="input" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
                  <option value="">Select purpose</option>
                  {['Business expansion', 'Education', 'Medical', 'Home improvement', 'Vehicle purchase', 'Personal', 'Emergency'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-700">Review & confirm</p>
              <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-5">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-violet-100">
                  {selectedMember && (
                    <>
                      <div className={`w-10 h-10 rounded-full ${selectedMember.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                        {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{selectedMember.firstName} {selectedMember.lastName}</p>
                        <p className="text-xs text-slate-500">{selectedMember.membershipNumber}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Loan amount</p>
                    <p className="font-bold text-slate-900">KES {amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Term</p>
                    <p className="font-bold text-slate-900">{term} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Interest rate</p>
                    <p className="font-bold text-slate-900">{rate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Monthly payment</p>
                    <p className="font-bold text-violet-700">KES {monthlyPayment.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 pt-3 border-t border-violet-100">
                    <p className="text-xs text-slate-500">Total repayment</p>
                    <p className="text-lg font-extrabold text-slate-900">KES {totalRepayment.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">This application will be submitted for approval and will appear in the pending queue.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 shadow-md"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 shadow-md flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <CheckCircle size={15} />
                  Submit application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────── LOANS PAGE ───────────────────

export default function Loans() {
  const [loans, setLoans] = useState(demoLoans)
  const [modalOpen, setModalOpen] = useState(false)
  const [tab, setTab] = useState<'ALL' | LoanStatus>('ALL')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const stats = useMemo(() => ({
    active:    loans.filter((l) => l.status === 'DISBURSED').length,
    pending:   loans.filter((l) => l.status === 'PENDING').length,
    repaid:    loans.filter((l) => l.status === 'REPAID').length,
    rejected:  loans.filter((l) => l.status === 'REJECTED').length,
    disbursed: loans.filter((l) => l.status === 'DISBURSED').reduce((s, l) => s + (l.approvedAmount || 0), 0),
    pendingAmount: loans.filter((l) => l.status === 'PENDING').reduce((s, l) => s + l.amount, 0),
    outstanding: loans.filter((l) => l.status === 'DISBURSED').reduce((s, l) => s + l.remainingBalance, 0),
  }), [loans])

  const filtered = useMemo(() => {
    return loans.filter((l) => {
      if (tab !== 'ALL' && l.status !== tab) return false
      if (query) {
        const q = query.toLowerCase()
        return l.memberName.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.purpose.toLowerCase().includes(q)
      }
      return true
    })
  }, [loans, tab, query])

  const counts = {
    ALL:       loans.length,
    PENDING:   loans.filter((l) => l.status === 'PENDING').length,
    APPROVED:  loans.filter((l) => l.status === 'APPROVED').length,
    DISBURSED: loans.filter((l) => l.status === 'DISBURSED').length,
    REPAID:    loans.filter((l) => l.status === 'REPAID').length,
    REJECTED:  loans.filter((l) => l.status === 'REJECTED').length,
  }

  const approve = (id: string) => {
    setLoans((p) => p.map((l) => l.id === id ? { ...l, status: 'APPROVED' as LoanStatus, approvedAmount: l.amount, approvalDate: new Date().toISOString().split('T')[0] } : l))
    showToast(`Loan ${id} approved`)
  }
  const reject = (id: string) => {
    setLoans((p) => p.map((l) => l.id === id ? { ...l, status: 'REJECTED' as LoanStatus, approvalDate: new Date().toISOString().split('T')[0] } : l))
    showToast(`Loan ${id} rejected`)
  }
  const disburse = (id: string) => {
    setLoans((p) => p.map((l) => l.id === id ? { ...l, status: 'DISBURSED' as LoanStatus, disbursementDate: new Date().toISOString().split('T')[0] } : l))
    showToast(`Loan ${id} disbursed`)
  }
  const addLoan = (l: DemoLoan) => {
    setLoans((p) => [l, ...p])
    showToast(`Loan application ${l.id} submitted`)
  }

  const statusColors: Record<LoanStatus, string> = {
    PENDING:   'bg-amber-50 text-amber-700',
    APPROVED:  'bg-blue-50 text-blue-700',
    DISBURSED: 'bg-emerald-50 text-emerald-700',
    REPAID:    'bg-slate-100 text-slate-600',
    REJECTED:  'bg-red-50 text-red-600',
    DEFAULTED: 'bg-red-100 text-red-700',
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
          <h1 className="text-2xl font-extrabold text-slate-900">Loans</h1>
          <p className="text-slate-500 text-sm mt-0.5">Process loan applications and manage repayments.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={14} />
            Export
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 transition-all shadow-md shadow-violet-600/30"
          >
            <Plus size={14} />
            Process Loan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Loans',      value: stats.active, sub: `KES ${(stats.outstanding / 1000).toFixed(0)}K outstanding`, icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pending Approval',  value: stats.pending, sub: `KES ${(stats.pendingAmount / 1000).toFixed(0)}K requested`, icon: Clock,      color: 'bg-amber-50 text-amber-600' },
          { label: 'Total Disbursed',   value: `KES ${(stats.disbursed / 1000000).toFixed(2)}M`, sub: 'All time', icon: DollarSign, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Default Rate',      value: '2.1%', sub: 'Healthy portfolio', icon: TrendingUp, color: 'bg-violet-50 text-violet-600' },
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

      {/* Tabs */}
      <div className="card p-1.5 flex items-center gap-1 overflow-x-auto">
        {(['ALL', 'PENDING', 'APPROVED', 'DISBURSED', 'REPAID', 'REJECTED'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              tab === t
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t === 'ALL' ? 'All Loans' : t.charAt(0) + t.slice(1).toLowerCase()}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              tab === t ? 'bg-white/20' : 'bg-slate-100'
            }`}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all"
            placeholder="Search by loan ID, member name or purpose…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loans list */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <CreditCard size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">No loans found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((l) => {
              const riskColor = l.risk === 'low'
                ? 'bg-emerald-50 text-emerald-700'
                : l.risk === 'medium'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-red-50 text-red-700'

              const progress = l.approvedAmount && l.status === 'DISBURSED'
                ? ((l.approvedAmount - l.remainingBalance) / l.approvedAmount) * 100
                : null

              return (
                <div key={l.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {l.memberName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-bold text-slate-900">{l.memberName}</p>
                        <span className="text-xs font-mono text-slate-500">{l.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${riskColor}`}>
                          {l.risk} risk
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[l.status]}`}>
                          {l.status.charAt(0) + l.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">
                        <Briefcase size={11} className="inline mr-1" />
                        {l.purpose} · {l.termMonths} months · {l.interestRate}% interest
                      </p>
                      <div className="flex items-center gap-5 text-xs">
                        <div>
                          <span className="text-slate-400">Amount:</span>{' '}
                          <span className="font-bold text-slate-900">KES {l.amount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Monthly:</span>{' '}
                          <span className="font-bold text-slate-900">KES {l.monthlyPayment.toLocaleString()}</span>
                        </div>
                        {l.status === 'DISBURSED' && (
                          <div>
                            <span className="text-slate-400">Balance:</span>{' '}
                            <span className="font-bold text-violet-700">KES {l.remainingBalance.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {progress !== null && (
                        <div className="mt-3 max-w-md">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-slate-500">Repayment progress</p>
                            <p className="text-xs font-bold text-slate-700">{Math.round(progress)}%</p>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {l.status === 'PENDING' && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => reject(l.id)} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors">
                            Reject
                          </button>
                          <button onClick={() => approve(l.id)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors shadow-sm flex items-center gap-1">
                            <CheckCircle size={12} /> Approve
                          </button>
                        </div>
                      )}
                      {l.status === 'APPROVED' && (
                        <button onClick={() => disburse(l.id)} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-colors shadow-sm flex items-center gap-1">
                          <DollarSign size={12} /> Disburse
                        </button>
                      )}
                      <button className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium">
                        Details <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ProcessLoanModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addLoan} />
    </div>
  )
}
