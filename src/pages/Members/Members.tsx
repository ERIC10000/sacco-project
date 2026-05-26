import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { memberService } from '@/services/memberService'
import { Member } from '@/types'

export default function Members() {
  const [page, setPage] = useState(1)
  const { data: response, isLoading } = useQuery({
    queryKey: ['members', page],
    queryFn: () => memberService.getMembers(page, 10).then(res => res.data.data),
  })

  if (isLoading) {
    return <div className="p-6">Loading members...</div>
  }

  const members = response?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Members</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Membership #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map((member: Member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {member.firstName} {member.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.membershipNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.status === 'ACTIVE'
                      ? 'bg-success-50 text-green-700'
                      : 'bg-danger-50 text-red-700'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-primary-600 hover:text-primary-700">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
