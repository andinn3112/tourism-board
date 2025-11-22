"use server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { Schema } from "./schema";

export async function action(formData) {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = Schema.safeParse(rawData);

  if (!parsed.success) {
    if (!parsed.success)
      return errorResponse(parsed.error.flatten().fieldErrors);
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  return successResponse();
}
