'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session from localStorage (or cookies as fallback) on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('cwb_token');
    const storedUser = localStorage.getItem('cwb_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (_) {
        localStorage.removeItem('cwb_token');
        localStorage.removeItem('cwb_user');
        document.cookie = 'cwb_token=; path=/; max-age=0';
        document.cookie = 'cwb_user=; path=/; max-age=0';
      }
    }
    setLoading(false);
  }, []);

  const persist = (token, user) => {
    // localStorage for client reads
    localStorage.setItem('cwb_token', token);
    localStorage.setItem('cwb_user', JSON.stringify(user));
    // cookies for Edge middleware (30-day expiry, same-site lax)
    const maxAge = 60 * 60 * 24 * 30;
    document.cookie = `cwb_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `cwb_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    setToken(token);
    setUser(user);
  };

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      if (!data.success) throw new Error(data.message);
      persist(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 🚀`);
      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, [router]);

  const register = useCallback(async (formData) => {
    try {
      const { data } = await authAPI.register(formData);
      if (!data.success) throw new Error(data.message);
      persist(data.token, data.user);
      toast.success(`Account created! Welcome to CodeWithBPMCE 🎉`);
      router.push('/dashboard');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('cwb_token');
    localStorage.removeItem('cwb_user');
    // Clear cookies
    document.cookie = 'cwb_token=; path=/; max-age=0';
    document.cookie = 'cwb_user=; path=/; max-age=0';
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authAPI.me();
      if (data.success) {
        const updatedUser = data.user;
        setUser(updatedUser);
        // Sync localStorage
        localStorage.setItem('cwb_user', JSON.stringify(updatedUser));
        // Sync cookie so middleware & navbar stay in sync
        const maxAge = 60 * 60 * 24 * 30;
        document.cookie = `cwb_user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=${maxAge}; SameSite=Lax`;
      }
    } catch (_) {}
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, isAuthenticated, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
