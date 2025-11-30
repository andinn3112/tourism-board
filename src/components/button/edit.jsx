"use client";

import { useAuthStore } from "@/store/auth";
import { Button } from "../ui/button";
import { PencilIcon } from "lucide-react";
import { useNavigate } from "@/hooks/use-navigate";

export default function EditButton({ link }) {
   const { isLoggedIn } = useAuthStore();
   const navigate = useNavigate();

   if (!isLoggedIn) return null;

   return (
      <Button onClick={() => navigate(link)}>
         <PencilIcon className="size-4" /> Edit
      </Button>
   );
}
