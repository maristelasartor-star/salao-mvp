import { useState, useEffect } from 'react';
import { UserCircle, Loader2, Plus, Trash2, CalendarHeart, Crown } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { canAddProfessional } from '../../lib/permissions';

export function ProfessionalView() {
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const { salon } = useAuth();

    // Form state
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [color, setColor] = useState('bg-blue-500');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const colorOptions = [
        { label: 'Azul', value: 'bg-blue-500' },
        { label: 'Roxo', value: 'bg-indigo-500' },
        { label: 'Rosa', value: 'bg-pink-500' },
        { label: 'Laranja', value: 'bg-orange-500' },
        { label: 'Verde', value: 'bg-emerald-500' },
    ];

    // 🔗 NEXANO CHECKOUT LINK
    const NEXANO_CHECKOUT_PRO = "https://checkout.nexano.com.br/checkout/cmm9xa6w1054n1yp9i3rblp4z?offer=8ZXJ2YN";

    const fetchProfessionals = async () => {
        setLoading(true);
        try {
            const data = await api.getProfessionals();
            setProfessionals(data);
        } catch (error) {
            console.error("Erro ao buscar profissionais:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`CUIDADO: Tem certeza que deseja excluir o profissional ${name}? TODOS os agendamentos e serviços atrelados a ele serão APAGADOS! Esta é uma ação destrutiva.`)) return;

        try {
            await api.deleteProfessional(id);
            fetchProfessionals();
        } catch (error) {
            alert("Erro ao excluir profissional.");
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.createProfessional({ name, role, color });
            setIsAdding(false);
            setName('');
            setRole('');
            setColor('bg-blue-500');
            fetchProfessionals();
        } catch (error) {
            alert("Erro ao criar profissional.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center">
                        <UserCircle className="w-6 h-6 mr-2 text-primary" />
                        Equipe de Profissionais
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gerencie os colaboradores que atendem no salão.</p>
                </div>

                <button
                    onClick={() => {
                        const canAdd = canAddProfessional(salon?.plan || 'start', professionals.length);
                        if (!canAdd) {
                            setIsPaywallOpen(true);
                        } else {
                            setIsAdding(!isAdding);
                        }
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center"
                >
                    {isAdding ? 'Cancelar' : <><Plus className="w-4 h-4 mr-2" /> Novo Membro</>}
                </button>
            </div>

            {/* Paywall Overlay */}
            {isPaywallOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-lg rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center border border-border">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/10">
                            <Crown className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-foreground">Limite de Profissionais</h3>
                        <p className="text-muted-foreground mb-8 text-sm">
                            O Plano <span className="uppercase font-bold text-foreground">{(salon?.plan || 'start')}</span> permite até {professionals.length} profissionais. Faça o upgrade agora para desbloquear novas vagas e expandir sua equipe!
                        </p>

                        <a href={`${NEXANO_CHECKOUT_PRO}?email=${salon?.email || ''}`} target="_blank" rel="noopener noreferrer" className="block w-full mb-3 bg-foreground text-background py-3 rounded-full font-bold shadow-lg hover:scale-[1.02] transition-transform">
                            Ver Planos de Upgrade
                        </a>
                        <button onClick={() => setIsPaywallOpen(false)} className="text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors">
                            Talvez mais tarde
                        </button>
                    </div>
                </div>
            )}

            {/* Add Form */}
            {isAdding && (
                <div className="glass-card p-6 animate-in slide-in-from-top-4 fade-in duration-300 border-2 border-primary/20">
                    <h3 className="text-lg font-bold mb-4">Adicionar Novo Profissional</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                        <div className="lg:col-span-4">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Nome</label>
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Lucas Silva" className="w-full p-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div className="lg:col-span-4">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Especialidade / Cargo</label>
                            <input required type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Ex: Barbeiro Sênior" className="w-full p-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div className="lg:col-span-3">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Cor na Agenda</label>
                            <div className="flex items-center space-x-2">
                                <select required value={color} onChange={e => setColor(e.target.value)} className="w-full p-2.5 bg-background border border-border rounded-lg text-sm">
                                    {colorOptions.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                                <div className={`w-8 h-8 rounded-full shrink-0 ${color}`} />
                            </div>
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
            ) : professionals.length === 0 ? (
                <div className="glass-card p-12 text-center text-muted-foreground">
                    Nenhum profissional cadastrado ainda.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {professionals.map((prof) => (
                        <div key={prof.id} className="glass-card p-6 flex flex-col items-center text-center border border-border hover:border-primary/50 transition-colors group relative overflow-hidden">

                            {/* Color Accent Top Bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${prof.color}`} />

                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-md ${prof.color}`}>
                                {prof.name.charAt(0)}
                            </div>

                            <h3 className="text-lg font-bold text-foreground">{prof.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{prof.role}</p>

                            <div className="w-full bg-secondary/50 rounded-lg p-2.5 flex items-center justify-center text-xs font-semibold text-muted-foreground mb-4">
                                <CalendarHeart className="w-4 h-4 mr-2" />
                                Visível na Agenda
                            </div>

                            <button
                                onClick={() => handleDelete(prof.id, prof.name)}
                                className="w-full py-2 flex items-center justify-center text-sm font-semibold text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Desligar Equipe
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
