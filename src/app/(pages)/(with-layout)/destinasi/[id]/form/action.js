"use server";
import { errorResponse, successResponse } from "@/lib/response";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { Schema } from "./schema";

export async function action(formData) {
   try {
      const parsed = Schema.safeParse(formData);

      if (!parsed.success) {
         console.log("Validation errors:", parsed.error.flatten().fieldErrors);
         return errorResponse(parsed.error.flatten().fieldErrors);
      }

      const { id, images, kategori, ...input } = parsed.data;

      // Format images
      const formattedImages = images.map((img) => ({
         fileId: img.fileId,
         imageUrl: img.imageUrl,
      }));

      // Gunakan transaction
      return await prisma.$transaction(async (tx) => {
         if (id) {
            // 1. Ambil images yang ada
            const existingImages = await tx.image.findMany({
               where: { destinasiId: id },
               select: { fileId: true },
            });

            const existingFileIds = existingImages.map((img) => img.fileId);
            const newFileIds = formattedImages.map((img) => img.fileId);

            // 2. Identifikasi images yang perlu dihapus
            const toDelete = existingFileIds.filter(
               (fileId) => !newFileIds.includes(fileId)
            );

            // 3. Hapus images yang tidak digunakan
            if (toDelete.length > 0) {
               await tx.image.deleteMany({
                  where: {
                     fileId: { in: toDelete },
                     destinasiId: id,
                  },
               });
            }

            // 4. Identifikasi images yang perlu ditambahkan
            const toCreate = formattedImages.filter(
               (img) => !existingFileIds.includes(img.fileId)
            );

            // 5. Update destinasi
            const data = await tx.destinasi.update({
               where: { id },
               data: {
                  ...input,
                  slug: slugify(input.nama),
                  kategori: { connect: { slug: kategori } },
                  images: {
                     create: toCreate,
                  },
               },
               include: {
                  images: true,
                  kategori: true,
               },
            });

            return successResponse({
               data,
               message: "Destinasi berhasil diperbarui",
            });
         } else {
            // CREATE baru
            const data = await tx.destinasi.create({
               data: {
                  ...input,
                  slug: slugify(input.nama),
                  kategori: { connect: { slug: kategori } },
                  images: {
                     create: formattedImages,
                  },
               },
               include: {
                  images: true,
                  kategori: true,
               },
            });

            return successResponse({
               data,
               message: "Destinasi berhasil dibuat",
            });
         }
      });
   } catch (error) {
      console.error("Error in destination action:", error);
      return errorResponse("Terjadi kesalahan pada server.");
   }
}
