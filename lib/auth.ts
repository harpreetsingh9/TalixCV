import { createClient } from './supabase/client';

export interface AuthUser {
  userId: string;
  userName: string;
  email: string;
}

export const authUtils = {
  // Get current user from supabase
  async getCurrentUser(): Promise<AuthUser | null> {
    if (typeof window === 'undefined') return null;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      userId: user.id,
      userName: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
    };
  },

  //sign up with email pass
  async signUp(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: AuthUser | null; error: string | null }> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Sign up failed' };
    }

    //create user record in profiles table
    const { error: dbError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name: name,
      email: email,
    });

    if (dbError) {
      console.error('Error creating user record:', dbError);
    }

    return {
      user: {
        userId: data.user.id,
        userName: name,
        email: email,
      },
      error: null,
    };
  },

  //sign in with email and password
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: AuthUser | null; error: string | null }> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Sign in failed' };
    }

    return {
      user: {
        userId: data.user.id,
        userName:
          data.user.user_metadata?.name ||
          data.user.email?.split('@')[0] ||
          'User',
        email: data.user.email || '',
      },
      error: null,
    };
  },

  // Sign in with Google (ready for future implementation)
  async signInWithGoogle(): Promise<{ error: string | null }> {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  async logout(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
  },

  //check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  },

  //get supabase session
  async getSession() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },
};
