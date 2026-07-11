import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand vs React Query, briefly: React Query owns *server* data (PGs, bookings —
// things that live in the database and can go stale). Zustand owns *client* state
// (is the user logged in, who are they, is dark mode on) — things with no
// "server truth" to refetch. Mixing these up is a common source of confusion,
// so keep that boundary in mind as you read the rest of the app.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    {
      name: 'pg-auth-storage', // localStorage key — persists login across page refreshes
    }
  )
);
