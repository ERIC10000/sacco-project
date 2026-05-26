export interface User {
  id: string
  username: string
  email: string
  role: 'ADMIN' | 'STAFF' | 'MEMBER'
  createdAt: string
  updatedAt: string
}

export interface Member {
  id: string
  membershipNumber: string
  firstName: string
  lastName: string
  nationalId: string
  email: string
  phone: string
  address: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  dateJoined: string
  totalContributions: number
  createdAt: string
  updatedAt: string
}

export interface Contribution {
  id: string
  memberId: string
  amount: number
  contributionDate: string
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE'
  transactionReference: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
}

export interface LoanApplication {
  id: string
  memberId: string
  requestedAmount: number
  approvedAmount: number | null
  interestRate: number
  loanTerm: number
  purpose: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED'
  applicationDate: string
  approvalDate: string | null
  createdAt: string
  updatedAt: string
}

export interface LoanRepayment {
  id: string
  loanId: string
  memberId: string
  repaymentAmount: number
  paymentDate: string
  penalties: number
  remainingBalance: number
  status: 'PENDING' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  recipientId: string
  title: string
  message: string
  type: 'REMINDER' | 'LOAN_UPDATE' | 'ANNOUNCEMENT'
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface FinancialReport {
  id: string
  reportType: 'MONTHLY' | 'ANNUAL' | 'QUARTERLY'
  reportingPeriod: string
  generatedBy: string
  generatedAt: string
  totalMembers: number
  totalContributions: number
  totalLoans: number
  exportedFilePath: string | null
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
