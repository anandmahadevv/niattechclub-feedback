import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface CustomUser {
  id: number;
  email: string;
  name: string;
  roll_number: string;
  department: string;
  bio: string;
  github_username?: string | null;
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
  signInWithProvider: (provider: "google" | "github") => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2 months in milliseconds (60 days)
const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;

        if (session) {
          const email = session.user.email;
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "Anonymous";
          const github_username = session.user.user_metadata?.preferred_username || null;

          const { data: existingUser } = await supabase
            .from("users_auth")
            .select("*")
            .eq("email", email)
            .single();

          if (existingUser) {
            setUser(existingUser);
            localStorage.setItem("auth_user", JSON.stringify(existingUser));
          } else {
            const { data: newUser, error } = await supabase.from("users_auth").insert({
              email: email,
              password: "social_login_dummy",
              name: name,
              roll_number: "N/A",
              department: "N/A",
              bio: "Logged in via social provider.",
              github_username: github_username
            }).select().single();

            if (!error && newUser) {
              setUser(newUser);
              localStorage.setItem("auth_user", JSON.stringify(newUser));
            }
          }
        } else {
          const storedUser = localStorage.getItem("auth_user");
          const loginTimeStr = localStorage.getItem("auth_login_time");

          if (storedUser && loginTimeStr) {
            const loginTime = parseInt(loginTimeStr, 10);
            if (!isNaN(loginTime) && Date.now() - loginTime > TWO_MONTHS_MS) {
              localStorage.removeItem("auth_user");
              localStorage.removeItem("auth_login_time");
              setUser(null);
            } else {
              setUser(JSON.parse(storedUser));
            }
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

  const signOut = async () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_login_time");
    setUser(null);
    await supabase.auth.signOut().catch(console.error);
  };

  const resetPassword = async (email: string, newPassword: string): Promise<void> => {
    // Note: This relies on the 'Allow Public Update' RLS policy on users_auth
    const { error } = await supabase
      .from("users_auth")
      .update({ password: newPassword })
      .eq("email", email.toLowerCase());

    if (error) {
      throw new Error(error.message || "Failed to reset password");
    }
  };

  const updateLocalUser = (updatedUser: CustomUser) => {
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const signInWithProvider = async (provider: "google" | "github"): Promise<void> => {
    const options: any = {
      redirectTo: window.location.origin + window.location.pathname,
    };
    if (provider === "github") {
      options.scopes = "read:user user:email";
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider, options });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateLocalUser, signInWithProvider, resetPassword }}>
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
