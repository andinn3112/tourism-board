"use server";
import { errorResponse, successResponse } from "@/lib/response";
import { Schema } from "./schema";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function action(formData) {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = Schema.safeParse(rawData);

  if (!parsed.success) {
    return errorResponse(parsed.error.flatten().fieldErrors);
  }

  const { id, ...input } = parsed.data;

  const data = await prisma.destination.upsert({
    where: { id },
    create: { ...input, slug: slugify(input?.name) },
    update: { ...input, slug: slugify(input?.name) },
  });

  return successResponse({ data });
}
