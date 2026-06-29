const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const projectsPageContent = {
        title: "Project Portfolio",
        subtitle: "Architectural Roadmap",
        futureProjectsTitle: "Future Projects",
        futureProjectsDesc: "A sneak peek into our upcoming endeavors. Strategic exploration into neuro-cinematic experiences and hyper-premium immersive interfaces."
    };

    await prisma.homeSection.upsert({
        where: { sectionName: 'projects-page' },
        update: { content: JSON.stringify(projectsPageContent) },
        create: {
            sectionName: 'projects-page',
            content: JSON.stringify(projectsPageContent)
        }
    });

    console.log("Seeded projects-page HomeSection");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
