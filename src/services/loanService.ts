import { api } from './api'
import { LoanApplication, LoanRepayment, PaginatedResponse } from '@/types'

export const loanService = {
  getLoanApplications: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<LoanApplication>>(`/loans?page=${page}&limit=${limit}`),

  getLoanApplicationById: (id: string) =>
    api.get<LoanApplication>(`/loans/${id}`),

  createLoanApplication: (data: Partial<LoanApplication>) =>
    api.post<LoanApplication>('/loans', data),

  approveLoan: (id: string, data: { approvedAmount: number; interestRate: number; loanTerm: number }) =>
    api.patch<LoanApplication>(`/loans/${id}/approve`, data),

  rejectLoan: (id: string, data: { reason: string }) =>
    api.patch<LoanApplication>(`/loans/${id}/reject`, data),

  getLoanRepayments: (loanId: string) =>
    api.get<PaginatedResponse<LoanRepayment>>(`/loans/${loanId}/repayments`),

  recordRepayment: (loanId: string, data: Partial<LoanRepayment>) =>
    api.post<LoanRepayment>(`/loans/${loanId}/repayments`, data),

  getLoansByStatus: (status: string) =>
    api.get<PaginatedResponse<LoanApplication>>(`/loans?status=${status}`),
}
