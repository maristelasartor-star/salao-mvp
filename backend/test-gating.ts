import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const salons = await prisma.salon.findMany();
    if (salons.length > 0) {
        console.log("Current Salon Plan:", salons[0].plan);
        // Ensure it's start for testing
        await prisma.salon.update({
            where: { id: salons[0].id },
            data: { plan: 'start' }
        });
        console.log("Updated Salon to 'start' plan.");
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
