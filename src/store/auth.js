"use client";

import { deleteSession } from "@/lib/session";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoading: true,
      isLoggedIn: false,
      user: null,

      setUser: (user) => {
        set({ user, isLoggedIn: !!user, isLoading: false });
      },

      // ⬇⬇ UPDATE BAGIAN INI
      logout: async () => {
        try {
          await deleteSession(); // hapus cookie/session
          set({
            user: null,
            isLoggedIn: false,
          });
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
