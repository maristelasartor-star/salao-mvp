import { LayoutDashboard, Calendar, Users, Scissors, GraduationCap, Settings, LogOut, ListOrdered } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard', path: '/dashboard' },
    { name: 'Agenda', icon: Calendar, id: 'agenda', path: '/dashboard/agenda' },
    { name: 'Lista de Espera', icon: ListOrdered, id: 'waitlist', path: '/dashboard/waitlist' },
    { name: 'Clientes', icon: Users, id: 'clientes', path: '/dashboard/clientes' },
    { name: 'Serviços', icon: Scissors, id: 'servicos', path: '/dashboard/servicos' },
    { name: 'Profissionais', icon: GraduationCap, id: 'profissionais', path: '/dashboard/profissionais' },
];

interface SidebarProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

export function Sidebar({ onViewChange }: SidebarProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (id: string, path: string) => {
        onViewChange(id);
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex bg-card flex-col w-64 border-r border-border font-sans h-full">
            <div className="flex items-center h-16 px-6 border-b border-border shadow-sm">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-primary-foreground font-black tracking-tighter text-sm">FA</span>
                </div>
                <span className="ml-3 text-lg font-bold text-foreground">Futur<span className="text-primary">Agenda</span></span>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                <div className="mb-6 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Menu Principal
                </div>
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item.id, item.path)}
                            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                                }`} />
                            <span className="font-medium whitespace-nowrap">{item.name}</span>

                            {/* SaaS Gating Badges */}
                            {item.id === 'waitlist' && (
                                <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${isActive ? 'bg-amber-500 text-white' : 'bg-amber-500/20 text-amber-600'}`}>
                                    Pro
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border mt-auto mb-20 md:mb-0">
                <button
                    onClick={() => handleNavigation('configuracoes', '/dashboard/configuracoes')}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all group ${location.pathname === '/dashboard/configuracoes'
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                >
                    <Settings className={`w-5 h-5 mr-3 transition-colors ${location.pathname === '/dashboard/configuracoes' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                        }`} />
                    Configurações
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2.5 mt-2 text-sm font-medium text-destructive/80 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all group"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sair
                </button>
            </div>
        </div>
    );
}
