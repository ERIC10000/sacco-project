import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';
export default function MemberDetail() {
    const { id } = useParams();
    const { data: member, isLoading } = useQuery({
        queryKey: ['member', id],
        queryFn: () => memberService.getMemberById(id).then(res => res.data.data),
    });
    if (isLoading)
        return _jsx("div", { children: "Loading..." });
    if (!member)
        return _jsx("div", { children: "Member not found" });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: [member.firstName, " ", member.lastName] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Member Information" }), _jsxs("dl", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-600", children: "Membership Number" }), _jsx("dd", { className: "text-gray-900 font-medium", children: member.membershipNumber })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-600", children: "National ID" }), _jsx("dd", { className: "text-gray-900 font-medium", children: member.nationalId })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-600", children: "Email" }), _jsx("dd", { className: "text-gray-900 font-medium", children: member.email })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-600", children: "Phone" }), _jsx("dd", { className: "text-gray-900 font-medium", children: member.phone })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-600", children: "Status" }), _jsx("dd", { children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${member.status === 'ACTIVE'
                                                    ? 'bg-success-50 text-green-700'
                                                    : 'bg-danger-50 text-red-700'}`, children: member.status }) })] })] })] }) })] }));
}
