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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Restore session from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('cwb_token');
      const storedUser = localStorage.getItem('cwb_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);

      localStorage.removeItem('cwb_token');
      localStorage.removeItem('cwb_user');

      document.cookie =
        'cwb_token=; path=/; max-age=0; SameSite=Lax';

      document.cookie =
        'cwb_user=; path=/; max-age=0; SameSite=Lax';
    } finally {
      setLoading(false);
    }
  }, []);

  // Save authentication data
  const persist = useCallback((authToken, authUser) => {
    // LocalStorage
    localStorage.setItem('cwb_token', authToken);
    localStorage.setItem('cwb_user', JSON.stringify(authUser));

    // Cookies for Next.js middleware
    const maxAge = 60 * 60 * 24 * 30;

    document.cookie =
      `cwb_token=${encodeURIComponent(authToken)}; ` +
      `path=/; ` +
      `max-age=${maxAge}; ` +
      `SameSite=Lax`;

    document.cookie =
      `cwb_user=${encodeURIComponent(JSON.stringify(authUser))}; ` +
      `path=/; ` +
      `max-age=${maxAge}; ` +
      `SameSite=Lax`;

    // React state
    setToken(authToken);
    setUser(authUser);
  }, []);

  // LOGIN
  const login = useCallback(
    async (email, password) => {
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
    },
    [persist]
  );

  // REGISTER
  const register = useCallback(
    async (formData) => {
      try {
        const { data } = await authAPI.register(formData);

        if (!data.success) {
          throw new Error(
            data.message || 'Registration failed'
          );
        }

        /*
         * IMPORTANT:
         *
         * Do NOT persist token/user here if your intended flow is:
         *
         * Register → Login → Dashboard
         *
         * Registration should only create the account.
         */
        toast.success(
          'Account created successfully! Please login.'
        );

        router.replace('/login');

        return {
          success: true,
        };
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Registration failed';

        toast.error(msg);

        return {
          success: false,
          message: msg,
        };
      }
    },
    [router]
  );

  // LOGOUT
  const logout = useCallback(() => {
    // Remove localStorage
    localStorage.removeItem('cwb_token');
    localStorage.removeItem('cwb_user');

    // Remove cookies
    document.cookie =
      'cwb_token=; path=/; max-age=0; SameSite=Lax';

    document.cookie =
      'cwb_user=; path=/; max-age=0; SameSite=Lax';

    // Clear React state
    setToken(null);
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

        // Update localStorage
        localStorage.setItem(
          'cwb_user',
          JSON.stringify(updatedUser)
        );

        // Update cookie
        const maxAge = 60 * 60 * 24 * 30;

        document.cookie =
          `cwb_user=${encodeURIComponent(
            JSON.stringify(updatedUser)
          )}; ` +
          `path=/; ` +
          `max-age=${maxAge}; ` +
          `SameSite=Lax`;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  const isAuthenticated =
    !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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