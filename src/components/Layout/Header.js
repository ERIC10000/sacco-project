import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ChevronDown, User, Settings, LogOut, HelpCircle, CreditCard, PiggyBank, AlertCircle, CheckCircle, X, } from 'lucide-react';
const searchResults = [
    { type: 'member', title: 'John Kamau', subtitle: 'Membership #M-1024', icon: User, path: '/members' },
    { type: 'member', title: 'Wanjiru Muthoni', subtitle: 'Membership #M-1156', icon: User, path: '/members' },
    { type: 'loan', title: 'Loan LN-3421', subtitle: 'KES 80,000 · Pending', icon: CreditCard, path: '/loans' },
    { type: 'contribution', title: 'CON-9920', subtitle: 'KES 5,000 · Today', icon: PiggyBank, path: '/contributions' },
];
const notifications = [
    { id: 1, type: 'warning', icon: AlertCircle, title: '5 loans need your approval', desc: 'Review pending applications', time: '5 min ago', unread: true },
    { id: 2, type: 'success', icon: CheckCircle, title: 'Monthly report ready', desc: 'June 2026 financial report', time: '1 hr ago', unread: true },
    { id: 3, type: 'info', icon: PiggyBank, title: 'KES 4.2M in contributions', desc: 'This month milestone reached', time: '3 hrs ago', unread: false },
    { id: 4, type: 'info', icon: User, title: '12 new members joined', desc: 'View new registrations', time: 'Yesterday', unread: false },
];
export default function Header() {
    const navigate = useNavigate();
    const user = { username: 'Admin', role: 'Administrator', initials: 'AD', email: 'admin@saccoflow.co.ke' };
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [notifList, setNotifList] = useState(notifications);
    const searchRef = useRef(null);
    const notifRef = useRef(null);
    const userRef = useRef(null);
    // Close all dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target))
                setSearchOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target))
                setNotifOpen(false);
            if (userRef.current && !userRef.current.contains(e.target))
                setUserOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    const unreadCount = notifList.filter((n) => n.unread).length;
    const filteredResults = searchQuery
        ? searchResults.filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
        : searchResults;
    const markAllRead = () => setNotifList((n) => n.map((x) => ({ ...x, unread: false })));
    const dismissNotif = (id) => setNotifList((n) => n.filter((x) => x.id !== id));
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (_jsxs("header", { className: "h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 sticky top-0 z-30", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "text-sm font-semibold text-slate-900 truncate", children: [greeting, ", ", user.username, " \uD83D\uDC4B"] }), _jsx("p", { className: "text-xs text-slate-400", children: now.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) })] }), _jsxs("div", { ref: searchRef, className: "relative hidden md:block", children: [_jsxs("div", { className: `flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 w-72 transition-all ${searchOpen ? 'border-indigo-500 ring-4 ring-indigo-100 bg-white' : 'border-slate-200'}`, children: [_jsx(Search, { size: 14, className: "text-slate-400 flex-shrink-0" }), _jsx("input", { type: "text", placeholder: "Search members, loans, contributions\u2026", className: "bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none w-full", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onFocus: () => setSearchOpen(true) }), searchQuery && (_jsx("button", { onClick: () => setSearchQuery(''), className: "text-slate-400 hover:text-slate-600", children: _jsx(X, { size: 14 }) }))] }), searchOpen && (_jsxs("div", { className: "absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50", children: [_jsx("div", { className: "px-4 py-3 border-b border-slate-50", children: _jsxs("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: [filteredResults.length, " result", filteredResults.length !== 1 ? 's' : ''] }) }), _jsx("div", { className: "max-h-80 overflow-y-auto", children: filteredResults.length === 0 ? (_jsx("div", { className: "px-4 py-8 text-center", children: _jsx("p", { className: "text-sm text-slate-400", children: "No results found" }) })) : (filteredResults.map((r, i) => {
                                    const Icon = r.icon;
                                    return (_jsxs("button", { onClick: () => { navigate(r.path); setSearchOpen(false); setSearchQuery(''); }, className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0", children: _jsx(Icon, { size: 16 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900 truncate", children: r.title }), _jsx("p", { className: "text-xs text-slate-500 truncate", children: r.subtitle })] }), _jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize", children: r.type })] }, i));
                                })) }), _jsxs("div", { className: "px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between", children: [_jsxs("p", { className: "text-xs text-slate-500", children: ["Press ", _jsx("kbd", { className: "px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-700 font-mono text-xs", children: "\u21B5" }), " to open"] }), _jsxs("p", { className: "text-xs text-slate-500", children: [_jsx("kbd", { className: "px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-700 font-mono text-xs", children: "esc" }), " to close"] })] })] }))] }), _jsxs("div", { ref: notifRef, className: "relative", children: [_jsxs("button", { onClick: () => { setNotifOpen(!notifOpen); setUserOpen(false); }, className: "relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors", children: [_jsx(Bell, { size: 18 }), unreadCount > 0 && (_jsx("span", { className: "absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white flex items-center justify-center", children: unreadCount }))] }), notifOpen && (_jsxs("div", { className: "absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50", children: [_jsxs("div", { className: "px-4 py-3 border-b border-slate-50 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold text-slate-900", children: "Notifications" }), _jsxs("p", { className: "text-xs text-slate-400", children: [unreadCount, " unread"] })] }), unreadCount > 0 && (_jsx("button", { onClick: markAllRead, className: "text-xs text-indigo-600 hover:text-indigo-700 font-semibold", children: "Mark all read" }))] }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: notifList.length === 0 ? (_jsxs("div", { className: "px-4 py-12 text-center", children: [_jsx(Bell, { size: 32, className: "text-slate-300 mx-auto mb-3" }), _jsx("p", { className: "text-sm text-slate-400", children: "No notifications" })] })) : (notifList.map((n) => {
                                    const Icon = n.icon;
                                    const colors = {
                                        warning: 'bg-amber-100 text-amber-600',
                                        success: 'bg-emerald-100 text-emerald-600',
                                        info: 'bg-indigo-100 text-indigo-600',
                                    };
                                    return (_jsxs("div", { className: `group flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${n.unread ? 'bg-indigo-50/30' : ''}`, children: [_jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[n.type]}`, children: _jsx(Icon, { size: 16 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: n.title }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: n.desc }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: n.time })] }), _jsx("button", { onClick: () => dismissNotif(n.id), className: "opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 text-slate-400 transition-all", children: _jsx(X, { size: 14 }) })] }, n.id));
                                })) }), _jsx("div", { className: "px-4 py-2.5 bg-slate-50 border-t border-slate-100", children: _jsx("button", { className: "text-xs text-indigo-600 hover:text-indigo-700 font-semibold w-full text-center", children: "View all notifications" }) })] }))] }), _jsxs("div", { ref: userRef, className: "relative", children: [_jsxs("button", { onClick: () => { setUserOpen(!userOpen); setNotifOpen(false); }, className: "flex items-center gap-2.5 group hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0", children: user.initials }), _jsxs("div", { className: "hidden sm:block leading-none text-left", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: user.username }), _jsx("p", { className: "text-xs text-slate-400", children: user.role })] }), _jsx(ChevronDown, { size: 14, className: `text-slate-400 group-hover:text-slate-700 transition-all ${userOpen ? 'rotate-180' : ''}` })] }), userOpen && (_jsxs("div", { className: "absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50", children: [_jsx("div", { className: "px-4 py-4 border-b border-slate-50 bg-gradient-to-br from-indigo-50 to-violet-50", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold", children: user.initials }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-bold text-slate-900 truncate", children: user.username }), _jsx("p", { className: "text-xs text-slate-500 truncate", children: user.email })] })] }) }), _jsx("div", { className: "py-1", children: [
                                    { icon: User, label: 'My Profile' },
                                    { icon: Settings, label: 'Settings' },
                                    { icon: HelpCircle, label: 'Help & Support' },
                                ].map(({ icon: Icon, label }) => (_jsxs("button", { className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors", children: [_jsx(Icon, { size: 16, className: "text-slate-400" }), _jsx("span", { className: "text-sm text-slate-700", children: label })] }, label))) }), _jsx("div", { className: "py-1 border-t border-slate-100", children: _jsxs("button", { onClick: logout, className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-left transition-colors text-red-600", children: [_jsx(LogOut, { size: 16 }), _jsx("span", { className: "text-sm font-semibold", children: "Sign out" })] }) })] }))] })] }));
}
