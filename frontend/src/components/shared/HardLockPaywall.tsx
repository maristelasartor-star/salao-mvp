import { useAuth } from '../../context/AuthContext';
import { Crown, LockKeyhole, ArrowRight } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export function HardLockPaywall() {
    const { salon } = useAuth();

    if (!salon || salon.plan !== 'start' || !salon.createdAt) return null;

    const daysUsed = differenceInDays(new Date(), new Date(salon.createdAt));
    const isExpired = daysUsed > 7;

    if (!isExpired) return null; // Let the normal app render

    const NEXANO_CHECKOUT_PRO = `https://checkout.nexano.com.br/checkout/cmm9xa6w1054n1yp9i3rblp4z?offer=8ZXJ2YN?email=${salon.email}`;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl p-4 animate-in fade-in duration-500">
            <div className="max-w-xl w-full text-center space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-red-500/10 relative">
                    <LockKeyhole className="w-12 h-12 text-red-500" />
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2 border-4 border-background">
                        <Crown className="w-4 h-4 text-white" />
                    </div>
                </div>

                <h1 className="text-4xl font-black tracking-tight text-foreground">
                    Seu período de teste <span className="text-red-500">expirou</span>.
                </h1>

                <p className="text-lg text-muted-foreground">
                    O período de avaliação gratuita de 7 dias do <strong>{salon.name}</strong> chegou ao fim. Para continuar usando a Agenda Inteligente, Lista de Espera e Gestão completa, faça o upgrade da sua conta agora.
                </p>

                <div className="pt-8">
                    <a href={NEXANO_CHECKOUT_PRO} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-full text-xl font-bold hover:scale-105 transition-all shadow-xl items-center justify-center gap-3">
                        Desbloquear Meu Sistema <ArrowRight className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </div>
    );
}
