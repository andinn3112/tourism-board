"use client";
import { useEffect } from "react";
import Header from "./header";
import { useAuthStore } from "@/store/auth";

export default function AdminLayout({ user, children }) {
   const { setUser } = useAuthStore();

   useEffect(() => {
      setUser(user);
   }, [user, setUser]);

   return (
      <div className="min-h-dvh w-dvh overflow-y-auto">
         <Header user={user} />
         <main>{children}</main>
      </div>
   );
}
