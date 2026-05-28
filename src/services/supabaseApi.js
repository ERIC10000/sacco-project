/**
 * Supabase-backed API layer for the dashboard.
 *
 * Every function here mirrors the shape of the existing demo-data services
 * so screens can swap from demo → live with a single import change.
 */
import { supabase, subscribeToTable } from '@/lib/supabase';
// ╔══════════════════════════ MEMBERS ════════════════════════════╗
export const membersApi = {
    list: async ({ search, status, limit = 50, offset = 0 } = {}) => {
        let q = supabase
            .from('v_member_summary')
            .select('*', { count: 'exact' })
            .order('joined_at', { ascending: false })
            .range(offset, offset + limit - 1);
        if (status && status !== 'ALL')
            q = q.eq('status', status);
        if (search)
            q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,membership_no.ilike.%${search}%,phone.ilike.%${search}%`);
        return q;
    },
    get: (id) => supabase.from('v_member_summary').select('*').eq('id', id).single(),
    create: (input) => supabase.from('members').insert(input).select().single(),
    update: (id, patch) => supabase.from('members').update(patch).eq('id', id).select().single(),
    remove: (id) => supabase.from('members').delete().eq('id', id),
    creditScore: (id) => supabase.from('v_member_credit_score').select('credit_score').eq('member_id', id).single(),
};
// ╔════════════════════ PENDING REGISTRATIONS ═══════════════════════╗
export const registrationsApi = {
    /** Members the mobile app self-registered that need admin approval. */
    pending: (saccoId) => supabase.from('v_pending_registrations')
        .select('*')
        .eq('sacco_id', saccoId)
        .order('created_at', { ascending: false }),
    approve: (memberId) => supabase.rpc('approve_member', { p_member_id: memberId }),
    reject: (memberId, reason) => supabase.rpc('reject_member', { p_member_id: memberId, p_reason: reason }),
    /** Live updates whenever a member self-registers. */
    subscribePending: (saccoId, cb) => subscribeToTable('members', `sacco_id=eq.${saccoId}`, cb),
};
// ╔════════════════════════ TRANSACTIONS ═════════════════════════╗
export const transactionsApi = {
    list: ({ memberId, type, limit = 50 } = {}) => {
        let q = supabase.from('transactions').select('*').order('occurred_at', { ascending: false }).limit(limit);
        if (memberId)
            q = q.eq('member_id', memberId);
        if (type)
            q = q.eq('txn_type', type);
        return q;
    },
    /** Atomically records a contribution + updates balance via SQL function. */
    recordContribution: (memberId, amount, method, reference, description) => supabase.rpc('process_contribution', {
        p_member_id: memberId,
        p_amount: amount,
        p_method: method,
        p_reference: reference,
        p_description: description ?? 'Member contribution',
    }),
    subscribeForSacco: (saccoId, cb) => subscribeToTable('transactions', `sacco_id=eq.${saccoId}`, cb),
};
// ╔════════════════════════════ LOANS ═════════════════════════════╗
export const loansApi = {
    list: ({ status, limit = 50 } = {}) => {
        let q = supabase.from('v_loan_portfolio').select('*').order('applied_at', { ascending: false }).limit(limit);
        if (status && status !== 'ALL')
            q = q.eq('status', status);
        return q;
    },
    get: (id) => supabase.from('v_loan_portfolio').select('*').eq('id', id).single(),
    apply: (input) => supabase.from('loans').insert({ ...input, status: 'PENDING' }).select().single(),
    approve: (loanId, approvedAmount) => supabase.rpc('approve_loan', { p_loan_id: loanId, p_approved_amount: approvedAmount ?? null }),
    reject: (loanId, reason) => supabase.from('loans').update({
        status: 'REJECTED', rejected_at: new Date().toISOString(), rejection_reason: reason,
    }).eq('id', loanId).select().single(),
    disburse: (loanId) => supabase.rpc('disburse_loan', { p_loan_id: loanId }),
    pendingForSacco: (saccoId) => supabase.from('v_loan_portfolio').select('*')
        .eq('sacco_id', saccoId).eq('status', 'PENDING')
        .order('applied_at'),
};
// ╔══════════════════════════ DIVIDENDS ═══════════════════════════╗
export const dividendsApi = {
    forMember: (memberId) => supabase.from('v_dividend_history').select('*')
        .eq('member_id', memberId)
        .order('period_start', { ascending: false }),
    estimate: (shares, annualRate, sharePrice) => supabase.rpc('calculate_dividend', {
        p_shares: shares, p_annual_rate_pct: annualRate, p_share_price: sharePrice,
    }),
    declarePeriod: (saccoId, label, start, end, rate) => supabase.from('dividend_periods').insert({
        sacco_id: saccoId, period_label: label, period_start: start, period_end: end,
        annual_rate_pct: rate, status: 'PENDING',
    }).select().single(),
};
// ╔═══════════════════════ NOTIFICATIONS ══════════════════════════╗
export const notificationsApi = {
    list: () => supabase.from('notifications').select('*')
        .order('created_at', { ascending: false }).limit(50),
    markRead: (id) => supabase.from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id),
    markAllRead: (memberId) => supabase.from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('member_id', memberId).eq('is_read', false),
    /** Live push when a new notification arrives for this member. */
    subscribe: (memberId, cb) => subscribeToTable('notifications', `member_id=eq.${memberId}`, (p) => cb(p.new)),
};
// ╔══════════════════════ SAVINGS GOALS ═══════════════════════════╗
export const goalsApi = {
    forMember: (memberId) => supabase.from('savings_goals').select('*')
        .eq('member_id', memberId).order('created_at', { ascending: false }),
    create: (input) => supabase.from('savings_goals').insert(input).select().single(),
    update: (id, patch) => supabase.from('savings_goals').update(patch).eq('id', id).select().single(),
};
// ╔══════════════════════════ DASHBOARD ═══════════════════════════╗
export const dashboardApi = {
    /** One-shot fetch of all the figures the home dashboard needs. */
    stats: async (saccoId) => {
        const [members, loans, contribsTotal, pending] = await Promise.all([
            supabase.from('members').select('id', { count: 'exact', head: true }).eq('sacco_id', saccoId),
            supabase.from('loans').select('id', { count: 'exact', head: true }).eq('sacco_id', saccoId).eq('status', 'DISBURSED'),
            supabase.from('transactions').select('amount').eq('sacco_id', saccoId).eq('txn_type', 'CONTRIBUTION').eq('status', 'COMPLETED'),
            supabase.from('loans').select('id', { count: 'exact', head: true }).eq('sacco_id', saccoId).eq('status', 'PENDING'),
        ]);
        return {
            totalMembers: members.count ?? 0,
            activeLoans: loans.count ?? 0,
            totalContributions: (contribsTotal.data ?? []).reduce((s, r) => s + Number(r.amount), 0),
            pendingApprovals: pending.count ?? 0,
        };
    },
    monthlyContributions: (saccoId) => supabase.from('v_monthly_contributions').select('*')
        .eq('sacco_id', saccoId)
        .order('month', { ascending: true }).limit(12),
};
