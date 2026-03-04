import { useState, useEffect } from 'react';
import { Users, Loader2, Search, Trash2, Phone, Calendar as CalendarIcon, AlertTriangle, X } from 'lucide-react';
import { api } from '../../lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseLocalDate } from '../../lib/utils';

export function ClientView() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedClient, setSelectedClient] = useState<any>(null); // For the modal

    const fetchClients = async () => {
        setLoading(true);
        try {
            const data = await api.getClients();
            setClients(data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o cliente ${name} e todo seu histórico de agendamentos?`)) return;

        try {
            await api.deleteClient(id);
            if (selectedClient?.id === id) setSelectedClient(null);
            fetchClients();
        } catch (error) {
            alert("Erro ao excluir cliente.");
        }
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'completed': return <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full text-xs font-semibold">Concluído</span>;
            case 'confirmed': return <span className="bg-blue-500/10 text-blue-500 px-2.5 py-0.5 rounded-full text-xs font-semibold">Confirmado</span>;
            case 'no-show': return <span className="bg-destructive/10 text-destructive px-2.5 py-0.5 rounded-full text-xs font-semibold">Faltou</span>;
            default: return <span className="bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full text-xs font-semibold">Pendente</span>;
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 relative">

            {/* Modal de Histórico do Cliente */}
            {selectedClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{selectedClient.name}</h2>
                                <div className="flex items-center text-muted-foreground mt-2 text-sm">
                                    <Phone className="w-4 h-4 mr-1.5" />
                                    {selectedClient.phone}
                                    <span className="mx-3">•</span>
                                    <CalendarIcon className="w-4 h-4 mr-1.5" />
                                    Cliente desde {format(new Date(selectedClient.createdAt), "MMMM 'de' yyyy", { locale: ptBR })}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="p-2 hover:bg-secondary rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body: Appointsment History */}
                        <div className="p-6 overflow-y-auto flex-1 bg-secondary/20">
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                                Histórico de Agendamentos ({selectedClient.appointments?.length || 0})
                            </h3>

                            {(!selectedClient.appointments || selectedClient.appointments.length === 0) ? (
                                <div className="text-center p-8 text-muted-foreground bg-background rounded-xl border border-border border-dashed">
                                    Nenhum agendamento encontrado para este cliente.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedClient.appointments.map((apt: any) => (
                                        <div key={apt.id} className="bg-background border border-border rounded-xl p-4 hover:border-primary/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-3">
                                                    <span className="font-bold text-foreground">{apt.service?.name || "Serviço Excluído"}</span>
                                                    {getStatusChip(apt.status)}
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                                    {format(parseLocalDate(apt.date), "dd 'de' MMMM, yyyy", { locale: ptBR })} às <strong className="ml-1 text-foreground">{apt.startTime}</strong>
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Com {apt.professional?.name || "Profissional Excluído"}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-lg">R$ {apt.service?.price?.toFixed(2) || "0.00"}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center">
                        <Users className="w-6 h-6 mr-2 text-primary" />
                        Gestão de Clientes
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Visualize e gerencie a carteira de clientes do salão.</p>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou celular..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Cliente</th>
                                <th className="px-6 py-4 font-semibold">Contato</th>
                                <th className="px-6 py-4 font-semibold text-center">Agendamentos</th>
                                <th className="px-6 py-4 font-semibold text-center">No-Shows</th>
                                <th className="px-6 py-4 font-semibold">Cliente Desde</th>
                                <th className="px-6 py-4 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            <button
                                                onClick={() => setSelectedClient(client)}
                                                className="font-bold text-foreground hover:text-primary transition-colors text-left flex items-center group w-full"
                                            >
                                                {client.name}
                                                <span className="opacity-0 group-hover:opacity-100 ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full transition-opacity whitespace-nowrap">
                                                    Ver Histórico
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-muted-foreground">
                                                <Phone className="w-3 h-3 mr-1.5" />
                                                {client.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold text-xs">
                                                {client._count?.appointments || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {(client.appointments?.filter((a: any) => a.status === 'no-show').length || 0) > 0 ? (
                                                <div className="inline-flex items-center justify-center text-destructive bg-destructive/10 px-2 py-0.5 rounded-md font-semibold text-xs border border-destructive/20">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    {client.appointments?.filter((a: any) => a.status === 'no-show').length}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground opacity-50">0</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex items-center">
                                                <CalendarIcon className="w-3 h-3 mr-1.5" />
                                                {format(new Date(client.createdAt), "dd MMM yyyy", { locale: ptBR })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(client.id, client.name)}
                                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                                title="Excluir Cliente"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
