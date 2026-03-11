import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, TrendingUp, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LandingView() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    // 🔗 NEXANO CHECKOUT LINKS
    const NEXANO_CHECKOUT_PRO = "https://checkout.nexano.com.br/checkout/cmm9xa6w1054n1yp9i3rblp4z?offer=8ZXJ2YN";
    const NEXANO_CHECKOUT_ELITE = "https://checkout.nexano.com.br/checkout/cmm9xa6w1054n1yp9i3rblp4z?offer=W8IH9BI";

    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30">
            {/* --- HEADER --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span className="text-primary font-black tracking-tighter text-lg">FA</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight">Futur<span className="text-primary">Agenda</span></span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-foreground transition-colors">Funcionalidades</a>
                        <a href="#benefits" className="hover:text-foreground transition-colors">Benefícios</a>
                        <a href="#pricing" className="hover:text-foreground transition-colors">Planos</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                            Entrar
                        </Link>
                        <Link to="/register" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                            Teste Grátis
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6">
                {/* Decorative Background Elements */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full point-events-none -z-10" />
                <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full point-events-none -z-10" />

                <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm font-semibold mb-4 text-primary">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        O Futuro da Gestão de Salões chegou
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1]">
                        Acabe com os buracos na sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">Agenda Inteligente</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Um sistema de agendamento online impulsionado por uma Lista de Espera Automática que preenche vagas vazias e maximiza o faturamento do seu espaço de beleza.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2">
                            Começar Meu Teste de 7 Dias <ChevronRight className="w-5 h-5" />
                        </Link>
                        <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-secondary text-foreground rounded-full text-lg font-bold hover:bg-secondary/80 transition-all flex items-center justify-center">
                            Ver Funcionalidades
                        </a>
                    </div>
                </div>

                {/* Dashboard Mockup Showcase */}
                <div className="mt-20 max-w-6xl mx-auto relative perspective-1000">
                    <div className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl p-2 md:p-4 shadow-2xl overflow-hidden ring-1 ring-white/10">
                        {/* Fake browser header */}
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="relative bg-muted/30 rounded-xl aspect-[16/9] md:aspect-[21/9] flex items-center justify-center border border-border/50 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-amber-500/5 mix-blend-overlay"></div>
                            <h3 className="text-2xl font-bold text-muted-foreground/50 rotate-[-5deg] group-hover:scale-105 transition-transform duration-700">Painel FuturAgenda - Preview</h3>

                            {/* Decorative Floating Cards representing the UI */}
                            <div className="absolute top-8 left-8 p-4 bg-background border border-border rounded-xl shadow-xl rotate-[5deg] animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-500/20 p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-500" /></div>
                                    <div><p className="text-xs text-muted-foreground">Faturamento Hoje</p><p className="font-bold">R$ 1.850,00</p></div>
                                </div>
                            </div>
                            <div className="absolute bottom-8 right-8 p-4 bg-background border border-border rounded-xl shadow-xl rotate-[-5deg] animate-pulse delay-150">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between border-b border-border/50 pb-2"><span className="text-sm font-bold">14:00 - Cliente VIP</span><span className="w-2 h-2 rounded-full bg-primary animate-ping"></span></div>
                                    <div className="flex items-center justify-between"><span className="text-sm font-bold">15:00 - Corte Terapia</span><span className="w-2 h-2 rounded-full bg-primary"></span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="py-24 bg-card px-6 relative border-y border-border/50">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Tudo que o seu negócio de beleza precisa.</h2>
                        <p className="text-lg text-muted-foreground">Esqueça a agenda de papel e as confusões no WhatsApp. Automatize tudo com uma experiência premium para seus clientes.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-background border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <CalendarCheck className="w-7 h-7 text-primary group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Agenda Online 24/7</h3>
                            <p className="text-muted-foreground leading-relaxed">Seu cliente agenda o horário pelo Link da sua Bio no Instagram, a qualquer hora. Sem depender de recepcionista.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-background border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-xs font-bold rounded-full border border-amber-500/20">Exclusivo</span>
                            </div>
                            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <Clock className="w-7 h-7 text-amber-500 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Lista de Espera Mágica</h3>
                            <p className="text-muted-foreground leading-relaxed">Agenda Lotada? O sistema capta quem tentou agendar e coloca numa lista VIP. Liberou vaga? Chame com 1 clique no WhatsApp.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-background border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <TrendingUp className="w-7 h-7 text-emerald-500 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Dashboard de Métricas</h3>
                            <p className="text-muted-foreground leading-relaxed">Painel de controle com faturamento, taxa de abstenção (No-Shows) e profissionais que mais geram lucro.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section id="pricing" className="py-24 px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] rounded-full point-events-none -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Planos que escalam com você</h2>
                        <p className="text-lg text-muted-foreground">Escolha o plano ideal para o momento do seu salão. Cancele quando quiser.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                        <div className="relative p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-2xl font-bold mb-2">Start (Teste)</h3>
                            <p className="text-muted-foreground mb-6">Para estúdios pequenos e autônomos.</p>
                            <div className="flex items-end gap-1 mb-8">
                                <span className="text-5xl font-black">Grátis</span>
                                <span className="text-muted-foreground mb-1 ml-2">por 7 dias</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {['Até 2 Profissionais', 'Serviços Ilimitados', 'Agenda Online (Link Bio)', 'Dashboard Simplificado'].map(i => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /> <span className="font-medium text-sm">{i}</span>
                                    </li>
                                ))}
                                <li className="flex items-center gap-3 opacity-50">
                                    <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded-full flex-shrink-0" /> <span className="text-sm line-through">Módulo Lista de Espera</span>
                                </li>
                                <li className="flex items-center gap-3 opacity-50">
                                    <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded-full flex-shrink-0" /> <span className="text-sm line-through">Métricas de Faltosos</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => isAuthenticated ? window.open(NEXANO_CHECKOUT_PRO, '_blank') : navigate('/register?plan=pro')}
                                className="block w-full py-4 rounded-xl border-2 border-primary text-primary font-bold text-center hover:bg-primary/5 transition-colors"
                            >
                                Testar Grátis
                            </button>
                        </div>

                        {/* Plan PRO (Highlight) */}
                        <div className="relative p-8 rounded-3xl bg-primary text-primary-foreground border border-primary/50 shadow-2xl scale-100 md:scale-105 z-10">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
                                Mais Popular
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <p className="text-primary-foreground/80 mb-6">Para salões e barbearias em expansão.</p>
                            <div className="flex items-end gap-1 mb-8">
                                <span className="text-5xl font-black">R$ 149</span><span className="text-xl font-bold text-primary-foreground/90">,90</span>
                                <span className="text-primary-foreground/70 mb-1 ml-1">/ mês</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {['Até 10 Profissionais', 'Tudo do plano Start', 'Módulo Lista de Espera Completo', 'Métricas e Alertas de No-Shows', 'Bloqueio de Horários'].map(i => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" /> <span className="font-medium text-sm">{i}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => isAuthenticated ? window.open(NEXANO_CHECKOUT_PRO, '_blank') : navigate('/register?plan=pro')}
                                className="block w-full py-4 rounded-xl bg-white text-primary font-bold text-center hover:bg-white/90 shadow-xl transition-colors"
                            >
                                Assinar o Pro
                            </button>
                        </div>

                        {/* Plan ELITE */}
                        <div className="relative p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-2xl font-bold mb-2">Elite</h3>
                            <p className="text-muted-foreground mb-6">Redes, Franquias e Grandes Clínicas.</p>
                            <div className="flex items-end gap-1 mb-8">
                                <span className="text-5xl font-black">R$ 299</span><span className="text-xl font-bold">,90</span>
                                <span className="text-muted-foreground mb-1 ml-1">/ mês</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {['Profissionais Ilimitados', 'Salões Ilimitados (Rede)', 'Tudo do plano Pro', 'Dashboard VIP de Receitas', 'Suporte Prioritário WhatsApp'].map(i => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /> <span className="font-medium text-sm">{i}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => isAuthenticated ? window.open(NEXANO_CHECKOUT_ELITE, '_blank') : navigate('/register?plan=elite')}
                                className="block w-full py-4 rounded-xl border-2 border-border text-foreground font-bold text-center hover:bg-muted transition-colors"
                            >
                                Assinar Plano Elite
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-card border-t border-border mt-12 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex justify-center md:justify-start items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                        <span className="font-black tracking-tighter text-lg border-2 border-current rounded-md px-1 py-0.5">FA</span>
                        <span className="text-xl font-black">FuturAgenda</span>
                    </div>
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} FuturAgenda Sistemas LTDA. Todos os direitos reservados.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Termos</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacidade</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contato</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
