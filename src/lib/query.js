"use server";
import prisma from "./prisma";
import { slugify } from "./utils";

export async function getDestination({
   search,
   limit = 6,
   kategori,
   page = 1,
   sortBy = "createdAt",
   sortOrder = "desc",
}) {
   const skip = (page - 1) * limit;

   const where = {
      AND: [
         search
            ? {
                 OR: [
                    { nama: { contains: search, mode: "insensitive" } },
                    { deskripsi: { contains: search, mode: "insensitive" } },
                    { alamat: { contains: search, mode: "insensitive" } },
                 ],
              }
            : {},
         kategori
            ? {
                 kategori: {
                    slug: kategori,
                 },
              }
            : {},
      ],
   };

   // Hapus array kosong
   where.AND = where.AND.filter(
      (condition) => Object.keys(condition).length > 0
   );
   if (where.AND.length === 0) delete where.AND;

   // Validasi sort field
   const validSortFields = ["createdAt", "updatedAt", "nama", "view"];
   const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
   const orderDirection = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

   const [data, total] = await prisma.$transaction([
      prisma.destinasi.findMany({
         take: limit,
         skip: skip,
         where: where,
         include: {
            kategori: { select: { nama: true, slug: true } },
            images: { select: { imageUrl: true } },
            reviews: true,
         },
         orderBy: {
            [orderField]: orderDirection,
         },
      }),
      prisma.destinasi.count({ where: where }),
   ]);

   return {
      data: data,
      meta: {
         page: page,
         limit: limit,
         total: total,
         totalPages: Math.ceil(total / limit),
         hasNext: page * limit < total,
         hasPrev: page > 1,
         sortBy: orderField,
         sortOrder: orderDirection,
         search: search || null,
         kategori: kategori || null,
      },
   };
}
export async function getDestinationById(id, type) {
   const data = await prisma.destinasi.findUnique({
      where: { id },
      include: {
         kategori: { select: { nama: true, slug: true } },
         images: { select: { imageUrl: true, fileId: true } },
         reviews: true,
      },
   });

   if (type == "add-view") {
      await addView(id);
   }

   return data;
}

export async function addView(id) {
   return await prisma.destinasi.update({
      where: { id },
      data: {
         view: {
            increment: 1,
         },
      },
   });
}

export async function getMostPopuler() {
   const data = await prisma.destinasi.findMany({
      orderBy: { view: "desc" },
      include: {
         images: true,
         kategori: true,
      },
      take: 6,
   });

   return { data };
}

export async function getCategories({
   sortBy = "nama",
   sortOrder = "asc",
   limit,
   page,
   search,
   includeDestinations = false,
}) {
   // Validasi dan mapping field untuk orderBy
   const validSortFields = ["nama", "createdAt", "updatedAt", "destinasiCount"];
   const orderField = validSortFields.includes(sortBy) ? sortBy : "nama";
   const orderDirection = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

   // Buat kondisi where untuk search
   const where = search
      ? {
           OR: [
              { nama: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { deskripsi: { contains: search, mode: "insensitive" } },
           ],
        }
      : {};

   // Konfigurasi select
   const selectConfig = {
      id: true,
      nama: true,
      slug: true,
      deskripsi: true,
      createdAt: true,
      updatedAt: true,
      _count: {
         select: {
            destinasi: true,
         },
      },
   };

   // Jika ingin include destinasi detail
   if (includeDestinations) {
      selectConfig.destinasi = {
         select: {
            id: true,
            nama: true,
            slug: true,
            images: {
               select: {
                  imageUrl: true,
               },
               take: 1,
            },
         },
         take: 5,
      };
   }

   // Jika ada pagination
   if (limit && page) {
      const skip = (page - 1) * limit;

      const [data, total] = await prisma.$transaction([
         prisma.kategori.findMany({
            take: limit,
            skip: skip,
            where: where,
            select: selectConfig,
            orderBy:
               orderField === "destinasiCount"
                  ? {
                       destinasi: {
                          _count: orderDirection,
                       },
                    }
                  : {
                       [orderField]: orderDirection,
                    },
         }),
         prisma.kategori.count({ where: where }),
      ]);

      // Jika sorting by destinasiCount, sort manual
      let sortedData = data;
      if (orderField === "destinasiCount") {
         sortedData = data.sort((a, b) => {
            const countA = a._count.destinasi;
            const countB = b._count.destinasi;
            return orderDirection === "asc" ? countA - countB : countB - countA;
         });
      }

      return {
         data: sortedData,
         meta: {
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
            sortBy: orderField,
            sortOrder: orderDirection,
            search: search || null,
         },
      };
   }

   // Jika tanpa pagination
   const data = await prisma.kategori.findMany({
      where: where,
      select: selectConfig,
      orderBy:
         orderField === "destinasiCount"
            ? {
                 destinasi: {
                    _count: orderDirection,
                 },
              }
            : {
                 [orderField]: orderDirection,
              },
   });

   // Jika sorting by destinasiCount, sort manual
   if (orderField === "destinasiCount") {
      const sortedData = data.sort((a, b) => {
         const countA = a._count.destinasi;
         const countB = b._count.destinasi;
         return orderDirection === "asc" ? countA - countB : countB - countA;
      });

      return {
         data: sortedData,
         meta: {
            total: data.length,
            sortBy: orderField,
            sortOrder: orderDirection,
            search: search || null,
         },
      };
   }

   return {
      data: data,
      meta: {
         total: data.length,
         sortBy: orderField,
         sortOrder: orderDirection,
         search: search || null,
      },
   };
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
