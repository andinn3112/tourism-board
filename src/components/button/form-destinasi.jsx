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
         className={buttonVariants({ variant: "outline", size: "icon" })}
      >
         <PencilIcon className="size-4" />
      </Link>
   );
}

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { deleteData } from "@/lib/delete-data";
import { useNavigate } from "@/hooks/use-navigate";
import { toast } from "sonner";

export function HapusDestinasi({ id, backUrl = "/destinasi" }) {
   const { isLoggedIn } = useAuthStore();
   const [open, setOpen] = useState(false);
   const [isPending, startTransition] = useTransition();
   const navigate = useNavigate();

   const handleDelete = async () => {
      startTransition(async () => {
         await deleteData(id);
         toast.success("Data berhasil dihapus");
         setOpen(false);
         navigate(backUrl);
      });
   };

   if (!isLoggedIn) return null;

   return (
      <>
         <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
         >
            <TrashIcon className="size-4" />
         </Button>
         <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Hapus data</DialogTitle>
                  <DialogDescription>
                     Apakah anda yakin mau menghapus data ini?
                  </DialogDescription>
               </DialogHeader>
               <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                     Batal
                  </Button>
                  <Button
                     variant="destructive"
                     disabled={isPending}
                     onClick={handleDelete}
                  >
                     Hapus
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
