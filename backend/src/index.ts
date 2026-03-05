import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthRequest } from './middleware/auth';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors({ origin: '*' }));
app.use(express.json());

// --- AUTH & SAAS ENDPOINTS --- //

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, slug, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const salon = await prisma.salon.create({
            data: { name, slug, email, password: hashedPassword }
        });

        // Create default Professional
        const pro = await prisma.professional.create({
            data: { name: 'Profissional Padrão', role: 'Especialista', color: 'bg-blue-500', salonId: salon.id }
        });

        // Create default Service
        await prisma.service.create({
            data: { name: 'Corte', durationMins: 30, price: 50, professionalId: pro.id, salonId: salon.id }
        });

        const token = jwt.sign({ salonId: salon.id, slug: salon.slug }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: "Salão criado com sucesso!", token, salon: { id: salon.id, name: salon.name, slug: salon.slug, email: salon.email, plan: salon.plan, createdAt: salon.createdAt } });
    } catch (error: any) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Email ou URL(slug) já em uso.' });
        res.status(500).json({ error: 'Erro ao registrar salão' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, overridePlan } = req.body;
        let salon = await prisma.salon.findUnique({ where: { email } });

        if (!salon) return res.status(401).json({ error: 'Credenciais inválidas' });

        const validPass = await bcrypt.compare(password, salon.password);
        if (!validPass) return res.status(401).json({ error: 'Credenciais inválidas' });

        // --- Demo Mock: Override Plan on Login if requested ---
        if (overridePlan && ['start', 'pro', 'elite'].includes(overridePlan)) {
            salon = await prisma.salon.update({
                where: { id: salon.id },
                data: { plan: overridePlan }
            });
        }
        // -----------------------------------------------------

        const token = jwt.sign({ salonId: salon.id, slug: salon.slug }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, salon: { id: salon.id, name: salon.name, slug: salon.slug, email: salon.email, plan: salon.plan, createdAt: salon.createdAt } });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

// --- NEXANO WEBHOOK --- //
app.post('/api/webhooks/nexano', async (req, res) => {
    try {
        // In a real environment, you must validate the webhook signature from Nexano here
        // const signature = req.headers['x-nexano-signature'];

        const { event, data } = req.body;

        // Example Nexano Payload structure parsing (adjust based on actual Nexano docs)
        if (event === 'PAYMENT_APPROVED' || event === 'SUBSCRIPTION_CREATED') {
            const customerEmail = data?.customer?.email; // Standard way most gateways send
            const purchasedPlan = data?.metadata?.plan || 'pro'; // Default to pro if not specified, or read from product ID

            if (customerEmail) {
                const salon = await prisma.salon.findUnique({ where: { email: customerEmail } });
                if (salon) {
                    await prisma.salon.update({
                        where: { id: salon.id },
                        data: { plan: purchasedPlan }
                    });
                    console.log(`[WEBHOOK] Salon ${salon.slug} upgraded to ${purchasedPlan} via Nexano.`);
                }
            }
        }

        res.status(200).send('Webhook Processed');
    } catch (error) {
        console.error('[WEBHOOK ERROR]', error);
        res.status(500).send('Webhook Error');
    }
});

// Endpoint Público para tela de Agendamento do Cliente (Sem autenticação, baseada no link)
app.get('/api/public/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const salon = await prisma.salon.findUnique({
            where: { slug },
            select: {
                id: true, name: true, plan: true,
                services: { include: { professional: { select: { id: true, name: true, role: true } } } },
                professionals: true
            }
        });

        if (!salon) return res.status(404).json({ error: 'Salão não encontrado' });
        res.json(salon);
    } catch {
        res.status(500).json({ error: 'Erro ao carregar dados do salão' });
    }
});

