// Type definitions for Supabase authentication

export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: unknown;
  };
};

export type SupabaseSession = {
  user: SupabaseUser;
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
};

export type AuthContextValue = {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};
