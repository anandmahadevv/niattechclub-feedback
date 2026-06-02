import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2 months in milliseconds (60 days)
const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session expiration
  const checkSessionExpiration = async () => {
    const loginTimeStr = localStorage.getItem("auth_login_time");
    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      if (!isNaN(loginTime) && Date.now() - loginTime > TWO_MONTHS_MS) {
        // Session expired (2 months limit reached)
        console.warn("Session expired (2 months limit reached). Logging out.");
        await supabase.auth.signOut();
        localStorage.removeItem("auth_login_time");
        setUser(null);
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    // 1. Initial session retrieval
    const initSession = async () => {
      try {
        const isExpired = await checkSessionExpiration();
        if (isExpired) {
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          // Set login time if it's missing but we have a session
          if (!localStorage.getItem("auth_login_time")) {
            localStorage.setItem("auth_login_time", Date.now().toString());
          }
        }
      } catch (err) {
        console.error("Error checking initial session:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // If it's a fresh sign in, set the timestamp
        if (event === "SIGNED_IN") {
          localStorage.setItem("auth_login_time", Date.now().toString());
        }

        // Run validation
        const isExpired = await checkSessionExpiration();
        if (!isExpired) {
          setUser(session.user);
        }
      } else {
        setUser(null);
        localStorage.removeItem("auth_login_time");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("auth_login_time");
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
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
