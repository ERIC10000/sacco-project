import { useState } from 'react'
import {
  MessageSquare, Send, Mail, Smartphone, Bell, Users,
  CheckCircle, Clock, AlertCircle, FileText, Sparkles,
  Filter, Search, Plus, Eye, Copy, X,
} from 'lucide-react'
import { demoMembers } from '@/data/demoData'

const messageTemplates = [
  { id: 't1', name: 'Contribution Reminder', icon: '💰', desc: 'Reminder for monthly contributions',         channel: 'SMS',   uses: 124 },
  { id: 't2', name: 'Loan Approval',         icon: '✅', desc: 'Notify member of loan approval',             channel: 'SMS',   uses: 56  },
  { id: 't3', name: 'Repayment Due',         icon: '📅', desc: 'Alert member that loan repayment is due',    channel: 'SMS',   uses: 89  },
  { id: 't4', name: 'AGM Invitation',        icon: '📢', desc: 'Annual general meeting invitation',          channel: 'Email', uses: 23  },
  { id: 't5', name: 'Welcome Message',       icon: '👋', desc: 'Welcome new SACCO members',                  channel: 'SMS',   uses: 41  },
  { id: 't6', name: 'Monthly Statement',     icon: '📊', desc: 'Send monthly account statement',             channel: 'Email', uses: 247 },
]

const sentMessages = [
  { id: 'MSG-2451', subject: 'Monthly contribution reminder', channel: 'SMS',   audience: 'All active members', recipients: 1184, sent: '2026-05-26 09:00', delivered: 1156, failed: 28, status: 'sent' },
  { id: 'MSG-2450', subject: 'AGM 2026 invitation',           channel: 'Email', audience: 'All members',         recipients: 1248, sent: '2026-05-24 14:30', delivered: 1201, failed: 47, status: 'sent' },
  { id: 'MSG-2449', subject: 'Repayment due alert',           channel: 'SMS',   audience: '38 active borrowers', recipients: 38,   sent: '2026-05-23 08:00', delivered: 38,   failed: 0,  status: 'sent' },
  { id: 'MSG-2448', subject: 'Welcome to SaccoFlow',          channel: 'SMS',   audience: '12 new members',      recipients: 12,   sent: '2026-05-22 16:45', delivered: 12,   failed: 0,  status: 'sent' },
  { id: 'MSG-2447', subject: 'Loan disbursement confirmation',channel: 'SMS',   audience: '8 approved loans',    recipients: 8,    sent: '2026-05-21 11:20', delivered: 8,    failed: 0,  status: 'sent' },
]

// ─────────────────── COMPOSE MODAL ───────────────────

