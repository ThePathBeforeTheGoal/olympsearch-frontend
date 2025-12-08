// src/types/supabase.ts
// Этот файл — твоя броня от всех ошибок any в проекте

export type SupabaseUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  app_metadata?: Record<string, any>;
  role?: string;
  aud?: string;
  [key: string]: any;
};

export type SupabaseSession = {
  access_token: string;
  token_type: string;
  user: SupabaseUser;
  expires_at?: number;
  [key: string]: any;
};

export type AuthContextValue = {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};