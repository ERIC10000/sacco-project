import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout/Layout'
import Landing from './pages/Landing/Landing'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Members from './pages/Members/Members'
import MemberDetail from './pages/Members/MemberDetail'
import Loans from './pages/Loans/Loans'
import LoanDetail from './pages/Loans/LoanDetail'
import Contributions from './pages/Contributions/Contributions'
import Reports from './pages/Reports/Reports'
import Communications from './pages/Communications/Communications'
import AuditLogs from './pages/AuditLogs/AuditLogs'
import Settings from './pages/Settings/Settings'
import SupabaseTest from './pages/SupabaseTest'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/supabase-test" element={<SupabaseTest />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/:id" element={<MemberDetail />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:id" element={<LoanDetail />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Navigate to="/settings" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
