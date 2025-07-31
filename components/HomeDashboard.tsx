import React, { useContext, useMemo, useState } from 'react';
import { View, BusinessType, SecurityEvent, Appointment, Student, Cylinder, Shipment, Promotion, DailySaleRecord, Viewing } from '../types';

import { AuthContext } from '../contexts/AuthContext';
import { BusinessContext } from '../contexts/BusinessContext';
import { SalesContext } from '../contexts/SalesContext';
import { InventoryContext } from '../contexts/InventoryContext';
import { SecurityContext } from '../contexts/SecurityContext';
// Industry Contexts
import { AppointmentContext } from '../contexts/AppointmentContext';
import { StudentContext } from '../contexts/StudentContext';
import { CylinderContext } from '../contexts/CylinderContext';
import { LogisticsContext } from '../contexts/LogisticsContext';
import { PromotionsContext } from '../contexts/PromotionsContext';
import { ViewingContext } from '../contexts/ViewingContext';

import { generateDailyBriefing } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { SalesIcon } from './icons/SalesIcon';
import { InventoryIcon } from './icons/InventoryIcon';
import { SecurityIcon } from './icons/SecurityIcon';
import { AppointmentIcon } from './icons/AppointmentIcon';
import { StudentsIcon } from './icons/StudentsIcon';
import { CylinderIcon } from './icons/CylinderIcon';
import { LogisticsIcon } from './icons/LogisticsIcon';
import { PromotionsIcon } from './icons/PromotionsIcon';
import { ViewingIcon } from './icons/ViewingIcon';


interface HomeDashboardProps {
    setActiveView: (view: View) => void;
}

const Widget: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    onClick: () => void;
    colorClass: string;
    comment?: string;
}> = ({ title, value, icon, onClick, colorClass, comment }) => (
    <button onClick={onClick} className="bg-[var(--card)] backdrop-blur-sm p-6 rounded-xl shadow-lg text-left hover:bg-[var(--border)]/50 transition-colors duration-200">
        <div className="flex justify-between items-start">
            <h3 className="text-[var(--text-muted)] text-sm font-medium">{title}</h3>
            <div className={`p-2 rounded-full bg-slate-900/50 ${colorClass}`}>
                {icon}
            </div>
        </div>
        <p className={`text-3xl font-bold ${colorClass} mt-2`}>{value}</p>
        {comment && <p className="text-xs text-[var(--text-muted)] mt-1">{comment}</p>}
    </button>
);


