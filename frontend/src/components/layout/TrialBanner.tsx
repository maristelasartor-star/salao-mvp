import { useAuth } from '../../context/AuthContext';
import { differenceInDays } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

export function TrialBanner() {
    const { salon } = useAuth();

    if (!salon || salon.plan !== 'start' || !salon.createdAt) return null;

    const daysUsed = differenceInDays(new Date(), new Date(salon.createdAt));
    const daysLeft = Math.max(0, 7 - daysUsed);

    if (daysLeft === 0) return null; // HardLock will handle this

    return (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-center gap-3 text-sm text-amber-700 dark:text-amber-500 font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>
                Você está no dia <strong>{7 - daysLeft + 1} de 7</strong> do seu teste grátis. Seu acesso será bloqueado em <strong>{daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}</strong>.
            </span>
            <a href="https://checkout.nexano.com.br/checkout/cmm9xa6w1054n1yp9i3rblp4z?offer=8ZXJ2YN" target="_blank" rel="noopener noreferrer" className="ml-2 font-bold underline hover:text-amber-600 dark:hover:text-amber-400">
                Fazer Upgrade Agora
            </a>
        </div>
    );
}
