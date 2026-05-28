import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, UserPlus, Search, Filter, Download, MoreVertical,
  Eye, Edit, Trash2, Mail, Phone, MapPin, Calendar,
  CheckCircle, XCircle, AlertCircle, X, Upload, ChevronDown,
  TrendingUp, UserCheck, UserX, Clock,
} from 'lucide-react'
import { demoMembers, DemoMember, MemberStatus } from '@/data/demoData'

// ─────────────────────── ADD MEMBER DRAWER ───────────────────────

function AddMemberDrawer({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (m: DemoMember) => void }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', nationalId: '', email: '', phone: '', address: '',
  })
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)

  if (!open) return null

  const reset = () => {
    setForm({ firstName: '', lastName: '', nationalId: '', email: '', phone: '', address: '' })
    setStep(1)
  }

  const submit = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500']
    const newId = `M-${1100 + Math.floor(Math.random() * 900)}`
    onSave({
      id: newId,
      membershipNumber: newId,
      firstName: form.firstName,
      lastName: form.lastName,
      nationalId: form.nationalId,
      email: form.email,
      phone: form.phone,
      address: form.address,
      status: 'ACTIVE',
      dateJoined: new Date().toISOString().split('T')[0],
      totalContributions: 0,
      activeLoans: 0,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    })
    reset()
    setSaving(false)
    onClose()
  }

  const canProceed = step === 1
    ? form.firstName && form.lastName && form.nationalId
    : form.email && form.phone && form.address

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add new member</h2>
              <p className="text-xs text-slate-500">Step {step} of 2</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 font-bold mb-3">Personal information</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First name *</label>
                  <input className="input" placeholder="e.g. John" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last name *</label>
                  <input className="input" placeholder="e.g. Kamau" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">National ID *</label>
                <input className="input" placeholder="e.g. 24895612" value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of birth</label>
                <input type="date" className="input" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100">Male</button>
                  <button className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100">Female</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 font-bold mb-3">Contact information</p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email *</label>
                <input type="email" className="input" placeholder="member@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone *</label>
                <input className="input" placeholder="+254 712 345 678" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Address *</label>
                <textarea rows={3} className="input resize-none" placeholder="Town, County" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <p className="text-sm font-bold text-slate-900 mb-1">Welcome SMS</p>
                <p className="text-xs text-slate-600">A welcome SMS with login credentials will be sent to this member.</p>
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

          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!canProceed || saving}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle size={15} />
                  Create member
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────── MEMBERS PAGE ───────────────────────

export default function Members() {
  const navigate = useNavigate()
  const [members, setMembers] = useState(demoMembers)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | MemberStatus>('ALL')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const stats = useMemo(() => ({
    total:    members.length,
    active:   members.filter((m) => m.status === 'ACTIVE').length,
    inactive: members.filter((m) => m.status === 'INACTIVE').length,
    suspended:members.filter((m) => m.status === 'SUSPENDED').length,
    newThisMonth: members.filter((m) => new Date(m.dateJoined) >= new Date('2026-05-01')).length,
    totalContributions: members.reduce((s, m) => s + m.totalContributions, 0),
  }), [members])

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (statusFilter !== 'ALL' && m.status !== statusFilter) return false
      if (query) {
        const q = query.toLowerCase()
        return (
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.membershipNumber.toLowerCase().includes(q) ||
          m.phone.includes(q)
        )
      }
      return true
    })
  }, [members, query, statusFilter])

  const addMember = (m: DemoMember) => {
    setMembers((prev) => [m, ...prev])
    showToast(`${m.firstName} ${m.lastName} added successfully`)
  }

  const deleteMember = (id: string) => {
    const m = members.find((x) => x.id === id)
    setMembers((prev) => prev.filter((x) => x.id !== id))
    if (m) showToast(`${m.firstName} ${m.lastName} removed`)
    setOpenMenu(null)
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
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
          <h1 className="text-2xl font-extrabold text-slate-900">Members</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your SACCO membership directory.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <Upload size={14} />
            Import
          </button>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={14} />
            Export
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/30"
          >
            <UserPlus size={14} />
            Add Member
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Members',     value: stats.total,    icon: Users,     color: 'bg-indigo-50 text-indigo-600',   change: `+${stats.newThisMonth} this month` },
          { label: 'Active',            value: stats.active,   icon: UserCheck, color: 'bg-emerald-50 text-emerald-600', change: `${Math.round((stats.active / stats.total) * 100)}% of total` },
          { label: 'Inactive',          value: stats.inactive, icon: UserX,     color: 'bg-slate-100 text-slate-600',    change: 'Need follow-up' },
          { label: 'Suspended',         value: stats.suspended,icon: AlertCircle, color: 'bg-amber-50 text-amber-600',   change: 'Under review' },
        ].map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={19} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mb-0.5">{value.toLocaleString()}</p>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-xs text-slate-400 mt-1">{change}</p>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all"
            placeholder="Search by name, ID, email or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">
          <Filter size={13} />
          More filters
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Members table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Contributions</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loans</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Users size={36} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-600">No members found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const initials = `${m.firstName[0]}${m.lastName[0]}`
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${m.avatarColor} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{m.firstName} {m.lastName}</p>
                            <p className="text-xs text-slate-500 font-mono">{m.membershipNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-slate-700">{m.email}</p>
                        <p className="text-xs text-slate-500">{m.phone}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-slate-700">{new Date(m.dateJoined).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <p className="text-sm font-bold text-slate-900">KES {m.totalContributions.toLocaleString()}</p>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                          m.activeLoans === 0
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {m.activeLoans}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {m.status === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                        {m.status === 'INACTIVE' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Inactive
                          </span>
                        )}
                        {m.status === 'SUSPENDED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === m.id ? null : m.id) }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenu === m.id && (
                          <div className="absolute right-5 top-full mt-1 w-44 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20">
                            <button onClick={() => { navigate(`/members/${m.id}`); setOpenMenu(null) }} className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 text-left text-sm text-slate-700">
                              <Eye size={14} /> View profile
                            </button>
                            <button onClick={() => setOpenMenu(null)} className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 text-left text-sm text-slate-700">
                              <Edit size={14} /> Edit
                            </button>
                            <button onClick={() => setOpenMenu(null)} className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 text-left text-sm text-slate-700">
                              <Mail size={14} /> Send message
                            </button>
                            <div className="border-t border-slate-100" />
                            <button onClick={() => deleteMember(m.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-red-50 text-left text-sm text-red-600">
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-700">1 - {filtered.length}</span> of <span className="font-bold text-slate-700">{filtered.length}</span> members
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg" disabled>Previous</button>
            <button className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg">1</button>
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg">2</button>
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg">3</button>
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg">Next</button>
          </div>
        </div>
      </div>

      <AddMemberDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={addMember} />
    </div>
  )
}
