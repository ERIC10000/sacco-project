import { api } from './api'
import { Contribution, PaginatedResponse } from '@/types'

export const contributionService = {
  getContributions: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Contribution>>(`/contributions?page=${page}&limit=${limit}`),

  getContributionById: (id: string) =>
    api.get<Contribution>(`/contributions/${id}`),

  recordContribution: (data: Partial<Contribution>) =>
    api.post<Contribution>('/contributions', data),

  getContributionsByMember: (memberId: string) =>
    api.get<PaginatedResponse<Contribution>>(`/contributions?memberId=${memberId}`),

  getContributionsByStatus: (status: string) =>
    api.get<PaginatedResponse<Contribution>>(`/contributions?status=${status}`),

  updateContribution: (id: string, data: Partial<Contribution>) =>
    api.put<Contribution>(`/contributions/${id}`, data),
}
