import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const salons = await prisma.salon.findMany({ select: { email: true, plan: true } });
        console.log("Salões cadastrados:");
        salons.forEach(s => console.log(`- ${s.email} (Plano: ${s.plan})`));
    } catch (e) {
        console.error("ERRO:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
