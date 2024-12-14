import { useState } from 'react';
import authService from '../services/authService';

interface LoginCredentials {
    email: string;
    password: string;
}

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(credentials);
            return response;
        } catch (err: any) {
            setError(err?.meta?.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};

export default useAuth;