const HomeDashboard: React.FC<HomeDashboardProps> = ({ setActiveView }) => {
    const { currentUser } = useContext(AuthContext);
    const { profile } = useContext(BusinessContext);
    const { sales } = useContext(SalesContext);
    const { inventory } = useContext(InventoryContext);
    const { securityEvents } = useContext(SecurityContext);
    
    // Industry Contexts
    const { appointments } = useContext(AppointmentContext);
    const { students } = useContext(StudentContext);
    const { cylinders } = useContext(CylinderContext);
    const { shipments } = useContext(LogisticsContext);
    const { activePromotions = [] } = useContext(PromotionsContext);
    const { viewings } = useContext(ViewingContext);

    const [briefing, setBriefing] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const todayString = new Date().toISOString().split('T')[0];

    const { todaySales, lowStockCount, latestSecurityEvent } = useMemo(() => ({
        todaySales: sales.find(s => s.date === todayString),
        lowStockCount: inventory.filter(i => i.reorderLevel !== undefined && i.stock <= i.reorderLevel).length,
        latestSecurityEvent: securityEvents[0]
    }), [sales, inventory, securityEvents, todayString]);

    const industryData = useMemo(() => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        switch(profile.businessType) {
            case BusinessType.Hospital:
                const appointmentsToday = appointments.filter(a => {
                    const appDate = new Date(a.date);
                    return appDate >= todayStart && appDate <= todayEnd;
                });
                return { 
                    widget: <Widget title="Today's Appointments" value={appointmentsToday.length.toString()} icon={<AppointmentIcon/>} onClick={() => setActiveView(View.Appointments)} colorClass="text-sky-400" comment="Scheduled for today"/>,
                    briefingData: { appointmentsToday }
                };
            case BusinessType.Education:
                 const newStudentsToday = students.filter(s => new Date(s.id.split('_')[1]).toDateString() === new Date().toDateString());
                 return { 
                    widget: <Widget title="Total Students" value={students.length.toString()} icon={<StudentsIcon />} onClick={() => setActiveView(View.Students)} colorClass="text-purple-400" comment={`${newStudentsToday.length} new today`}/>,
                    briefingData: { newStudentsToday }
                };
            case BusinessType.LPGStation:
                const faultyCylinders = cylinders.filter(c => c.status === 'Faulty');
                return { 
                    widget: <Widget title="Faulty Cylinders" value={faultyCylinders.length.toString()} icon={<CylinderIcon/>} onClick={() => setActiveView(View.CylinderInventory)} colorClass="text-red-400" comment="Require inspection"/>,
                    briefingData: { faultyCylinders }
                };
            case BusinessType.General:
                 const inTransitShipments = shipments.filter(s => s.status === 'In-Transit');
                 return {
                    widget: <Widget title="In-Transit Shipments" value={inTransitShipments.length.toString()} icon={<LogisticsIcon/>} onClick={() => setActiveView(View.Logistics)} colorClass="text-orange-400" comment="Currently on the road"/>,
                    briefingData: { inTransitShipments }
                 }
            case BusinessType.Supermarket:
                return {
                    widget: <Widget title="Active Promotions" value={activePromotions.length.toString()} icon={<PromotionsIcon/>} onClick={() => setActiveView(View.Promotions)} colorClass="text-rose-400" comment="Currently running"/>,
                    briefingData: { activePromotions }
                };
            case BusinessType.RealEstate:
                const viewingsToday = viewings.filter(v => {
                    const viewDate = new Date(v.date);
                    return viewDate >= todayStart && viewDate <= todayEnd;
                });
                 return {
                    widget: <Widget title="Upcoming Viewings" value={viewingsToday.length.toString()} icon={<ViewingIcon/>} onClick={() => setActiveView(View.Viewings)} colorClass="text-teal-400" comment="Scheduled for today"/>,
                    briefingData: { viewingsToday }
                 };
            default:
                return { widget: null, briefingData: {} };
        }
    }, [profile.businessType, setActiveView, appointments, students, cylinders, shipments, activePromotions, viewings]);

    const handleGenerateBriefing = async () => {
        if (!currentUser) return;
        setIsGenerating(true);
        setError(null);
        setBriefing('');

        const result = await generateDailyBriefing({
            profile,
            user: currentUser,
            todaySales,
            lowStockCount,
            latestSecurityEvent,
            ...industryData.briefingData,
        });

        if (result.startsWith('Error:')) {
            setError(result);
        } else {
            setBriefing(result);
        }
        setIsGenerating(false);
    };

    if (!currentUser) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Good morning, {currentUser.name.split(' ')[0]}!</h1>
                <p className="text-[var(--text-muted)]">Here's your business summary for today.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-[var(--border)] rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="h-6 w-6 text-[var(--primary)]" />
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">AI Daily Briefing</h2>
                    </div>
                    <button
                        onClick={handleGenerateBriefing}
                        disabled={isGenerating}
                        className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGenerating ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <SparklesIcon className="h-5 w-5" />
                        )}
                        <span>Generate</span>
                    </button>
                </div>
                <div className="min-h-[60px] bg-[var(--background)]/80 rounded-lg p-4 flex items-center justify-center">
                    {isGenerating && <p className="text-[var(--text-muted)]">Generating briefing...</p>}
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    {briefing && <p className="text-[var(--text-primary)] text-center font-medium">{briefing}</p>}
                    {!isGenerating && !error && !briefing && <p className="text-[var(--text-muted)] text-center">Click "Generate" to get your AI-powered daily briefing.</p>}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Widget 
                    title="Today's Revenue" 
                    value={`${profile.currency}${(todaySales?.revenue || 0).toLocaleString()}`} 
                    icon={<SalesIcon />} 
                    onClick={() => setActiveView(View.DailySales)} 
                    colorClass="text-green-400"
                    comment={`${todaySales?.transactions || 0} transactions`}
                />
                 <Widget 
                    title="Low Stock Items" 
                    value={lowStockCount.toString()}
                    icon={<InventoryIcon />} 
                    onClick={() => setActiveView(View.StockAlerts)} 
                    colorClass="text-yellow-400"
                    comment="Need restocking"
                />
                 <Widget 
                    title="Security Status" 
                    value={latestSecurityEvent?.severity || 'Nominal'}
                    icon={<SecurityIcon />} 
                    onClick={() => setActiveView(View.Security)} 
                    colorClass={latestSecurityEvent?.severity === 'High' || latestSecurityEvent?.severity === 'Critical' ? 'text-red-400' : 'text-green-400'}
                    comment={latestSecurityEvent?.description || 'No new events'}
                />
                {industryData.widget}
            </div>

        </div>
    );
};

export default HomeDashboard;