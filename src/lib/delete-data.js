"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function deleteDestinasi(id) {
   const images = await prisma.image.findMany({
      where: {
         destinasiId: id,
      },
      select: {
         fileId: true,
      },
   });

   try {
      await fetch("/api/image/delete-many", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            fileIds: images.map((img) => img.fileId),
         }),
      });
   } catch (error) {
      console.warn("error delete", error);
   }

   await prisma.destinasi.delete({
      where: { id },
   });

   revalidatePath("/destinasi");
}

export async function deleteKategori(id) {
   await prisma.kategori.delete({
      where: { id },
   });

   revalidatePath("/kategori");
}
