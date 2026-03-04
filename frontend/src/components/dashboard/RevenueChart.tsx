import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const data = [
    { name: 'Seg', revenue: 400, expected: 400 },
    { name: 'Ter', revenue: 700, expected: 800 },
    { name: 'Qua', revenue: 1200, expected: 1100 },
    { name: 'Qui', revenue: 1800, expected: 1600 },
    { name: 'Sex', revenue: 2500, expected: 2400 },
    { name: 'Sáb', revenue: 3800, expected: 3500 },
    { name: 'Dom', revenue: 900, expected: 1000 },
];

export function RevenueChart() {
    return (
        <div className="glass-card p-6 h-[400px] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Faturamento da Semana</h3>
                    <p className="text-sm text-muted-foreground">+24% em relação à semana passada</p>
                </div>
                <span className="inline-flex h-8 items-center rounded-full bg-secondary px-3 text-xs font-medium text-foreground">
                    Últimos 7 dias
                </span>
            </div>
            <div className="flex-1 w-full mt-2 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            tickFormatter={(value) => `R$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                borderRadius: '12px',
                                border: '1px solid hsl(var(--border))',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }}
                            labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                            itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                            formatter={(value) => [`R$ ${value}`, 'Faturamento']}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="hsl(var(--primary))"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
