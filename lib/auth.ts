import { v4 as uuidv4 } from 'uuid';

export interface AuthUser {
  userId: string;
  userName: string;
}

const AUTH_KEY = 'resume_builder_auth';

export const authUtils = {
  // Get current user from localStorage
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Login/Signup with just a name
  authenticate(userName: string): AuthUser {
    const user: AuthUser = {
      userId: uuidv4(),
      userName: userName.trim(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
    return user;
  },

  // Logout
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
