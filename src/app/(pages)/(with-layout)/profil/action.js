"use server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import bcrypt from "bcrypt";
import { Schema } from "./schema";

export async function action(formData) {
   const parsed = Schema.safeParse(formData);

   if (!parsed.success) {
      return errorResponse(parsed.error.flatten().fieldErrors);
   }

   const { email, name, password } = parsed.data;

   const user = await prisma.user.findUnique({ where: { email } });

   if (!user) {
      return errorResponse({ email: ["User not found"] });
   }

   // Update password
   let hashedPassword;
   if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
   } else {
      hashedPassword = user?.password;
   }
   await prisma.user.update({
      where: { email },
      data: { name, password: hashedPassword },
   });

   return successResponse({
      id: user?.id,
      name,
      email,
   });
}
