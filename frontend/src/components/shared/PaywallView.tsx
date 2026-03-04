import { Sparkles, Crown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface PaywallViewProps {
    title: string;
    description: string;
    features: string[];
}

export function PaywallView({ title, description, features }: PaywallViewProps) {
    const { salon } = useAuth();
    // 🔗 NEXANO CHECKOUT LINK (Substitua pelo link gerado no seu painel Nexano)
    const NEXANO_CHECKOUT_PRO = "https://checkout.nexano.com.br/checkout/cmm9xa6w1054n1yp9i3rblp4z?offer=8ZXJ2YN";

    return (
        <div className="flex-1 p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-amber-500/10">
                <Crown className="w-10 h-10 text-amber-500" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
                Recurso exclusivo do <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Plano Pro</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mb-12">
                O módulo <strong className="text-foreground">{title}</strong> permite que você {description}. Eleve a gestão do <strong className="text-foreground">{salon?.name}</strong> para o próximo nível.
            </p>

            <div className="bg-card border border-border/60 rounded-3xl p-8 md:p-12 w-full max-w-3xl shadow-2xl relative overflow-hidden text-left ring-1 ring-white/10">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />

                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="text-amber-500 w-6 h-6" />
                    O que você ganha com o Upgrade:
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                    {features.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="bg-emerald-500/10 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                            <span className="font-medium text-muted-foreground">{item}</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                        <span className="font-medium text-muted-foreground">Escale até 10 Profissionais</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <a href={`${NEXANO_CHECKOUT_PRO}?email=${salon?.email || ''}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-foreground text-background rounded-full text-lg font-bold hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2">
                        Fazer Upgrade Agora <ArrowRight className="w-5 h-5" />
                    </a>
                    <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-secondary text-foreground rounded-full text-lg font-bold hover:bg-secondary/80 transition-all text-center">
                        Voltar ao Painel
                    </Link>
                </div>
            </div>
        </div>
    );
}
