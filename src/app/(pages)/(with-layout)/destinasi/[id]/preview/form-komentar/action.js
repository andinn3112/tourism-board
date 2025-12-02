"use server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { Schema } from "./schema";
import { revalidatePath } from "next/cache";

export async function action(formData) {
   const parsed = Schema.safeParse(formData);

   if (!parsed.success) {
      return errorResponse(parsed.error.flatten().fieldErrors);
   }

   const { destinasiId, ...input } = parsed.data;

   const data = await prisma.review.create({
      data: {
         ...input,
         destinasi: {
            connect: { id: destinasiId },
         },
      },
   });

   revalidatePath(`/destinasi/${destinasiId}/preview`);

   return successResponse(data);
}
