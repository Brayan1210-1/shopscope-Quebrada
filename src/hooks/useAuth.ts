import { useState, useCallback } from 'react';
import type { AuthResponse } from '../types/types';

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('shopscope_token'));

    const login = async (username: string, password: string): Promise<void> => {
        const res = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) throw new Error('Credenciales inválidas');

        const data: AuthResponse = await res.json();
        localStorage.setItem('shopscope_token', data.accessToken);
        setToken(data.accessToken);
    };

    const logout = useCallback(() => {
        localStorage.removeItem('shopscope_token');
        setToken(null);
    }, []);

    return { token, login, logout };
};