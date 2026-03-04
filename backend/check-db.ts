import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    const list = await prisma.appointment.findMany({
        where: {
            status: 'waitlist'
        },
        include: {
            client: true
        }
    });
    console.log("WAITLIST ITEMS FOUND:", list.length);
    console.log(JSON.stringify(list, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
