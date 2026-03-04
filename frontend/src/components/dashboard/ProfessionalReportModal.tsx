import { X, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProfessionalReportModalProps {
    professionals: any[];
    isOpen: boolean;
    onClose: () => void;
}

export function ProfessionalReportModal({ professionals, isOpen, onClose }: ProfessionalReportModalProps) {
    const [expandedProf, setExpandedProf] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleProf = (id: string) => {
        setExpandedProf(expandedProf === id ? null : id);
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-3xl rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Relatório de Faturamento</h2>
                        <p className="text-sm text-muted-foreground mt-1">Produtividade detalhada por profissional (Últimos agendamentos)</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-background hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Scrollable List */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {professionals.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            Nenhum faturamento registrado ainda.
                        </div>
                    ) : (
                        professionals.map((prof: any, index: number) => (
                            <div key={prof.id} className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-200">

                                {/* Professional Header Row (Clickable) */}
                                <div
                                    onClick={() => toggleProf(prof.id)}
                                    className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:bg-muted/30 select-none"
                                >
                                    <div className="relative">
                                        <img src={`https://ui-avatars.com/api/?name=${prof.name}&background=random&color=fff`} alt={prof.name} className="h-12 w-12 rounded-full border-2 border-background shadow-sm" />
                                        {index === 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">1º</span>}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-foreground">{prof.name}</h3>
                                        <p className="text-xs text-muted-foreground">{prof.role}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Atendimentos</p>
                                            <div className="flex items-center justify-end font-medium text-foreground">
                                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                                {prof.appointments?.length || 0}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Faturamento Total</p>
                                            <div className="flex items-center justify-end text-lg font-bold text-green-600 dark:text-green-500">
                                                <DollarSign className="w-4 h-4" />
                                                {prof.revenue}
                                            </div>
                                        </div>

                                        <div className="pl-4 border-l border-border text-muted-foreground">
                                            {expandedProf === prof.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Appointments List */}
                                {expandedProf === prof.id && (
                                    <div className="bg-muted/10 border-t border-border p-4">
                                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Histórico de Serviços
                                        </h4>

                                        {prof.appointments?.length === 0 ? (
                                            <p className="text-sm text-muted-foreground italic pl-6">Sem agendamentos registrados.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {prof.appointments.map((apt: any) => (
                                                    <div key={apt.id} className="bg-background border border-border/50 rounded-lg p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:border-border transition-colors">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-sm text-foreground">{apt.client?.name || 'Cliente'}</span>
                                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-bold tracking-wider">
                                                                    {apt.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {apt.service?.name} • Duração: {apt.service?.durationMins}m
                                                            </p>
                                                        </div>
                                                        <div className="text-left sm:text-right">
                                                            <p className="text-sm font-semibold text-green-600 dark:text-green-500">
                                                                R$ {apt.service?.price}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground uppercase">
                                                                {format(new Date(`${apt.date}T${apt.startTime}`), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