// O POST de Agendamento público agora precisa do salonId derivado do link.
app.post('/api/public/:slug/bookings', async (req, res) => {
    try {
        const { slug } = req.params;
        const salon = await prisma.salon.findUnique({ where: { slug } });
        if (!salon) return res.status(404).json({ error: 'Salão não encontrado' });

        const { clientName, clientPhone, professionalId, serviceId, date, startTime, isWaitlist } = req.body;

        let client = await prisma.client.findFirst({ where: { phone: clientPhone, salonId: salon.id } });
        if (!client) {
            client = await prisma.client.create({ data: { name: clientName, phone: clientPhone, salonId: salon.id } });
        }

        const apt = await prisma.appointment.create({
            data: {
                salonId: salon.id,
                clientId: client.id,
                professionalId,
                serviceId,
                date,
                startTime: isWaitlist ? '00:00' : startTime, // Dummy time for waitlist
                status: isWaitlist ? 'waitlist' : 'pending'
            }
        });

        res.status(201).json(apt);
    } catch (error) {
        console.error("PRISMA BOOKING ERR:", error);
        res.status(500).json({ error: 'Falha ao agendar' });
    }
});

// Novo endpoint para verificar ocupação de um profissional em um determinado dia
app.get('/api/public/:slug/availability', async (req: any, res: any) => {
    try {
        const { slug } = req.params;
        const { date, professionalId } = req.query;

        const salon = await prisma.salon.findUnique({ where: { slug } });
        if (!salon) return res.status(404).json({ error: 'Salão não encontrado' });

        if (!date || !professionalId) return res.status(400).json({ error: 'Missing parameters' });

        const appointments = await prisma.appointment.findMany({
            where: {
                salonId: salon.id,
                professionalId: professionalId as string,
                date: date as string,
                status: { notIn: ['cancelled', 'no-show', 'waitlist'] } // Includes blocked, pending, completed
            },
            include: { service: true }
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar disponibilidade' });
    }
});

// --- PROTECTED DASHBOARD ENDPOINTS --- //
app.get('/api/dashboard/metrics', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        let dateQuery = req.query.date as string;
        if (!dateQuery) {
            const now = new Date();
            dateQuery = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        }

        const dateAppointments = await prisma.appointment.findMany({
            where: { salonId: req.salonId, date: dateQuery },
            include: { service: true }
        });

        // Faturamento é estritamente os atendimentos CONCLUÍDOS
        const expectedRevenue = dateAppointments
            .filter((a: any) => a.status === 'completed')
            .reduce((acc: number, curr: any) => acc + curr.service.price, 0);

        // Perda engloba apenas os FALTOSOS
        const noShowLoss = dateAppointments
            .filter((a: any) => a.status === 'no-show')
            .reduce((acc: number, curr: any) => acc + curr.service.price, 0);

        // Agendamentos Totais daquele dia
        const appointmentsToday = dateAppointments.length;

        // Ocupação: Supondo 8 vagas/dia por Profissional (Simplificado pro MVP)
        const professionalsCount = await prisma.professional.count({ where: { salonId: req.salonId } });
        const totalCapacitySlots = professionalsCount * 8;
        const occupancyRate = totalCapacitySlots > 0 ? Math.round((appointmentsToday / totalCapacitySlots) * 100) : 0;

        res.json({ appointmentsToday, expectedRevenue, noShowLoss, occupancyRate });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.get('/api/professionals/top', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        const professionals = await prisma.professional.findMany({
            where: { salonId: req.salonId },
            include: { appointments: { where: { status: { not: 'no-show' } }, include: { service: true, client: true }, orderBy: { date: 'desc' } } }
        });

        const ranked = professionals.map((prof: any) => ({
            id: prof.id, name: prof.name, role: prof.role,
            appointments: prof.appointments,
            revenue: prof.appointments.reduce((sum: number, apt: any) => sum + apt.service.price, 0)
        })).sort((a: any, b: any) => b.revenue - a.revenue);

        res.json(ranked);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// --- PROTECTED AGENDA / BOOKING ENDPOINTS --- //
app.get('/api/agenda', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        let dateQuery = req.query.date as string;
        if (!dateQuery) {
            const now = new Date();
            dateQuery = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        }

        const appointments = await prisma.appointment.findMany({
            where: { salonId: req.salonId, date: dateQuery },
            include: { client: true, service: true, professional: true },
            orderBy: { startTime: 'asc' }
        });

        const professionals = await prisma.professional.findMany({ where: { salonId: req.salonId } });
        res.json({ appointments, professionals });
    } catch {
        res.status(500).json({ error: 'Failed' });
    }
});

app.get('/api/waitlist', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        const waitlist = await prisma.appointment.findMany({
            where: { salonId: req.salonId, status: 'waitlist' },
            include: { client: true, service: true, professional: true },
            orderBy: { date: 'asc' }
        });
        res.json(waitlist);
    } catch {
        res.status(500).json({ error: 'Failed' });
    }
});

