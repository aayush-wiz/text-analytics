import { createContext } from "react";
import { AuthState, User, LoginCredentials, RegisterData } from "../types";

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export interface AuthContextProps {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  authState: initialAuthState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: () => {},
  clearError: () => {},
}); 