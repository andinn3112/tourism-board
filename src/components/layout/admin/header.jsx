import { ToggleTheme } from "@/components/button";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/hooks/use-navigate";
import { SITE_NAME } from "@/lib/env";
import { useAuthStore } from "@/store/auth";
import { MoreHorizontalIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function Header() {
   const { isLoggedIn, isLoading } = useAuthStore();
   const navigate = useNavigate();

   return (
      <header className="sticky top-0 bg-background/10 backdrop-blur-sm z-20 shadow-lg shadow-muted/5 p-4">
         <div className="flex justify-between gap-4 max-w-7xl mx-auto items-center">
            <h1 className="text-xl font-bold text-primary">{SITE_NAME}</h1>
            <div className="flex gap-1 items-center">
               <Link href="/destinasi" className="mr-4">
                  Destinasi
               </Link>
               <ToggleTheme />
               {isLoading ? (
                  <Button variant="ghost" size="icon" disabled>
                     <MoreHorizontalIcon />
                  </Button>
               ) : isLoggedIn ? (
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => navigate("/profil")}
                  >
                     <UserIcon className="size-4" />
                  </Button>
               ) : (
                  <Button
                     size="sm"
                     className="rounded-full border border-primary px-4 bg-transparent text-primary hover:text-primary-foreground"
                     onClick={() => navigate("/login")}
                  >
                     Login
                  </Button>
               )}
            </div>
         </div>
      </header>
   );
}
