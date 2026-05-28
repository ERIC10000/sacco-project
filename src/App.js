import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Members from './pages/Members/Members';
import MemberDetail from './pages/Members/MemberDetail';
import Loans from './pages/Loans/Loans';
import LoanDetail from './pages/Loans/LoanDetail';
import Contributions from './pages/Contributions/Contributions';
import Reports from './pages/Reports/Reports';
import Communications from './pages/Communications/Communications';
import AuditLogs from './pages/AuditLogs/AuditLogs';
import Settings from './pages/Settings/Settings';
import SupabaseTest from './pages/SupabaseTest';
import NotFound from './pages/NotFound';
const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});
function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/supabase-test", element: _jsx(SupabaseTest, {}) }), _jsxs(Route, { element: _jsx(Layout, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/members", element: _jsx(Members, {}) }), _jsx(Route, { path: "/members/:id", element: _jsx(MemberDetail, {}) }), _jsx(Route, { path: "/loans", element: _jsx(Loans, {}) }), _jsx(Route, { path: "/loans/:id", element: _jsx(LoanDetail, {}) }), _jsx(Route, { path: "/contributions", element: _jsx(Contributions, {}) }), _jsx(Route, { path: "/communications", element: _jsx(Communications, {}) }), _jsx(Route, { path: "/audit-logs", element: _jsx(AuditLogs, {}) }), _jsx(Route, { path: "/reports", element: _jsx(Reports, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/help", element: _jsx(Navigate, { to: "/settings" }) })] }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) }));
}
export default App;
