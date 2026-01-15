import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, ChevronLeft, MapPin, ShieldCheck, Zap, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { JobStatusBadge } from '../../components/common/JobStatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3rem]";

export const SystemForecast = () => {
    const { jobs } = useData();
    const navigate = useNavigate();
    const forecastJobs = jobs.filter(j => j.status === 'PREDICTED' || j.status === 'BIDDING');

    return (
        <div className="animate-fade-in space-y-10 pb-20 text-slate-900">
            <header className="flex items-center gap-6 px-4">
                <button
                    onClick={() => navigate('/homeowner')}
                    className="w-14 h-14 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-[#C5A059]/40 transition-all hover:scale-105 shadow-sm"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">System Forecasts</h2>
                        <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[8px] font-bold mt-1 shadow-sm">Predictive Analytics Active</div>
                    </div>
                    <p className="text-slate-400 text-sm mt-1 font-medium tracking-tight">Probability-based failure modeling for connected infrastructure nodes.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-10">
                {forecastJobs.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${GLASS_STYLE} p-32 text-center border-dashed border-slate-200`}>
                        <ShieldCheck className="mx-auto text-emerald-500/20 mb-8" size={80} />
                        <h3 className="text-2xl font-serif text-slate-900 font-bold">Resilience Buffer Optimal.</h3>
                        <p className="text-slate-400 text-sm mt-3 max-w-sm mx-auto leading-relaxed">No predicted failure vectors detected within the current 30-day monitoring window.</p>
                        <button onClick={() => navigate('/homeowner')} className="mt-10 px-8 py-3 bg-white border border-black/5 rounded-xl text-[10px] font-bold text-[#C5A059] hover:bg-slate-50 transition-all shadow-premium">Monitoring Node Stats</button>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {forecastJobs.map((job, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={job.id}
                                className={`${GLASS_STYLE} p-10 relative group overflow-hidden border-white hover:border-[#C5A059]/30 transition-all`}
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#C5A059]/5 to-transparent pointer-events-none" />

                                <div className="absolute top-10 right-10">
                                    <div className="flex gap-3 scale-110">
                                        <JobStatusBadge status={job.status} />
                                        <PriorityBadge priority={job.priority} />
                                    </div>
                                </div>

                                <div className="flex flex-col xl:flex-row gap-12 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${job.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-[#C5A059]/5 border-[#C5A059]/10 text-[#C5A059]'}`}>
                                                <AlertTriangle size={24} />
                                            </div>
                                            <div>
                                                <span className={`text-[10px] font-bold ${job.severity === 'CRITICAL' ? 'text-rose-500' : 'text-[#C5A059]'}`}>
                                                    {job.severity} Severity Vector
                                                </span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] font-bold text-slate-300">Registry Identifier: {job.id}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                    <span className="text-[9px] font-bold text-slate-300 leading-none">Cluster: {job.deviceId}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4 tracking-tight">{job.deviceName} Predictive Failure</h3>
                                        <p className="text-slate-500 text-base leading-relaxed max-w-2xl mb-10">
                                            Telemetry analysis indicates a <span className="text-slate-900 font-bold">{75 + (idx * 5)}% probability</span> of operational degradation within the next <span className="text-slate-900 font-bold">14-22 days</span>.
                                            Erratic vibration signatures and duty cycle spikes suggest imminent stator fatigue. Proactive intervention highly recommended to protect aggregate HRI.
                                        </p>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                            <div className="p-5 bg-slate-50/50 rounded-[1.5rem] border border-black/5 group-hover:border-[#C5A059]/10 transition-colors shadow-inner">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock size={12} className="text-slate-300" />
                                                    <span className="text-[8px] font-bold text-slate-400">Stability Window</span>
                                                </div>
                                                <span className="text-lg font-bold text-slate-600">~18 Days</span>
                                            </div>
                                            <div className="p-5 bg-slate-50/50 rounded-[1.5rem] border border-black/5 group-hover:border-[#C5A059]/10 transition-colors shadow-inner">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp size={12} className="text-emerald-500" />
                                                    <span className="text-[8px] font-bold text-slate-400">Reliability Index Recovery</span>
                                                </div>
                                                <span className="text-lg font-bold text-emerald-500">+{8 + (idx * 2)}.4 Pts</span>
                                            </div>
                                            <div className="p-5 bg-slate-50/50 rounded-[1.5rem] border border-black/5 group-hover:border-[#C5A059]/10 transition-colors shadow-inner">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ShieldCheck size={12} className="text-[#C5A059]" />
                                                    <span className="text-[8px] font-bold text-slate-400">Estimated Preventive Cost</span>
                                                </div>
                                                <span className="text-lg font-bold text-slate-900">${job.payout}</span>
                                            </div>
                                            <div className="p-5 bg-slate-50/50 rounded-[1.5rem] border border-black/5 group-hover:border-[#C5A059]/10 transition-colors shadow-inner">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertTriangle size={12} className="text-rose-500" />
                                                    <span className="text-[8px] font-bold text-slate-400">Emergency Risk</span>
                                                </div>
                                                <span className="text-lg font-bold text-rose-500">+${(job.payout * 2.5).toFixed(0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="xl:w-72 flex flex-col justify-end gap-4">
                                        <button
                                            onClick={() => navigate('/homeowner/bids')}
                                            className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-premium hover:bg-slate-800 transition-all text-[10px] flex items-center justify-center gap-2 group/btn"
                                        >
                                            Initiate Strategy Cycle <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </button>
                                        <button className="w-full py-5 bg-white border border-black/5 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-all text-[10px] flex items-center justify-center gap-2 shadow-sm">
                                            Telemetry Deep-Dive <Zap size={14} className="text-[#C5A059]" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
