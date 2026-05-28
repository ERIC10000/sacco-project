import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { PiggyBank, Plus, Search, Download, X, CheckCircle, AlertCircle, ArrowUpRight, Receipt, CreditCard, Smartphone, Banknote, FileText, } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
import { demoContributions, demoMembers } from '@/data/demoData';
const chartData = [
    { day: 'Mon', amount: 32000 },
    { day: 'Tue', amount: 45000 },
    { day: 'Wed', amount: 28000 },
    { day: 'Thu', amount: 58000 },
    { day: 'Fri', amount: 71000 },
    { day: 'Sat', amount: 42000 },
    { day: 'Sun', amount: 35000 },
];
// ─────────────────── RECORD CONTRIBUTION MODAL ───────────────────
function RecordContributionModal({ open, onClose, onSave }) {
    const [form, setForm] = useState({ memberId: '', amount: '', method: 'M_PESA', reference: '' });
    const [saving, setSaving] = useState(false);
    if (!open)
        return null;
    const member = demoMembers.find((m) => m.id === form.memberId);
    const canSave = form.memberId && form.amount && form.reference;
    const save = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 700));
        const newId = `CON-${9930 + Math.floor(Math.random() * 100)}`;
        onSave({
            id: newId,
            memberId: form.memberId,
            memberName: member ? `${member.firstName} ${member.lastName}` : '',
            amount: Number(form.amount),
            date: new Date().toISOString().split('T')[0],
            method: form.method,
            reference: form.reference,
            status: 'COMPLETED',
        });
        setForm({ memberId: '', amount: '', method: 'M_PESA', reference: '' });
        setSaving(false);
        onClose();
    };
    const methods = [
        { v: 'M_PESA', label: 'M-Pesa', icon: Smartphone },
        { v: 'BANK_TRANSFER', label: 'Bank Transfer', icon: CreditCard },
        { v: 'CASH', label: 'Cash', icon: Banknote },
        { v: 'CHEQUE', label: 'Cheque', icon: FileText },
    ];
    return (_jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-slate-900/50 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden", children: [_jsxs("div", { className: "px-6 py-5 border-b border-slate-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center", children: _jsx(PiggyBank, { size: 20 }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Record contribution" }), _jsx("p", { className: "text-xs text-slate-500", children: "Log a new member contribution" })] })] }), _jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg hover:bg-slate-100 text-slate-400", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "px-6 py-5 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Member *" }), _jsxs("select", { className: "input", value: form.memberId, onChange: (e) => setForm({ ...form, memberId: e.target.value }), children: [_jsx("option", { value: "", children: "Select a member" }), demoMembers.map((m) => (_jsxs("option", { value: m.id, children: [m.firstName, " ", m.lastName, " (", m.membershipNumber, ")"] }, m.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Amount (KES) *" }), _jsx("input", { type: "number", className: "input", placeholder: "5000", value: form.amount, onChange: (e) => setForm({ ...form, amount: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Payment method *" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: methods.map(({ v, label, icon: Icon }) => (_jsxs("button", { onClick: () => setForm({ ...form, method: v }), className: `flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-semibold transition-all ${form.method === v
                                                ? 'bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`, children: [_jsx(Icon, { size: 16 }), label] }, v))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Reference / Transaction ID *" }), _jsx("input", { className: "input", placeholder: "QGH123ABC", value: form.reference, onChange: (e) => setForm({ ...form, reference: e.target.value }) })] }), canSave && (_jsxs("div", { className: "rounded-lg bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3", children: [_jsx(Receipt, { size: 18, className: "text-emerald-600 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold text-emerald-900", children: "Receipt will be auto-generated" }), _jsxs("p", { className: "text-xs text-emerald-700 mt-0.5", children: ["Sent via SMS to ", member?.phone] })] })] }))] }), _jsxs("div", { className: "px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100", children: "Cancel" }), _jsx("button", { onClick: save, disabled: !canSave || saving, className: "px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-md flex items-center gap-2", children: saving ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Recording\u2026"] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 15 }), "Record contribution"] })) })] })] })] }));
}
// ─────────────────── CONTRIBUTIONS PAGE ───────────────────
export default function Contributions() {
    const [items, setItems] = useState(demoContributions);
    const [modalOpen, setModalOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [toast, setToast] = useState(null);
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };
    const stats = useMemo(() => {
        const completed = items.filter((c) => c.status === 'COMPLETED');
        const today = items.filter((c) => c.date === '2026-05-26');
        return {
            total: items.length,
            totalAmount: completed.reduce((s, c) => s + c.amount, 0),
            todayAmount: today.reduce((s, c) => s + c.amount, 0),
            pending: items.filter((c) => c.status === 'PENDING').length,
            failed: items.filter((c) => c.status === 'FAILED').length,
            avg: completed.length ? completed.reduce((s, c) => s + c.amount, 0) / completed.length : 0,
        };
    }, [items]);
    const filtered = items.filter((c) => {
        if (statusFilter !== 'ALL' && c.status !== statusFilter)
            return false;
        if (query) {
            const q = query.toLowerCase();
            return c.memberName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.reference.toLowerCase().includes(q);
        }
        return true;
    });
    const add = (c) => {
        setItems((p) => [c, ...p]);
        showToast(`Contribution ${c.id} recorded`);
    };
    const methodIcons = {
        M_PESA: Smartphone, BANK_TRANSFER: CreditCard, CASH: Banknote, CHEQUE: FileText,
    };
    const methodLabels = {
        M_PESA: 'M-Pesa', BANK_TRANSFER: 'Bank', CASH: 'Cash', CHEQUE: 'Cheque',
    };
    const statusColors = {
        COMPLETED: 'bg-emerald-50 text-emerald-700',
        PENDING: 'bg-amber-50 text-amber-700',
        FAILED: 'bg-red-50 text-red-600',
    };
    return (_jsxs("div", { className: "space-y-6", children: [toast && (_jsxs("div", { className: "fixed top-20 right-6 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center", children: _jsx(CheckCircle, { size: 16 }) }), _jsx("p", { className: "text-sm font-semibold text-slate-800", children: toast })] })), _jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-extrabold text-slate-900", children: "Contributions" }), _jsx("p", { className: "text-slate-500 text-sm mt-0.5", children: "Track and record member contributions." })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { className: "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm", children: [_jsx(Download, { size: 14 }), "Export"] }), _jsxs("button", { onClick: () => setModalOpen(true), className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md shadow-emerald-600/30", children: [_jsx(Plus, { size: 14 }), "Record Contribution"] })] })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: "Today's Collections", value: `KES ${stats.todayAmount.toLocaleString()}`, sub: 'Live total', icon: ArrowUpRight, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Total this month', value: `KES ${(stats.totalAmount / 1000).toFixed(0)}K`, sub: '+9.3% vs last', icon: PiggyBank, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'Average contribution', value: `KES ${stats.avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, sub: 'Per member', icon: Receipt, color: 'bg-violet-50 text-violet-600' },
                    { label: 'Pending', value: stats.pending, sub: `${stats.failed} failed`, icon: AlertCircle, color: 'bg-amber-50 text-amber-600' },
                ].map(({ label, value, sub, icon: Icon, color }) => (_jsxs("div", { className: "card p-5", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsx("div", { className: `w-10 h-10 rounded-xl ${color} flex items-center justify-center`, children: _jsx(Icon, { size: 19 }) }) }), _jsx("p", { className: "text-2xl font-extrabold text-slate-900 mb-0.5", children: value }), _jsx("p", { className: "text-xs text-slate-500 font-medium", children: label }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: sub })] }, label))) }), _jsxs("div", { className: "card p-5", children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-slate-900", children: "Weekly Contributions" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Last 7 days" })] }) }), _jsx(ResponsiveContainer, { width: "100%", height: 220, children: _jsxs(AreaChart, { data: chartData, margin: { top: 0, right: 0, left: -20, bottom: 0 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "contrib2", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#10b981", stopOpacity: 0.3 }), _jsx("stop", { offset: "100%", stopColor: "#10b981", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9", vertical: false }), _jsx(XAxis, { dataKey: "day", tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false, tickFormatter: (v) => `${(v / 1000).toFixed(0)}K` }), _jsx(Tooltip, { formatter: (v) => [`KES ${v.toLocaleString()}`, 'Collected'] }), _jsx(Area, { type: "monotone", dataKey: "amount", stroke: "#10b981", strokeWidth: 2.5, fill: "url(#contrib2)", dot: { r: 4, fill: '#10b981' } })] }) })] }), _jsxs("div", { className: "card p-4 flex items-center gap-3 flex-wrap", children: [_jsxs("div", { className: "relative flex-1 min-w-[240px]", children: [_jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }), _jsx("input", { className: "w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all", placeholder: "Search by member, ID or reference\u2026", value: query, onChange: (e) => setQuery(e.target.value) })] }), _jsx("div", { className: "flex items-center gap-1.5", children: ['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map((s) => (_jsx("button", { onClick: () => setStatusFilter(s), className: `px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${statusFilter === s
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`, children: s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase() }, s))) })] }), _jsx("div", { className: "card overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-slate-50 border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "ID" }), _jsx("th", { className: "text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Member" }), _jsx("th", { className: "text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Method" }), _jsx("th", { className: "text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Reference" }), _jsx("th", { className: "text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Amount" }), _jsx("th", { className: "text-center px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-50", children: filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-5 py-12 text-center text-sm text-slate-400", children: "No contributions found" }) })) : (filtered.map((c) => {
                                    const MethodIcon = methodIcons[c.method];
                                    return (_jsxs("tr", { className: "hover:bg-slate-50/60 transition-colors", children: [_jsx("td", { className: "px-5 py-3.5 text-sm font-mono text-slate-700", children: c.id }), _jsx("td", { className: "px-5 py-3.5 text-sm font-semibold text-slate-900", children: c.memberName }), _jsx("td", { className: "px-5 py-3.5", children: _jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold", children: [_jsx(MethodIcon, { size: 12 }), methodLabels[c.method]] }) }), _jsx("td", { className: "px-5 py-3.5 text-xs font-mono text-slate-500", children: c.reference }), _jsx("td", { className: "px-5 py-3.5 text-sm text-slate-700", children: new Date(c.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' }) }), _jsxs("td", { className: `px-5 py-3.5 text-sm font-bold text-right ${c.status === 'COMPLETED' ? 'text-emerald-600' : 'text-slate-700'}`, children: ["+KES ", c.amount.toLocaleString()] }), _jsx("td", { className: "px-5 py-3.5 text-center", children: _jsx("span", { className: `px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[c.status]}`, children: c.status.charAt(0) + c.status.slice(1).toLowerCase() }) })] }, c.id));
                                })) })] }) }) }), _jsx(RecordContributionModal, { open: modalOpen, onClose: () => setModalOpen(false), onSave: add })] }));
}
