'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // On mount, try to fetch current user from server using cookie-based auth (server-set httpOnly cookie)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await authAPI.me();
        if (data?.success && mounted) {
          setUser(data.user);
          // persist user for UI across reloads (non-sensitive)
          localStorage.setItem('cwb_user', JSON.stringify(data.user));
        }
      } catch (_) {
        // clear stale client state
        localStorage.removeItem('cwb_user');
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const persist = (user) => {
    // Only persist user object client-side; token is managed via httpOnly cookie set by server
    localStorage.setItem('cwb_user', JSON.stringify(user));
    setUser(user);
  };

  const waitForCookieSync = async (attempts = 5, delayMs = 250) => {
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await authAPI.me();
        if (res?.data?.success) return res.data.user;
      } catch (_) {}
      // exponential backoff-ish
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
    return null;
  };

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      if (!data.success) throw new Error(data.message);
      // server sets httpOnly cookie; wait until server-set cookie is visible to backend by calling /me
      const syncedUser = await waitForCookieSync();
      const finalUser = syncedUser || data.user;
      persist(finalUser);
      toast.success(`Welcome back, ${finalUser.name.split(' ')[0]}! 🚀`);
      // Redirect based on role
      const targetPath = finalUser.role === 'admin' ? '/admin' : '/dashboard';
      try {
        const { data } = await authAPI.login({
          email,
          password,
        });

        if (!data.success) {
          throw new Error(data.message || 'Login failed');
        }

        // Save token + user first
        persist(data.token, data.user);

        toast.success(
          `Welcome back, ${data.user.name.split(' ')[0]}!`
        );

        // Decide destination
        const targetPath =
          data.user.role === 'admin'
            ? '/admin'
            : '/dashboard';

        /*
         * Use full browser navigation instead of router.replace().
         *
         * This makes sure Next.js middleware receives the
         * newly-created authentication cookies.
         */
        window.location.href = targetPath;

        return {
          success: true,
          user: data.user,
        };
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Login failed';

        toast.error(msg);

        return {
          success: false,
          message: msg,
        };
      }
      return { success: true, user: finalUser };
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
      // server sets httpOnly cookie; wait until cookie is visible to backend by calling /me
      const syncedUser = await waitForCookieSync();
      const finalUser = syncedUser || data.user;
      persist(finalUser);
      toast.success(`Account created! Welcome to CodeWithBPMCE 🎉`);
      router.push('/dashboard');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      // Tell server to clear httpOnly cookie, then clear client-side state
      await authAPI.logout();
    } catch (_) {
      // ignore errors from logout call
    }
    localStorage.removeItem('cwb_user');
    // Clear any client cookies for fallback (best-effort)
    document.cookie = 'cwb_token=; path=/; max-age=0';
    document.cookie = 'cwb_user=; path=/; max-age=0';
    setUser(null);

    toast.success('Logged out successfully');

    router.push('/');
  }, [router]);

  // Refresh current user
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authAPI.me();

      if (data.success) {
        const updatedUser = data.user;

        setUser(updatedUser);
        // Sync localStorage
        localStorage.setItem('cwb_user', JSON.stringify(updatedUser));
        // Server sets cwb_user cookie; no need to set it from client.
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isAuthenticated, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return ctx;
}