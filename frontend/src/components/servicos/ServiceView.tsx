import { useState, useEffect } from 'react';
import { Scissors, Loader2, Plus, Trash2, Clock, User } from 'lucide-react';
import { api } from '../../lib/api';

export function ServiceView() {
    const [services, setServices] = useState<any[]>([]);
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [durationMins, setDurationMins] = useState('60');
    const [professionalId, setProfessionalId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [servicesData, profsData] = await Promise.all([
                api.getServices(),
                api.getProfessionals()
            ]);
            setServices(servicesData);
            setProfessionals(profsData);
            if (profsData.length > 0) setProfessionalId(profsData[0].id);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o serviço ${name}? Agendamentos futuros com este serviço também serão apagados.`)) return;

        try {
            await api.deleteService(id);
            fetchData();
        } catch (error) {
            alert("Erro ao excluir serviço.");
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.createService({
                name,
                price: parseFloat(price),
                durationMins: parseInt(durationMins),
                professionalId
            });
            setIsAdding(false);
            setName('');
            setPrice('');
            setDurationMins('60');
            fetchData();
        } catch (error) {
            alert("Erro ao criar serviço.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center">
                        <Scissors className="w-6 h-6 mr-2 text-primary" />
                        Gestão de Serviços
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Catálogo de serviços oferecidos pelo salão.</p>
                </div>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center"
                >
                    {isAdding ? 'Cancelar' : <><Plus className="w-4 h-4 mr-2" /> Novo Serviço</>}
                </button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="glass-card p-6 animate-in slide-in-from-top-4 fade-in duration-300 border-2 border-primary/20">
                    <h3 className="text-lg font-bold mb-4">Adicionar Novo Serviço</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                        <div className="lg:col-span-4">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Nome do Serviço</label>
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Corte Degrade" className="w-full p-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Preço (R$)</label>
                            <input required type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full p-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Duração (Min)</label>
                            <input required type="number" min="15" step="15" value={durationMins} onChange={e => setDurationMins(e.target.value)} className="w-full p-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div className="lg:col-span-3">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Profissional</label>
                            <select required value={professionalId} onChange={e => setProfessionalId(e.target.value)} className="w-full p-2.5 bg-background border border-border rounded-lg text-sm">
                                {professionals.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} - {p.role}</option>
                                ))}
                            </select>
                        </div>
                        <div className="lg:col-span-1">
                            <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground p-2.5 rounded-lg font-bold text-sm disabled:opacity-50">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : services.length === 0 ? (
                <div className="glass-card p-12 text-center text-muted-foreground">
                    Nenhum serviço cadastrado ainda.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="glass-card p-5 group flex flex-col justify-between border border-border hover:border-primary/30 transition-colors">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-foreground leading-tight">{service.name}</h3>
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ml-2">
                                        R$ {service.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {service.durationMins} minutos
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <User className="w-4 h-4 mr-2" />
                                        {service.professional?.name || 'Não atribuído'}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(service.id, service.name)}
                                className="w-full py-2 flex items-center justify-center text-sm font-semibold text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Excluir
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
