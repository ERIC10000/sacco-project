import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { CreditCard, Plus, Search, Download, X, CheckCircle, Clock, AlertCircle, TrendingUp, DollarSign, ChevronRight, Briefcase, } from 'lucide-react';
import { demoLoans, demoMembers } from '@/data/demoData';
// ─────────────────── PROCESS LOAN MODAL ───────────────────
function ProcessLoanModal({ open, onClose, onSubmit }) {
    const [form, setForm] = useState({
        memberId: '', amount: '', term: '12', purpose: '', interestRate: '12',
    });
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    if (!open)
        return null;
    const selectedMember = demoMembers.find((m) => m.id === form.memberId);
    const amount = Number(form.amount) || 0;
    const term = Number(form.term) || 12;
    const rate = Number(form.interestRate) || 12;
    const monthlyPayment = amount > 0 ? Math.round((amount * (1 + (rate / 100) * (term / 12))) / term) : 0;
    const totalRepayment = monthlyPayment * term;
    const canProceed = step === 1
        ? form.memberId
        : step === 2
            ? form.amount && form.purpose
            : true;
    const submit = async () => {
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 900));
        const newId = `LN-${3500 + Math.floor(Math.random() * 500)}`;
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
        });
        setSubmitting(false);
        setForm({ memberId: '', amount: '', term: '12', purpose: '', interestRate: '12' });
        setStep(1);
        onClose();
    };
    return (_jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-slate-900/50 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden", children: [_jsxs("div", { className: "px-6 py-5 border-b border-slate-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white flex items-center justify-center", children: _jsx(CreditCard, { size: 20 }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Process new loan" }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Step ", step, " of 3"] })] })] }), _jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg hover:bg-slate-100 text-slate-400", children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "px-6 py-3 border-b border-slate-100 flex gap-2", children: [1, 2, 3].map((s) => (_jsx("div", { className: `flex-1 h-1 rounded-full ${step >= s ? 'bg-violet-600' : 'bg-slate-200'}` }, s))) }), _jsxs("div", { className: "px-6 py-5", children: [step === 1 && (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm font-bold text-slate-700", children: "Select member" }), _jsx("div", { className: "max-h-72 overflow-y-auto space-y-2", children: demoMembers.slice(0, 8).map((m) => {
                                            const selected = form.memberId === m.id;
                                            return (_jsxs("button", { onClick: () => setForm({ ...form, memberId: m.id }), className: `w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selected
                                                    ? 'border-violet-500 bg-violet-50'
                                                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`, children: [_jsxs("div", { className: `w-10 h-10 rounded-full ${m.avatarColor} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`, children: [m.firstName[0], m.lastName[0]] }), _jsxs("div", { className: "flex-1 text-left min-w-0", children: [_jsxs("p", { className: "text-sm font-semibold text-slate-900 truncate", children: [m.firstName, " ", m.lastName] }), _jsxs("p", { className: "text-xs text-slate-500", children: [m.membershipNumber, " \u00B7 ", m.activeLoans, " active loan", m.activeLoans !== 1 ? 's' : ''] })] }), selected && _jsx(CheckCircle, { size: 18, className: "text-violet-600 flex-shrink-0" })] }, m.id));
                                        }) })] })), step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm font-bold text-slate-700", children: "Loan details" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Amount (KES) *" }), _jsx("input", { type: "number", className: "input", placeholder: "50000", value: form.amount, onChange: (e) => setForm({ ...form, amount: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Term (months)" }), _jsx("select", { className: "input", value: form.term, onChange: (e) => setForm({ ...form, term: e.target.value }), children: [6, 12, 18, 24, 36, 48].map((t) => _jsxs("option", { value: t, children: [t, " months"] }, t)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Interest rate (%)" }), _jsx("input", { type: "number", className: "input", value: form.interestRate, onChange: (e) => setForm({ ...form, interestRate: e.target.value }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Purpose *" }), _jsxs("select", { className: "input", value: form.purpose, onChange: (e) => setForm({ ...form, purpose: e.target.value }), children: [_jsx("option", { value: "", children: "Select purpose" }), ['Business expansion', 'Education', 'Medical', 'Home improvement', 'Vehicle purchase', 'Personal', 'Emergency'].map((p) => (_jsx("option", { value: p, children: p }, p)))] })] })] })), step === 3 && (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm font-bold text-slate-700", children: "Review & confirm" }), _jsxs("div", { className: "rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-5", children: [_jsx("div", { className: "flex items-center gap-3 mb-4 pb-4 border-b border-violet-100", children: selectedMember && (_jsxs(_Fragment, { children: [_jsxs("div", { className: `w-10 h-10 rounded-full ${selectedMember.avatarColor} text-white flex items-center justify-center text-xs font-bold`, children: [selectedMember.firstName[0], selectedMember.lastName[0]] }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-bold text-slate-900", children: [selectedMember.firstName, " ", selectedMember.lastName] }), _jsx("p", { className: "text-xs text-slate-500", children: selectedMember.membershipNumber })] })] })) }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500", children: "Loan amount" }), _jsxs("p", { className: "font-bold text-slate-900", children: ["KES ", amount.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500", children: "Term" }), _jsxs("p", { className: "font-bold text-slate-900", children: [term, " months"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500", children: "Interest rate" }), _jsxs("p", { className: "font-bold text-slate-900", children: [rate, "% p.a."] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500", children: "Monthly payment" }), _jsxs("p", { className: "font-bold text-violet-700", children: ["KES ", monthlyPayment.toLocaleString()] })] }), _jsxs("div", { className: "col-span-2 pt-3 border-t border-violet-100", children: [_jsx("p", { className: "text-xs text-slate-500", children: "Total repayment" }), _jsxs("p", { className: "text-lg font-extrabold text-slate-900", children: ["KES ", totalRepayment.toLocaleString()] })] })] })] }), _jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2", children: [_jsx(AlertCircle, { size: 16, className: "text-amber-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-xs text-amber-800", children: "This application will be submitted for approval and will appear in the pending queue." })] })] }))] }), _jsxs("div", { className: "px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between", children: [step > 1 ? (_jsx("button", { onClick: () => setStep(step - 1), className: "px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100", children: "Back" })) : _jsx("div", {}), step < 3 ? (_jsx("button", { onClick: () => setStep(step + 1), disabled: !canProceed, className: "px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 shadow-md", children: "Continue" })) : (_jsx("button", { onClick: submit, disabled: submitting, className: "px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 shadow-md flex items-center gap-2", children: submitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Submitting\u2026"] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 15 }), "Submit application"] })) }))] })] })] }));
}
// ─────────────────── LOANS PAGE ───────────────────
export default function Loans() {
    const [loans, setLoans] = useState(demoLoans);
    const [modalOpen, setModalOpen] = useState(false);
    const [tab, setTab] = useState('ALL');
    const [query, setQuery] = useState('');
    const [toast, setToast] = useState(null);
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };
    const stats = useMemo(() => ({
        active: loans.filter((l) => l.status === 'DISBURSED').length,
        pending: loans.filter((l) => l.status === 'PENDING').length,
        repaid: loans.filter((l) => l.status === 'REPAID').length,
        rejected: loans.filter((l) => l.status === 'REJECTED').length,
        disbursed: loans.filter((l) => l.status === 'DISBURSED').reduce((s, l) => s + (l.approvedAmount || 0), 0),
        pendingAmount: loans.filter((l) => l.status === 'PENDING').reduce((s, l) => s + l.amount, 0),
        outstanding: loans.filter((l) => l.status === 'DISBURSED').reduce((s, l) => s + l.remainingBalance, 0),
    }), [loans]);
    const filtered = useMemo(() => {
        return loans.filter((l) => {
            if (tab !== 'ALL' && l.status !== tab)
                return false;
            if (query) {
                const q = query.toLowerCase();
                return l.memberName.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.purpose.toLowerCase().includes(q);
            }
            return true;
        });
    }, [loans, tab, query]);
    const counts = {
        ALL: loans.length,
        PENDING: loans.filter((l) => l.status === 'PENDING').length,
        APPROVED: loans.filter((l) => l.status === 'APPROVED').length,
        DISBURSED: loans.filter((l) => l.status === 'DISBURSED').length,
        REPAID: loans.filter((l) => l.status === 'REPAID').length,
        REJECTED: loans.filter((l) => l.status === 'REJECTED').length,
    };
    const approve = (id) => {
        setLoans((p) => p.map((l) => l.id === id ? { ...l, status: 'APPROVED', approvedAmount: l.amount, approvalDate: new Date().toISOString().split('T')[0] } : l));
        showToast(`Loan ${id} approved`);
    };
    const reject = (id) => {
        setLoans((p) => p.map((l) => l.id === id ? { ...l, status: 'REJECTED', approvalDate: new Date().toISOString().split('T')[0] } : l));
        showToast(`Loan ${id} rejected`);
    };
    const disburse = (id) => {
        setLoans((p) => p.map((l) => l.id === id ? { ...l, status: 'DISBURSED', disbursementDate: new Date().toISOString().split('T')[0] } : l));
        showToast(`Loan ${id} disbursed`);
    };
    const addLoan = (l) => {
        setLoans((p) => [l, ...p]);
        showToast(`Loan application ${l.id} submitted`);
    };
    const statusColors = {
        PENDING: 'bg-amber-50 text-amber-700',
        APPROVED: 'bg-blue-50 text-blue-700',
        DISBURSED: 'bg-emerald-50 text-emerald-700',
        REPAID: 'bg-slate-100 text-slate-600',
        REJECTED: 'bg-red-50 text-red-600',
        DEFAULTED: 'bg-red-100 text-red-700',
    };
    return (_jsxs("div", { className: "space-y-6", children: [toast && (_jsxs("div", { className: "fixed top-20 right-6 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center", children: _jsx(CheckCircle, { size: 16 }) }), _jsx("p", { className: "text-sm font-semibold text-slate-800", children: toast })] })), _jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-extrabold text-slate-900", children: "Loans" }), _jsx("p", { className: "text-slate-500 text-sm mt-0.5", children: "Process loan applications and manage repayments." })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { className: "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm", children: [_jsx(Download, { size: 14 }), "Export"] }), _jsxs("button", { onClick: () => setModalOpen(true), className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 transition-all shadow-md shadow-violet-600/30", children: [_jsx(Plus, { size: 14 }), "Process Loan"] })] })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Active Loans', value: stats.active, sub: `KES ${(stats.outstanding / 1000).toFixed(0)}K outstanding`, icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Pending Approval', value: stats.pending, sub: `KES ${(stats.pendingAmount / 1000).toFixed(0)}K requested`, icon: Clock, color: 'bg-amber-50 text-amber-600' },
                    { label: 'Total Disbursed', value: `KES ${(stats.disbursed / 1000000).toFixed(2)}M`, sub: 'All time', icon: DollarSign, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'Default Rate', value: '2.1%', sub: 'Healthy portfolio', icon: TrendingUp, color: 'bg-violet-50 text-violet-600' },
                ].map(({ label, value, sub, icon: Icon, color }) => (_jsxs("div", { className: "card p-5", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsx("div", { className: `w-10 h-10 rounded-xl ${color} flex items-center justify-center`, children: _jsx(Icon, { size: 19 }) }) }), _jsx("p", { className: "text-2xl font-extrabold text-slate-900 mb-0.5", children: value }), _jsx("p", { className: "text-xs text-slate-500 font-medium", children: label }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: sub })] }, label))) }), _jsx("div", { className: "card p-1.5 flex items-center gap-1 overflow-x-auto", children: ['ALL', 'PENDING', 'APPROVED', 'DISBURSED', 'REPAID', 'REJECTED'].map((t) => (_jsxs("button", { onClick: () => setTab(t), className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === t
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'}`, children: [t === 'ALL' ? 'All Loans' : t.charAt(0) + t.slice(1).toLowerCase(), _jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-md ${tab === t ? 'bg-white/20' : 'bg-slate-100'}`, children: counts[t] })] }, t))) }), _jsx("div", { className: "card p-4", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }), _jsx("input", { className: "w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all", placeholder: "Search by loan ID, member name or purpose\u2026", value: query, onChange: (e) => setQuery(e.target.value) })] }) }), _jsx("div", { className: "card overflow-hidden", children: filtered.length === 0 ? (_jsxs("div", { className: "px-5 py-16 text-center", children: [_jsx(CreditCard, { size: 40, className: "text-slate-300 mx-auto mb-3" }), _jsx("p", { className: "text-sm font-semibold text-slate-600", children: "No loans found" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Try adjusting your filters." })] })) : (_jsx("div", { className: "divide-y divide-slate-50", children: filtered.map((l) => {
                        const riskColor = l.risk === 'low'
                            ? 'bg-emerald-50 text-emerald-700'
                            : l.risk === 'medium'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700';
                        const progress = l.approvedAmount && l.status === 'DISBURSED'
                            ? ((l.approvedAmount - l.remainingBalance) / l.approvedAmount) * 100
                            : null;
                        return (_jsx("div", { className: "p-5 hover:bg-slate-50/60 transition-colors", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0", children: l.memberName.split(' ').map((n) => n[0]).join('').slice(0, 2) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [_jsx("p", { className: "text-sm font-bold text-slate-900", children: l.memberName }), _jsx("span", { className: "text-xs font-mono text-slate-500", children: l.id }), _jsxs("span", { className: `text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${riskColor}`, children: [l.risk, " risk"] }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[l.status]}`, children: l.status.charAt(0) + l.status.slice(1).toLowerCase() })] }), _jsxs("p", { className: "text-xs text-slate-500 mb-2", children: [_jsx(Briefcase, { size: 11, className: "inline mr-1" }), l.purpose, " \u00B7 ", l.termMonths, " months \u00B7 ", l.interestRate, "% interest"] }), _jsxs("div", { className: "flex items-center gap-5 text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Amount:" }), ' ', _jsxs("span", { className: "font-bold text-slate-900", children: ["KES ", l.amount.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Monthly:" }), ' ', _jsxs("span", { className: "font-bold text-slate-900", children: ["KES ", l.monthlyPayment.toLocaleString()] })] }), l.status === 'DISBURSED' && (_jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Balance:" }), ' ', _jsxs("span", { className: "font-bold text-violet-700", children: ["KES ", l.remainingBalance.toLocaleString()] })] }))] }), progress !== null && (_jsxs("div", { className: "mt-3 max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("p", { className: "text-xs text-slate-500", children: "Repayment progress" }), _jsxs("p", { className: "text-xs font-bold text-slate-700", children: [Math.round(progress), "%"] })] }), _jsx("div", { className: "h-1.5 bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all", style: { width: `${progress}%` } }) })] }))] }), _jsxs("div", { className: "flex flex-col items-end gap-2", children: [l.status === 'PENDING' && (_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("button", { onClick: () => reject(l.id), className: "px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors", children: "Reject" }), _jsxs("button", { onClick: () => approve(l.id), className: "px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors shadow-sm flex items-center gap-1", children: [_jsx(CheckCircle, { size: 12 }), " Approve"] })] })), l.status === 'APPROVED' && (_jsxs("button", { onClick: () => disburse(l.id), className: "px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-colors shadow-sm flex items-center gap-1", children: [_jsx(DollarSign, { size: 12 }), " Disburse"] })), _jsxs("button", { className: "text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium", children: ["Details ", _jsx(ChevronRight, { size: 12 })] })] })] }) }, l.id));
                    }) })) }), _jsx(ProcessLoanModal, { open: modalOpen, onClose: () => setModalOpen(false), onSubmit: addLoan })] }));
}
