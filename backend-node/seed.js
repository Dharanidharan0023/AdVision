const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            password: hashedPassword,
        },
        create: {
            username: 'admin',
            password: hashedPassword,
            role: 'ROLE_ADMIN',
        },
    });
    console.log({ admin });

    // Create Sample Posts
    const post1 = await prisma.post.create({
        data: {
            title: 'Welcome to AdVision Studio',
            content: 'This is the beginning of our journey. Stay tuned for more updates!',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
        },
    });

    const post2 = await prisma.post.create({
        data: {
            title: 'Our First Cinematic Vlog',
            content: 'Exploring the depths of visual storytelling.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoId: 'dQw4w9WgXcQ',
            imageUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        },
    });

    // Create Sample Projects
    const project1 = await prisma.project.create({
        data: {
            title: 'AdVision Website',
            description: 'The official portfolio website built with React and Node.js',
            status: 'In Progress',
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
        },
    });

    const project2 = await prisma.project.create({
        data: {
            title: 'Cyberpunk Short Film',
            description: 'A futuristic look at AI and humanity.',
            status: 'Planned',
        },
    });

    console.log({ post1, post2, project1, project2 });
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
