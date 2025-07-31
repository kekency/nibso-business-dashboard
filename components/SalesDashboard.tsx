import React, { useContext, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BusinessContext } from '../contexts/BusinessContext';
import { SalesContext } from '../contexts/SalesContext';
import { DailySaleRecord } from '../types';
import { generateSalesInsights } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

type OverviewType = 'daily' | 'weekly';

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-[var(--card)] backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <h3 className="text-[var(--text-muted)] text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{value}</p>
    </div>
);

const SalesDashboard: React.FC = () => {
    const { profile } = useContext(BusinessContext);
    const { sales } = useContext(SalesContext);
    const [overviewType, setOverviewType] = useState<OverviewType>('daily');
    
    // AI Insights state
    const [insights, setInsights] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { chartData, totalRevenue, totalTransactions, avgSaleValue } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let filteredSales: DailySaleRecord[] = [];
        let chartData: { name: string; revenue: number }[] = [];

        if (overviewType === 'daily') {
            const last7Days = new Date(today);
            last7Days.setDate(today.getDate() - 6);
            
            filteredSales = sales.filter(s => {
                const saleDate = new Date(s.date);
                return saleDate >= last7Days && saleDate <= today;
            });

            const salesByDay = new Map<string, number>();
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                salesByDay.set(dateString, 0);
            }

            for (const sale of filteredSales) {
                salesByDay.set(sale.date, (salesByDay.get(sale.date) || 0) + sale.revenue);
            }
            
            chartData = Array.from(salesByDay.entries())
                .map(([date, revenue]) => ({ name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), revenue }))
                .reverse();

        } else if (overviewType === 'weekly') {
            const last4Weeks = new Date(today);
            last4Weeks.setDate(today.getDate() - 27);

            filteredSales = sales.filter(s => {
                const saleDate = new Date(s.date);
                return saleDate >= last4Weeks && saleDate <= today;
            });
            
            const salesByWeek = new Map<number, { revenue: number, year: number }>();

            for (const sale of filteredSales) {
                const date = new Date(sale.date);
                const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
                const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

                if (!salesByWeek.has(weekNumber)) {
                    salesByWeek.set(weekNumber, { revenue: 0, year: date.getFullYear() });
                }
                salesByWeek.get(weekNumber)!.revenue += sale.revenue;
            }

            chartData = Array.from(salesByWeek.entries())
                .sort((a,b) => a[0] - b[0])
                .map(([week, data]) => ({ name: `Week ${week}`, revenue: data.revenue }));
        }

        const totalRevenue = filteredSales.reduce((acc, s) => acc + s.revenue, 0);
        const totalTransactions = filteredSales.reduce((acc, s) => acc + s.transactions, 0);
        const avgSaleValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        return { chartData, totalRevenue, totalTransactions, avgSaleValue };
    }, [sales, overviewType]);

    const handleGenerateInsights = async () => {
        setIsGenerating(true);
        setError(null);
        setInsights('');

        const result = await generateSalesInsights(sales, profile);
        if (result.startsWith('Error:') || result.startsWith('Not enough data')) {
            setError(result);
        } else {
            setInsights(result);
        }

        setIsGenerating(false);
    };

    return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-lg p-1 space-x-1">
                <button 
                    onClick={() => setOverviewType('daily')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${overviewType === 'daily' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--border)]'}`}>
                    Daily Overview
                </button>
                <button 
                    onClick={() => setOverviewType('weekly')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${overviewType === 'weekly' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--border)]'}`}>
                    Weekly Overview
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Revenue" value={`${profile.currency}${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
            <StatCard title="Transactions" value={totalTransactions.toLocaleString()} />
            <StatCard title="Avg. Sale Value" value={`${profile.currency}${avgSaleValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-[var(--border)] rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="h-6 w-6 text-[var(--primary)]" />
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">AI Sales Insights</h2>
                </div>
                <button
                    onClick={handleGenerateInsights}
                    disabled={isGenerating}
                    className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isGenerating ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <>
                            <SparklesIcon className="h-5 w-5" />
                            <span>Generate</span>
                        </>
                    )}
                </button>
            </div>
            <div className="min-h-[120px] bg-[var(--background)]/80 rounded-lg p-4 flex items-center justify-center">
                {isGenerating && <p className="text-[var(--text-muted)]">Generating... please wait.</p>}
                {error && <p className="text-red-400 text-center">{error}</p>}
                {insights && (
                    <div className="text-[var(--text-muted)] whitespace-pre-wrap font-sans text-sm w-full">
                        {insights}
                    </div>
                )}
                {!isGenerating && !error && !insights && <p className="text-[var(--text-muted)] text-center">Click "Generate" to get an AI-powered analysis of your sales data.</p>}
            </div>
        </div>

        <div className="bg-[var(--card)] backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Revenue Overview</h2>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" stroke="var(--text-muted)" />
                        <YAxis tickFormatter={(value) => `${profile.currency}${(value / 1000).toFixed(0)}k`} stroke="var(--text-muted)" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'var(--background)', 
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)'
                            }} 
                            cursor={{fill: 'var(--border)'}}
                            formatter={(value: number) => [`${profile.currency}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue']}
                        />
                        <Legend wrapperStyle={{color: 'var(--text-primary)'}}/>
                        <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default SalesDashboard;