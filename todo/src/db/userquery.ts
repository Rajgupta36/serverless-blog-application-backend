import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


const prisma = new PrismaClient().$extends(withAccelerate());

export async function signup(username: string, email: string, password: string) {
  try {
    const res = await prisma.user.findFirst({ where: { email }, cacheStrategy: { ttl: 60 }, });
    if (!res) {

      const user = await prisma.user.create({
        data: { username, email, password },
      });
      return user;
    } else {

      return { err: 'email already used' }
    }

  } catch (error) {
    console.error('Error in signup:', error);
    throw new Error('Internal Server Error');
  }
}

export async function signin(email: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { email, password }, cacheStrategy: { ttl: 60 },
    });

    return user;
  } catch (error) {
    console.error('Error in signin:', error);
    throw new Error('Internal Server Error');
  }
}

export async function verify(email: string, username: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { email, username }, cacheStrategy: { ttl: 60 },
    });

    return user;
  } catch (error) {
    console.error('Error in verify:', error);
    throw new Error('Internal Server Error');
  }
}
