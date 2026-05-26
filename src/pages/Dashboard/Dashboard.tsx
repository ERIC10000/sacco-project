import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface DashboardStats {
  totalMembers: number
  activeLoans: number
  totalContributions: number
  pendingApprovals: number
  totalRepayments: number
  defaultRate: number
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get<DashboardStats>('/dashboard/stats').then(res => res.data.data),
  })

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  const monthlyData = [
    { month: 'Jan', contributions: 40000, repayments: 35000 },
    { month: 'Feb', contributions: 45000, repayments: 40000 },
    { month: 'Mar', contributions: 50000, repayments: 45000 },
    { month: 'Apr', contributions: 55000, repayments: 50000 },
    { month: 'May', contributions: 60000, repayments: 55000 },
    { month: 'Jun', contributions: 65000, repayments: 60000 },
  ]

  const loanStatusData = [
    { name: 'Approved', value: 45 },
    { name: 'Pending', value: 25 },
    { name: 'Rejected', value: 15 },
    { name: 'Disbursed', value: 15 },
  ]

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6']

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Members"
          value={stats?.totalMembers ?? 0}
          icon="👥"
          color="primary"
        />
        <StatCard
          title="Active Loans"
          value={stats?.activeLoans ?? 0}
          icon="💰"
          color="success"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals ?? 0}
          icon="📋"
          color="warning"
        />
        <StatCard
          title="Total Contributions"
          value={`KES ${(stats?.totalContributions ?? 0).toLocaleString()}`}
          icon="📊"
          color="primary"
        />
        <StatCard
          title="Total Repayments"
          value={`KES ${(stats?.totalRepayments ?? 0).toLocaleString()}`}
          icon="✅"
          color="success"
        />
        <StatCard
          title="Default Rate"
          value={`${stats?.defaultRate ?? 0}%`}
          icon="⚠️"
          color="danger"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="contributions" stroke="#3b82f6" />
              <Line type="monotone" dataKey="repayments" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Loan Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Loan Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={loanStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {loanStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  color: 'primary' | 'success' | 'warning' | 'danger'
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 border-primary-200',
    success: 'bg-success-50 border-green-200',
    warning: 'bg-warning-50 border-yellow-200',
    danger: 'bg-danger-50 border-red-200',
  }

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  )
}
