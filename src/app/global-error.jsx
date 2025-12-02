"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
   useEffect(() => {
      console.error("Error page:", error);
   }, [error]);

   return (
      <html>
         <body className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <h2 className="text-2xl font-semibold mb-4">Terjadi kesalahan.</h2>
            <p className="text-muted-foreground mb-4">
               Maaf, halaman gagal dimuat. Silakan coba lagi atau hubungi
               administrator.
            </p>
            <button
               onClick={() => reset()}
               className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
               Coba Lagi
            </button>
         </body>
      </html>
   );
}
