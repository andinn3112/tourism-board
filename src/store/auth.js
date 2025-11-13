"use client";
import { deleteCookie } from "@/lib/session";
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
         logout: async () => {
            try {
               await deleteSession();
               await deleteCookie();
               return data;
            } catch (error) {
               console.error({ error });
            }
         },
      }),
      {
         name: "auth-storage",
      }
   )
);
