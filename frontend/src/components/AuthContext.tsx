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
  signInWithProvider: (provider: "google" | "github") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2 months in milliseconds (60 days)
const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync native Supabase session with our CustomUser flow
  const syncSocialLogin = async (session: any) => {
    if (!session || !session.user) return;
    
    const email = session.user.email;
    const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "Anonymous";
    
    // Check if user exists in custom table
    const { data: existingUser } = await supabase
      .from("users_auth")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    let authenticatedUser: CustomUser;

    if (existingUser) {
      authenticatedUser = existingUser;
    } else {
      // Create placeholder record for social login user
      const { data: newUser, error } = await supabase
        .from("users_auth")
        .insert({
          email: email.toLowerCase(),
          password: "social_login_dummy", // Placeholder for NOT NULL constraint
          name: name,
          roll_number: "N/A",
          department: "N/A",
          bio: "Logged in via social provider.",
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error creating custom user for social login:", error);
        return;
      }
      authenticatedUser = newUser;
    }

    localStorage.setItem("auth_user", JSON.stringify(authenticatedUser));
    localStorage.setItem("auth_login_time", Date.now().toString());
    setUser(authenticatedUser);
  };

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

    // Listen for native Supabase auth changes (e.g., returning from Google/GitHub)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        await syncSocialLogin(session);
      }
    });

    // Check if there is already a native session (just returned from redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        syncSocialLogin(session);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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

  const signInWithProvider = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + window.location.pathname, // Redirect back to current page
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_login_time");
    setUser(null);
    // Also sign out from native Supabase if there was an active session
    await supabase.auth.signOut().catch(console.error);
  };

  const updateLocalUser = (updatedUser: CustomUser) => {
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateLocalUser, signInWithProvider }}>
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
