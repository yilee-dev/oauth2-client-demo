import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      idToken: null,
      user: null,
      setAuth: (accessToken, refreshToken, idToken, user) =>
        set({ accessToken, refreshToken, idToken, user }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          idToken: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
