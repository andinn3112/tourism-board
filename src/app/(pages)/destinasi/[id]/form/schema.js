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
         console.log("Original images value:", value);

         if (!value) return [];
         if (Array.isArray(value)) return value;
         if (typeof FileList !== "undefined" && value instanceof FileList)
            return Array.from(value);
         if (typeof File !== "undefined" && value instanceof File)
            return [value];
         if (typeof value === "string") return [value];
         return [];
      })
      .pipe(
         z.array(z.any()).superRefine((images, ctx) => {
            // Validasi array length
            if (images.length === 0) {
               ctx.addIssue({
                  code: z.ZodIssueCode.too_small,
                  minimum: 1,
                  type: "array",
                  inclusive: true,
                  message: "Minimal 1 gambar harus diupload",
                  path: [],
               });
               return;
            }

            if (images.length > 10) {
               ctx.addIssue({
                  code: z.ZodIssueCode.too_big,
                  maximum: 10,
                  type: "array",
                  inclusive: true,
                  message: "Maksimal 10 gambar",
                  path: [],
               });
               return;
            }

            let validImageCount = 0;

            // Validasi setiap item
            images.forEach((item, index) => {
               let isValid = false;
               let errorMessage = "";

               // Check File objects
               if (typeof File !== "undefined" && item instanceof File) {
                  isValid = true;

                  // Additional file validation
                  if (item.size === 0) {
                     isValid = false;
                     errorMessage = "File tidak boleh kosong";
                  } else if (item.size > 10 * 1024 * 1024) {
                     // 10MB
                     isValid = false;
                     errorMessage = "File terlalu besar (maksimal 10MB)";
                  } else if (!item.type.startsWith("image/")) {
                     isValid = false;
                     errorMessage = "File harus berupa gambar";
                  }
               }

               // Check URL strings
               else if (typeof item === "string") {
                  if (item.trim() === "") {
                     isValid = false;
                     errorMessage = "URL gambar tidak boleh kosong";
                  } else if (!item.startsWith("http")) {
                     isValid = false;
                     errorMessage = "URL gambar tidak valid";
                  } else {
                     isValid = true;
                  }
               }

               // Check File-like objects
               else if (
                  item &&
                  typeof item === "object" &&
                  item.name &&
                  item.size
               ) {
                  isValid = true;
               }

               // Jika tidak valid, tambahkan error
               if (!isValid) {
                  ctx.addIssue({
                     code: z.ZodIssueCode.custom,
                     message: errorMessage || "Format gambar tidak valid",
                     path: [index],
                  });
               } else {
                  validImageCount++;
               }
            });

            // Final validation - minimal 1 gambar valid
            if (validImageCount === 0) {
               ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Minimal 1 gambar valid harus diupload",
                  path: [],
               });
            }
         })
      ),
});
