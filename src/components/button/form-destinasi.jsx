"use client";

import { useAuthStore } from "@/store/auth";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "lucide-react";

export function TambahDestinasi() {
   const { isLoggedIn } = useAuthStore();

   if (!isLoggedIn) return null;

   return (
      <Link href="/destinasi/new/form" className={buttonVariants()}>
         Tambah
      </Link>
   );
}

export function EditDestinasi({ id }) {
   const { isLoggedIn } = useAuthStore();

   if (!isLoggedIn) return null;

   return (
      <Link
         href={`/destinasi/${id}/form`}
         className={buttonVariants({ variant: "ouline", size: "icon" })}
      >
         <PencilIcon className="size-4" />
      </Link>
   );
}

export function HapusDestinasi() {
   const { isLoggedIn } = useAuthStore();

   if (!isLoggedIn) return null;

   return (
      <Button variant="destructive" size="icon">
         <TrashIcon className="size-4" />
      </Button>
   );
}
