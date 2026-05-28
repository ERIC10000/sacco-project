import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Search, Filter, Download, MoreVertical, Eye, Edit, Trash2, Mail, CheckCircle, AlertCircle, X, Upload, ChevronDown, UserCheck, UserX, } from 'lucide-react';
import { demoMembers } from '@/data/demoData';
// ─────────────────────── ADD MEMBER DRAWER ───────────────────────
function AddMemberDrawer({ open, onClose, onSave }) {
    const [form, setForm] = useState({
        firstName: '', lastName: '', nationalId: '', email: '', phone: '', address: '',
    });
    const [saving, setSaving] = useState(false);
    const [step, setStep] = useState(1);
    if (!open)
        return null;
    const reset = () => {
        setForm({ firstName: '', lastName: '', nationalId: '', email: '', phone: '', address: '' });
        setStep(1);
    };
    const submit = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
        const newId = `M-${1100 + Math.floor(Math.random() * 900)}`;
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
        });
        reset();
        setSaving(false);
        onClose();
    };
    const canProceed = step === 1
        ? form.firstName && form.lastName && form.nationalId
        : form.email && form.phone && form.address;
    return (_jsxs("div", { className: "fixed inset-0 z-[60] flex", children: [_jsx("div", { className: "absolute inset-0 bg-slate-900/50 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300", children: [_jsxs("div", { className: "px-6 py-5 border-b border-slate-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center", children: _jsx(UserPlus, { size: 20 }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Add new member" }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Step ", step, " of 2"] })] })] }), _jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg hover:bg-slate-100 text-slate-400", children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "px-6 py-3 border-b border-slate-100", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `flex-1 h-1 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}` }), _jsx("div", { className: `flex-1 h-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}` })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto px-6 py-5", children: step === 1 ? (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-slate-700 font-bold mb-3", children: "Personal information" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "First name *" }), _jsx("input", { className: "input", placeholder: "e.g. John", value: form.firstName, onChange: (e) => setForm({ ...form, firstName: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Last name *" }), _jsx("input", { className: "input", placeholder: "e.g. Kamau", value: form.lastName, onChange: (e) => setForm({ ...form, lastName: e.target.value }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "National ID *" }), _jsx("input", { className: "input", placeholder: "e.g. 24895612", value: form.nationalId, onChange: (e) => setForm({ ...form, nationalId: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Date of birth" }), _jsx("input", { type: "date", className: "input" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Gender" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { className: "px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100", children: "Male" }), _jsx("button", { className: "px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100", children: "Female" })] })] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-slate-700 font-bold mb-3", children: "Contact information" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Email *" }), _jsx("input", { type: "email", className: "input", placeholder: "member@email.com", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Phone *" }), _jsx("input", { className: "input", placeholder: "+254 712 345 678", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Address *" }), _jsx("textarea", { rows: 3, className: "input resize-none", placeholder: "Town, County", value: form.address, onChange: (e) => setForm({ ...form, address: e.target.value }) })] }), _jsxs("div", { className: "bg-indigo-50 rounded-lg p-4 border border-indigo-100", children: [_jsx("p", { className: "text-sm font-bold text-slate-900 mb-1", children: "Welcome SMS" }), _jsx("p", { className: "text-xs text-slate-600", children: "A welcome SMS with login credentials will be sent to this member." })] })] })) }), _jsxs("div", { className: "px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between", children: [step > 1 ? (_jsx("button", { onClick: () => setStep(step - 1), className: "px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100", children: "Back" })) : _jsx("div", {}), step < 2 ? (_jsx("button", { onClick: () => setStep(step + 1), disabled: !canProceed, className: "px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md", children: "Continue" })) : (_jsx("button", { onClick: submit, disabled: !canProceed || saving, className: "px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2", children: saving ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Saving\u2026"] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 15 }), "Create member"] })) }))] })] })] }));
}
// ─────────────────────── MEMBERS PAGE ───────────────────────
export default function Members() {
    const navigate = useNavigate();
    const [members, setMembers] = useState(demoMembers);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [openMenu, setOpenMenu] = useState(null);
    const [toast, setToast] = useState(null);
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };
    const stats = useMemo(() => ({
        total: members.length,
        active: members.filter((m) => m.status === 'ACTIVE').length,
        inactive: members.filter((m) => m.status === 'INACTIVE').length,
        suspended: members.filter((m) => m.status === 'SUSPENDED').length,
        newThisMonth: members.filter((m) => new Date(m.dateJoined) >= new Date('2026-05-01')).length,
        totalContributions: members.reduce((s, m) => s + m.totalContributions, 0),
    }), [members]);
    const filtered = useMemo(() => {
        return members.filter((m) => {
            if (statusFilter !== 'ALL' && m.status !== statusFilter)
                return false;
            if (query) {
                const q = query.toLowerCase();
                return (m.firstName.toLowerCase().includes(q) ||
                    m.lastName.toLowerCase().includes(q) ||
                    m.email.toLowerCase().includes(q) ||
                    m.membershipNumber.toLowerCase().includes(q) ||
                    m.phone.includes(q));
            }
            return true;
        });
    }, [members, query, statusFilter]);
    const addMember = (m) => {
        setMembers((prev) => [m, ...prev]);
        showToast(`${m.firstName} ${m.lastName} added successfully`);
    };
    const deleteMember = (id) => {
        const m = members.find((x) => x.id === id);
        setMembers((prev) => prev.filter((x) => x.id !== id));
        if (m)
            showToast(`${m.firstName} ${m.lastName} removed`);
        setOpenMenu(null);
    };
    return (_jsxs("div", { className: "space-y-6", children: [toast && (_jsxs("div", { className: "fixed top-20 right-6 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center", children: _jsx(CheckCircle, { size: 16 }) }), _jsx("p", { className: "text-sm font-semibold text-slate-800", children: toast })] })), _jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-extrabold text-slate-900", children: "Members" }), _jsx("p", { className: "text-slate-500 text-sm mt-0.5", children: "Manage your SACCO membership directory." })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { className: "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm", children: [_jsx(Upload, { size: 14 }), "Import"] }), _jsxs("button", { className: "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm", children: [_jsx(Download, { size: 14 }), "Export"] }), _jsxs("button", { onClick: () => setDrawerOpen(true), className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/30", children: [_jsx(UserPlus, { size: 14 }), "Add Member"] })] })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Total Members', value: stats.total, icon: Users, color: 'bg-indigo-50 text-indigo-600', change: `+${stats.newThisMonth} this month` },
                    { label: 'Active', value: stats.active, icon: UserCheck, color: 'bg-emerald-50 text-emerald-600', change: `${Math.round((stats.active / stats.total) * 100)}% of total` },
                    { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'bg-slate-100 text-slate-600', change: 'Need follow-up' },
                    { label: 'Suspended', value: stats.suspended, icon: AlertCircle, color: 'bg-amber-50 text-amber-600', change: 'Under review' },
                ].map(({ label, value, icon: Icon, color, change }) => (_jsxs("div", { className: "card p-5", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsx("div", { className: `w-10 h-10 rounded-xl ${color} flex items-center justify-center`, children: _jsx(Icon, { size: 19 }) }) }), _jsx("p", { className: "text-2xl font-extrabold text-slate-900 mb-0.5", children: value.toLocaleString() }), _jsx("p", { className: "text-xs text-slate-500 font-medium", children: label }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: change })] }, label))) }), _jsxs("div", { className: "card p-4 flex items-center gap-3 flex-wrap", children: [_jsxs("div", { className: "relative flex-1 min-w-[240px]", children: [_jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }), _jsx("input", { className: "w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all", placeholder: "Search by name, ID, email or phone\u2026", value: query, onChange: (e) => setQuery(e.target.value) })] }), _jsx("div", { className: "flex items-center gap-1.5", children: ['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'].map((s) => (_jsx("button", { onClick: () => setStatusFilter(s), className: `px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${statusFilter === s
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`, children: s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase() }, s))) }), _jsxs("button", { className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors", children: [_jsx(Filter, { size: 13 }), "More filters", _jsx(ChevronDown, { size: 12 })] })] }), _jsxs("div", { className: "card overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-slate-50 border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Member" }), _jsx("th", { className: "text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Contact" }), _jsx("th", { className: "text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Joined" }), _jsx("th", { className: "text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Contributions" }), _jsx("th", { className: "text-center px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Loans" }), _jsx("th", { className: "text-center px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-5 py-3" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-50", children: filtered.length === 0 ? (_jsx("tr", { children: _jsxs("td", { colSpan: 7, className: "px-5 py-12 text-center", children: [_jsx(Users, { size: 36, className: "text-slate-300 mx-auto mb-3" }), _jsx("p", { className: "text-sm font-semibold text-slate-600", children: "No members found" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Try adjusting your search or filters." })] }) })) : (filtered.map((m) => {
                                        const initials = `${m.firstName[0]}${m.lastName[0]}`;
                                        return (_jsxs("tr", { className: "hover:bg-slate-50/60 transition-colors group", children: [_jsx("td", { className: "px-5 py-3.5", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-9 h-9 rounded-full ${m.avatarColor} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`, children: initials }), _jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "text-sm font-semibold text-slate-900", children: [m.firstName, " ", m.lastName] }), _jsx("p", { className: "text-xs text-slate-500 font-mono", children: m.membershipNumber })] })] }) }), _jsxs("td", { className: "px-5 py-3.5", children: [_jsx("p", { className: "text-sm text-slate-700", children: m.email }), _jsx("p", { className: "text-xs text-slate-500", children: m.phone })] }), _jsx("td", { className: "px-5 py-3.5", children: _jsx("p", { className: "text-sm text-slate-700", children: new Date(m.dateJoined).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) }) }), _jsx("td", { className: "px-5 py-3.5 text-right", children: _jsxs("p", { className: "text-sm font-bold text-slate-900", children: ["KES ", m.totalContributions.toLocaleString()] }) }), _jsx("td", { className: "px-5 py-3.5 text-center", children: _jsx("span", { className: `inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${m.activeLoans === 0
                                                            ? 'bg-slate-100 text-slate-500'
                                                            : 'bg-indigo-100 text-indigo-700'}`, children: m.activeLoans }) }), _jsxs("td", { className: "px-5 py-3.5 text-center", children: [m.status === 'ACTIVE' && (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }), "Active"] })), m.status === 'INACTIVE' && (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400" }), "Inactive"] })), m.status === 'SUSPENDED' && (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" }), "Suspended"] }))] }), _jsxs("td", { className: "px-5 py-3.5 relative", children: [_jsx("button", { onClick: (e) => { e.stopPropagation(); setOpenMenu(openMenu === m.id ? null : m.id); }, className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors", children: _jsx(MoreVertical, { size: 16 }) }), openMenu === m.id && (_jsxs("div", { className: "absolute right-5 top-full mt-1 w-44 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20", children: [_jsxs("button", { onClick: () => { navigate(`/members/${m.id}`); setOpenMenu(null); }, className: "w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 text-left text-sm text-slate-700", children: [_jsx(Eye, { size: 14 }), " View profile"] }), _jsxs("button", { onClick: () => setOpenMenu(null), className: "w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 text-left text-sm text-slate-700", children: [_jsx(Edit, { size: 14 }), " Edit"] }), _jsxs("button", { onClick: () => setOpenMenu(null), className: "w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 text-left text-sm text-slate-700", children: [_jsx(Mail, { size: 14 }), " Send message"] }), _jsx("div", { className: "border-t border-slate-100" }), _jsxs("button", { onClick: () => deleteMember(m.id), className: "w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-red-50 text-left text-sm text-red-600", children: [_jsx(Trash2, { size: 14 }), " Remove"] })] }))] })] }, m.id));
                                    })) })] }) }), _jsxs("div", { className: "px-5 py-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("p", { className: "text-xs text-slate-500", children: ["Showing ", _jsxs("span", { className: "font-bold text-slate-700", children: ["1 - ", filtered.length] }), " of ", _jsx("span", { className: "font-bold text-slate-700", children: filtered.length }), " members"] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { className: "px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg", disabled: true, children: "Previous" }), _jsx("button", { className: "px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg", children: "1" }), _jsx("button", { className: "px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg", children: "2" }), _jsx("button", { className: "px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg", children: "3" }), _jsx("button", { className: "px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg", children: "Next" })] })] })] }), _jsx(AddMemberDrawer, { open: drawerOpen, onClose: () => setDrawerOpen(false), onSave: addMember })] }));
}
