import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import * as api from '../api';
import { isJwtExpired } from '../utils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const accessTokenRef = useRef(null);
  const refreshTokenRef = useRef(localStorage.getItem('refresh_token'));

  const getAccessToken = useCallback(() => accessTokenRef.current, []);

  const clearAuth = useCallback(() => {
    accessTokenRef.current = null;
    refreshTokenRef.current = null;
    setUser(null);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('last_route');
    localStorage.removeItem('last_route_params');
  }, []);

  const saveUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const setTokens = useCallback((accessToken, refreshToken) => {
    accessTokenRef.current = accessToken;
    refreshTokenRef.current = refreshToken;
    localStorage.setItem('refresh_token', refreshToken);
  }, []);

  const refreshAuth = useCallback(async () => {
    const token = refreshTokenRef.current;
    if (!token) return false;
    try {
      const response = await api.refreshToken(token);
      accessTokenRef.current = response.access_token;
      return true;
    } catch {
      return false;
    }
  }, []);

  // Wire API with auth callbacks once
  useEffect(() => {
    api.configureAuth({
      getToken: () => accessTokenRef.current,
      onRefresh: refreshAuth,
      onExpired: clearAuth,
    });
  }, [refreshAuth, clearAuth]);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const storedToken = refreshTokenRef.current;
      if (!storedToken || isJwtExpired(storedToken)) {
        clearAuth();
        setLoading(false);
        return;
      }
      try {
        const res = await api.refreshToken(storedToken);
        accessTokenRef.current = res.access_token;
        const userData = await api.getCurrentUser();
        saveUser(userData.profile || userData);
      } catch {
        clearAuth();
      }
      setLoading(false);
    };
    restore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.login(email, password);
      setTokens(res.access_token, res.refresh_token);
      saveUser(res.user);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [setTokens, saveUser]);

  const logout = useCallback(async () => {
    try {
      if (refreshTokenRef.current) await api.logout(refreshTokenRef.current);
    } catch { /* ignore */ }
    clearAuth();
  }, [clearAuth]);

  const register = useCallback(async (name, email, password) => {
    try {
      const res = await api.register(name, email, password);
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    try {
      const res = await api.verifyEmail(token);
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    try {
      const res = await api.requestPasswordReset(email);
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      const res = await api.resetPassword(token, newPassword);
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    try {
      const res = await api.resendVerificationEmail(email);
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!accessTokenRef.current && !!refreshTokenRef.current;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
        resendVerification,
        isAuthenticated,
        saveUser,
        setTokens,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
