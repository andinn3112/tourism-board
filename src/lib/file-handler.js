"use server";

import ImageKit from "imagekit";
import {
   IMAGEKIT_PRIVATE_KEY,
   IMAGEKIT_PUBLIC_KEY,
   IMAGEKIT_URL_ENDPOINT,
   SITE_NAME,
} from "./env";

import { strToUnderscore } from "./formater";

const imagekit = new ImageKit({
   publicKey: IMAGEKIT_PUBLIC_KEY,
   privateKey: IMAGEKIT_PRIVATE_KEY,
   urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload file ke ImageKit
 * @param {File} file - file input (browser)
 * @param {string} folder - folder target di ImageKit
 * @param {string} type - ekstensi target image (default: webp)
 * @param {number} width - ukuran lebar untuk transformasi (default: 1000)
 * @returns {Promise<{success: boolean, url?: string, fileId?: string, error?: string}>}
 */
export async function uploadFile(file, folder, type = "webp", width = 1000) {
   const webBase = strToUnderscore(SITE_NAME || "WEBSITE");

   if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "File tidak valid atau kosong" };
   }

   try {
      const mimeType = file.type;
      const isImage = mimeType.startsWith("image/");
      const originalExt = file.name.split(".").pop()?.toLowerCase() || "bin";
      const inputBuffer = Buffer.from(await file.arrayBuffer());

      // Nama file unik
      const fileName = isImage
         ? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`
         : `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}.${originalExt}`;

      // Upload file original langsung ke ImageKit
      const uploadRes = await imagekit.upload({
         file: inputBuffer,
         fileName,
         folder: `${webBase}/${folder}`,
         tags: webBase,
      });

      if (!uploadRes?.url || !uploadRes?.fileId) {
         return {
            success: false,
            error: "Upload berhasil tapi respons tidak lengkap",
         };
      }

      // Transformasi otomatis via URL CDN ImageKit
      let transformedUrl = uploadRes.url;
      if (isImage) {
         transformedUrl = imagekit.url({
            src: uploadRes.url,
            transformation: [
               {
                  width: String(width),
                  quality: "80",
                  format: type.toLowerCase() || "auto",
               },
            ],
         });
      }

      return {
         success: true,
         url: transformedUrl,
         fileId: uploadRes.fileId,
      };
   } catch (err) {
      return {
         success: false,
         error: err instanceof Error ? err.message : "Upload gagal",
      };
   }
}

/**
 * Hapus file di ImageKit
 * @param {string} urlOrFileId - URL atau ID file dari ImageKit
 */
export async function deleteFile(urlOrFileId) {
   try {
      if (!urlOrFileId) return;

      if (urlOrFileId.startsWith("file_")) {
         await imagekit.deleteFile(urlOrFileId);
      } else {
         const parts = urlOrFileId.split("/");
         const filename = parts[parts.length - 1].split("?")[0];
         await imagekit.deleteFile(filename);
      }
   } catch (error) {
      console.warn("Gagal menghapus file:", error);
   }
}
