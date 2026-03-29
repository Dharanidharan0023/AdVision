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

    // Create Home Sections
    await prisma.homeSection.upsert({
        where: { sectionName: 'hero' },
        update: {},
        create: {
            sectionName: 'hero',
            content: JSON.stringify({
                title: 'AdVision <br /> <span class="neon-text italic">Studio</span>',
                subtitle: 'Creative storytelling through cinematic vision.'
            })
        }
    });

    await prisma.homeSection.upsert({
        where: { sectionName: 'stats' },
        update: {},
        create: {
            sectionName: 'stats',
            content: JSON.stringify([
                { label: 'Subscribers', value: '1.09K+' },
                { label: 'Videos', value: '105' },
                { label: 'Views', value: '274K+' }
            ])
        }
    });

    // Create Initial About
    await prisma.about.create({
        data: {
            title: 'About AdVision',
            subtitle: 'Crafting Cinematic Realities',
            description: 'Founded with a passion for visual excellence, AdVision Studio is dedicated to pushing the boundaries of creative storytelling. We specialize in cinematic vlogs, short films, and digital artistry that captivates and inspires.',
            experienceYears: 5,
            imageUrl: 'https://images.unsplash.com/photo-1492691523569-44058d45e3ea?auto=format&fit=crop&q=80'
        }
    });

    console.log('Seeding completed!');
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
