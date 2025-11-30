"use client";
import { useEffect } from "react";
import Header from "./header";
import { useAuthStore } from "@/store/auth";

export default function WebLayout({ user, children }) {
   const { setUser } = useAuthStore();

   useEffect(() => {
      setUser(user);
   }, [user, setUser]);

   return (
      <div className="">
         <Header user={user} />
         <main className="pt-6">{children}</main>
      </div>
   );
}
