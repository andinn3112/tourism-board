"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react"; // <-- TAMBAH INI

export default function Header() {
  const { user, logout, isLoggedIn } = useAuthStore();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="w-full bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        <Link href="/" className="font-bold text-lg">
          Tourism-Board
        </Link>

        <nav className="flex gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/destinasi">Destinasi Wisata</Link>
          <Link href="/kuliner/destinasi">Kuliner</Link>
          <Link href="/budaya/destinasi">Budaya</Link>
          <Link href="/event/destinasi">Event</Link>
        </nav>
        <div>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
                <UserCircle className="w-5 h-5" />
                <span>{user?.name}</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/profil">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
