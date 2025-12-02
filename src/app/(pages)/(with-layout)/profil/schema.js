import { requiredEmail, requiredField } from "@/lib/validator";
import { z } from "zod";

export const Schema = z.object({
   name: requiredField("Nama"),
   email: requiredEmail("Email"),
   password: z.string().optional(),
});
