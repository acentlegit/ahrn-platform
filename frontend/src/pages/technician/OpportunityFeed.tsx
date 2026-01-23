import React from 'react';
import { motion } from 'framer-motion';
import { Radar, Zap, Shield, Search, Filter, ArrowRight, TrendingUp } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { JobStatusBadge } from '../../components/common/JobStatusBadge';
import { NotificationCenter } from '../../components/common/NotificationCenter';
import { SettingsCenter } from '../../components/common/SettingsCenter';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const OpportunityFeed = () => {
    const { jobs, acceptMarketJob, refetch } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Opportunities are jobs in PREDICTED or BIDDING status that haven't been assigned yet
    // For demo purposes, we show BIDDING jobs as active opportunities
    const opportunities = jobs.filter(j => j.status === 'BIDDING');

    const handleAccept = async (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation();
        if (user?.name) {
            await acceptMarketJob(jobId, user.name);
            // Refresh to remove from list
            await refetch();
        }
    };

    return (
        <div className="animate-fade-in space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Field Radar</h2>
                    <p className="text-slate-500 text-xs font-medium">Predictive failure opportunities within your service cluster.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative mr-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search nodes..."
                            className="bg-white border border-black/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all w-64 shadow-sm placeholder:text-slate-300"
                        />
                    </div>
                    <NotificationCenter />
                    <SettingsCenter />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={`${GLASS_STYLE} p-8 rounded-[2.5rem]`}>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-bold text-slate-500">Your Rank</span>
                            <Shield size={14} className="text-[#C5A059]" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-2">Alpha-7</div>
                        {/* <p className="text-[10px] text-slate-500 font-bold mb-6">PoF Verification: 98.4%</p> */}
                        <div className="pt-6 border-t border-black/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-slate-500">Weekly Goal</span>
                                <span className="text-[10px] font-bold text-emerald-500">82%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[82%]" />
                            </div>
                        </div>
                    </div>

                    <div className={`${GLASS_STYLE} p-8 rounded-[2.5rem]`}>
                        <h4 className="text-[10px] font-bold text-slate-500 mb-4">Active Market</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Total Bids</span>
                                <span className="text-xs font-bold text-slate-900">42</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Average Payout</span>
                                <span className="text-xs font-bold text-slate-900">$158.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="px-4 py-2 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 rounded-xl text-[10px] font-bold">
                            {opportunities.length} New Opportunities
                        </div>
                        <div className="px-4 py-2 bg-white border border-black/5 rounded-xl text-[10px] font-bold text-slate-500 flex items-center gap-2 shadow-sm">
                            <Filter size={12} /> Filter
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {opportunities.length === 0 ? (
                            <div className={`${GLASS_STYLE} p-20 rounded-[3rem] text-center`}>
                                <Radar className="mx-auto text-slate-400 mb-6 animate-pulse" size={48} />
                                <h3 className="text-xl font-serif text-slate-500">Radar clear. No new anomalies.</h3>
                                <p className="text-slate-400 text-sm mt-2">The network is currently operating at peak reliability.</p>
                            </div>
                        ) : (
                            opportunities.map(job => (
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    key={job.id}
                                    onClick={() => navigate(`/technician/job/${job.id}`)}
                                    className={`${GLASS_STYLE} p-8 rounded-[2.5rem] relative group border-white cursor-pointer`}
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <JobStatusBadge status={job.status} />
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${job.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-[#C5A059]/10 text-[#C5A059]'}`}>
                                                    {job.severity} Potential
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{job.deviceName} Restoration</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                                                Predictive diagnosis suggests immediate failure within 21 days. Outcome-based intervention required for node cluster PX-882.
                                            </p>
                                        </div>

                                        <div className="md:w-64 flex flex-col justify-between items-end">
                                            <div className="text-right">
                                                <div className="text-3xl font-serif font-bold text-slate-900 mb-1">${job.payout}</div>
                                                <div className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-1">
                                                    <TrendingUp size={12} /> High Yield Bid
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => handleAccept(e, job.id)}
                                                    className="px-6 py-3 bg-emerald-500 text-white text-[10px] font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                                                >
                                                    Accept Now
                                                </button>
                                                <button className="flex items-center gap-2 px-6 py-3 bg-[#C5A059] text-white text-[10px] font-bold rounded-xl shadow-lg shadow-[#C5A059]/20 group-hover:bg-[#b08d4b] transition-all">
                                                    Submit Bid <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Visualization Micro-interaction */}
                                    <div className="mt-8 grid grid-cols-4 gap-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.random() * 60 + 40}%` }}
                                                    transition={{ delay: i * 0.1, duration: 1 }}
                                                    className="h-full bg-slate-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
