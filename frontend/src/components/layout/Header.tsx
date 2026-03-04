import { Bell, Search, Sun, Moon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    const { salon } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        // In a real app, this would toggle the 'dark' class on document.documentElement
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <header className="h-16 glass z-10 sticky top-0 px-6 flex items-center justify-between transition-colors duration-300">
            {/* Title */}
            <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-3">
                    {title}
                    {salon?.plan === 'pro' && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                            <Sparkles className="w-3 h-3" /> Pro
                        </span>
                    )}
                    {salon?.plan === 'elite' && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-2 py-0.5 rounded-full shadow-sm">
                            <Sparkles className="w-3 h-3" /> Elite
                        </span>
                    )}
                    {salon?.plan === 'start' && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                            Start
                        </span>
                    )}
                </h1>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Sistema Online
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar agendamento..."
                        className="h-9 w-64 rounded-full border border-border bg-secondary/50 px-9 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    />
                </div>

                <button
                    onClick={toggleTheme}
                    className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>

                <button className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-destructive border-[1.5px] border-background"></span>
                </button>

                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer border border-primary/20 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=random&color=fff" alt="User" />
                </div>
            </div>
        </header>
    );
}
