"use client";
import { useEffect } from "react";
import Header from "./header";
import { useAuthStore } from "@/store/auth";
import Footer from "./footer";

export default function WebLayout({ user, children }) {
   const { setUser } = useAuthStore();

   useEffect(() => {
      setUser(user);
   }, [user, setUser]);

   return (
      <div className="flex flex-col h-full flex-1 min-h-screen">
         <Header user={user} />
         <main className="pt-6 flex-1 pb-10">{children}</main>
         <Footer />
      </div>
   );
}
