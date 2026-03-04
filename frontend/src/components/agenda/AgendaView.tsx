import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, MessageCircle, Plus, X, Lock, ListOrdered } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../lib/api';
import { parseLocalDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function AgendaView() {
    const { salon } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewType, setViewType] = useState<'daily' | 'weekly'>('daily');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApt, setSelectedApt] = useState<any | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Modal Admin Booking State
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [newApt, setNewApt] = useState<{ clientName: string; clientPhone: string; date: string; startTime: string; serviceId: string; professionalId: string; status?: string }>({
        clientName: '', clientPhone: '', date: '', startTime: '', serviceId: '', professionalId: ''
    });
    const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

    const fetchAgendaAndContext = async () => {
        setLoading(true);
        try {
            const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            const [res, srvs] = await Promise.all([
                api.getAgenda(dateString),
                api.getServices()
            ]);
            setAppointments(res.appointments);
            setProfessionals(res.professionals);
            setServices(srvs);
        } catch (error) {
            console.error("Erro ao buscar agenda:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgendaAndContext();
    }, [currentDate]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            await api.updateBookingStatus(id, newStatus);
            setSelectedApt(null);
            fetchAgendaAndContext();
        } catch (error) {
            console.error("Erro ao atualizar status", error);
            alert("Erro ao atualizar status do agendamento");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCreateAdminBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsBookingSubmitting(true);
        try {
            await api.createAdminBooking(newApt);
            setIsBookingModalOpen(false);
            setNewApt({ clientName: '', clientPhone: '', date: '', startTime: '', serviceId: '', professionalId: '' });
            alert("Agendamento bloqueado com sucesso na agenda!");
            fetchAgendaAndContext(); // Reload agenda
        } catch (error) {
            alert("Erro ao criar agendamento presencial.");
        } finally {
            setIsBookingSubmitting(false);
        }
    };

    const handleWhatsAppMsg = (apt: any, isReminder = false) => {
        const phoneDigits = apt.client.phone.replace(/\D/g, ''); // Remove máscara
        let dataApt = apt.date;
        try { dataApt = format(parseLocalDate(apt.date), "dd/MM 'às'", { locale: ptBR }); } catch (e) { }

        let msg = "";
        if (isReminder) {
            msg = `Olá ${apt.client.name}! Não esqueça, você tem ${apt.service.name} com ${apt.professional.name} amanhã (${dataApt} ${apt.startTime}). Até lá!`;
        } else {
            msg = `Olá ${apt.client.name}, seu agendamento de ${apt.service.name} com ${apt.professional.name} para o dia ${dataApt} ${apt.startTime} está confirmado!`;
        }

        const encodedMsg = encodeURIComponent(msg);
        const url = `https://wa.me/55${phoneDigits}?text=${encodedMsg}`;
        window.open(url, '_blank');
    };

    const hours = Array.from({ length: 12 }, (_, i) => i + 8);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'border-emerald-500 text-emerald-700 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20';
            case 'pending': return 'border-amber-500 text-amber-700 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/20';
            case 'completed': return 'border-blue-500 text-blue-700 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/20';
            case 'no-show': return 'border-destructive text-destructive bg-destructive/10';
            case 'blocked': return 'border-slate-800 text-slate-100 bg-slate-800 dark:bg-slate-900 border-dashed opacity-80';
            default: return 'border-border bg-secondary';
        }
    };

    const waitlist = appointments.filter(a => a.status === 'waitlist');
    const validAppointments = appointments.filter(a => a.status !== 'waitlist');

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Toolbar */}
            <div className="glass-card mb-6 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Date Navigation */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setCurrentDate(addDays(currentDate, -1))}
                            className="p-2 hover:bg-secondary rounded-full transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-bold text-center text-foreground capitalize mr-2">
                            {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                        </h2>
                        {waitlist.length > 0 && (
                            <div className="flex items-center bg-amber-500/20 text-amber-600 dark:text-amber-500 px-3 py-1 rounded-full text-xs font-bold animate-pulse cursor-help" title="Clientes aguardando liberação de horários neste dia.">
                                <ListOrdered className="w-3.5 h-3.5 mr-1.5" />
                                {waitlist.length} na Espera
                            </div>
                        )}
                        <button
                            onClick={() => setCurrentDate(addDays(currentDate, 1))}
                            className="p-2 hover:bg-secondary rounded-full transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition-colors font-medium"
                    >
                        Hoje
                    </button>
                </div>

                {/* Filters and Actions */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-secondary/50 rounded-lg p-1 border border-border">
                        <button
                            onClick={() => setViewType('daily')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewType === 'daily' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Diário
                        </button>
                        <button
                            onClick={() => setViewType('weekly')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewType === 'weekly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Semanal
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (salon?.plan === 'start') {
                                    alert("🔒 O Bloqueio de Horários é exclusivo para planos Pro e Elite. Faça o upgrade para utilizar.");
                                    return;
                                }
                                setNewApt({ ...newApt, status: 'blocked', serviceId: services[0]?.id || '' });
                                setIsBookingModalOpen(true);
                            }}
                            className={`${salon?.plan === 'start' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'} border px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center`}
                            title={salon?.plan === 'start' ? 'Exclusivo Plano Pro' : ''}
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Bloquear
                        </button>
                        <button
                            onClick={() => setIsBookingModalOpen(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm shadow-primary/30 transition-all flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Agendamento
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="glass-card flex-1 overflow-auto bg-white/50 dark:bg-zinc-950/50">
                <div className="min-w-[800px]">
                    {/* Header Row (Professionals) */}
                    <div className="flex border-b border-border sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
                        <div className="w-20 border-r border-border shrink-0 flex flex-col items-center justify-center p-3">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Horários</span>
                            <div className="mt-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">75% Ocupado</div>
                        </div>
                        {professionals.map(prof => (
                            <div key={prof.id} className="flex-1 flex flex-col items-center py-3 border-r border-border last:border-0">
                                <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center text-white text-xs font-bold ${prof.color || 'bg-primary'} shadow-sm shadow-black/10`}>
                                    {prof.name.charAt(0)}
                                </div>
                                <span className="font-semibold text-sm text-foreground">{prof.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Time Slots */}
                    <div className="relative">
                        {/* Current Time Indicator (Mock positioned at 10:45) */}
                        <div className="absolute left-20 right-0 h-px bg-primary z-20 pointer-events-none" style={{ top: '165px' }}>
                            <div className="absolute -left-[4.5rem] -top-2.5 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                10:45
                            </div>
                            <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary" />
                        </div>

                        {loading && (
                            <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}

                        {hours.map(hour => (
                            <div key={hour} className="flex border-b border-border last:border-0 relative h-16 group">
                                {/* Time Label */}
                                <div className="w-20 border-r border-border shrink-0 flex items-start justify-end pr-3 pt-2">
                                    <span className="text-xs font-medium text-muted-foreground">{hour}:00</span>
                                </div>

                                {/* Colunas por Profissional */}
                                {professionals.map(prof => (
                                    <div key={`${hour}-${prof.id}`} className="flex-1 border-r border-border last:border-0 relative hover:bg-secondary/30 transition-colors cursor-pointer p-1">

                                        {/* Render Appointments logic here based on time and prof */}
                                        {validAppointments.map(apt => {
                                            if (apt.professionalId === prof.id && parseInt(apt.startTime.split(':')[0]) === hour) {
                                                const startMin = parseInt(apt.startTime.split(':')[1]);
                                                const topPos = (startMin / 60) * 100;
                                                const height = apt.status === 'blocked' ? 4 : (apt.service.durationMins / 60) * 4;

                                                return (
                                                    <div
                                                        key={apt.id}
                                                        onClick={() => setSelectedApt(apt)}
                                                        className={`absolute left-1 right-1 rounded-md border-l-[3px] p-2 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer z-10 ${getStatusColor(apt.status)}`}
                                                        style={{ top: `${topPos}%`, height: `${height}rem`, minHeight: '3.5rem' }}
                                                    >
                                                        <div className="flex items-center justify-between pointer-events-none">
                                                            <span className="text-xs font-bold truncate pr-2">
                                                                {apt.status === 'blocked' ? '🚫 Bloqueado' : apt.client.name}
                                                            </span>
                                                            <span className="text-[10px] font-semibold opacity-70 whitespace-nowrap">{apt.startTime}</span>
                                                        </div>
                                                        <span className="text-[11px] font-medium opacity-80 mt-1 truncate pointer-events-none">{apt.service.name}</span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Appointment Details Modal */}
            {selectedApt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="glass-card max-w-sm w-full p-6 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedApt(null)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            <span className="text-xl">&times;</span>
                        </button>

                        <h3 className="text-xl font-bold mb-4">Detalhes do Agendamento</h3>

                        <div className="space-y-3 mb-6">
                            <div>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Cliente</span>
                                <p className="font-medium">{selectedApt.client.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">WhatsApp</span>
                                    <p className="font-medium">{selectedApt.client.phone}</p>
                                </div>
                                <button
                                    onClick={() => handleWhatsAppMsg(selectedApt, false)}
                                    className="p-1.5 mt-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-md transition-colors"
                                    title="Enviar Confirmação"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Serviço</span>
                                    <p className="font-medium">{selectedApt.service.name}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Valor</span>
                                    <p className="font-medium text-emerald-600 font-bold">R$ {selectedApt.service.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Horário e Profissional</span>
                                <p className="font-medium">{selectedApt.startTime} com {selectedApt.professional.name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status Atual</span>
                                <div className={`inline-block mt-1 px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedApt.status)}`}>
                                    {selectedApt.status === 'pending' && 'Pendente'}
                                    {selectedApt.status === 'confirmed' && 'Confirmado'}
                                    {selectedApt.status === 'completed' && 'Concluído'}
                                    {selectedApt.status === 'no-show' && 'Faltou'}
                                </div>
                            </div>

                            <button
                                onClick={() => handleWhatsAppMsg(selectedApt, true)}
                                className="w-full mt-2 flex items-center justify-center p-2 bg-slate-100 dark:bg-zinc-800 text-foreground hover:bg-slate-200 dark:hover:bg-zinc-700 border border-border rounded-lg text-sm font-semibold transition-colors"
                            >
                                <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                                Enviar Lembrete de 24h
                            </button>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Alterar Status</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusUpdate(selectedApt.id, 'confirmed')}
                                    className="p-2 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    Confirmar
                                </button>
                                <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusUpdate(selectedApt.id, 'completed')}
                                    className="p-2 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    Concluir
                                </button>
                                <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusUpdate(selectedApt.id, 'no-show')}
                                    className="p-2 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    Faltou
                                </button>
                                <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusUpdate(selectedApt.id, 'pending')}
                                    className="p-2 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    Pendente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE ADMIN BOOKING MODAL */}
            {isBookingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="glass-card max-w-lg w-full p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsBookingModalOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Bloquear Horário (Admin)</h3>
                            </div>
                        </div>

                        <form onSubmit={handleCreateAdminBooking} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ex: Maria"
                                        value={newApt.clientName}
                                        onChange={e => setNewApt({ ...newApt, clientName: e.target.value })}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">WhatsApp</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="(11) 99999-9999"
                                        value={newApt.clientPhone}
                                        onChange={e => setNewApt({ ...newApt, clientPhone: e.target.value })}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Data</label>
                                    <input
                                        required
                                        type="date"
                                        value={newApt.date}
                                        onChange={e => setNewApt({ ...newApt, date: e.target.value })}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Horário</label>
                                    <input
                                        required
                                        type="time"
                                        value={newApt.startTime}
                                        onChange={e => setNewApt({ ...newApt, startTime: e.target.value })}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Serviço</label>
                                    <select
                                        required
                                        value={newApt.serviceId}
                                        onChange={e => setNewApt({ ...newApt, serviceId: e.target.value })}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                    >
                                        <option value="">Selecione...</option>
                                        {services.map(s => <option key={s.id} value={s.id}>{s.name} (R$ {s.price})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Profissional</label>
                                    <select
                                        required
                                        value={newApt.professionalId}
                                        onChange={e => setNewApt({ ...newApt, professionalId: e.target.value })}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                    >
                                        <option value="">Selecione...</option>
                                        {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsBookingModalOpen(false)}
                                    className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-lg font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isBookingSubmitting}
                                    className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-bold flex items-center transition-colors disabled:opacity-50"
                                >
                                    {isBookingSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar e Bloquear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
