import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, PiggyBank, BarChart3, TrendingUp, LogOut, Settings, MessageSquare, ScrollText, HelpCircle, Sparkles, } from 'lucide-react';
const mainNav = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', badge: null },
    { icon: Users, label: 'Members', path: '/members', badge: '1,248', badgeType: 'count' },
    { icon: CreditCard, label: 'Loans', path: '/loans', badge: '342', badgeType: 'count' },
    { icon: PiggyBank, label: 'Contributions', path: '/contributions', badge: null },
    { icon: BarChart3, label: 'Reports', path: '/reports', badge: null },
];
const managementNav = [
    { icon: MessageSquare, label: 'Communications', path: '/communications', badge: 'New', badgeType: 'new' },
    { icon: ScrollText, label: 'Audit Logs', path: '/audit-logs', badge: null },
];
const systemNav = [
    { icon: Settings, label: 'Settings', path: '/settings', badge: null },
    { icon: HelpCircle, label: 'Help & Support', path: '/help', badge: null },
];
export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    const isActive = (path) => location.pathname === path ||
        (path !== '/dashboard' && location.pathname.startsWith(path));
    const renderItem = (item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (_jsxs(Link, { to: item.path, className: `group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`, children: [active && (_jsx("span", { className: "absolute -left-3.5 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-400" })), _jsx(Icon, { size: 19, className: `flex-shrink-0 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`, strokeWidth: active ? 2.2 : 1.8 }), _jsx("span", { className: "flex-1 tracking-tight", children: item.label }), item.badge && (_jsx("span", { className: `text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${active
                        ? 'bg-white/20 text-white'
                        : item.badgeType === 'new'
                            ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'}`, children: item.badge }))] }, item.path));
    };
    return (_jsxs("aside", { className: "w-72 flex-shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0 border-r border-slate-800/60", children: [_jsx("div", { className: "px-5 py-6 border-b border-slate-800/60", children: _jsxs(Link, { to: "/dashboard", className: "flex items-center gap-3 group", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-900/40 group-hover:shadow-indigo-600/40 transition-all", children: _jsx(TrendingUp, { size: 20, className: "text-white", strokeWidth: 2.4 }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-white font-extrabold text-lg leading-none tracking-tight", children: "SaccoFlow" }), _jsx("p", { className: "text-slate-500 text-xs mt-1 leading-none", children: "Management System" })] })] }) }), _jsxs("nav", { className: "flex-1 px-4 py-5 overflow-y-auto", children: [_jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-slate-500 text-[11px] font-bold uppercase tracking-[0.12em] px-3.5 mb-3", children: "Main Menu" }), _jsx("div", { className: "space-y-1", children: mainNav.map(renderItem) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-slate-500 text-[11px] font-bold uppercase tracking-[0.12em] px-3.5 mb-3", children: "Management" }), _jsx("div", { className: "space-y-1", children: managementNav.map(renderItem) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-slate-500 text-[11px] font-bold uppercase tracking-[0.12em] px-3.5 mb-3", children: "System" }), _jsx("div", { className: "space-y-1", children: systemNav.map(renderItem) })] }), _jsxs("div", { className: "mt-8 p-4 rounded-xl bg-gradient-to-br from-indigo-600/25 via-indigo-700/15 to-violet-700/25 border border-indigo-500/20 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("div", { className: "w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-md", children: _jsx(Sparkles, { size: 14, className: "text-white" }) }), _jsx("p", { className: "text-white font-bold text-sm leading-none", children: "Upgrade to Pro" })] }), _jsx("p", { className: "text-slate-400 text-xs leading-relaxed mb-3", children: "Unlimited members and advanced analytics." }), _jsx("button", { className: "w-full text-xs font-bold bg-white text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm", children: "Upgrade now" })] })] })] }), _jsxs("div", { className: "px-4 py-4 border-t border-slate-800/60 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3 px-2 py-1", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-slate-800", children: "AD" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-white text-sm font-semibold leading-none truncate", children: "Admin" }), _jsx("p", { className: "text-slate-500 text-xs mt-1 leading-none", children: "Administrator" })] }), _jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900", title: "Online" })] }), _jsxs("button", { onClick: logout, className: "group flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200", children: [_jsx(LogOut, { size: 17, className: "flex-shrink-0 group-hover:translate-x-0.5 transition-transform" }), _jsx("span", { className: "tracking-tight", children: "Sign out" })] })] })] }));
}
