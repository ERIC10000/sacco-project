import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, CreditCard, PiggyBank,
  BarChart3, TrendingUp, LogOut, Settings,
  MessageSquare, ScrollText, HelpCircle, Sparkles,
} from 'lucide-react'

interface NavItem {
  icon: any
  label: string
  path: string
  badge?: string | null
  badgeType?: 'count' | 'new'
}

const mainNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/dashboard',     badge: null },
  { icon: Users,           label: 'Members',       path: '/members',       badge: '1,248', badgeType: 'count' },
  { icon: CreditCard,      label: 'Loans',         path: '/loans',         badge: '342',   badgeType: 'count' },
  { icon: PiggyBank,       label: 'Contributions', path: '/contributions', badge: null },
  { icon: BarChart3,       label: 'Reports',       path: '/reports',       badge: null },
]

const managementNav: NavItem[] = [
  { icon: MessageSquare,   label: 'Communications', path: '/communications', badge: 'New', badgeType: 'new' },
  { icon: ScrollText,      label: 'Audit Logs',     path: '/audit-logs',     badge: null },
]

const systemNav: NavItem[] = [
  { icon: Settings,        label: 'Settings',       path: '/settings',       badge: null },
  { icon: HelpCircle,      label: 'Help & Support', path: '/help',           badge: null },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/dashboard' && location.pathname.startsWith(path))

  const renderItem = (item: NavItem) => {
    const Icon  = item.icon
    const active = isActive(item.path)
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${
          active
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        }`}
      >
        {/* Active indicator strip */}
        {active && (
          <span className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-400" />
        )}

        <Icon
          size={19}
          className={`flex-shrink-0 transition-transform duration-200 ${
            active ? '' : 'group-hover:scale-110'
          }`}
          strokeWidth={active ? 2.2 : 1.8}
        />

        <span className="flex-1 tracking-tight">{item.label}</span>

        {item.badge && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
            active
              ? 'bg-white/20 text-white'
              : item.badgeType === 'new'
              ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
              : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'
          }`}>
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside className="w-72 flex-shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0 border-r border-slate-800/60">

      {/* ─── Brand ─── */}
      <div className="px-5 py-6 border-b border-slate-800/60">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-900/40 group-hover:shadow-indigo-600/40 transition-all">
            <TrendingUp size={20} className="text-white" strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <p className="text-white font-extrabold text-lg leading-none tracking-tight">SaccoFlow</p>
            <p className="text-slate-500 text-xs mt-1 leading-none">Management System</p>
          </div>
        </Link>
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 px-4 py-5 overflow-y-auto">

        {/* Main */}
        <div className="mb-6">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.12em] px-3.5 mb-3">
            Main Menu
          </p>
          <div className="space-y-1">
            {mainNav.map(renderItem)}
          </div>
        </div>

        {/* Management */}
        <div className="mb-6">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.12em] px-3.5 mb-3">
            Management
          </p>
          <div className="space-y-1">
            {managementNav.map(renderItem)}
          </div>
        </div>

        {/* System */}
        <div className="mb-6">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.12em] px-3.5 mb-3">
            System
          </p>
          <div className="space-y-1">
            {systemNav.map(renderItem)}
          </div>
        </div>

        {/* ─── Compact promo card ─── */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-indigo-600/25 via-indigo-700/15 to-violet-700/25 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-md">
                <Sparkles size={14} className="text-white" />
              </div>
              <p className="text-white font-bold text-sm leading-none">Upgrade to Pro</p>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Unlimited members and advanced analytics.
            </p>
            <button className="w-full text-xs font-bold bg-white text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm">
              Upgrade now
            </button>
          </div>
        </div>
      </nav>

      {/* ─── User mini-profile + Logout ─── */}
      <div className="px-4 py-4 border-t border-slate-800/60 space-y-3">

        {/* User pill */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-slate-800">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-none truncate">Admin</p>
            <p className="text-slate-500 text-xs mt-1 leading-none">Administrator</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" title="Online" />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="group flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={17} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          <span className="tracking-tight">Sign out</span>
        </button>
      </div>
    </aside>
  )
}
