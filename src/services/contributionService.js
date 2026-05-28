import { api } from './api';
export const contributionService = {
    getContributions: (page = 1, limit = 10) => api.get(`/contributions?page=${page}&limit=${limit}`),
    getContributionById: (id) => api.get(`/contributions/${id}`),
    recordContribution: (data) => api.post('/contributions', data),
    getContributionsByMember: (memberId) => api.get(`/contributions?memberId=${memberId}`),
    getContributionsByStatus: (status) => api.get(`/contributions?status=${status}`),
    updateContribution: (id, data) => api.put(`/contributions/${id}`, data),
};
