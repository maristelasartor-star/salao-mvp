import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

export function BookingView() {
    const { slug } = useParams<{ slug: string }>();
    const [step, setStep] = useState(1);
    const [salon, setSalon] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Selections
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedProf, setSelectedProf] = useState<any | null>(null);
    const [clientName, setClientName] = useState<string>('');
    const [clientPhone, setClientPhone] = useState<string>('');
    const [isCheckingDay, setIsCheckingDay] = useState(false);
    const [dayIsFull, setDayIsFull] = useState(false);
    const [isWaitlistAccepted, setIsWaitlistAccepted] = useState(false);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    useEffect(() => {
        const fetchSalon = async () => {
            if (!slug) return;
            try {
                const data = await api.public.getSalon(slug);
                setSalon(data);
            } catch (error) {
                console.error("Falha ao carregar salão", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchSalon();
    }, [slug]);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!selectedProf || !slug || !selectedService || !selectedDate) return;

            setIsCheckingDay(true);
            setDayIsFull(false);
            setIsWaitlistAccepted(false);
            setSelectedTime(null); // Reset time when date changes

            try {
                const apts = await api.public.checkAvailability(slug, selectedDate, selectedProf.id);

                // Simulação de Expediente (09h as 18h)
                const workStart = 9 * 60;
                const workEnd = 18 * 60;

                // Build a list of occupied intervals for the selected professional
                const occupied: { start: number; end: number }[] = [];
                apts.forEach((a: any) => {
                    const start = a.startTime ? parseInt(a.startTime.split(':')[0]) * 60 + parseInt(a.startTime.split(':')[1]) : 0;
                    const duration = a.service?.durationMins ?? 60;
                    occupied.push({ start, end: start + duration });
                });

                // Generate candidate times in 30‑minute steps
                const step = 30;
                const candidates: string[] = [];
                for (let mins = workStart; mins + (selectedService?.durationMins ?? 30) <= workEnd; mins += step) {
                    const hour = Math.floor(mins / 60).toString().padStart(2, '0');
                    const minute = (mins % 60).toString().padStart(2, '0');
                    candidates.push(`${hour}:${minute}`);
                }

                // Filter out times that would overlap any occupied interval
                const filtered = candidates.filter((time) => {
                    const start = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
                    const end = start + (selectedService?.durationMins ?? 30);
                    return !occupied.some((int) => !(end <= int.start || start >= int.end));
                });

                const mockTimes = filtered;
                if (mockTimes.length === 0) {
                    setDayIsFull(true);
                    setAvailableTimes([]);
                } else {
                    setAvailableTimes(mockTimes);
                }


            } catch (err) {
                console.error("Erro ao buscar vagas", err);
            } finally {
                setIsCheckingDay(false);
            }
        };
        fetchAvailability();
    }, [selectedDate, selectedProf, slug, selectedService]);

    if (notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="text-center p-8 bg-card rounded-2xl border border-border">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Estabelecimento não encontrado</h2>
                    <p className="text-muted-foreground mt-2">Verifique o link ou entre em contato com o estabelecimento.</p>
                </div>
            </div>
        );
    }

    const nextStep = () => {
        setStep(s => Math.min(s + 1, 5));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const prevStep = () => {
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Brand Header */}
            <div className="text-center mb-10">
                <div className="inline-flex h-16 w-16 bg-primary/10 rounded-2xl items-center justify-center mb-4">
                    <span className="text-primary font-black tracking-tighter text-2xl">FA</span>
                </div>
                {/* Dynamically display actual Salon Name */}
                <h1 className="text-3xl font-bold text-foreground">{salon?.name || 'Carregando...'}</h1>
                <p className="text-muted-foreground mt-2">Agende seu horário de forma rápida e fácil.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary -z-10 rounded-full"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-300 rounded-full" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

                {['Serviço', 'Profissional', 'Data', 'Seus Dados', 'Confirmação'].map((label, i) => {
                    const isPast = step > i + 1;
                    const isCurrent = step === i + 1;
                    return (
                        <div key={label} className="flex flex-col items-center z-10">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-sm ${isPast ? 'bg-primary text-primary-foreground' :
                                isCurrent ? 'bg-background border-2 border-primary text-primary' :
                                    'bg-secondary text-muted-foreground border border-border'
                                }`}>
                                {isPast ? <CheckCircle className="h-4 w-4 md:h-5 md:w-5" /> : (i + 1)}
                            </div>
                            <span className={`mt-2 text-[10px] md:text-xs font-medium text-center max-w-[60px] md:max-w-none leading-tight ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="glass-card p-6 md:p-8 min-h-[400px]">
                {/* Step 1: Service */}
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in right-0">
                        <h2 className="text-xl font-semibold mb-6">1. Escolha o serviço</h2>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                        ) : salon?.services?.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">Nenhum serviço cadastrado neste salão.</div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {salon?.services.map((service: any) => (
                                    <div
                                        key={service.id}
                                        onClick={() => setSelectedService(service)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedService?.id === service.id
                                            ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-foreground">{service.name}</h3>
                                            <span className="font-bold text-primary">R$ {service.price}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4 mr-1.5" />
                                            {service.durationMins} min
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Professional */}
                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-xl font-semibold mb-6">2. Escolha o profissional</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {selectedService && (
                                <div
                                    onClick={() => setSelectedProf(selectedService.professional)}
                                    className={`flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all text-center ${selectedProf?.id === selectedService.professional.id
                                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3">
                                        <img src={`https://ui-avatars.com/api/?name=${selectedService.professional.name}&background=random&color=fff`} className="w-full h-full rounded-full" alt={selectedService.professional.name} />
                                    </div>
                                    <h3 className="font-semibold text-foreground">{selectedService.professional.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{selectedService.professional.role}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Date & Time */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-xl font-semibold">3. Escolha a data e horário</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Real Calendar */}
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Data Disponível</h3>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={selectedDate || ''}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                />
                            </div>
                            {/* Dynamic Panel: Times OR Waitlist */}
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {isCheckingDay ? "Buscando vagas..." : dayIsFull ? "Aviso de Lotação" : "Horários Livres"}
                                </h3>

                                {isCheckingDay ? (
                                    <div className="h-40 flex items-center justify-center border-2 border-dashed border-border rounded-xl">
                                        <p className="text-muted-foreground animate-pulse text-sm">Consultando agenda de {selectedProf?.name.split(' ')[0]}...</p>
                                    </div>
                                ) : (!selectedDate) ? (
                                    <div className="h-40 flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/20">
                                        <p className="text-muted-foreground text-sm text-center px-4">Selecione uma data ao lado para ver os horários do profissional.</p>
                                    </div>
                                ) : dayIsFull ? (
                                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                                            Infelizmente, <strong>{selectedProf?.name}</strong> esgotou os horários para essa data.
                                        </p>
                                        <div className="pt-2 border-t border-amber-200/50 dark:border-amber-800/50">
                                            {salon?.plan !== 'start' && (
                                                <p className="text-sm font-semibold mb-3">Deseja entrar na Lista de Espera se alguém desistir?</p>
                                            )}
                                            <div className="flex gap-3">
                                                {salon?.plan !== 'start' && (
                                                    <button
                                                        onClick={() => {
                                                            setIsWaitlistAccepted(true);
                                                            setStep(4);
                                                        }}
                                                        className="flex-1 py-1.5 rounded-lg text-sm font-bold transition-all bg-background border border-amber-500 text-amber-700 hover:bg-amber-100"
                                                    >
                                                        Sim, me avise
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => { setSelectedDate(null); setDayIsFull(false); }}
                                                    className="flex-1 py-1.5 rounded-lg bg-background border border-border text-foreground hover:bg-muted text-sm font-medium transition-all"
                                                >
                                                    Mudar dia
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                        {availableTimes.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`p-2 rounded-lg border text-sm font-medium transition-colors ${selectedTime === time
                                                    ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                                    : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Client Details */}
                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-md mx-auto">
                        <h2 className="text-xl font-semibold mb-2">4. Seus Dados</h2>
                        <p className="text-sm text-muted-foreground mb-6">Precisamos de algumas informações para confirmar seu agendamento.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Nome Completo</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        className="pl-10 w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">WhatsApp</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-muted-foreground font-medium text-sm">+55</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        className="pl-12 w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">* Enviaremos mensagens de confirmação e lembretes para este número.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Confirmation */}
                {step === 5 && (
                    <div className="animate-in fade-in slide-in-from-right-4 text-center max-w-sm mx-auto">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Quase lá, {clientName.split(' ')[0]}!</h2>
                        <p className="text-muted-foreground mb-6">Confirme os dados do seu agendamento abaixo.</p>

                        <div className="bg-secondary/50 rounded-xl p-4 text-left space-y-3 mb-8 border border-border">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Serviço:</span>
                                <span className="font-semibold text-foreground">{selectedService?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Data/Hora:</span>
                                <span className={`font-semibold ${isWaitlistAccepted ? 'text-amber-500' : 'text-foreground'}`}>
                                    {selectedDate && selectedDate.split('-').reverse().join('/')}
                                    {isWaitlistAccepted ? ' (Lista de Espera)' : ` às ${selectedTime}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Profissional:</span>
                                <span className="font-semibold text-foreground">{selectedProf?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">WhatsApp:</span>
                                <span className="font-semibold text-foreground">{clientPhone}</span>
                            </div>
                            <div className="pt-3 mt-3 border-t border-border flex justify-between font-bold">
                                <span>Total:</span>
                                <span className="text-primary">R$ {selectedService?.price.toFixed(2)}</span>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground mb-6">
                            * Ao confirmar, você concorda com nossa política de cancelamento (tolerância de atraso de 15 min).
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 flex justify-between items-center">
                {step > 1 ? (
                    <button
                        onClick={prevStep}
                        className="px-6 py-2.5 rounded-xl font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                        Voltar
                    </button>
                ) : <div />}

                {step < 5 ? (
                    <button
                        onClick={nextStep}
                        disabled={
                            (step === 1 && !selectedService) ||
                            (step === 2 && !selectedProf) ||
                            (step === 3 && (!selectedDate || (!selectedTime && !isWaitlistAccepted))) ||
                            (step === 4 && (!clientName || !clientPhone || clientPhone.length < 10))
                        }
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold flex items-center shadow-md shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Avançar <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={async () => {
                            if (!slug) return;
                            try {
                                setLoading(true);
                                await api.public.bookAppointment(slug, {
                                    clientName: clientName,
                                    clientPhone: clientPhone,
                                    professionalId: selectedProf.id,
                                    serviceId: selectedService.id,
                                    date: selectedDate,
                                    startTime: isWaitlistAccepted ? '00:00' : selectedTime,
                                    isWaitlist: isWaitlistAccepted
                                });
                                alert(isWaitlistAccepted ? 'Inscrito na Lista de Espera!' : 'Agendamento confirmado com sucesso!');
                                // Reset form or show success screen here
                                setStep(1);
                                setSelectedService(null);
                                setSelectedProf(null);
                                setSelectedDate(null);
                                setSelectedTime(null);
                            } catch (e: any) {
                                console.error('BOOKING ERROR DETAILS:', e);
                                alert('Erro ao salvar no banco: ' + (e.message || e));
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                        className="bg-emerald-500 text-white w-full py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all flex items-center justify-center">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirmar Agendamento via WhatsApp'}
                    </button>
                )}
            </div>
        </div>
    );
}
