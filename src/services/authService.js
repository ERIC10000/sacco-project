import { api } from './api';
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    setToken: (token) => {
        localStorage.setItem('token', token);
    },
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },
    getToken: () => {
        return localStorage.getItem('token');
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};
