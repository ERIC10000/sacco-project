import { api } from './api';
export const memberService = {
    getMembers: (page = 1, limit = 10) => api.get(`/members?page=${page}&limit=${limit}`),
    getMemberById: (id) => api.get(`/members/${id}`),
    createMember: (data) => api.post('/members', data),
    updateMember: (id, data) => api.put(`/members/${id}`, data),
    deleteMember: (id) => api.delete(`/members/${id}`),
    searchMembers: (query) => api.get(`/members/search?q=${query}`),
    deactivateMember: (id) => api.patch(`/members/${id}/deactivate`, {}),
    getMemberContributions: (memberId) => api.get(`/members/${memberId}/contributions`),
    getMemberLoans: (memberId) => api.get(`/members/${memberId}/loans`),
};
