import { requiredEmail, requiredField } from "@/lib/validator";
import { z } from "zod";

export const Schema = z.object({
   email: requiredEmail("Email"),
   password: requiredField("Password"),
});