app.post('/api/bookings/admin', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        const salonId = req.salonId!;
        const { professionalId, serviceId, date, startTime, clientName, clientPhone, status } = req.body;

        const isBlocked = status === 'blocked';

        // --- SaaS GATING: Disallow Blocking for Start Plan ---
        if (isBlocked) {
            const salon = await prisma.salon.findUnique({ where: { id: salonId } });
            if (salon?.plan === 'start') {
                return res.status(403).json({ error: 'Time blocking is not available on the Start plan.' });
            }
        }
        // -----------------------------------------------------

        const finalClientName = isBlocked ? 'Sistema' : clientName;
        const finalClientPhone = isBlocked ? '0000000000' : clientPhone;

        let client = await prisma.client.findFirst({
            where: { phone: finalClientPhone, salonId }
        });

        if (!client) {
            client = await prisma.client.create({
                data: {
                    salonId,
                    name: finalClientName,
                    phone: finalClientPhone,
                }
            });
        }

        const apt = await prisma.appointment.create({
            data: {
                salonId,
                clientId: client.id,
                professionalId,
                serviceId, // For blocked slots, we just use the first service ID to satisfy schema
                date,
                startTime,
                status: isBlocked ? 'blocked' : 'confirmed'
            }
        });
        res.status(201).json(apt);
    } catch (error) {
        console.error('Admin Booking Error:', error);
        res.status(500).json({ error: 'Failed' });
    }
});

app.patch('/api/bookings/:id/status', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        const updatedApt = await prisma.appointment.update({
            where: { id: req.params.id as string, salonId: req.salonId },
            data: { status: req.body.status }
        });
        res.json(updatedApt);
    } catch { res.status(500).json({ error: 'Failed' }); }
});

// --- PROTECTED CLIENTS / SERVICES / PROFESSIONALS ENDPOINTS --- //
app.get('/api/clients', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        const clients = await prisma.client.findMany({
            where: { salonId: req.salonId },
            include: { _count: { select: { appointments: true } }, appointments: { include: { service: true, professional: true }, orderBy: { date: 'desc' } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(clients);
    } catch { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/clients/:id', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        await prisma.client.delete({ where: { id: req.params.id as string, salonId: req.salonId } });
        res.status(204).send();
    } catch { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/services', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        const services = await prisma.service.findMany({
            where: { salonId: req.salonId },
            include: { professional: { select: { id: true, name: true, role: true } } }
        });
        res.json(services);
    } catch { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/services', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        const { name, price, durationMins, professionalId } = req.body;
        const service = await prisma.service.create({ data: { salonId: req.salonId!, name, price, durationMins, professionalId, returnsInDays: 30 } });
        res.status(201).json(service);
    } catch { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/services/:id', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        await prisma.service.delete({ where: { id: req.params.id as string, salonId: req.salonId } });
        res.status(204).send();
    } catch { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/professionals', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        res.json(await prisma.professional.findMany({ where: { salonId: req.salonId } }));
    } catch { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/professionals', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        const { name, role, color } = req.body;

        // --- SaaS GATING: Limit Professionals ---
        const salon = await prisma.salon.findUnique({ where: { id: req.salonId } });
        if (salon?.plan === 'start') {
            const profCount = await prisma.professional.count({ where: { salonId: req.salonId } });
            if (profCount >= 2) {
                return res.status(403).json({ error: 'Limit of professionals reached for Start plan.' });
            }
        }
        // ----------------------------------------

        const professional = await prisma.professional.create({ data: { salonId: req.salonId!, name, role, color } });
        res.status(201).json(professional);
    } catch { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/professionals/:id', authenticateToken as any, async (req: AuthRequest, res: any) => {
    try {
        await prisma.professional.delete({ where: { id: req.params.id as string, salonId: req.salonId } });
        res.status(204).send();
    } catch { res.status(500).json({ error: 'Failed' }); }
});

app.listen(PORT, () => {
    console.log(`🚀 Multi-Tenant Backend running on http://localhost:${PORT}`);
});
