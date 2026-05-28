export const APP_NAME = 'SACCO Management System';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const MEMBER_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
};
export const LOAN_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    DISBURSED: 'DISBURSED',
};
export const CONTRIBUTION_STATUS = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
};
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    MEMBER: 'MEMBER',
};
export const PAYMENT_METHODS = {
    CASH: 'CASH',
    BANK_TRANSFER: 'BANK_TRANSFER',
    CHEQUE: 'CHEQUE',
};
export const REPORT_TYPES = {
    MONTHLY: 'MONTHLY',
    QUARTERLY: 'QUARTERLY',
    ANNUAL: 'ANNUAL',
};
