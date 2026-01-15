import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Clock,
    TrendingUp,
    Lock,
    MapPin,
    LayoutGrid,
    ArrowRight,
    Zap,
    Activity,
    Radar,
    Hammer,
    UserCircle,
    Bell,
    Settings,
    Briefcase,
    DollarSign,
    Star,
    CheckCircle2,
    Search
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { JobStatusBadge } from '../../components/common/JobStatusBadge';
import { NotificationCenter } from '../../components/common/NotificationCenter';
import { SettingsCenter } from '../../components/common/SettingsCenter';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const TechnicianDashboard = () => {
    const { jobs, devices } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Calculate true active count for stats (ignoring filters)
    const activeCount = jobs.filter(j => ['ASSIGNED', 'IN_PROGRESS', 'VERIFYING'].includes(j.status)).length;

    const visibleJobs = jobs.filter(j => {
        const isMatch = ['ASSIGNED', 'IN_PROGRESS', 'VERIFYING', 'COMPLETED'].includes(j.status);
        const matchesSearch = j.deviceName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
        return isMatch && matchesSearch && matchesStatus;
    });

    const opportunitiesCount = jobs.filter(j => j.status === 'BIDDING').length;

    const stats = useMemo(() => {
        const completedJobs = jobs.filter(j => j.status === 'COMPLETED');
        const earnings = completedJobs.reduce((acc, j) => acc + j.payout, 0);
        // const avgPoF = completedJobs.length > 0
        //     ? completedJobs.reduce((acc, j) => acc + (j.bids[0]?.pofScore || 95), 0) / completedJobs.length
        //     : 96.2;

        return [
            // { label: 'Proof of Repair Score', value: avgPoF.toFixed(1), icon: ShieldCheck, color: 'bg-indigo-500', text: 'text-indigo-400' },
            { label: 'Active', value: activeCount.toString(), icon: Clock, color: 'bg-emerald-500', text: 'text-emerald-400' },
            { label: 'Earnings', value: `$${earnings.toLocaleString()}`, icon: DollarSign, color: 'bg-[#C5A059]', text: 'text-[#C5A059]' },
            { label: 'Rating', value: Math.min(5, 4.5 + (completedJobs.length * 0.1)).toFixed(1), icon: Star, color: 'bg-rose-500', text: 'text-rose-400' }
        ];
    }, [jobs, activeCount]);

    return (
        <div className="animate-fade-in space-y-10 pb-32 text-slate-900">
            {/* Header / Profile (Image 4 style) */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-4 border-white shadow-premium p-1 bg-white">
                        <img
                            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=2670&auto=format&fit=crop"
                            alt="Technician Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900">John Doe</h1>
                            <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100 text-[8px] font-bold mt-1">Level 4 Engineer</div>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                            <p className="text-slate-400 text-xs font-bold">Technician #77x-Alpha</p>
                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Online
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C5A059] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search Assignments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-black/5 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-[#C5A059] transition-all w-64 shadow-sm placeholder:text-slate-300 text-slate-600"
                        />
                    </div>
                    <NotificationCenter />
                    <SettingsCenter />
                </div>
            </header>

            {/* Productivity Tiles (Image 4 style) */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className={`${GLASS_STYLE} p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-[#C5A059]/30 transition-all border-white`}
                    >
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400">{stat.label}</p>
                            <p className="text-4xl font-serif font-bold text-slate-900 group-hover:scale-110 origin-left transition-transform duration-500 tracking-tight">{stat.value}</p>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12 duration-500`}>
                            <stat.icon size={28} />
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Workflow Protocol Horizontal Scroller (Image 0 style) */}
            <section className="px-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 pb-4">
                    <div className="flex gap-4 pb-4">
                        {[
                            { label: 'All Jobs', value: 'ALL', color: 'bg-slate-100 text-slate-400 border-slate-200' },
                            { label: 'Assigned', value: 'ASSIGNED', color: 'bg-indigo-50 text-indigo-400 border-indigo-100' },
                            { label: 'In Progress', value: 'IN_PROGRESS', color: 'bg-emerald-50 text-emerald-400 border-emerald-100' },
                            { label: 'Verifying', value: 'VERIFYING', color: 'bg-cyan-50 text-cyan-400 border-cyan-100' },
                            { label: 'Completed', value: 'COMPLETED', color: 'bg-blue-50 text-blue-400 border-blue-100' },
                        ].map((step, i) => (
                            <div
                                key={i}
                                onClick={() => setStatusFilter(step.value)}
                                className={`flex-shrink-0 px-6 py-3 rounded-full border text-[10px] font-bold cursor-pointer transition-all hover:brightness-95 ${statusFilter === step.value
                                    ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-premium'
                                    : step.color
                                    }`}
                            >
                                {step.label}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                {/* Market Radar (Image 1 style theme) */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => navigate('/technician/radar')}
                    className={`${GLASS_STYLE} lg:col-span-2 p-12 rounded-[3.5rem] relative overflow-hidden flex flex-col justify-between cursor-pointer group min-h-[360px] border-white`}
                >
                    {/* Abstract technical grid background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,1)_100%)] opacity-50 z-0 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:opacity-10 transition-opacity">
                        <Radar size={200} className="text-slate-900" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-10">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-50 border border-rose-100 rounded-full shadow-sm">
                                <Activity size={16} className="text-rose-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-rose-500">Anomaly Search Active</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">Sector: Austin-North</span>
                        </div>
                        <h2 className="text-6xl font-serif font-bold text-slate-900 mb-6 tracking-tighter">Market Radar</h2>
                        <p className="text-slate-500 text-lg max-w-xl leading-relaxed font-medium">
                            {opportunitiesCount} new predictive failure anomalies detected within your localized service cluster.
                            <span className="text-slate-900 font-bold block mt-2">Submit outcome-based strategies to lock interventions.</span>
                        </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-3 text-[#C5A059] text-xs font-bold mt-10 group-hover:gap-5 transition-all">
                        Synchronize Radar Feed <ArrowRight size={18} />
                    </div>
                </motion.div>

                {/* Assignment Queue (Image 4 style cards) */}
                <div className={`${GLASS_STYLE} p-10 rounded-[3.5rem] flex flex-col border-white`}>
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[10px] font-bold text-slate-400">Protocol Queue</h3>
                        <Briefcase size={18} className="text-slate-300" />
                    </div>
                    <div className="flex-1 space-y-6 overflow-y-auto max-h-[220px] pr-2 scrollbar-hide">
                        {visibleJobs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                                <CheckCircle2 className="text-slate-200 mb-4" size={48} />
                                <span className="text-[10px] font-bold text-slate-400">Registry Clear</span>
                            </div>
                        ) : (
                            visibleJobs.map((job, idx) => {
                                const device = devices.find(d => d.id === job.deviceId);
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={job.id}
                                        onClick={() => navigate(job.status === 'ASSIGNED' ? `/technician/job/${job.id}` : `/technician/complete/${job.id}`)}
                                        className="p-8 bg-white border border-black/5 rounded-[2.5rem] hover:shadow-premium hover:border-[#C5A059]/30 transition-all cursor-pointer group/item relative overflow-hidden shadow-sm"
                                    >
                                        <div className="flex items-center gap-5 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center text-slate-400 group-hover/item:text-[#C5A059] transition-colors relative shadow-inner">
                                                <Hammer size={24} />
                                                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${job.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-[#C5A059]'}`} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900 truncate max-w-[160px] leading-tight group-hover/item:text-[#C5A059] transition-colors">{job.deviceName}</h4>
                                                <p className="text-[9px] text-slate-400 font-bold mt-1">Technician Level 4 Secured</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6 pt-6 border-t border-black/5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[7px] font-bold text-slate-400">Service Level Agreement Deadline</span>
                                                <span className={`text-[8px] font-bold ${job.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`}>
                                                    {job.severity === 'CRITICAL' ? '45m' : job.severity === 'HIGH' ? '2.5h' : '6h'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[7px] font-bold text-slate-400">Node Health</span>
                                                <span className={`text-[8px] font-bold ${device && device.health < 40 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {device?.health || 0}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-black/5 group-hover/item:border-[#C5A059]/20 transition-all shadow-inner">
                                            <JobStatusBadge status={job.status} className="scale-90 origin-left" />
                                            <ArrowRight size={16} className="text-slate-400 group-hover/item:text-[#C5A059] group-hover/item:translate-x-1 transition-all" />
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* AI Insight Section (Image 1 technical feel) */}
            <section className="px-4">
                <div className={`${GLASS_STYLE} p-12 rounded-[3.5rem] border-indigo-100 bg-indigo-50/50 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 font-serif text-[15rem] leading-none font-black text-indigo-900/[0.03] -mr-10 -mt-10 select-none">
                        AI
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                        <div className="w-24 h-24 bg-white text-indigo-500 rounded-[2rem] border border-indigo-100 flex items-center justify-center flex-shrink-0 shadow-premium">
                            <Zap size={40} className="animate-pulse" />
                        </div>
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-indigo-100 mb-4 shadow-sm">
                                <Activity size={14} className="text-indigo-500" />
                                <span className="text-[9px] font-bold text-indigo-600">Cognitive Strategy Active</span>
                            </div>
                            <h4 className="text-3xl font-serif font-bold text-slate-900 mb-3 tracking-tight">Predictive Yield Optimizer</h4>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-4xl font-medium">
                                {(() => {
                                    const biddingJobs = jobs.filter(j => j.status === 'BIDDING');
                                    const categories = biddingJobs.reduce((acc, j) => {
                                        const device = devices.find(d => d.id === j.deviceId);
                                        if (device) acc[device.type] = (acc[device.type] || 0) + j.payout;
                                        return acc;
                                    }, {} as Record<string, number>);
                                    const bestCat = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'HVAC';

                                    return (
                                        <>
                                            AHRN Intelligence suggests focusing on <span className="text-slate-900 border-b border-indigo-500">"{bestCat}" category node clusters</span> this week.
                                            Historical yield is <span className="text-emerald-600">{(10 + (biddingJobs.length % 5))}% higher</span> due to seasonal duty cycle spikes in your current geofence.
                                        </>
                                    );
                                })()}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
