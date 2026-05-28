import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { ScrollText, Search, Download, Calendar, User, CheckCircle, X, Edit, Trash2, LogIn, DollarSign, AlertCircle, Activity, Clock, } from 'lucide-react';
import { demoAuditLogs } from '@/data/demoData';
const actionConfig = {
    LOGIN: { icon: LogIn, color: 'bg-slate-100 text-slate-700', label: 'Login' },
    CREATE: { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', label: 'Create' },
    UPDATE: { icon: Edit, color: 'bg-blue-50 text-blue-700', label: 'Update' },
    DELETE: { icon: Trash2, color: 'bg-red-50 text-red-700', label: 'Delete' },
    APPROVE: { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', label: 'Approve' },
    REJECT: { icon: X, color: 'bg-red-50 text-red-700', label: 'Reject' },
    DISBURSE: { icon: DollarSign, color: 'bg-violet-50 text-violet-700', label: 'Disburse' },
    EXPORT: { icon: Download, color: 'bg-amber-50 text-amber-700', label: 'Export' },
};
export default function AuditLogs() {
    const [query, setQuery] = useState('');
    const [actionFilter, setAction] = useState('ALL');
    const [userFilter, setUserFilter] = useState('ALL');
    const stats = useMemo(() => ({
        total: demoAuditLogs.length,
        today: demoAuditLogs.length, // all are today in demo
        users: [...new Set(demoAuditLogs.map((l) => l.user))].length,
        flagged: 0,
    }), []);
    const users = [...new Set(demoAuditLogs.map((l) => l.user))];
    const filtered = demoAuditLogs.filter((l) => {
        if (actionFilter !== 'ALL' && l.action !== actionFilter)
            return false;
        if (userFilter !== 'ALL' && l.user !== userFilter)
            return false;
        if (query) {
            const q = query.toLowerCase();
            return l.user.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.resource.toLowerCase().includes(q);
        }
        return true;
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-extrabold text-slate-900", children: "Audit Logs" }), _jsx("p", { className: "text-slate-500 text-sm mt-0.5", children: "Track every action performed in your SACCO system." })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("button", { className: "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm", children: [_jsx(Download, { size: 14 }), "Export logs"] }) })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Total Events', value: stats.total, sub: 'All time', icon: Activity, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'Today', value: stats.today, sub: 'Last 24h', icon: Clock, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Active Users', value: stats.users, sub: 'In logs', icon: User, color: 'bg-violet-50 text-violet-600' },
                    { label: 'Flagged Events', value: stats.flagged, sub: 'For review', icon: AlertCircle, color: 'bg-amber-50 text-amber-600' },
                ].map(({ label, value, sub, icon: Icon, color }) => (_jsxs("div", { className: "card p-5", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsx("div", { className: `w-10 h-10 rounded-xl ${color} flex items-center justify-center`, children: _jsx(Icon, { size: 19 }) }) }), _jsx("p", { className: "text-2xl font-extrabold text-slate-900 mb-0.5", children: value }), _jsx("p", { className: "text-xs text-slate-500 font-medium", children: label }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: sub })] }, label))) }), _jsxs("div", { className: "card p-4 flex items-center gap-3 flex-wrap", children: [_jsxs("div", { className: "relative flex-1 min-w-[240px]", children: [_jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }), _jsx("input", { className: "w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all", placeholder: "Search logs by user, action or detail\u2026", value: query, onChange: (e) => setQuery(e.target.value) })] }), _jsxs("select", { className: "px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500", value: actionFilter, onChange: (e) => setAction(e.target.value), children: [_jsx("option", { value: "ALL", children: "All actions" }), Object.keys(actionConfig).map((a) => (_jsx("option", { value: a, children: actionConfig[a].label }, a)))] }), _jsxs("select", { className: "px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500", value: userFilter, onChange: (e) => setUserFilter(e.target.value), children: [_jsx("option", { value: "ALL", children: "All users" }), users.map((u) => _jsx("option", { value: u, children: u }, u))] }), _jsxs("button", { className: "inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors", children: [_jsx(Calendar, { size: 14 }), "Date range"] })] }), _jsxs("div", { className: "card overflow-hidden", children: [filtered.length === 0 ? (_jsxs("div", { className: "px-5 py-16 text-center", children: [_jsx(ScrollText, { size: 40, className: "text-slate-300 mx-auto mb-3" }), _jsx("p", { className: "text-sm font-semibold text-slate-600", children: "No logs match your filters" })] })) : (_jsx("div", { className: "divide-y divide-slate-50", children: filtered.map((log) => {
                            const cfg = actionConfig[log.action];
                            const Icon = cfg.icon;
                            return (_jsxs("div", { className: "px-5 py-3.5 hover:bg-slate-50/60 transition-colors flex items-start gap-4", children: [_jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`, children: _jsx(Icon, { size: 16 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [_jsx("span", { className: "text-sm font-bold text-slate-900", children: log.user }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.color}`, children: cfg.label }), _jsx("span", { className: "text-xs font-mono text-slate-500", children: log.resource })] }), _jsx("p", { className: "text-sm text-slate-700", children: log.details }), _jsxs("div", { className: "flex items-center gap-4 mt-1.5 text-xs text-slate-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 11 }), " ", log.timestamp] }), _jsx("span", { className: "flex items-center gap-1", children: _jsx("span", { className: "font-mono", children: log.ip }) })] })] }), _jsx("div", { className: "w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0", children: log.userInitials })] }, log.id));
                        }) })), _jsxs("div", { className: "px-5 py-3 border-t border-slate-100 flex items-center justify-between", children: [_jsxs("p", { className: "text-xs text-slate-500", children: ["Showing ", _jsx("span", { className: "font-bold text-slate-700", children: filtered.length }), " of ", _jsx("span", { className: "font-bold text-slate-700", children: demoAuditLogs.length }), " events"] }), _jsx("button", { className: "text-xs font-semibold text-indigo-600 hover:text-indigo-700", children: "Load more" })] })] })] }));
}
