import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface CustomUser {
  id: number;
  email: string;
  name: string;
  roll_number: string;
  department: string;
  bio: string;
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<CustomUser>;
  signUp: (
    email: string,
    password: string,
    name: string,
    rollNumber: string,
    department: string,
    bio: string
  ) => Promise<void>;
  signOut: () => void;
  updateLocalUser: (updatedUser: CustomUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2 months in milliseconds (60 days)
const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = () => {
      try {
        const storedUser = localStorage.getItem("auth_user");
        const loginTimeStr = localStorage.getItem("auth_login_time");

        if (storedUser && loginTimeStr) {
          const loginTime = parseInt(loginTimeStr, 10);
          if (!isNaN(loginTime) && Date.now() - loginTime > TWO_MONTHS_MS) {
            console.warn("Custom session expired (2 months limit reached).");
            localStorage.removeItem("auth_user");
            localStorage.removeItem("auth_login_time");
            setUser(null);
          } else {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error("Error reading stored auth session:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<CustomUser> => {
    const { data, error } = await supabase.rpc("login_user", {
      email_input: email,
      password_input: password,
    });

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("Invalid email or password");
    }

    const authenticatedUser: CustomUser = data[0];

    localStorage.setItem("auth_user", JSON.stringify(authenticatedUser));
    localStorage.setItem("auth_login_time", Date.now().toString());
    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    rollNumber: string,
    department: string,
    bio: string
  ): Promise<void> => {
    const { error } = await supabase.from("users_auth").insert({
      email: email.toLowerCase(),
      password,
      name,
      roll_number: rollNumber,
      department,
      bio,
    });

    if (error) {
      if (error.message?.includes("unique constraint") || error.message?.includes("already exists")) {
        throw new Error("An account with this email address already exists.");
      }
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_login_time");
    setUser(null);
  };

  const updateLocalUser = (updatedUser: CustomUser) => {
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
