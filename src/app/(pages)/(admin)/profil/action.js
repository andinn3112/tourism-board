"use server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { Schema } from "./schema";
import bcrypt from "bcrypt";

export async function action(formData) {
   const rawData = Object.fromEntries(formData.entries());
   const parsed = Schema.safeParse(rawData);

   if (!parsed.success) {
      return errorResponse(parsed.error.flatten().fieldErrors);
   }

   const { email, name, password } = parsed.data;

   const user = await prisma.user.findUnique({ where: { email } });

   if (!user) {
      return errorResponse({ email: ["User not found"] });
   }

   // Update password
   const hashedPassword = await bcrypt.hash(password, 10);
   await prisma.user.update({
      where: { email },
      data: { name, password: hashedPassword },
   });

   return successResponse();
}
