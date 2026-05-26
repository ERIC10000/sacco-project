import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { memberService } from '@/services/memberService'

export default function MemberDetail() {
  const { id } = useParams()
  const { data: member, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: () => memberService.getMemberById(id!).then(res => res.data.data),
  })

  if (isLoading) return <div>Loading...</div>
  if (!member) return <div>Member not found</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        {member.firstName} {member.lastName}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Member Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-600">Membership Number</dt>
              <dd className="text-gray-900 font-medium">{member.membershipNumber}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">National ID</dt>
              <dd className="text-gray-900 font-medium">{member.nationalId}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Email</dt>
              <dd className="text-gray-900 font-medium">{member.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Phone</dt>
              <dd className="text-gray-900 font-medium">{member.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Status</dt>
              <dd>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.status === 'ACTIVE'
                    ? 'bg-success-50 text-green-700'
                    : 'bg-danger-50 text-red-700'
                }`}>
                  {member.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
