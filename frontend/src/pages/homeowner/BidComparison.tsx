import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Lock, ArrowUpDown, Scale, Zap, CheckCircle2, X, AlertTriangle, Star, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { JobStatusBadge } from '../../components/common/JobStatusBadge';
import { NotificationCenter } from '../../components/common/NotificationCenter';
import { SettingsCenter } from '../../components/common/SettingsCenter';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { AIReasoningPanel } from '../../components/common/AIReasoningPanel';
import { FailureAnalysisModal } from '../../components/modals/FailureAnalysisModal';
import { ComparisonModal } from '../../components/modals/ComparisonModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Job, Bid } from '../../types';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const BidComparison = () => {
    const { jobs, acceptBid, declineBid } = useData();
    const navigate = useNavigate();
    const biddingJobs = jobs.filter(j => j.status === 'BIDDING');

    const [sortKey, setSortKey] = useState<'price' | 'pofScore' | 'technicianRating'>('price');
    const [selectedBidIds, setSelectedBidIds] = useState<Record<string, string[]>>({});
    const [comparingJobId, setComparingJobId] = useState<string | null>(null);
    const [confirmingAction, setConfirmingAction] = useState<{ type: 'DECLINE_BID', jobId: string, bidId?: string } | null>(null);
    const [analyzingJob, setAnalyzingJob] = useState<Job | null>(null);

    const toggleBidSelection = (jobId: string, bidId: string) => {
        setSelectedBidIds(prev => {
            const current = prev[jobId] || [];
            const updated = current.includes(bidId)
                ? current.filter(id => id !== bidId)
                : [...current, bidId];
            return { ...prev, [jobId]: updated };
        });
    };

    const getJobComparingBids = (jobId: string) => {
        const job = jobs.find(j => j.id === jobId);
        if (!job) return [];
        return job.bids.filter(b => (selectedBidIds[jobId] || []).includes(b.id));
    };

    const executeConfirmedAction = async () => {
        if (!confirmingAction) return;
        if (confirmingAction.type === 'DECLINE_BID') {
            await declineBid(confirmingAction.jobId, confirmingAction.bidId!);
        }
        setConfirmingAction(null);
    };

    return (
        <div className="animate-fade-in space-y-10 pb-20 text-slate-900">
            <ConfirmDialog
                isOpen={!!confirmingAction}
                onClose={() => setConfirmingAction(null)}
                onConfirm={executeConfirmedAction}
                title="Decline Strategy Bid"
                message="Decline this intervention strategy? This will remove the technician's proposed solution from the current bidding cycle."
                confirmText="Decline Bid"
            />

            <FailureAnalysisModal
                job={analyzingJob}
                isOpen={!!analyzingJob}
                onClose={() => setAnalyzingJob(null)}
            />

            <AnimatePresence mode="wait">
                {comparingJobId && (
                    <ComparisonModal
                        bids={getJobComparingBids(comparingJobId)}
                        isOpen={!!comparingJobId}
                        onClose={() => setComparingJobId(null)}
                        onAccept={(bidId) => {
                            acceptBid(comparingJobId, bidId);
                            setComparingJobId(null);
                            setSelectedBidIds(prev => ({ ...prev, [comparingJobId]: [] }));
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Premium Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/homeowner')}
                        className="w-14 h-14 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-[#C5A059]/40 transition-all hover:scale-105 shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Bid Comparison</h2>
                            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 text-[8px] font-bold mt-1 shadow-sm">Multi-Strategy Audit</div>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 font-medium tracking-tight">Review and verify outcome-based interventions for localized node clusters.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white/50 rounded-2xl border border-black/5 flex items-center gap-4 shadow-premium mr-4 backdrop-blur-md">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Strategy${i}`} alt="tech" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-slate-900 block">{biddingJobs.reduce((acc, j) => acc + j.bids.length, 0)} Active Bids</span>
                            <span className="text-[8px] font-bold text-slate-400">Network Consensus Formed</span>
                        </div>
                    </div>
                    <NotificationCenter />
                    <SettingsCenter />
                </div>
            </header>

            <div className="space-y-12">
                {biddingJobs.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${GLASS_STYLE} p-32 text-center border-dashed border-slate-200`}>
                        <Scale className="mx-auto text-slate-100 mb-8" size={64} />
                        <h3 className="text-2xl font-serif text-slate-900 font-bold">Registry currently clear.</h3>
                        <p className="text-slate-400 text-sm mt-3 max-w-sm mx-auto leading-relaxed">System anomalies will trigger new bidding cycles across independent service nodes.</p>
                        <button onClick={() => navigate('/homeowner')} className="mt-10 px-8 py-3 bg-white border border-black/5 rounded-xl text-[10px] font-bold text-[#C5A059] hover:bg-slate-50 transition-all shadow-premium">Return to Telemetry</button>
                    </motion.div>
                ) : (
                    biddingJobs.map((job, jIdx) => {
                        const sortedBids = [...job.bids].sort((a, b) => {
                            if (sortKey === 'price') return a.price - b.price;
                            return (b[sortKey] as number) - (a[sortKey] as number);
                        });
                        const selectedCount = (selectedBidIds[job.id] || []).length;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: jIdx * 0.1 }}
                                key={job.id}
                                className={`${GLASS_STYLE} p-10 flex flex-col gap-10 overflow-hidden relative border-white shadow-premium`}
                            >
                                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 pb-10 border-b border-black/5">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border shadow-inner ${job.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-[#C5A059]/5 border-[#C5A059]/10 text-[#C5A059]'}`}>
                                            <AlertTriangle size={32} />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-4 mb-2">
                                                <h4 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{job.deviceName}</h4>
                                                <div className="scale-110"><JobStatusBadge status={job.status} /></div>
                                                <PriorityBadge priority={job.priority} />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                                                    Node Cluster: {job.deviceId}
                                                </p>
                                                <div className="w-px h-3 bg-slate-200" />
                                                <p className="text-[10px] text-slate-400 font-bold">
                                                    {job.severity === 'CRITICAL' ? 'Immediate Execution' : '14-22 Day Drift Window'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                                        <button
                                            onClick={() => setAnalyzingJob(job)}
                                            className="flex-1 xl:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group shadow-sm"
                                        >
                                            <Zap size={16} className="group-hover:animate-pulse" /> Diagnostic Brief
                                        </button>

                                        {selectedCount > 1 && (
                                            <button
                                                onClick={() => setComparingJobId(job.id)}
                                                className="flex-1 xl:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-slate-900 text-white text-[10px] font-bold rounded-2xl shadow-premium hover:bg-slate-800 transition-all scale-105"
                                            >
                                                <Scale size={16} /> Matrix Contrast ({selectedCount})
                                            </button>
                                        )}

                                        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-black/5 shadow-inner">
                                            <span className="text-[9px] font-bold text-slate-400 ml-3">Registry Filter:</span>
                                            <select
                                                value={sortKey}
                                                onChange={(e) => setSortKey(e.target.value as any)}
                                                className="bg-transparent text-[10px] font-bold text-[#C5A059] outline-none cursor-pointer px-2 appearance-none"
                                            >
                                                {/* <option value="pofScore" className="bg-white">Proof of Repair Protocol</option> */}
                                                <option value="price" className="bg-white">Lowest Price</option>
                                                <option value="technicianRating" className="bg-white">Expert Rating</option>
                                            </select>
                                            <ArrowUpDown size={14} className="text-slate-300 mr-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <AnimatePresence mode="popLayout">
                                        {sortedBids.length === 0 && (
                                            <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/20">
                                                <div className="flex flex-col items-center gap-4 opacity-50">
                                                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center animate-spin border-t-[#C5A059]">
                                                        <Zap size={24} className="text-[#C5A059]" />
                                                    </div>
                                                    <span className="text-sm font-serif italic text-slate-400">Awaiting network validator bids...</span>
                                                </div>
                                            </div>
                                        )}
                                        {sortedBids.map((bid, bIdx) => {
                                            const isSelected = (selectedBidIds[job.id] || []).includes(bid.id);
                                            return (
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ delay: bIdx * 0.05 }}
                                                    key={bid.id}
                                                    className={`p-8 rounded-[2.5rem] border transition-all group relative overflow-hidden flex flex-col justify-between hover:translate-y-[-4px] ${isSelected ? 'border-[#C5A059] bg-[#C5A059]/5 shadow-premium' : 'bg-white border-black/5 hover:border-[#C5A059]/20 hover:shadow-premium'}`}
                                                >
                                                    {/* Selection Toggle */}
                                                    <button
                                                        onClick={() => toggleBidSelection(job.id, bid.id)}
                                                        className={`absolute top-6 left-6 w-8 h-8 rounded-xl border flex items-center justify-center transition-all z-20 ${isSelected ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' : 'bg-slate-50 border-black/5 text-transparent hover:border-[#C5A059]/40 shadow-inner'}`}
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>

                                                    {/* Decline Button */}
                                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                        <button
                                                            onClick={() => setConfirmingAction({ type: 'DECLINE_BID', jobId: job.id, bidId: bid.id })}
                                                            className="w-8 h-8 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="mb-8 pt-6">
                                                        <div className="flex justify-between items-start mb-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden border-2 border-white shadow-premium group-hover:border-[#C5A059]/50 transition-colors">
                                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bid.id}`} alt="tech" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div>
                                                                    <span className="text-lg font-bold text-slate-900 block leading-tight tracking-tight">{bid.technicianName}</span>
                                                                    <div className="flex items-center gap-1.5 mt-1">
                                                                        <div className="px-2 py-0.5 bg-white rounded border border-black/5 flex items-center gap-1 shadow-sm">
                                                                            <Star size={10} className="text-amber-400 fill-amber-400" />
                                                                            <span className="text-[10px] font-black text-slate-900">{bid.technicianRating}</span>
                                                                        </div>
                                                                        <span className="text-[7px] font-bold text-slate-400 ml-1">Verified Provider</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-3xl font-serif font-bold text-slate-900 tracking-tighter leading-none">${bid.price}</span>
                                                                <span className="text-[7px] text-[#C5A059] font-bold block mt-1">Fixed Price Protocol</span>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            {/* <div className="p-4 bg-slate-50 rounded-2xl border border-black/5 flex flex-col gap-1 shadow-inner">
                                                                <span className="text-[7px] text-slate-400 font-bold">Proof of Repair Veracity</span>
                                                                <span className="text-xs font-bold text-emerald-500">{bid.pofScore}%</span>
                                                            </div> */}
                                                            <div className="p-4 bg-slate-50 rounded-2xl border border-black/5 flex flex-col gap-1 shadow-inner">
                                                                <span className="text-[7px] text-slate-400 font-bold">Guaranteed</span>
                                                                <span className="text-xs font-bold text-slate-900">{bid.guaranteeTarget} Months</span>
                                                            </div>
                                                            <div className="p-4 bg-slate-50 rounded-2xl border border-black/5 flex items-center justify-between shadow-inner">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock size={12} className="text-[#C5A059]" />
                                                                    <span className="text-[7px] text-slate-400 font-bold">Network Response</span>
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-900">{bid.eta}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => acceptBid(job.id, bid.id)}
                                                        className="w-full py-4 bg-slate-50 border border-black/5 text-slate-400 text-[10px] font-bold rounded-2xl hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059] transition-all shadow-sm hover:shadow-premium group/btn"
                                                    >
                                                        Confirm Selection <ChevronLeft size={14} className="inline ml-1 rotate-180" />
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
