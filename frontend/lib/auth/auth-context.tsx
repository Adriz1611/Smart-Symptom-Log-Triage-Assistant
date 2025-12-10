"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth";
import { User, LoginCredentials, RegisterData } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session (client-side only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (error) {
          console.error("Failed to parse user data:", error);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        router.push("/dashboard");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log("Attempting registration with:", {
        ...data,
        password: "[REDACTED]",
      });
      const response = await authApi.register(data);
      console.log("Registration response:", response);
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration error details:", error);
      console.error("Error response:", error.response?.data);

      // Handle validation errors from backend
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const errorMessages = error.response.data.errors
          .map((err: any) => err.message)
          .join(", ");
        throw new Error(errorMessages);
      }

      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Registration failed";
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
