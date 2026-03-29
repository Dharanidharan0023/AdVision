const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPosts() {
  try {
    const posts = await prisma.post.findMany();
    console.log('--- Posts in Database ---');
    posts.forEach(post => {
      console.log(`ID: ${post.id} | Title: ${post.title} | VideoURL: ${post.videoUrl}`);
    });
    console.log('-------------------------');
  } catch (err) {
    console.error('Error fetching posts:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();
