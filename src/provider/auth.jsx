"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/auth";

export default function AuthProvider({ user, children }) {
   const { setUser } = useAuthStore();

   useEffect(() => {
      if (user) {
         setUser(user);
      }
   }, [user]);

   return <>{children}</>;
}
