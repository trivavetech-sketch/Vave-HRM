"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// ── Hardcoded demo credentials ──
const DEMO_EMAIL = "admin@vave.com";
const DEMO_PASSWORD = "password123";
const DEMO_USER = {
  name: "Neha Sharma",
  email: DEMO_EMAIL,
  role: "Tenant Administrator",
  initials: "NS",
  tenantId: "tenant_09ef182b",
};

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  initials: string;
  tenantId: string;
}

interface RegisteredUser {
  name: string;
  email: string;
  password: string;
  registeredAt: string;
}

interface RegisterResult {
  success: boolean;
  error?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
  justRegistered?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (name: string, email: string, password: string) => Promise<RegisterResult>;
  logout: () => void;
}

const AUTH_USER_KEY = "vave_auth_user";
const REGISTERED_USERS_KEY = "vave_registered_users";

const AuthContext = createContext<AuthContextType | null>(null);

/** Load registered users array from localStorage */
function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save registered users array to localStorage */
function saveRegisteredUsers(users: RegisteredUser[]) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

/** Build initials from a name string */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // ── Login ──
  const login = async (email: string, password: string): Promise<LoginResult> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const normalizedEmail = email.toLowerCase().trim();

    // 1) Check hardcoded demo account
    if (normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const userData: AuthUser = { ...DEMO_USER, email: DEMO_EMAIL };
      setUser(userData);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      return { success: true };
    }

    // 2) Check registered users from localStorage
    const registered = getRegisteredUsers();
    const match = registered.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (match && match.password === password) {
      const userData: AuthUser = {
        name: match.name,
        email: match.email,
        role: "Tenant Administrator",
        initials: getInitials(match.name),
        tenantId: `tenant_${Math.random().toString(36).slice(2, 10)}`,
      };
      setUser(userData);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      return { success: true };
    }

    if (match) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    return {
      success: false,
      error: "No account found with this email. Please register or use admin@vave.com / password123",
    };
  };

  // ── Register ──
  const register = async (name: string, email: string, password: string): Promise<RegisterResult> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const normalizedEmail = email.toLowerCase().trim();

    // Validate inputs
    if (!name.trim()) return { success: false, error: "Name is required." };
    if (!normalizedEmail) return { success: false, error: "Email is required." };
    if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

    // Check for duplicate (including demo account)
    if (normalizedEmail === DEMO_EMAIL) {
      return { success: false, error: "This email is already registered as a demo account." };
    }

    const registered = getRegisteredUsers();
    if (registered.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: "An account with this email already exists. Please sign in." };
    }

    // Save new user
    const newUser: RegisteredUser = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      registeredAt: new Date().toISOString(),
    };
    saveRegisteredUsers([...registered, newUser]);

    // Auto-login after registration
    const userData: AuthUser = {
      name: newUser.name,
      email: newUser.email,
      role: "Tenant Administrator",
      initials: getInitials(newUser.name),
      tenantId: `tenant_${Math.random().toString(36).slice(2, 10)}`,
    };
    setUser(userData);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));

    return { success: true };
  };

  // ── Logout ──
  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
