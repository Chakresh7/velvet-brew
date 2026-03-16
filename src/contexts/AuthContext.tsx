import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isNewSignup: boolean;
  setIsNewSignup: (v: boolean) => void;
  signOut: () => Promise<void>;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewSignup, setIsNewSignup] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN") {
        setAuthModalOpen(false);
      }
      if (event === "SIGNED_OUT") {
        setIsNewSignup(false);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  return (
    <AuthContext.Provider value={{ user, session, loading, isNewSignup, setIsNewSignup, signOut, authModalOpen, openAuthModal, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
