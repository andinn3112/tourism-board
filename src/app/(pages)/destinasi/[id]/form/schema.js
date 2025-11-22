import { z } from "zod";

export const Schema = z.object({
  id: z.string().optional().default(""),
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  slug: z.string().optional(),
  description: z.string().min(1, { message: "Deskripsi wajib diisi" }),
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
  coordinate: z.string().min(1, { message: "Koordinat wajib diisi" }),
});
