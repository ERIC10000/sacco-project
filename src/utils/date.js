import { format, parseISO, differenceInDays } from 'date-fns';
export const formatDate = (date) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM dd, yyyy');
};
export const formatDateTime = (date) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM dd, yyyy HH:mm');
};
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
    }).format(amount);
};
export const daysUntil = (date) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return differenceInDays(d, new Date());
};
