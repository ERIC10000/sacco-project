import { useState } from 'react'
import {
  Building2, Bell, Lock, Users, CreditCard, Palette,
  CheckCircle, Globe, Mail, Smartphone, Shield, Database,
  Save, ChevronRight,
} from 'lucide-react'

const sections = [
  { id: 'organization', icon: Building2,  label: 'Organization',     desc: 'SACCO info & branding' },
  { id: 'loans',        icon: CreditCard, label: 'Loan Policies',    desc: 'Interest, terms, limits' },
  { id: 'contributions',icon: Palette,    label: 'Contribution Rules', desc: 'Min/max, frequency' },
  { id: 'notifications',icon: Bell,       label: 'Notifications',    desc: 'SMS, email, alerts' },
  { id: 'users',        icon: Users,      label: 'Users & Roles',    desc: 'Staff permissions' },
  { id: 'security',     icon: Shield,     label: 'Security',         desc: '2FA, sessions, audit' },
  { id: 'integrations', icon: Database,   label: 'Integrations',     desc: 'M-Pesa, banks, SMS' },
]

export default function Settings() {
  const [active, setActive]   = useState('organization')
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg); setTimeout(() => setToast(null), 2500)
  }

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    showToast('Settings saved successfully')
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

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure your SACCO operations and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">

        {/* Sidebar */}
        <div className="card p-3 h-fit sticky top-20">
          {sections.map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                active === id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={17} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-slate-400 truncate">{desc}</p>
              </div>
              {active === id && <ChevronRight size={14} />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">

          {active === 'organization' && (
            <>
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Organization details</h2>
                <p className="text-sm text-slate-500 mb-6">This information appears on receipts, reports and member portal.</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">SACCO Name</label>
                    <input className="input" defaultValue="Umoja Savings & Credit Cooperative" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Registration No.</label>
                    <input className="input" defaultValue="CS/12345/2018" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tax PIN</label>
                    <input className="input" defaultValue="P051234567X" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                    <input type="email" className="input" defaultValue="info@umojasacco.co.ke" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone</label>
                    <input className="input" defaultValue="+254 712 345 678" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Physical address</label>
                    <textarea rows={2} className="input resize-none" defaultValue="P.O. Box 4567, Nakuru, Kenya" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Localization</h2>
                <p className="text-sm text-slate-500 mb-6">Set your currency, timezone, and language.</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Currency</label>
                    <select className="input" defaultValue="KES">
                      <option value="KES">KES (Kenyan Shilling)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="UGX">UGX (Ugandan Shilling)</option>
                      <option value="TZS">TZS (Tanzanian Shilling)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Timezone</label>
                    <select className="input" defaultValue="Africa/Nairobi">
                      <option>Africa/Nairobi</option>
                      <option>Africa/Kampala</option>
                      <option>Africa/Dar_es_Salaam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Language</label>
                    <select className="input" defaultValue="en">
                      <option value="en">English</option>
                      <option value="sw">Kiswahili</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {active === 'loans' && (
            <div className="card p-6 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Loan policies</h2>
                <p className="text-sm text-slate-500">Configure default loan terms and limits.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default interest rate (% p.a.)</label>
                  <input type="number" className="input" defaultValue="12" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Maximum loan term (months)</label>
                  <input type="number" className="input" defaultValue="48" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Minimum loan amount (KES)</label>
                  <input type="number" className="input" defaultValue="5000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Maximum loan amount (KES)</label>
                  <input type="number" className="input" defaultValue="500000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Late payment penalty (%)</label>
                  <input type="number" className="input" defaultValue="5" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Multiplier (times savings)</label>
                  <input type="number" className="input" defaultValue="3" />
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <p className="text-sm font-bold text-slate-700">Approval workflow</p>
                {[
                  { label: 'Require guarantors',          on: true,  desc: 'At least 2 guarantors per loan' },
                  { label: 'Two-step approval',           on: true,  desc: 'Loan officer + Manager' },
                  { label: 'Auto-disburse on approval',   on: false, desc: 'Skip manual disbursement step' },
                  { label: 'Send approval SMS',           on: true,  desc: 'Notify members automatically' },
                ].map((opt) => (
                  <label key={opt.label} className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                    <div className={`relative w-10 h-6 rounded-full transition-colors ${opt.on ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${opt.on ? 'left-4' : 'left-0.5'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {active === 'contributions' && (
            <div className="card p-6 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Contribution rules</h2>
                <p className="text-sm text-slate-500">Set member contribution requirements.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Minimum monthly contribution (KES)</label>
                  <input type="number" className="input" defaultValue="500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Registration fee (KES)</label>
                  <input type="number" className="input" defaultValue="2000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Contribution frequency</label>
                  <select className="input" defaultValue="monthly">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Due date</label>
                  <input className="input" defaultValue="15th of every month" />
                </div>
              </div>
            </div>
          )}

          {active === 'notifications' && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Notification preferences</h2>
              <p className="text-sm text-slate-500 mb-6">Choose what notifications to send and how.</p>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Event</th>
                    <th className="text-center pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider"><Smartphone size={14} className="inline" /> SMS</th>
                    <th className="text-center pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider"><Mail size={14} className="inline" /> Email</th>
                    <th className="text-center pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider"><Bell size={14} className="inline" /> In-app</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'New contribution recorded',  sms: true,  email: false, app: true },
                    { label: 'Loan approved',              sms: true,  email: true,  app: true },
                    { label: 'Loan rejected',              sms: true,  email: true,  app: true },
                    { label: 'Loan disbursed',             sms: true,  email: true,  app: true },
                    { label: 'Repayment due reminder',     sms: true,  email: false, app: true },
                    { label: 'Overdue payment alert',      sms: true,  email: true,  app: true },
                    { label: 'AGM and meetings',           sms: false, email: true,  app: true },
                    { label: 'Monthly statement',          sms: false, email: true,  app: false },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-slate-50">
                      <td className="py-3 text-sm text-slate-800">{row.label}</td>
                      {['sms', 'email', 'app'].map((ch) => (
                        <td key={ch} className="py-3 text-center">
                          <label className="inline-flex">
                            <input type="checkbox" defaultChecked={(row as any)[ch]} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {active === 'users' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Staff & roles</h2>
                  <p className="text-sm text-slate-500">Manage who has access to your system.</p>
                </div>
                <button className="px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md">
                  + Invite user
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { name: 'Admin',         email: 'admin@umojasacco.co.ke',      role: 'Administrator', last: 'Online now',     color: 'from-indigo-500 to-violet-600' },
                  { name: 'Jane Wairimu',  email: 'jane.w@umojasacco.co.ke',     role: 'Loan Officer',  last: '12 minutes ago', color: 'from-emerald-400 to-emerald-600' },
                  { name: 'Mark Otieno',   email: 'mark.o@umojasacco.co.ke',     role: 'Accountant',    last: '2 hours ago',    color: 'from-amber-400 to-amber-600' },
                  { name: 'Joyce Akinyi',  email: 'joyce.a@umojasacco.co.ke',    role: 'Cashier',       last: 'Yesterday',      color: 'from-rose-400 to-rose-600' },
                ].map((u) => (
                  <div key={u.email} className="py-3 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${u.color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                      {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">{u.role}</span>
                    <span className="text-xs text-slate-400 hidden sm:block">{u.last}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 'security' && (
            <div className="space-y-4">
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Security</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Two-factor authentication', desc: 'Add an extra layer of security with 2FA', on: true },
                    { label: 'Session timeout',           desc: 'Auto sign out after 30 minutes inactivity', on: true },
                    { label: 'Strong password policy',    desc: 'Require 12+ chars with mixed case and symbols', on: true },
                    { label: 'IP whitelisting',           desc: 'Only allow logins from approved IPs', on: false },
                  ].map((opt) => (
                    <label key={opt.label} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
                          <Shield size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                          <p className="text-xs text-slate-500">{opt.desc}</p>
                        </div>
                      </div>
                      <div className={`relative w-10 h-6 rounded-full transition-colors ${opt.on ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${opt.on ? 'left-4' : 'left-0.5'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === 'integrations' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'M-Pesa Daraja',   desc: 'Mobile money collections', connected: true,  color: 'bg-emerald-100 text-emerald-700', icon: '🟢' },
                { name: 'KCB Bank',        desc: 'Bank account sync',        connected: true,  color: 'bg-emerald-100 text-emerald-700', icon: '🟢' },
                { name: 'AfricasTalking',  desc: 'SMS gateway',              connected: true,  color: 'bg-emerald-100 text-emerald-700', icon: '🟢' },
                { name: 'SendGrid',        desc: 'Email delivery',           connected: false, color: 'bg-slate-100 text-slate-600',    icon: '⚪' },
                { name: 'QuickBooks',      desc: 'Accounting sync',          connected: false, color: 'bg-slate-100 text-slate-600',    icon: '⚪' },
                { name: 'Equity Bank',     desc: 'Bank account sync',        connected: false, color: 'bg-slate-100 text-slate-600',    icon: '⚪' },
              ].map((i) => (
                <div key={i.name} className="card p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center text-2xl">
                      {i.icon}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${i.color}`}>
                      {i.connected ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-900 mb-1">{i.name}</p>
                  <p className="text-sm text-slate-500 mb-4">{i.desc}</p>
                  <button className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    i.connected
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}>
                    {i.connected ? 'Configure' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Save button */}
          <div className="card p-4 flex items-center justify-end gap-2 sticky bottom-4 shadow-lg">
            <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 shadow-md flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
