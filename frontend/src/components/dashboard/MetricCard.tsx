import { ArrowDownIcon, ArrowUpIcon, DollarSign, Users, CalendarX, TrendingUp } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    trend: string;
    description: string;
    icon: React.ElementType;
    isNegativeTrend?: boolean;
}

export function MetricCard({ title, value, trend, description, icon: Icon, isNegativeTrend }: MetricCardProps) {
    const isPositive = !isNegativeTrend && trend.startsWith('+');
    const TrendIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;

    return (
        <div className="glass-card p-6 flex flex-col justify-between hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-foreground">{value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${title.includes('Perdido') || title.includes('Cancelamentos')
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-primary/10 text-primary'
                    }`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            <div className="mt-4 flex items-center text-sm">
                <span className={`flex items-center font-medium px-2 py-0.5 rounded-full mr-2 ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                    }`}>
                    <TrendIcon className="mr-1 h-3 w-3" />
                    {trend}
                </span>
                <span className="text-muted-foreground">{description}</span>
            </div>
        </div>
    );
}
