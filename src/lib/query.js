"use server";
import prisma from "./prisma";
import { slugify } from "./utils";

export async function getDestination(params) {
   return await prisma.destinasi.findMany({
      take: 10,
      include: {
         kategori: { select: { nama: true, slug: true } },
         images: { select: { url: true } },
         reviews: true,
      },
   });
}

export async function getDestinationById(id) {
   return await prisma.destinasi.findUnique({
      where: { id },
      include: {
         kategori: { select: { nama: true, slug: true } },
         images: { select: { url: true } },
         reviews: true,
      },
   });
}

export async function getCategories() {
   return await prisma.kategori.findMany({
      select: {
         id: true,
         nama: true,
         slug: true,
      },
      orderBy: { nama: "asc" },
   });
}

export async function createCategory(value) {
   return await prisma.kategori.create({
      data: { nama: value, slug: slugify(value) },
      select: {
         id: true,
         nama: true,
         slug: true,
      },
   });
}
