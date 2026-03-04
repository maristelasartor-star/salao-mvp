import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';

export function LoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const plan = searchParams.get('plan');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await api.auth.login({ email, password, overridePlan: plan });
            login(data.token, data.salon);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Credenciais inválidas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-primary-foreground font-black text-3xl tracking-tighter">FA</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground tracking-tight">
                    Acesso ao Sistema
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Gerencie seu salão de forma inteligente.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card py-8 px-4 shadow-xl shadow-black/5 sm:rounded-2xl sm:px-10 border border-border">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-md flex items-start">
                                <AlertCircle className="w-5 h-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-destructive font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                E-mail
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="voce@salao.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar na Plataforma'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
