import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StudentUser } from '../types/user/user.types';

interface AuthState {
  user: StudentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: StudentUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        window.location.href = "/";
      },
    }),
    {
      name: 'urban-classes-admin-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
