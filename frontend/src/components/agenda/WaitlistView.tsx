import { useState, useEffect } from 'react';
import { ListOrdered, Clock, Phone, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { PaywallView } from '../shared/PaywallView';

export default function WaitlistView() {
    const [waitlist, setWaitlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { salon } = useAuth();

    useEffect(() => {
        if (salon?.plan !== 'start') {
            fetchWaitlist();
        } else {
            setLoading(false);
        }
    }, [salon]);

    const fetchWaitlist = async () => {
        try {
            setLoading(true);
            const data = await api.getWaitlist();
            setWaitlist(data);
        } catch (error) {
            console.error("Erro ao carregar lista de espera", error);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppClick = (phone: string, clientName: string, profName: string) => {
        const text = `Olá, ${clientName}! Liberamos um horário na agenda do(a) ${profName} que você estava aguardando. Ainda tem interesse?`;
        window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleRemove = async (id: string) => {
        if (!confirm('Remover cliente da Lista de Espera? (Isso cancela a intenção de agendamento)')) return;
        try {
            await api.updateBookingStatus(id, 'cancelled');
            setWaitlist(waitlist.filter(w => w.id !== id));
        } catch (e) {
            alert('Falha ao remover cliente da lista.');
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (salon?.plan === 'start') {
        return (
            <PaywallView
                title="Lista de Espera Inteligente"
                description="capture automaticamente clientes que tentam agendar horários ocupados"
                features={[
                    "Aproveite 100% da sua agenda",
                    "Aumente a receita diária",
                    "Reduza prejuízos com faltas",
                    "Botão direto pro WhatsApp",
                ]}
            />
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                        <ListOrdered className="mr-3 h-8 w-8 text-amber-500" />
                        Lista de Espera
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie os clientes que desejam ser encaixados caso surjam vagas.
                    </p>
                </div>
            </div>

            {waitlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 glass-card border-dashed border-2">
                    <Clock className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Fila Vazia</h2>
                    <p className="text-muted-foreground">Nenhum cliente está aguardando horários no momento.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {waitlist.map((item) => {
                        const dateStr = item.date.split('-').reverse().join('/');
                        return (
                            <div key={item.id} className="relative bg-card rounded-xl border border-amber-200 dark:border-amber-900/50 p-5 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                                {/* Decorative amber top border */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground truncate max-w-[180px]" title={item.client.name}>
                                            {item.client.name}
                                        </h3>
                                        <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 mt-2">
                                            Aguardando Encaixe
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                        title="Remover da Fila"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                                        <span>Data Alvo: <strong className="text-foreground">{dateStr}</strong></span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 mr-2 text-primary" />
                                        <span>Profissional: <strong className="text-foreground">{item.professional.name}</strong></span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <ListOrdered className="w-4 h-4 mr-2 text-primary" />
                                        <span>Serviço: <strong className="text-foreground">{item.service.name}</strong></span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleWhatsAppClick(item.client.phone, item.client.name, item.professional.name)}
                                    className="w-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 py-2.5 rounded-lg flex items-center justify-center font-bold text-sm transition-colors"
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Chamar no WhatsApp
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
