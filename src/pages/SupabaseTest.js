import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Live Supabase connection test page.
 *
 * Visit /supabase-test in dev to confirm:
 *   1) Env vars are loaded
 *   2) The client can reach your project
 *   3) Anonymous queries succeed (or fail with a meaningful error)
 *
 * Delete this once you're confident everything is wired up.
 */
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';
export default function SupabaseTest() {
    const [checks, setChecks] = useState([
        { name: 'Env variables loaded', status: 'pending' },
        { name: 'Supabase client initialized', status: 'pending' },
        { name: 'Auth endpoint reachable', status: 'pending' },
        { name: 'Database query succeeds', status: 'pending' },
    ]);
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    useEffect(() => {
        (async () => {
            const next = [...checks];
            // 1) Env vars
            next[0] = url && key
                ? { name: 'Env variables loaded', status: 'ok', detail: `URL: ${url.slice(0, 32)}…` }
                : { name: 'Env variables loaded', status: 'fail', detail: 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in .env.local' };
            setChecks([...next]);
            // 2) Client initialized
            next[1] = supabase
                ? { name: 'Supabase client initialized', status: 'ok' }
                : { name: 'Supabase client initialized', status: 'fail' };
            setChecks([...next]);
            // 3) Auth endpoint reachable (anonymous session check is harmless)
            try {
                const { error } = await supabase.auth.getSession();
                next[2] = error
                    ? { name: 'Auth endpoint reachable', status: 'fail', detail: error.message }
                    : { name: 'Auth endpoint reachable', status: 'ok' };
            }
            catch (e) {
                next[2] = { name: 'Auth endpoint reachable', status: 'fail', detail: e.message };
            }
            setChecks([...next]);
            // 4) Database query — try the saccos table; falls back to a benign error if schema isn't applied yet
            try {
                const { error } = await supabase.from('saccos').select('id', { count: 'exact', head: true });
                if (!error) {
                    next[3] = { name: 'Database query succeeds', status: 'ok', detail: '`saccos` table reachable' };
                }
                else if (error.message.includes('relation') || error.code === '42P01') {
                    next[3] = { name: 'Database query succeeds', status: 'fail', detail: 'Schema not applied yet — run the migrations in supabase/migrations/' };
                }
                else {
                    next[3] = { name: 'Database query succeeds', status: 'fail', detail: error.message };
                }
            }
            catch (e) {
                next[3] = { name: 'Database query succeeds', status: 'fail', detail: e.message };
            }
            setChecks([...next]);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const allPassed = checks.every((c) => c.status === 'ok');
    return (_jsx("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-6", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-xl w-full", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center", children: _jsx(Database, { className: "text-white", size: 24 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-extrabold text-slate-900", children: "Supabase Connection Test" }), _jsx("p", { className: "text-sm text-slate-500", children: "Verifying your dashboard \u2194 Supabase wiring" })] })] }), _jsx("div", { className: "space-y-3", children: checks.map((c) => (_jsxs("div", { className: `flex items-start gap-3 p-4 rounded-xl border ${c.status === 'ok' ? 'bg-emerald-50 border-emerald-200' :
                            c.status === 'fail' ? 'bg-red-50 border-red-200' :
                                'bg-slate-50 border-slate-200'}`, children: [_jsxs("div", { className: "flex-shrink-0 mt-0.5", children: [c.status === 'ok' && _jsx(CheckCircle, { className: "text-emerald-600", size: 20 }), c.status === 'fail' && _jsx(XCircle, { className: "text-red-600", size: 20 }), c.status === 'pending' && _jsx(Loader2, { className: "text-slate-500 animate-spin", size: 20 })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: `font-semibold text-sm ${c.status === 'ok' ? 'text-emerald-900' :
                                            c.status === 'fail' ? 'text-red-900' :
                                                'text-slate-700'}`, children: c.name }), c.detail && (_jsx("p", { className: `text-xs mt-1 break-words ${c.status === 'fail' ? 'text-red-700' : 'text-slate-500'}`, children: c.detail }))] })] }, c.name))) }), allPassed && (_jsxs("div", { className: "mt-6 p-4 rounded-xl bg-emerald-600 text-white text-center", children: [_jsx("p", { className: "font-bold", children: "\uD83C\uDF89 Everything works! Your dashboard is talking to Supabase." }), _jsx("p", { className: "text-sm text-emerald-100 mt-1", children: "You can delete this page now." })] }))] }) }));
}
