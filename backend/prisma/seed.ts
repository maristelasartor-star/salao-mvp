import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with a default Salon...');
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create the primary Salon Admin
    const salao1 = await prisma.salon.upsert({
        where: { email: 'admin@salao.com' },
        update: {},
        create: {
            name: 'Studio Beleza VIP',
            slug: 'studio-vip',
            email: 'admin@salao.com',
            password: hashedPassword
        },
    });

    console.log(`✅ Salão criado: ${salao1.name}`);
    console.log(`  └─ Login: ${salao1.email}`);
    console.log(`  └─ Senha: 123456`);
    console.log(`  └─ Link Agendamento: /agendar/${salao1.slug}`);

    // Optionally create some starting data for this salon
    const prof = await prisma.professional.create({
        data: {
            salonId: salao1.id,
            name: 'Amanda Souza',
            role: 'Cabeleireira Senior',
        }
    });

    const serv = await prisma.service.create({
        data: {
            salonId: salao1.id,
            name: 'Corte Feminino',
            price: 120.0,
            durationMins: 60,
            professionalId: prof.id
        }
    });

    console.log(`✅ Profissional e Serviço teste criados para o Salão.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
