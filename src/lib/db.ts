import { PrismaClient } from "@prisma/client";

// Workaround to prevent errors from too many prisma clients during development
// See https://github.com/prisma/prisma/issues/5007
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export default prisma;
