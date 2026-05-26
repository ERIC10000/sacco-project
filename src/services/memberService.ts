import { api } from './api'
import { Member, ApiResponse, PaginatedResponse } from '@/types'

export const memberService = {
  getMembers: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Member>>(`/members?page=${page}&limit=${limit}`),

  getMemberById: (id: string) =>
    api.get<Member>(`/members/${id}`),

  createMember: (data: Partial<Member>) =>
    api.post<Member>('/members', data),

  updateMember: (id: string, data: Partial<Member>) =>
    api.put<Member>(`/members/${id}`, data),

  deleteMember: (id: string) =>
    api.delete<void>(`/members/${id}`),

  searchMembers: (query: string) =>
    api.get<PaginatedResponse<Member>>(`/members/search?q=${query}`),

  deactivateMember: (id: string) =>
    api.patch<Member>(`/members/${id}/deactivate`, {}),

  getMemberContributions: (memberId: string) =>
    api.get(`/members/${memberId}/contributions`),

  getMemberLoans: (memberId: string) =>
    api.get(`/members/${memberId}/loans`),
}
