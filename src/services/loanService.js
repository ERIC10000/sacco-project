import { api } from './api';
export const loanService = {
    getLoanApplications: (page = 1, limit = 10) => api.get(`/loans?page=${page}&limit=${limit}`),
    getLoanApplicationById: (id) => api.get(`/loans/${id}`),
    createLoanApplication: (data) => api.post('/loans', data),
    approveLoan: (id, data) => api.patch(`/loans/${id}/approve`, data),
    rejectLoan: (id, data) => api.patch(`/loans/${id}/reject`, data),
    getLoanRepayments: (loanId) => api.get(`/loans/${loanId}/repayments`),
    recordRepayment: (loanId, data) => api.post(`/loans/${loanId}/repayments`, data),
    getLoansByStatus: (status) => api.get(`/loans?status=${status}`),
};
