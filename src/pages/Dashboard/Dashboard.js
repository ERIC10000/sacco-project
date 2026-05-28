import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, registrationsApi } from '@/services/supabaseApi';
import { Users, CreditCard, PiggyBank, AlertCircle, FileText, TrendingUp, TrendingDown, ArrowRight, ArrowUpRight, Clock, UserPlus, Download, Calendar, MoreVertical, CheckCircle, X, Filter, RefreshCw, ChevronRight, Sparkles, Eye, Award, Activity, } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
// ─────────────────────────── DATA ───────────────────────────
const monthlyData = [
    { month: 'Jan', contributions: 380000, repayments: 210000 },
    { month: 'Feb', contributions: 425000, repayments: 245000 },
    { month: 'Mar', contributions: 398000, repayments: 230000 },
    { month: 'Apr', contributions: 470000, repayments: 280000 },
    { month: 'May', contributions: 512000, repayments: 310000 },
    { month: 'Jun', contributions: 498000, repayments: 295000 },
    { month: 'Jul', contributions: 561000, repayments: 340000 },
];
const loanData = [
    { name: 'Approved', value: 145, fill: '#4f46e5' },
    { name: 'Pending', value: 38, fill: '#f59e0b' },
    { name: 'Rejected', value: 24, fill: '#ef4444' },
    { name: 'Disbursed', value: 135, fill: '#10b981' },
];
const memberGrowthData = [
    { month: 'Jan', value: 980 },
    { month: 'Feb', value: 1012 },
    { month: 'Mar', value: 1058 },
    { month: 'Apr', value: 1115 },
    { month: 'May', value: 1180 },
    { month: 'Jun', value: 1220 },
    { month: 'Jul', value: 1248 },
];
const sparkline = [4, 6, 5, 8, 7, 9, 12, 11, 14, 13, 16, 18];
const recentActivity = [
    { id: 1, member: 'John Kamau', type: 'Contribution', category: 'contribution', amount: '+KES 5,000', time: '2 min ago', status: 'completed', color: 'bg-indigo-500' },
    { id: 2, member: 'Wanjiru Muthoni', type: 'Loan Repayment', category: 'loan', amount: '+KES 12,500', time: '18 min ago', status: 'completed', color: 'bg-violet-500' },
    { id: 3, member: 'Peter Otieno', type: 'Loan Application', category: 'loan', amount: 'KES 80,000', time: '1 hr ago', status: 'pending', color: 'bg-amber-500' },
    { id: 4, member: 'Grace Achieng', type: 'Contribution', category: 'contribution', amount: '+KES 3,000', time: '2 hrs ago', status: 'completed', color: 'bg-indigo-500' },
    { id: 5, member: 'David Njoroge', type: 'Loan Repayment', category: 'loan', amount: '+KES 8,750', time: '3 hrs ago', status: 'completed', color: 'bg-violet-500' },
    { id: 6, member: 'Amina Hassan', type: 'New Member', category: 'member', amount: '—', time: 'Yesterday', status: 'new', color: 'bg-emerald-500' },
    { id: 7, member: 'Joseph Kiprono', type: 'Contribution', category: 'contribution', amount: '+KES 10,000', time: 'Yesterday', status: 'completed', color: 'bg-indigo-500' },
    { id: 8, member: 'Mary Wambui', type: 'Loan Application', category: 'loan', amount: 'KES 150,000', time: '2 days ago', status: 'approved', color: 'bg-emerald-500' },
];
const pendingApprovals = [
    { id: 'LN-3421', member: 'Peter Otieno', amount: 80000, term: '12 months', purpose: 'Business expansion', risk: 'low' },
    { id: 'LN-3422', member: 'Sarah Wanjiku', amount: 150000, term: '24 months', purpose: 'Home improvement', risk: 'medium' },
    { id: 'LN-3423', member: 'James Mwangi', amount: 45000, term: '6 months', purpose: 'Education', risk: 'low' },
    { id: 'LN-3424', member: 'Lucy Akinyi', amount: 200000, term: '36 months', purpose: 'Vehicle purchase', risk: 'high' },
];
const topContributors = [
    { rank: 1, name: 'Joseph Kiprono', amount: 285000, trend: 12, initials: 'JK' },
    { rank: 2, name: 'Mary Wambui', amount: 242000, trend: 8, initials: 'MW' },
    { rank: 3, name: 'David Njoroge', amount: 198000, trend: -3, initials: 'DN' },
    { rank: 4, name: 'Grace Achieng', amount: 175000, trend: 15, initials: 'GA' },
    { rank: 5, name: 'John Kamau', amount: 152000, trend: 5, initials: 'JK' },
];
const upcomingRepayments = [
    { id: 1, member: 'Wanjiru Muthoni', amount: 12500, dueDate: 'Today', overdue: false, daysUntil: 0 },
    { id: 2, member: 'Peter Otieno', amount: 8750, dueDate: 'Tomorrow', overdue: false, daysUntil: 1 },
    { id: 3, member: 'James Mwangi', amount: 5200, dueDate: 'May 28', overdue: false, daysUntil: 2 },
    { id: 4, member: 'Lucy Akinyi', amount: 18900, dueDate: 'May 30', overdue: false, daysUntil: 4 },
    { id: 5, member: 'Joseph Kiprono', amount: 22000, dueDate: 'Jun 02', overdue: false, daysUntil: 7 },
];
const kpis = [
    { label: 'Total Members', value: '1,248', change: '+12', changeLabel: 'this month', up: true, icon: Users, color: 'bg-indigo-50 text-indigo-600', sparkColor: '#4f46e5' },
    { label: 'Active Loans', value: '342', change: '+8', changeLabel: 'this month', up: true, icon: CreditCard, color: 'bg-violet-50 text-violet-600', sparkColor: '#7c3aed' },
    { label: 'Total Contributions', value: 'KES 4.28M', change: '+9.3%', changeLabel: 'vs last month', up: true, icon: PiggyBank, color: 'bg-emerald-50 text-emerald-600', sparkColor: '#10b981' },
    { label: 'Pending Approvals', value: '18', change: '-4', changeLabel: 'from yesterday', up: false, icon: AlertCircle, color: 'bg-amber-50 text-amber-600', sparkColor: '#f59e0b' },
];
const quickActions = [
    { label: 'Add Member', icon: UserPlus, color: 'from-indigo-500 to-indigo-600', path: '/members' },
    { label: 'Record Contribution', icon: PiggyBank, color: 'from-emerald-500 to-emerald-600', path: '/contributions' },
    { label: 'Process Loan', icon: CreditCard, color: 'from-violet-500 to-violet-600', path: '/loans' },
    { label: 'Generate Report', icon: FileText, color: 'from-amber-500 to-amber-600', path: '#' },
];
// ─────────────────────────── HELPERS ───────────────────────────
function fmt(n) {
    return n >= 1000000
        ? `${(n / 1000000).toFixed(1)}M`
        : n >= 1000
            ? `${(n / 1000).toFixed(0)}K`
            : String(n);
}
function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length)
        return null;
    return (_jsxs("div", { className: "bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-3 text-xs", children: [_jsx("p", { className: "font-bold text-slate-800 mb-2", children: label }), payload.map((p) => (_jsxs("p", { style: { color: p.color }, className: "font-semibold flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full", style: { background: p.color } }), p.name, ": KES ", p.value.toLocaleString()] }, p.name)))] }));
}
// Mini sparkline component
function Sparkline({ data, color }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data
        .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80 - 10}`)
        .join(' ');
    return (_jsx("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", className: "w-full h-10", children: _jsx("polyline", { points: points, fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
// ─────────────────────────── REPORT MODAL ───────────────────────────
function ReportModal({ open, onClose }) {
    const [reportType, setReportType] = useState('monthly');
    const [format, setFormat] = useState('pdf');
    const [generating, setGenerating] = useState(false);
    const [done, setDone] = useState(false);
    if (!open)
        return null;
    const generate = async () => {
        setGenerating(true);
        await new Promise((r) => setTimeout(r, 1800));
        setGenerating(false);
        setDone(true);
        setTimeout(() => { setDone(false); onClose(); }, 1500);
    };
    return (_jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200", children: [_jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden", children: [_jsxs("div", { className: "px-6 py-5 border-b border-slate-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center", children: _jsx(FileText, { size: 20 }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Generate Report" }), _jsx("p", { className: "text-xs text-slate-500", children: "Choose your report options" })] })] }), _jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg hover:bg-slate-100 text-slate-400", children: _jsx(X, { size: 18 }) })] }), done ? (_jsxs("div", { className: "px-6 py-12 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4", children: _jsx(CheckCircle, { size: 32 }) }), _jsx("p", { className: "text-lg font-bold text-slate-900 mb-1", children: "Report ready!" }), _jsx("p", { className: "text-sm text-slate-500", children: "Your download has started." })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "px-6 py-5 space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2", children: "Report Type" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: ['monthly', 'quarterly', 'annual', 'custom'].map((t) => (_jsx("button", { onClick: () => setReportType(t), className: `px-4 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${reportType === t
                                                        ? 'bg-indigo-600 text-white shadow-md'
                                                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`, children: t }, t))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2", children: "Export Format" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: [
                                                    { v: 'pdf', label: 'PDF', icon: '📄' },
                                                    { v: 'xlsx', label: 'Excel', icon: '📊' },
                                                    { v: 'csv', label: 'CSV', icon: '📋' },
                                                ].map((f) => (_jsxs("button", { onClick: () => setFormat(f.v), className: `px-3 py-3 rounded-lg text-sm font-semibold transition-all flex flex-col items-center gap-1 ${format === f.v
                                                        ? 'bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500'
                                                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`, children: [_jsx("span", { className: "text-xl", children: f.icon }), f.label] }, f.v))) })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg px-4 py-3", children: [_jsx("p", { className: "text-xs font-semibold text-slate-500 mb-1", children: "Included data" }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: ['Members', 'Contributions', 'Loans', 'Repayments', 'Audit logs'].map((t) => (_jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600", children: t }, t))) })] })] }), _jsxs("div", { className: "px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors", children: "Cancel" }), _jsx("button", { onClick: generate, disabled: generating, className: "px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-60", children: generating ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Generating\u2026"] })) : (_jsxs(_Fragment, { children: [_jsx(Download, { size: 15 }), "Generate ", format.toUpperCase()] })) })] })] }))] })] }));
}
// ─────────────────────────── DASHBOARD ───────────────────────────
const UMOJA_SACCO_ID = '00000000-0000-0000-0000-000000000001';
export default function Dashboard() {
    const [reportOpen, setReportOpen] = useState(false);
    const [activityFilter, setActivityFilter] = useState('all');
    const [pending, setPending] = useState(pendingApprovals);
    const [actionToast, setActionToast] = useState(null);
    // ─── Live KPIs from Supabase ───────────────────────────────────
    const [liveStats, setLiveStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);
    useEffect(() => {
        let cancelled = false;
        setStatsLoading(true);
        dashboardApi.stats(UMOJA_SACCO_ID)
            .then((s) => { if (!cancelled) {
            setLiveStats(s);
            setStatsError(null);
        } })
            .catch((e) => { if (!cancelled)
            setStatsError(e.message ?? 'Could not load stats'); })
            .finally(() => { if (!cancelled)
            setStatsLoading(false); });
        return () => { cancelled = true; };
    }, []);
    const [pendingMembers, setPendingMembers] = useState([]);
    const loadPendingMembers = async () => {
        const { data } = await registrationsApi.pending(UMOJA_SACCO_ID);
        setPendingMembers((data ?? []));
    };
    useEffect(() => {
        loadPendingMembers();
        // Subscribe so new sign-ups appear instantly
        const unsub = registrationsApi.subscribePending(UMOJA_SACCO_ID, () => loadPendingMembers());
        return () => { unsub?.(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const approveMember = async (m) => {
        const { error } = await registrationsApi.approve(m.id);
        if (error) {
            showToast(`Approval failed: ${error.message}`, 'info');
            return;
        }
        showToast(`${m.first_name} ${m.last_name} approved`, 'success');
        loadPendingMembers();
    };
    const rejectMember = async (m) => {
        const reason = window.prompt(`Reject ${m.first_name}'s registration. Reason?`, 'Failed KYC');
        if (!reason)
            return;
        const { error } = await registrationsApi.reject(m.id, reason);
        if (error) {
            showToast(`Reject failed: ${error.message}`, 'info');
            return;
        }
        showToast(`${m.first_name} ${m.last_name} rejected`, 'info');
        loadPendingMembers();
    };
    const relativeTime = (iso) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1)
            return 'just now';
        if (mins < 60)
            return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24)
            return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };
    /** Merge live data into the existing KPI definitions so the cards stay styled. */
    const liveKpis = useMemo(() => {
        if (!liveStats)
            return kpis;
        const formatKES = (n) => n >= 1000000 ? `KES ${(n / 1000000).toFixed(2)}M`
            : n >= 1000 ? `KES ${(n / 1000).toFixed(0)}K`
                : `KES ${n}`;
        return [
            { ...kpis[0], value: liveStats.totalMembers.toLocaleString() },
            { ...kpis[1], value: liveStats.activeLoans.toLocaleString() },
            { ...kpis[2], value: formatKES(liveStats.totalContributions) },
            { ...kpis[3], value: liveStats.pendingApprovals.toString() },
        ];
    }, [liveStats]);
    const showToast = (message, type = 'success') => {
        setActionToast({ message, type });
        setTimeout(() => setActionToast(null), 2500);
    };
    const handleApprove = (id) => {
        setPending((p) => p.filter((x) => x.id !== id));
        showToast(`Loan ${id} approved successfully`, 'success');
    };
    const handleReject = (id) => {
        setPending((p) => p.filter((x) => x.id !== id));
        showToast(`Loan ${id} rejected`, 'info');
    };
    const filteredActivity = activityFilter === 'all'
        ? recentActivity
        : recentActivity.filter((a) => a.category === activityFilter);
    const activityCounts = {
        all: recentActivity.length,
        contribution: recentActivity.filter((a) => a.category === 'contribution').length,
        loan: recentActivity.filter((a) => a.category === 'loan').length,
        member: recentActivity.filter((a) => a.category === 'member').length,
    };
    return (_jsxs("div", { className: "space-y-6", children: [actionToast && (_jsxs("div", { className: "fixed top-20 right-6 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-200", children: [_jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center ${actionToast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`, children: _jsx(CheckCircle, { size: 16 }) }), _jsx("p", { className: "text-sm font-semibold text-slate-800", children: actionToast.message })] })), _jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-extrabold text-slate-900", children: "Dashboard" }), _jsx("p", { className: "text-slate-500 text-sm mt-0.5", children: "Here's what's happening with your SACCO today." })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { className: "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm", children: [_jsx(RefreshCw, { size: 14 }), "Refresh"] }), _jsxs("button", { onClick: () => setReportOpen(true), className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/30", children: [_jsx(Download, { size: 14 }), "Generate Report"] })] })] }), _jsxs("div", { className: "rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-5 py-4 flex items-center gap-4", children: [_jsx("div", { className: "w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0", children: _jsx(AlertCircle, { size: 20 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "text-sm font-bold text-slate-900", children: [pending.length, " loan", pending.length !== 1 ? 's' : '', " need your approval"] }), _jsxs("p", { className: "text-xs text-slate-600 mt-0.5", children: ["Total requested: KES ", pending.reduce((s, p) => s + p.amount, 0).toLocaleString(), ". Review and process them below."] })] }), _jsxs("a", { href: "#pending-approvals", className: "hidden sm:flex text-sm font-semibold text-amber-700 hover:text-amber-800 items-center gap-1", children: ["Review now ", _jsx(ArrowRight, { size: 14 })] })] }), pendingMembers.length > 0 && (_jsxs("div", { className: "card overflow-hidden border-indigo-200", children: [_jsxs("div", { className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center", children: _jsx(UserPlus, { size: 18 }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-slate-900", children: "New member registrations" }), _jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [pendingMembers.length, " pending admin approval \u00B7 live from mobile sign-ups"] })] })] }), _jsxs("span", { className: "text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center gap-1", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" }), "LIVE"] })] }), _jsx("div", { className: "divide-y divide-slate-50", children: pendingMembers.map((m) => (_jsxs("div", { className: "px-5 py-3.5 hover:bg-slate-50/60 transition-colors flex items-center gap-4", children: [_jsxs("div", { className: `w-10 h-10 rounded-full ${m.avatar_color ?? 'bg-indigo-500'} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`, children: [m.first_name[0], m.last_name[0]] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "text-sm font-semibold text-slate-900", children: [m.first_name, " ", m.last_name] }), _jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [_jsx("span", { className: "font-mono", children: m.membership_no }), " \u00B7 ", m.phone, m.national_id && ` · ID ${m.national_id}`] })] }), _jsx("p", { className: "text-xs text-slate-400 hidden sm:block", children: relativeTime(m.created_at) }), _jsx("button", { onClick: () => rejectMember(m), className: "px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors", children: "Reject" }), _jsxs("button", { onClick: () => approveMember(m), className: "px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors shadow-sm flex items-center gap-1", children: [_jsx(CheckCircle, { size: 13 }), " Approve"] })] }, m.id))) })] })), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: quickActions.map(({ label, icon: Icon, color, path }) => (_jsxs(Link, { to: path, onClick: (e) => { if (path === '#') {
                        e.preventDefault();
                        setReportOpen(true);
                    } }, className: `group bg-gradient-to-br ${color} text-white rounded-xl p-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx(Icon, { size: 22 }), _jsx(ArrowUpRight, { size: 16, className: "opacity-50 group-hover:opacity-100 transition-opacity" })] }), _jsx("p", { className: "text-sm font-bold", children: label }), _jsx("p", { className: "text-xs opacity-80 mt-0.5", children: "Quick action" })] }, label))) }), statsError && (_jsxs("div", { className: "rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700", children: ["\u26A0\uFE0F Live data error: ", statsError, ". Showing cached values."] })), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4", children: liveKpis.map(({ label, value, change, changeLabel, up, icon: Icon, color, sparkColor }) => (_jsxs("div", { className: "card p-5 hover:shadow-md transition-shadow group", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("div", { className: `w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`, children: _jsx(Icon, { size: 19 }) }), _jsxs("div", { className: `flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${up ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`, children: [up ? _jsx(TrendingUp, { size: 12 }) : _jsx(TrendingDown, { size: 12 }), change] })] }), _jsx("p", { className: `text-2xl font-extrabold text-slate-900 mb-0.5 ${statsLoading ? 'animate-pulse' : ''}`, children: value }), _jsx("p", { className: "text-xs text-slate-500 font-medium", children: label }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: statsLoading ? 'syncing live…' : changeLabel }), _jsx("div", { className: "mt-2 -mx-1 opacity-70 group-hover:opacity-100 transition-opacity", children: _jsx(Sparkline, { data: sparkline, color: sparkColor }) })] }, label))) }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "card p-5 lg:col-span-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-5 flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-bold text-slate-900", children: "Contributions vs Repayments" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Last 7 months" })] }), _jsx("div", { className: "flex items-center gap-1 bg-slate-100 rounded-lg p-0.5", children: ['7M', '1Y', 'All'].map((p, i) => (_jsx("button", { className: `px-3 py-1 rounded-md text-xs font-semibold transition-all ${i === 0 ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`, children: p }, p))) })] }), _jsx(ResponsiveContainer, { width: "100%", height: 240, children: _jsxs(AreaChart, { data: monthlyData, margin: { top: 0, right: 0, left: -20, bottom: 0 }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "contrib", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#4f46e5", stopOpacity: 0.2 }), _jsx("stop", { offset: "95%", stopColor: "#4f46e5", stopOpacity: 0 })] }), _jsxs("linearGradient", { id: "repay", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.2 }), _jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9", vertical: false }), _jsx(XAxis, { dataKey: "month", tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false, tickFormatter: fmt }), _jsx(Tooltip, { content: _jsx(ChartTooltip, {}) }), _jsx(Area, { type: "monotone", dataKey: "contributions", name: "Contributions", stroke: "#4f46e5", strokeWidth: 2.5, fill: "url(#contrib)", dot: false, activeDot: { r: 5, strokeWidth: 2, stroke: '#fff' } }), _jsx(Area, { type: "monotone", dataKey: "repayments", name: "Repayments", stroke: "#10b981", strokeWidth: 2.5, fill: "url(#repay)", dot: false, activeDot: { r: 5, strokeWidth: 2, stroke: '#fff' } })] }) }), _jsx("div", { className: "flex gap-5 mt-3", children: [
                                    { color: 'bg-indigo-600', label: 'Contributions', value: 'KES 3.24M' },
                                    { color: 'bg-emerald-500', label: 'Repayments', value: 'KES 1.91M' },
                                ].map((l) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `w-2.5 h-2.5 rounded-full ${l.color}` }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500 leading-tight", children: l.label }), _jsx("p", { className: "text-xs font-bold text-slate-700 leading-tight", children: l.value })] })] }, l.label))) })] }), _jsxs("div", { className: "card p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-bold text-slate-900", children: "Loan Status" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Current distribution" })] }), _jsx("button", { className: "p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50", children: _jsx(MoreVertical, { size: 14 }) })] }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(BarChart, { data: loanData, layout: "vertical", margin: { top: 0, right: 0, left: 10, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9", horizontal: false }), _jsx(XAxis, { type: "number", tick: { fontSize: 11, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(YAxis, { type: "category", dataKey: "name", tick: { fontSize: 12, fill: '#64748b' }, axisLine: false, tickLine: false, width: 60 }), _jsx(Tooltip, { cursor: { fill: '#f8fafc' }, formatter: (v) => [`${v} loans`, ''] }), _jsx(Bar, { dataKey: "value", radius: [0, 6, 6, 0], children: loanData.map((entry, i) => (_jsx(Cell, { fill: entry.fill }, i))) })] }) }), _jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400", children: "Total disbursed" }), _jsx("p", { className: "text-sm font-bold text-slate-800", children: "KES 12.8M" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400", children: "Default rate" }), _jsx("p", { className: "text-sm font-bold text-emerald-600", children: "2.1%" })] })] })] })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-4", id: "pending-approvals", children: [_jsxs("div", { className: "card overflow-hidden lg:col-span-2", children: [_jsxs("div", { className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center", children: _jsx(AlertCircle, { size: 18 }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-slate-900", children: "Pending Loan Approvals" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Action required" })] })] }), _jsxs(Link, { to: "/loans", className: "text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1", children: ["View all ", _jsx(ArrowRight, { size: 12 })] })] }), pending.length === 0 ? (_jsxs("div", { className: "px-5 py-12 text-center", children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3", children: _jsx(CheckCircle, { size: 28 }) }), _jsx("p", { className: "text-sm font-bold text-slate-800", children: "All caught up!" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "No loans pending your approval." })] })) : (_jsx("div", { className: "divide-y divide-slate-50", children: pending.map((loan) => {
                                    const riskColor = loan.risk === 'low'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : loan.risk === 'medium'
                                            ? 'bg-amber-50 text-amber-700'
                                            : 'bg-red-50 text-red-700';
                                    return (_jsxs("div", { className: "px-5 py-3.5 hover:bg-slate-50/60 transition-colors flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0", children: loan.member.split(' ').map((n) => n[0]).join('').slice(0, 2) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900 truncate", children: loan.member }), _jsxs("span", { className: `text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${riskColor}`, children: [loan.risk, " risk"] })] }), _jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [_jsx("span", { className: "font-mono", children: loan.id }), " \u00B7 ", loan.purpose, " \u00B7 ", loan.term] })] }), _jsxs("div", { className: "text-right hidden sm:block", children: [_jsxs("p", { className: "text-sm font-bold text-slate-900", children: ["KES ", loan.amount.toLocaleString()] }), _jsx("p", { className: "text-xs text-slate-400", children: "requested" })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("button", { onClick: () => handleReject(loan.id), className: "p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors", title: "Reject", children: _jsx(X, { size: 14 }) }), _jsxs("button", { onClick: () => handleApprove(loan.id), className: "px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1", children: [_jsx(CheckCircle, { size: 13 }), "Approve"] })] })] }, loan.id));
                                }) }))] }), _jsxs("div", { className: "card overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center", children: _jsx(Award, { size: 18 }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-slate-900", children: "Top Contributors" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "This month" })] })] }) }), _jsx("div", { className: "divide-y divide-slate-50", children: topContributors.map((c) => (_jsxs("div", { className: "px-5 py-3 hover:bg-slate-50/60 transition-colors flex items-center gap-3", children: [_jsx("span", { className: `w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.rank === 1 ? 'bg-amber-100 text-amber-700' :
                                                c.rank === 2 ? 'bg-slate-200 text-slate-700' :
                                                    c.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-50 text-slate-500'}`, children: c.rank }), _jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0", children: c.initials }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900 truncate", children: c.name }), _jsxs("p", { className: "text-xs text-slate-500", children: ["KES ", c.amount.toLocaleString()] })] }), _jsxs("span", { className: `text-xs font-bold flex items-center gap-0.5 ${c.trend > 0 ? 'text-emerald-600' : 'text-red-500'}`, children: [c.trend > 0 ? _jsx(TrendingUp, { size: 11 }) : _jsx(TrendingDown, { size: 11 }), Math.abs(c.trend), "%"] })] }, c.rank))) })] })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "card overflow-hidden lg:col-span-2", children: [_jsxs("div", { className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center", children: _jsx(Calendar, { size: 18 }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-slate-900", children: "Upcoming Repayments" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Next 7 days" })] })] }), _jsxs(Link, { to: "/loans", className: "text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1", children: ["View all ", _jsx(ArrowRight, { size: 12 })] })] }), _jsx("div", { className: "divide-y divide-slate-50", children: upcomingRepayments.map((r) => (_jsxs("div", { className: "px-5 py-3 hover:bg-slate-50/60 transition-colors flex items-center gap-4", children: [_jsxs("div", { className: "w-12 text-center", children: [_jsx("p", { className: `text-xs font-bold ${r.daysUntil === 0 ? 'text-red-600' :
                                                        r.daysUntil === 1 ? 'text-amber-600' :
                                                            'text-slate-500'}`, children: r.dueDate }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: r.daysUntil === 0 ? 'Today' : `${r.daysUntil}d` })] }), _jsx("div", { className: "w-px h-8 bg-slate-100" }), _jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0", children: r.member.split(' ').map((n) => n[0]).join('').slice(0, 2) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900 truncate", children: r.member }), _jsx("p", { className: "text-xs text-slate-500", children: "Loan repayment" })] }), _jsxs("p", { className: "text-sm font-bold text-slate-900", children: ["KES ", r.amount.toLocaleString()] }), _jsx("button", { className: "p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors", children: _jsx(Eye, { size: 14 }) })] }, r.id))) }), _jsxs("div", { className: "px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between", children: [_jsx("p", { className: "text-xs text-slate-500", children: "Total expected" }), _jsxs("p", { className: "text-sm font-bold text-slate-800", children: ["KES ", upcomingRepayments.reduce((s, r) => s + r.amount, 0).toLocaleString()] })] })] }), _jsxs("div", { className: "card p-5", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center", children: _jsx(Activity, { size: 18 }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-slate-900", children: "Member Growth" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Past 7 months" })] })] }) }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-3xl font-extrabold text-slate-900", children: "1,248" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full", children: [_jsx(ArrowUpRight, { size: 11 }), " +27.3%"] }), _jsx("p", { className: "text-xs text-slate-500", children: "vs Jan" })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 120, children: _jsxs(LineChart, { data: memberGrowthData, margin: { top: 5, right: 0, left: 0, bottom: 0 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "memG", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#10b981" }), _jsx("stop", { offset: "100%", stopColor: "#10b981", stopOpacity: 0.3 })] }) }), _jsx(Tooltip, { contentStyle: { background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, padding: '6px 10px' }, formatter: (v) => [`${v} members`, 'Total'] }), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "url(#memG)", strokeWidth: 3, dot: { r: 3, fill: '#10b981' }, activeDot: { r: 5 } })] }) }), _jsxs("div", { className: "pt-3 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400", children: "New this month" }), _jsx("p", { className: "text-sm font-bold text-emerald-600", children: "+28" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400", children: "Active rate" }), _jsx("p", { className: "text-sm font-bold text-slate-800", children: "94.2%" })] })] })] })] }), _jsxs("div", { className: "card overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-slate-100", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 flex-wrap gap-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center", children: _jsx(Sparkles, { size: 18 }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-slate-900", children: "Recent Activity" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Latest transactions and events" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { className: "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors", children: [_jsx(Filter, { size: 12 }), "Filter"] }), _jsxs("button", { className: "text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1", children: ["View all ", _jsx(ArrowRight, { size: 12 })] })] })] }), _jsx("div", { className: "flex items-center gap-1 overflow-x-auto", children: [
                                    { key: 'all', label: 'All' },
                                    { key: 'contribution', label: 'Contributions' },
                                    { key: 'loan', label: 'Loans' },
                                    { key: 'member', label: 'Members' },
                                ].map((t) => (_jsxs("button", { onClick: () => setActivityFilter(t.key), className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activityFilter === t.key
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-50'}`, children: [t.label, _jsx("span", { className: `text-[10px] px-1.5 rounded-full ${activityFilter === t.key ? 'bg-white/20' : 'bg-slate-100'}`, children: activityCounts[t.key] })] }, t.key))) })] }), _jsx("div", { className: "divide-y divide-slate-50", children: filteredActivity.length === 0 ? (_jsx("div", { className: "px-5 py-12 text-center", children: _jsx("p", { className: "text-sm text-slate-400", children: "No activity in this category" }) })) : (filteredActivity.map((item) => (_jsxs("div", { className: "flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer", children: [_jsxs("div", { className: "relative flex-shrink-0", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold", children: item.member.split(' ').map((n) => n[0]).join('').slice(0, 2) }), _jsx("span", { className: `absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${item.color}` })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900 truncate", children: item.member }), _jsx("p", { className: "text-xs text-slate-500 truncate", children: item.type })] }), _jsx("p", { className: `text-sm font-bold flex-shrink-0 hidden sm:block ${item.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-700'}`, children: item.amount }), _jsxs("div", { className: "text-right flex-shrink-0", children: [_jsx("span", { className: item.status === 'completed' ? 'badge-green' :
                                                item.status === 'pending' ? 'badge-amber' :
                                                    item.status === 'approved' ? 'badge-blue' :
                                                        'badge-blue', children: item.status === 'completed' ? 'Completed' :
                                                item.status === 'pending' ? 'Pending' :
                                                    item.status === 'approved' ? 'Approved' : 'New' }), _jsxs("p", { className: "text-xs text-slate-400 mt-1 flex items-center gap-0.5 justify-end", children: [_jsx(Clock, { size: 10 }), item.time] })] }), _jsx(ChevronRight, { size: 14, className: "text-slate-300 flex-shrink-0 hidden md:block" })] }, item.id)))) })] }), _jsx(ReportModal, { open: reportOpen, onClose: () => setReportOpen(false) })] }));
}
