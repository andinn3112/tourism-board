"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  // Optional: set a small automatic redirect after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // comment out if you don't want auto-redirect
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6">
      <div className="max-w-3xl w-full text-center">
        <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-white shadow-md mx-auto mb-6">
          {/* Simple SVG icon for a friendly 404 */}
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

        <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
          404
        </h1>
        <p className="text-xl text-slate-600 mb-6">
          Halaman yang kamu cari tidak ditemukan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={() => router.back()}
            className="px-5 py-3 rounded-lg shadow-sm border border-slate-200 text-slate-800 bg-white hover:shadow-md transition"
          >
            Kembali
          </button>

          <Link
            href="/"
            className="px-5 py-3 rounded-lg bg-sky-600 text-white font-medium hover:opacity-95 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>

        <div className="mt-8 text-sm text-slate-500">
          <p>
            Atau coba periksa URL, atau gunakan{" "}
            <Link href="/" className="underline">
              beranda
            </Link>{" "}
            untuk menemukan apa yang kamu cari.
          </p>
        </div>
      </div>
    </main>
  );
}
