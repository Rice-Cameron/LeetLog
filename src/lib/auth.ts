import { PrismaClient } from '@prisma/client';
import { NeonAuth } from '@neondatabase/serverless-auth';
import { Auth } from '@stackframe/stack';

const prisma = new PrismaClient();

export const auth = new Auth({
  db: prisma,
  // Add your Stack Auth configuration here
  // You'll need to add your API keys from Stack Auth
});

export const neonAuth = new NeonAuth(prisma);
