import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
export const useAuth = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const loginMutation = useMutation({
        mutationFn: (credentials) => authService.login(credentials).then(res => res.data.data),
        onSuccess: (data) => {
            authService.setToken(data.token);
            authService.setUser(data.user);
            navigate('/dashboard');
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Login failed');
        },
    });
    const logout = () => {
        authService.logout();
        navigate('/login');
    };
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    return {
        login: loginMutation.mutate,
        logout,
        isAuthenticated,
        user,
        isLoading: loginMutation.isPending,
        error,
    };
};
