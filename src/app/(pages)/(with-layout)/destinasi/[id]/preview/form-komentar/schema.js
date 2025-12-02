import { requiredEmail, requiredField } from "@/lib/validator";
import { z } from "zod";

export const Schema = z.object({
   destinasiId: requiredField("Destinasi"),
   nama: requiredField("Nama"),
   email: requiredEmail("Email"),
   komentar: requiredField("Komentar"),
});