function ComposeModal({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (msg: string) => void }) {
  const [channel, setChannel]   = useState<'SMS' | 'Email' | 'In-app'>('SMS')
  const [audience, setAudience] = useState('all-active')
  const [subject, setSubject]   = useState('')
  const [message, setMessage]   = useState('')
  const [sending, setSending]   = useState(false)

  if (!open) return null

  const send = async () => {
    setSending(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSending(false)
    onSend(`Message sent to ${audienceCount} recipients`)
    setSubject(''); setMessage(''); setAudience('all-active'); setChannel('SMS')
    onClose()
  }

  const audienceMap: Record<string, number> = {
    'all':           demoMembers.length,
    'all-active':    demoMembers.filter((m) => m.status === 'ACTIVE').length,
    'with-loans':    demoMembers.filter((m) => m.activeLoans > 0).length,
    'no-contrib':    3,
    'new-members':   5,
  }
  const audienceCount = audienceMap[audience]

  const charLimit = channel === 'SMS' ? 160 : 5000
  const remaining = charLimit - message.length

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center">
              <Send size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Compose message</h2>
              <p className="text-xs text-slate-500">Send to your SACCO members</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Channel */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Channel</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 'SMS' as const,    icon: Smartphone,   label: 'SMS',    desc: 'KES 1.50 / msg' },
                { v: 'Email' as const,  icon: Mail,         label: 'Email',  desc: 'Free' },
                { v: 'In-app' as const, icon: Bell,         label: 'In-app', desc: 'Free' },
              ].map(({ v, icon: Icon, label, desc }) => (
                <button
                  key={v}
                  onClick={() => setChannel(v)}
                  className={`flex flex-col items-start gap-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    channel === v
                      ? 'bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  <span className="text-xs font-normal text-slate-500">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Audience</label>
            <select className="input" value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value="all">All members ({audienceMap.all})</option>
              <option value="all-active">All active members ({audienceMap['all-active']})</option>
              <option value="with-loans">Members with active loans ({audienceMap['with-loans']})</option>
              <option value="no-contrib">No contribution this month ({audienceMap['no-contrib']})</option>
              <option value="new-members">New members this month ({audienceMap['new-members']})</option>
            </select>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Users size={12} className="text-slate-400" />
              <span className="text-slate-600">
                Will be sent to <span className="font-bold text-slate-900">{audienceCount}</span> recipient{audienceCount !== 1 ? 's' : ''}
              </span>
              {channel === 'SMS' && (
                <span className="ml-auto text-slate-500">
                  Estimated cost: <span className="font-bold text-slate-900">KES {(audienceCount * 1.5).toFixed(2)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Subject (Email only) */}
          {channel === 'Email' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
              <input className="input" placeholder="Important: Monthly statement" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
          )}

          {/* Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Message</label>
              <span className={`text-xs ${remaining < 0 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {remaining} characters remaining
              </span>
            </div>
            <textarea
              rows={5}
              className="input resize-none"
              placeholder={channel === 'SMS' ? 'Dear {name}, ...' : 'Write your message here...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Use <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-700">{'{name}'}</code> to personalize with member's name
            </p>
          </div>

          <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 flex items-start gap-2">
            <Sparkles size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-800">
              <strong>Pro tip:</strong> Schedule this message to send at the optimal time for your members. Most engagement happens 9-11 AM.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2">
            <Clock size={15} />
            Schedule
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Cancel
            </button>
            <button
              onClick={send}
              disabled={!message || sending}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md flex items-center gap-2"
            >
              {sending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={15} />
                  Send now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────── COMMUNICATIONS PAGE ───────────────────

export default function Communications() {
  const [composeOpen, setComposeOpen] = useState(false)
  const [tab, setTab] = useState<'history' | 'templates'>('history')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg); setTimeout(() => setToast(null), 2500)
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
          <h1 className="text-2xl font-extrabold text-slate-900">Communications</h1>
          <p className="text-slate-500 text-sm mt-0.5">Send SMS, email, and in-app messages to your members.</p>
        </div>
        <button
          onClick={() => setComposeOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-600/30"
        >
          <Send size={14} />
          Compose Message
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Messages Sent',    value: '2,451', sub: 'This month',    icon: Send,        color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Delivery Rate',    value: '98.2%', sub: 'Above average', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'SMS Credits',      value: '4,820', sub: 'Available',     icon: Smartphone,  color: 'bg-amber-50 text-amber-600' },
          { label: 'Active Templates', value: 12,      sub: '6 in use',      icon: FileText,    color: 'bg-violet-50 text-violet-600' },
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
      <div className="card p-1.5 flex items-center gap-1">
        {([
          { v: 'history' as const,   label: 'Message History', count: sentMessages.length },
          { v: 'templates' as const, label: 'Templates',       count: messageTemplates.length },
        ]).map(({ v, label, count }) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === v
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
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
      {tab === 'history' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Recent messages</p>
            <div className="flex items-center gap-2">
              <button className="text-xs text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1">
                <Filter size={12} /> Filter
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {sentMessages.map((m) => {
              const ChannelIcon = m.channel === 'SMS' ? Smartphone : m.channel === 'Email' ? Mail : Bell
              return (
                <div key={m.id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    m.channel === 'SMS'   ? 'bg-emerald-50 text-emerald-600' :
                    m.channel === 'Email' ? 'bg-indigo-50 text-indigo-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    <ChannelIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900 truncate">{m.subject}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">{m.channel}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {m.audience} · {m.sent}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900">{m.recipients}</p>
                    <p className="text-xs text-slate-400">recipients</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600">{Math.round((m.delivered / m.recipients) * 100)}%</p>
                    <p className="text-xs text-slate-400">delivered</p>
                  </div>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                    <Eye size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'templates' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-700">Pre-built templates</p>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <Plus size={13} /> New template
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messageTemplates.map((t) => (
              <div key={t.id} className="card p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{t.icon}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {t.channel}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">{t.name}</p>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Used {t.uses} times</span>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    Use template <Copy size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} onSend={showToast} />
    </div>
  )
}
