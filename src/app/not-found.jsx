"use client";

import { buttonVariants } from "@/components/ui/button";
import { useNavigate } from "@/hooks/use-navigate";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
   const navigate = useNavigate();
   const [countdown, setCountdown] = useState(5);

   useEffect(() => {
      const timer = setInterval(() => {
         setCountdown((prev) => {
            if (prev <= 1) {
               clearInterval(timer);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);

      return () => clearInterval(timer);
   }, []);

   // Redirect ketika countdown mencapai 0
   useEffect(() => {
      if (countdown === 0) {
         navigate("/");
      }
   }, [countdown, navigate]);

   return (
      <main className="min-h-screen flex items-center justify-center px-6">
         <div className="max-w-3xl w-full text-center">
            <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-foreground/5 shadow-md mx-auto mb-6">
               <svg
                  width="72"
                  height="72"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
               >
                  <path
                     d="M12 2L12 22"
                     stroke="currentColor"
                     strokeWidth="1.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
                  <path
                     d="M5 8.5C6.5 6 9.5 4 12 4C14.5 4 17.5 6 19 8.5"
                     stroke="currentColor"
                     strokeWidth="1.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            </div>

            <h1 className="text-6xl font-extrabold tracking-tight text-destructive mb-4">
               404
            </h1>
            <p className="text-xl text-slate-600 mb-2">
               Halaman yang kamu cari tidak ditemukan.
            </p>

            {/* Countdown Timer */}
            <div className="mb-6">
               <p className="text-lg text-slate-500">
                  Redirect otomatis dalam{" "}
                  <span className="font-bold text-sky-600">{countdown}</span>{" "}
                  detik...
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
               <Link href="/" className={buttonVariants()}>
                  Kembali ke Beranda Sekarang
               </Link>
            </div>

            <div className="mt-8 text-sm text-slate-500">
               <p>
                  Atau coba periksa URL, atau gunakan{" "}
                  <Link
                     href="/"
                     className="underline hover:text-sky-600 transition"
                  >
                     beranda
                  </Link>{" "}
                  untuk menemukan apa yang kamu cari.
               </p>
            </div>
         </div>
      </main>
   );
}
