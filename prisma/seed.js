const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
   const users = [
      {
         name: "dev",
         email: "dev@dev.com",
         password: bcrypt.hashSync("112", 10),
         role: "ADMIN",
      },
   ];
   await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
   });
}

main()
   .then(async () => {
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });

// atau: npx prisma db seed

// npx prisma migrate reset
// npx prisma migrate dev
