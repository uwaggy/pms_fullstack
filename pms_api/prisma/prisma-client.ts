import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'minimal',
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
