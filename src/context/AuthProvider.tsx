// src/context/AuthProvider.tsx
"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchWithAuth } from "@/lib/apiClient";
import type { SupabaseUser, SupabaseSession, AuthContextValue } from "@/types/supabase";

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [session, setSession] = React.useState<SupabaseSession | null>(null);
  const [loading, setLoading] = React.useState(true);

  const syncProfile = async (sess: SupabaseSession) => {
    try {
      await fetchWithAuth("/api/v1/profiles/sync", {
        method: "POST",
        body: JSON.stringify({
          id: sess.user.id,
          email: sess.user.email,
        }),
      });
    } catch {
      // не критично
    }
  };

  React.useEffect(() => {
    // Явно указываем тип для session из getSession()
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: SupabaseSession | null } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session) syncProfile(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: SupabaseSession | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session) syncProfile(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string) => {
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};