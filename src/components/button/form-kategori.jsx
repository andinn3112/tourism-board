"use client";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { deleteKategori } from "@/lib/delete-data";
import { useNavigate } from "@/hooks/use-navigate";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export function HapusKategori({ id, backUrl = "/kategori" }) {
   const { isLoggedIn } = useAuthStore();
   const [open, setOpen] = useState(false);
   const [isPending, startTransition] = useTransition();
   const navigate = useNavigate();

   const handleDelete = async () => {
      startTransition(async () => {
         await deleteKategori(id);
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
