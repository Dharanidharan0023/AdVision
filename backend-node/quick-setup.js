// Simplified database setup using Prisma Client
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Setting up database...');

    try {
        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: hashedPassword,
                role: 'ROLE_ADMIN',
            },
        });

        console.log('✅ Admin user created!');
        console.log('   Username: admin');
        console.log('   Password: admin123');

        // Create sample post
        await prisma.post.create({
            data: {
                title: 'Welcome to AdVision Studio',
                content: 'Ellam Pugazhum Iraivanukke. This is the beginning of our creative journey!',
                featured: true,
                imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
            },
        });

        // Create sample project
        await prisma.project.create({
            data: {
                title: 'AdVision Website',
                description: 'The official portfolio website built with React and Node.js',
                status: 'In Progress',
                imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
            },
        });

        console.log('✅ Sample data created!');
        console.log('\n🚀 Setup complete! Start the backend with: npm run dev');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
