"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearAccessToken,
  getAccessToken,
} from "@/lib/auth-session";
import { authService } from "@/services/auth-service";
import type { UserResponse } from "@/services/auth-service";

type AuthStatus = "loading" | "authenticated" | "anonymous" | "error";

interface AuthContextValue {
  user: UserResponse | null;
  status: AuthStatus;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [authError, setAuthError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setStatus("loading");
    setAuthError(null);

    try {
      const token = getAccessToken();

      if (!token) {
        setUser(null);
        setStatus("anonymous");
        return;
      }

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
    } catch (error) {
      setUser(null);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setAuthError(null);
        setStatus("anonymous");
        return;
      }

      setAuthError(
        authService.getErrorMessage(
          error,
          "Unable to restore your sign-in session.",
        ),
      );
      setStatus("error");
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const currentUser = await authService.login({ email, password });
    setUser(currentUser);
    setAuthError(null);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setAuthError(null);
    setStatus("anonymous");
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => {
      setUser(null);
      setAuthError(null);
      setStatus("anonymous");
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);
    const restoreTimer = window.setTimeout(() => {
      void refreshUser();
    }, 0);

    return () => {
      window.clearTimeout(restoreTimer);
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleExpiredSession,
      );
    };
  }, [refreshUser]);

  const value = useMemo(
    () => ({ user, status, authError, login, logout, refreshUser }),
    [user, status, authError, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

export { AuthProvider, useAuth };
