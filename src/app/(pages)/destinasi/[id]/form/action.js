"use server";
import { errorResponse, successResponse } from "@/lib/response";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { Schema } from "./schema";
import { deleteFile, uploadFile } from "@/lib/file-handler";

// Sync images function yang sudah disederhanakan
async function syncImages({ existing, submittedImages }) {
   // Files baru yang diupload
   const newFiles = (submittedImages || []).filter(
      (file) => file instanceof File && file.size > 0
   );

   // URLs existing yang masih dipilih
   const keptUrls = (submittedImages || []).filter(
      (img) => typeof img === "string" && img.startsWith("http")
   );

   // Identifikasi images yang dihapus
   const toDelete = existing.images.filter(
      (img) => !keptUrls.includes(img.url)
   );

   console.log(
      `Sync Images - New: ${newFiles.length}, Keep: ${keptUrls.length}, Delete: ${toDelete.length}`
   );

   // Hapus images yang dihapus dari ImageKit
   for (const img of toDelete) {
      try {
         if (img.imageId) await deleteFile(img.imageId);
         console.log(`✓ Deleted from ImageKit: ${img.url}`);
      } catch (err) {
         console.warn("Gagal hapus file:", img.url, err.message);
      }
   }

   // Upload files baru
   const uploadedImages = [];
   for (const file of newFiles) {
      try {
         const uploaded = await uploadFile(file, "destinations", "webp", 1000);
         if (uploaded.success) {
            uploadedImages.push({
               url: uploaded.url,
               imageId: uploaded.fileId,
            });
            console.log(`✓ Uploaded: ${file.name}`);
         }
      } catch (error) {
         console.warn(`Failed to upload ${file.name}:`, error);
      }
   }

   return {
      // Images yang dihapus dari database
      deleteMany:
         toDelete.length > 0
            ? {
                 id: { in: toDelete.map((img) => img.id) },
              }
            : undefined,
      // Images baru yang dibuat
      create: uploadedImages,
   };
}

export async function action(formData) {
   try {
      const entries = Array.from(formData.entries());
      const rawData = {};

      console.log("=== RAW FORM DATA ENTRIES ===");
      entries.forEach(([key, value]) => {
         console.log(
            `${key}:`,
            value instanceof File ? `FILE - ${value.name}` : `STRING - ${value}`
         );
      });

      for (const [key, value] of entries) {
         if (key === "images") {
            if (!rawData.images) {
               rawData.images = [];
            }
            if (
               value instanceof File ||
               (typeof value === "string" && value !== "")
            ) {
               rawData.images.push(value);
            }
         } else {
            rawData[key] = value;
         }
      }

      console.log("=== PROCESSED RAWDATA ===");
      console.log("RawData images count:", rawData.images?.length || 0);

      const parsed = Schema.safeParse(rawData);

      if (!parsed.success) {
         console.log("Validation errors:", parsed.error.flatten().fieldErrors);
         return errorResponse(parsed.error.flatten().fieldErrors);
      }

      const { id, images: submittedImages, kategori, ...input } = parsed.data;

      console.log("=== AFTER VALIDATION ===");
      console.log("Submitted images count:", submittedImages.length);

      // 1. Get existing data jika edit
      let existingDestination = null;
      if (id) {
         existingDestination = await prisma.destinasi.findUnique({
            where: { id },
            include: { images: true },
         });
      }

      // 2. Sync images
      const imagesOperation = await syncImages({
         existing: existingDestination || { images: [] },
         submittedImages: Array.isArray(submittedImages)
            ? submittedImages
            : [submittedImages],
      });

      // 3. UPSERT operation
      const data = await prisma.destinasi.upsert({
         where: { id: id || "" },
         create: {
            ...input,
            slug: slugify(input.nama),
            kategori: {
               connect: { slug: kategori },
            },
            images: {
               create: imagesOperation.create, // Create semua images baru
            },
         },
         update: {
            ...input,
            slug: slugify(input.nama),
            kategori: {
               connect: { slug: kategori },
            },
            images: {
               ...(imagesOperation.deleteMany && {
                  deleteMany: imagesOperation.deleteMany,
               }),
               ...(imagesOperation.create.length > 0 && {
                  create: imagesOperation.create,
               }),
            },
         },
         include: {
            images: true,
            kategori: true,
         },
      });

      return successResponse({
         data,
         message: id
            ? "Destinasi berhasil diperbarui"
            : "Destinasi berhasil dibuat",
      });
   } catch (error) {
      console.error("Error in destination action:", error);
      return errorResponse("Terjadi kesalahan pada server.");
   }
}
