import { MetricCard } from './MetricCard';
import { RevenueChart } from './RevenueChart';
import { DollarSign, Users, CalendarX, TrendingUp, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../lib/api';
import { ProfessionalReportModal } from './ProfessionalReportModal';
import { useAuth } from '../../context/AuthContext';

export function DashboardView() {
    const { salon } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [metrics, setMetrics] = useState<any>(null);
    const [rankedProfs, setRankedProfs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isReportOpen, setIsReportOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const dateStr = format(currentDate, 'yyyy-MM-dd');
                const [mRes, pRes] = await Promise.all([
                    api.getDashboardMetrics(dateStr),
                    api.getTopProfessionals()
                ]);
                setMetrics(mRes);
                setRankedProfs(pRes);
            } catch (err) {
                console.error("Erro ao puxar dados", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentDate]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            {/* Date Toolbar */}
            <div className="flex items-center justify-between bg-card px-4 py-3 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentDate(subDays(currentDate, 1))}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <div className="flex flex-col items-center min-w-[140px]">
                        <span className="text-sm font-semibold capitalize text-foreground">
                            {format(currentDate, "dd 'de' MMMM", { locale: ptBR })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {format(currentDate, 'EEEE', { locale: ptBR })}
                        </span>
                    </div>

                    <button
                        onClick={() => setCurrentDate(addDays(currentDate, 1))}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <button
                    onClick={() => setCurrentDate(new Date())}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors px-4 py-2 bg-primary/10 rounded-lg"
                >
                    Hoje
                </button>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Faturamento do Dia"
                    value={`R$ ${metrics?.expectedRevenue || 0}`}
                    trend="Concluídos"
                    description="entradas reais"
                    icon={DollarSign}
                />
                <MetricCard
                    title="Atendimentos do Dia"
                    value={metrics?.appointmentsToday || "0"}
                    trend="Diário"
                    description="na agenda"
                    icon={Users}
                />
                <MetricCard
                    title="Taxa de Ocupação"
                    value={`${metrics?.occupancyRate || 0}%`}
                    trend="Médio"
                    description="da capacidade total"
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Valor Perdido"
                    value={salon?.plan === 'start' ? '🔒 Plano Pro' : `R$ ${metrics?.noShowLoss || 0}`}
                    trend={salon?.plan === 'start' ? 'Pro' : 'Alerta'}
                    description={salon?.plan === 'start' ? 'Métrica bloqueada' : 'dinheiro não ganho'}
                    icon={CalendarX}
                    isNegativeTrend={salon?.plan !== 'start'}
                />
            </div>

            {/* Main Charts & Lists Row */}
            <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">

                {/* Revenue Chart */}
                <div className="md:col-span-4 lg:col-span-5">
                    <RevenueChart />
                </div>

                {/* Top Professionals Ranking (Side Panel) */}
                <div className="md:col-span-3 lg:col-span-2 space-y-6">
                    <div className="glass-card p-6 h-full flex flex-col">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Top Profissionais</h3>
                                <p className="text-sm text-muted-foreground">Maior faturamento no mês</p>
                            </div>
                            <Sparkles className="h-5 w-5 text-amber-500" />
                        </div>

                        <div className="space-y-6 flex-1">
                            {rankedProfs.slice(0, 4).map((prof, i) => (
                                <div key={prof.id} className="flex items-center">
                                    <div className="relative">
                                        <img src={`https://ui-avatars.com/api/?name=${prof.name}&background=random&color=fff`} alt={prof.name} className="h-10 w-10 rounded-full border-2 border-background" />
                                        {i === 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white ring-2 ring-background">1</span>}
                                        {i === 1 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 text-[10px] font-bold text-white ring-2 ring-background">2</span>}
                                        {i === 2 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-700 text-[10px] font-bold text-white ring-2 ring-background">3</span>}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none text-foreground">{prof.name}</p>
                                        <p className="text-xs text-muted-foreground">{prof.role}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-sm text-primary">
                                        R$ {prof.revenue}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsReportOpen(true)}
                            className="w-full mt-6 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
                        >
                            Ver Relatório Completo
                        </button>
                    </div>
                </div>

            </div>

            <ProfessionalReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                professionals={rankedProfs}
            />

        </div>
    );
}
