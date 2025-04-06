// src/context/AuthContext.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { authService } from "../services/api";
import {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  ApiResponse,
} from "../types";
import { AuthContext } from "./AuthContextValue";

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  const loadUser = async () => {
    // Only try to load user if token exists in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setAuthState((prev) => ({ ...prev, loading: true }));
      const userData = (await authService.getMe()) as ApiResponse<User>;
      setAuthState({
        user: userData.data,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error loading user:", error);
      // Clear token if it's invalid
      localStorage.removeItem("token");
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const response = (await authService.login(credentials)) as ApiResponse<{
        token: string;
        user: User;
      }>;
      localStorage.setItem("token", response.data.token);
      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const response = (await authService.register(data)) as ApiResponse<{
        token: string;
        user: User;
      }>;
      localStorage.setItem("token", response.data.token);
      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      setAuthState((prev) => ({
        ...prev,
        user: { ...prev.user!, ...userData },
      }));
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{ authState, login, register, logout, updateUser, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
