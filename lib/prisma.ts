import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL as string;
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

export default prisma;
