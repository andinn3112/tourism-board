import { z } from "zod";
import { requiredField } from "@/lib/validator";

export const Schema = z.object({
   id: z.string().optional().default(""),
   nama: requiredField("Nama"),
   slug: z.string().optional(),
   deskripsi: requiredField("Deskripsi"),
   alamat: requiredField("Alamat Lengkap"),
   koordinat: requiredField("Koordinat"),
   kategori: requiredField("Kategori"),

   images: z
      .any()
      .transform((value) => {
         // Jika undefined/null, ubah ke array kosong
         if (value === undefined || value === null) return [];

         // Jika sudah array, return
         if (Array.isArray(value)) return value;

         // Jika bukan array, wrap dalam array
         return [value];
      })
      .pipe(
         z
            .array(
               z.object({
                  fileId: z.string().min(1, "fileId tidak boleh kosong"),
                  imageUrl: z.string().url("URL gambar tidak valid"),
               })
            )
            .min(1, "Minimal 1 gambar harus diupload")
            .max(10, "Maksimal 10 gambar")
      ),
});
