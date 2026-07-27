import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  onboardingCompleted: boolean;
}

export interface Profile {
  _id: string;
  userId: string;
  bio?: string;
  conversationTitle?: string;
  interests: string[];
  showOnExplore: boolean;
  exploreThumbnail?: string;
  allowRandomMatching: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  setProfile: (profile: Profile) => void;
  logout: () => void;
  setOnboardingCompleted: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      profile: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      setProfile: (profile) => set({ profile }),
      logout: () => set({ token: null, user: null, profile: null, isAuthenticated: false }),
      setOnboardingCompleted: () =>
        set((state) => ({
          user: state.user ? { ...state.user, onboardingCompleted: true } : null,
        })),
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);
