import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email("Email tidak valid"),
  password: z.string().min(1, { message: "Password wajib diisi" }),
});
