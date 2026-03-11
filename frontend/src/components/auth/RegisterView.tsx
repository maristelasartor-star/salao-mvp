import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';

export function RegisterView() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [slug, setSlug] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Parse query params for plan and email
    const queryParams = new URLSearchParams(location.search);
    const planParam = queryParams.get('plan');
    const emailParam = queryParams.get('email');
    const isPaid = queryParams.get('paid') === 'true';

    // Initial state with param email if present
    useState(() => {
        if (emailParam) setEmail(emailParam);
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Remove espaços e acentos do slug caso o usuário tenha digitado errado
            const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

            const data = await api.auth.register({ name, email, password, slug: formattedSlug });

            // Auto Login - O backend agora retorna o token logo no registro
            if (data.token && data.salon) {
                login(data.token, data.salon);
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta. Esse email ou url pode já estar em uso.');
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
                    Crie sua Conta
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    {planParam ? (
                        <>Complete seu cadastro para ativar seu plano <span className="font-bold text-primary capitalize">{planParam}</span>.</>
                    ) : (
                        "Inicie seu teste grátis de 7 dias no plano Start."
                    )}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card py-8 px-4 shadow-xl shadow-black/5 sm:rounded-2xl sm:px-10 border border-border">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-md flex items-start">
                                <AlertCircle className="w-5 h-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-destructive font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">
                                Nome do Salão ou Barbearia
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'));
                                }}
                                className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Stúdio Beleza"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">
                                Link da Agenda (URL)
                            </label>
                            <div className="flex rounded-md shadow-sm h-11">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground sm:text-sm">
                                    futuragenda.com/
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="flex-1 block w-full rounded-none rounded-r-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="studio-beleza"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">
                                E-mail
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="voce@salao.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">
                                Senha
                            </label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center h-11 mt-6 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Conta e Começar'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
                                Faça Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
