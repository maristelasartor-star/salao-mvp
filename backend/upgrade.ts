import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const salon = await prisma.salon.update({
            where: { email: 'maristela.sartor@gmail.com' },
            data: { plan: 'elite' }
        });
        console.log("SUCESSO! O Salão da Maristela agora foi atualizado para:", salon.plan);
    } catch (e) {
        console.error("ERRO:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
