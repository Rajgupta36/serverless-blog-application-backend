import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


const prisma = new PrismaClient().$extends(withAccelerate());

export async function publicpost() {
  try {
    const posts = await prisma.post.findMany({ cacheStrategy: { ttl: 60 }, });
    return posts;
  } catch (error) {
    console.error('Error retrieving public posts:', error);
    throw new Error('Internal Server Error');
  }
}
export async function privatepost(username: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        user: { username },
      }, cacheStrategy: { ttl: 60 },
    });
    return posts;
  } catch (error) {
    console.error('Error retrieving posts by user:', error);
    throw new Error('Internal Server Error');
  }

}

export async function createpost(title: string, description: string, thumbnailUrl: string, username: string) {
  try {
    const createdAt = new Date();
    const res = await prisma.post.create({
      data: {
        title: title,
        description: description,
        thumbnailUrl: thumbnailUrl,
        createdAt: createdAt,
        Author: username,
        user: { connect: { username: username } },
      }
    });

    return res;
  } catch (error: any) {

    console.error("Error creating post:", error.message);
    throw new Error("Failed to create post.");
  }
}

export async function getPostById(postId: number) {
  const res = await prisma.post.findUnique({ where: { id: postId }, cacheStrategy: { ttl: 60 }, });
  return res;
}


export async function updatePost(title: string, description: string, thumbnailUrl: string, id: number) {
  let data: any = {};
  if (title) {
    data.title = title;
  }
  if (description) {
    data.description = description;
  }
  if (thumbnailUrl) {
    data.thumbnailUrl = thumbnailUrl;
  }
  const res = await prisma.post.update({ where: { id: id }, data: data });
  return res;
}

export async function deletePost(postId: number) {
  const res = await prisma.post.delete({ where: { id: postId } });
  return res;
}