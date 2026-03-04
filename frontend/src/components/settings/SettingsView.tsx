import { useState } from 'react';
import { User, Lock, Mail, Save, AlertCircle, Link, Copy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function SettingsView() {
    const { salon } = useAuth();

    // Controlled inputs for dummy UI
    const [name, setName] = useState(salon?.name || '');
    const [email, setEmail] = useState(salon?.email || '');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Dados da conta atualizados com sucesso (Simulação).');
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('As senhas novas não coincidem.');
            return;
        }
        alert('Senha alterada com sucesso (Simulação).');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const bookingLink = `${window.location.origin}/agendar/${salon?.slug}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(bookingLink);
        alert('Link copiado para a área de transferência!');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
                    <p className="text-muted-foreground mt-2">Gerencie sua conta e preferências do sistema.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Coluna Esquerda: Dados e Senha */}
                <div className="md:col-span-2 space-y-6">

                    {/* Block 1: Dados Pessoais */}
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center">
                            <User className="w-5 h-5 text-primary mr-2" />
                            <h2 className="font-semibold text-foreground">Dados da Conta</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Nome do Estabelecimento</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">E-mail de Acesso</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 flex items-center rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
                                        <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Block 2: Segurança (Senha) */}
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center">
                            <Lock className="w-5 h-5 text-primary mr-2" />
                            <h2 className="font-semibold text-foreground">Alterar Senha</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSavePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Senha Atual</label>
                                    <input
                                        type="password"
                                        required
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full max-w-sm h-11 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Nova Senha</label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Confirmar Nova Senha</label>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button type="submit" className="bg-secondary text-secondary-foreground border border-border px-4 py-2 flex items-center rounded-md font-medium text-sm hover:bg-secondary/70 transition-colors">
                                        <Lock className="w-4 h-4 mr-2" /> Atualizar Senha
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Suporte e Info */}
                <div className="space-y-6">

                    {/* Block: Link de Agendamento */}
                    <div className="bg-primary rounded-2xl border border-primary/20 shadow-lg p-6 relative overflow-hidden text-primary-foreground">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 pointer-events-none"></div>

                        <div className="flex items-center mb-4 relative z-10">
                            <Link className="w-5 h-5 mr-2" />
                            <h3 className="font-bold">Seu Link de Agendamento</h3>
                        </div>

                        <p className="text-sm text-primary-foreground/80 mb-4 relative z-10">
                            Compartilhe este link na bio do seu Instagram ou WhatsApp para seus clientes agendarem horários online.
                        </p>

                        <div className="flex relative z-10">
                            <input
                                type="text"
                                readOnly
                                value={bookingLink}
                                className="flex-1 bg-black/20 border border-white/20 rounded-l-lg px-3 py-2 text-sm text-white focus:outline-none"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="bg-white text-primary px-3 py-2 rounded-r-lg font-bold hover:bg-white/90 transition-colors flex items-center justify-center"
                                title="Copiar Link"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Block: Suporte */}
                    <div className="bg-primary/5 rounded-2xl border border-primary/20 shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-12 -translate-y-12"></div>

                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Suporte Técnico</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Precisa de ajuda ou encontrou algum problema? Entre em contato com a nossa equipe especializada.
                        </p>

                        <div className="bg-background rounded-lg p-4 border border-border flex flex-col items-center justify-center text-center">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">E-mail Direto</span>
                            <a href="mailto:instaapploja@gmail.com" className="font-medium text-primary hover:underline">
                                instaapploja@gmail.com
                            </a>
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 text-sm">
                        <div className="flex items-start text-muted-foreground mb-4">
                            <AlertCircle className="w-5 h-5 mr-3 text-amber-500 shrink-0 mt-0.5" />
                            <p>As alterações feitas nesta página de demonstração MVP não persistem no banco de dados atualmente.</p>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-border mt-4">
                            <span className="text-muted-foreground font-medium">Versão</span>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">v1.2.0-SaaS</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-border">
                            <span className="text-muted-foreground font-medium">Plano Atual</span>
                            <span className="font-semibold text-primary">Pro Beta</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
