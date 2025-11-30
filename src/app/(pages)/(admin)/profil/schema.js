import { z } from "zod";

export const Schema = z.object({
  nama: z.string().min(1, { message: "Email wajib diisi" }),
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email("Email tidak valid"),
  password: z.string().optional(),
});
