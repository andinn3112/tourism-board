"use client";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function LinkKategori() {
   const { isLoggedIn } = useAuthStore();
   if (!isLoggedIn) {
      return null;
   }
   return (
      <Link className={buttonVariants({ variant: "outline" })} href="/kategori">
         Data Kategori
      </Link>
   );
}
