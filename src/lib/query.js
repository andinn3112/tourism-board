import prisma from "./prisma";

export async function getDestination(params) {
  return await prisma.destination.findMany({
    take: 10,
  });
}

export async function getDestinationById(id) {
  return await prisma.destination.findUnique({
    where: { id },
  });
}
