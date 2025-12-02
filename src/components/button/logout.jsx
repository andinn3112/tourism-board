"use client";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2Icon, LogOutIcon } from "lucide-react";

export function LogoutButton() {
   const { isLoggedIn, logout } = useAuthStore();
   const [loading, setLoading] = useState();

   const handleLogout = async () => {
      setLoading(true);
      await logout();
   };

   if (!isLoggedIn) return null;

   return (
      <Button variant="destructive" size="icon" onClick={handleLogout}>
         {loading ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
      </Button>
   );
}
