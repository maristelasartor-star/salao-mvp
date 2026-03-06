import { LayoutDashboard, Calendar, Users, Scissors, GraduationCap, Settings, LogOut, ListOrdered } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard', path: '/dashboard' },
    { name: 'Agenda', icon: Calendar, id: 'agenda', path: '/dashboard/agenda' },
    { name: 'Espera', icon: ListOrdered, id: 'waitlist', path: '/dashboard/waitlist' },
    { name: 'Clientes', icon: Users, id: 'clientes', path: '/dashboard/clientes' },
    { name: 'Serviços', icon: Scissors, id: 'servicos', path: '/dashboard/servicos' },
    { name: 'Equipe', icon: GraduationCap, id: 'profissionais', path: '/dashboard/profissionais' },
    { name: 'Ajustes', icon: Settings, id: 'configuracoes', path: '/dashboard/configuracoes' },
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
        <div className="md:flex bg-card flex-col md:w-64 border-t md:border-t-0 md:border-r border-border font-sans fixed md:relative bottom-0 left-0 w-full md:h-full z-50">
            {/* Desktop Brand Header */}
            <div className="hidden md:flex items-center h-16 px-6 border-b border-border shadow-sm">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-primary-foreground font-black tracking-tighter text-sm">FA</span>
                </div>
                <span className="ml-3 text-lg font-bold text-foreground">Futur<span className="text-primary">Agenda</span></span>
            </div>

            <nav className="flex md:flex-col flex-1 px-2 md:px-4 py-2 md:py-8 space-x-1 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-y-auto">
                <div className="hidden md:block mb-6 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Menu Principal
                </div>
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item.id, item.path)}
                            className={`flex-1 md:w-full flex md:flex-row flex-col items-center justify-center md:justify-start px-2 md:px-3 py-2 md:py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <Icon className={`w-5 h-5 md:mr-3 mb-1 md:mb-0 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                                }`} />
                            <span className="text-[10px] md:text-base font-medium whitespace-nowrap">{item.name}</span>

                            {/* SaaS Gating Badges - Hidden on mobile text for space */}
                            {item.id === 'waitlist' && (
                                <span className={`hidden md:inline-block ml-auto text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${isActive ? 'bg-amber-500 text-white' : 'bg-amber-500/20 text-amber-600'}`}>
                                    Pro
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="hidden md:block p-4 border-t border-border mt-auto">
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
