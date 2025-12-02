"use client";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@/hooks/use-navigate";
import { useAuthStore } from "@/store/auth";
import { UserIcon } from "lucide-react";
import { Button } from "../ui/button";

export function AccountButton() {
   const { user, logout } = useAuthStore();
   const navigate = useNavigate();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
               <UserIcon className="size-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent>
            <DropdownMenuLabel>
               {user?.name}
               <br />
               {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profil")}>
               Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
