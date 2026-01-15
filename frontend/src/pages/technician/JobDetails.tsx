import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Zap, Info, Shield, Clock, Send, Camera, ClipboardCheck, History } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { JobStatusBadge } from '../../components/common/JobStatusBadge';
import { AIReasoningPanel } from '../../components/common/AIReasoningPanel';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const JobDetails = () => {
    const { jobs, submitBid, acceptMarketJob, addNotification, startJob } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { jobId } = useParams();
    const job = jobs.find(j => j.id === jobId);

    const [bidAmount, setBidAmount] = useState(job?.payout || 0);
    const [bidETA, setBidETA] = useState('24h');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!job) return <div>Job not found</div>;

    const handleSubmitBid = async () => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await submitBid({
                jobId: job.id,
                technicianName: user.name,
                price: bidAmount,
                eta: bidETA,
                guaranteeTarget: 12
            });
            addNotification({
                title: 'Bid Transmitted',
                message: `Your strategy for ${job.deviceName} has been recorded to the registry.`,
                type: 'SUCCESS'
            });
            navigate('/technician');
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartJob = async () => {
        setIsSubmitting(true);
        try {
            await startJob(job.id);
            addNotification({
                title: 'Intervention Started',
                message: `${job.deviceName} status set to IN_PROGRESS.`,
                type: 'SUCCESS'
            });
            navigate('/technician');
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickAccept = async () => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await acceptMarketJob(job.id, user.name);
            addNotification({
                title: 'Assignment Secured',
                message: `You have accepted the terms for ${job.deviceName}. Protocol initialized.`,
                type: 'SUCCESS'
            });
            navigate('/technician');
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-10 pb-20">
            <header className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/technician')}
                    className="p-3 bg-white border border-black/5 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900 shadow-sm"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Job Analysis</h2>
                    <p className="text-slate-400 text-xs font-medium tracking-wide">Autonomous diagnostic brief for {job.deviceName}.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Domain Context */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={`${GLASS_STYLE} p-8 rounded-[2.5rem] relative overflow-hidden`}>
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <JobStatusBadge status={job.status} />
                                    <span className="text-[10px] font-bold text-slate-400">Node Identifier: PX-882-BETA</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 leading-tight">{job.deviceName} Restoration</h3>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-500 block mb-1">Target Payout</span>
                                <span className="text-3xl font-serif font-bold text-slate-900">${job.payout}</span>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <AIReasoningPanel
                                prompt={`Perform a diagnostic brief for ${job.deviceName} on Node PX-882. Vibration cycles are at 180% of baseline. Logic board temperature is nominal but current draw is erratic.`}
                            />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-white rounded-2xl border border-black/5 text-center shadow-sm">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg inline-block mb-2 border border-indigo-100">
                                        <Zap size={14} />
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 block mb-1">Severity</span>
                                    <span className="text-xs font-bold text-slate-900">{job.severity}</span>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-black/5 text-center shadow-sm">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg inline-block mb-2 border border-emerald-100">
                                        <Shield size={14} />
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 block mb-1">Covered</span>
                                    <span className="text-xs font-bold text-slate-900">Full Registry</span>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-black/5 text-center shadow-sm">
                                    <div className="p-2 bg-slate-100 text-slate-500 rounded-lg inline-block mb-2 border border-black/5">
                                        <Clock size={14} />
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 block mb-1">Deadline</span>
                                    <span className="text-xs font-bold text-slate-900">72 Hours</span>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-black/5 text-center shadow-sm">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg inline-block mb-2 border border-amber-100">
                                        <History size={14} />
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 block mb-1">History</span>
                                    <span className="text-xs font-bold text-slate-900">Clean</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${GLASS_STYLE} p-8 rounded-[2.5rem]`}>
                        <div className="flex items-center gap-2 mb-6 text-slate-400">
                            <Info size={18} />
                            <h4 className="text-xs font-bold tracking-widest">Network Requirements</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                'Cryptographic Proof of Repair required upon completion',
                                'Real-time telemetry stabilization window (24 hrs)',
                                'Component-level serial verification',
                                'Environmental stress test pass required'
                            ].map((req, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                                    <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Bidding Terminal */}
                <div className="space-y-8">
                    <div className={`${GLASS_STYLE} p-8 rounded-[2.5rem] border border-[#C5A059]/20 shadow-premium`}>
                        <h3 className="text-xl font-serif font-bold text-slate-900 mb-8">
                            {job.status === 'BIDDING' ? 'Bidding Terminal' : 'Job Controls'}
                        </h3>

                        <div className="space-y-6">
                            {job.status === 'BIDDING' && (
                                <>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-3">Your Bid Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(Number(e.target.value))}
                                                className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-xl font-bold text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-3">Response Window</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['24h', '48h', '72h'].map((eta) => (
                                                <button
                                                    key={eta}
                                                    onClick={() => setBidETA(eta)}
                                                    className={`py-3 rounded-xl border text-[10px] font-bold transition-all ${bidETA === eta ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' : 'bg-white border-black/5 text-slate-400 hover:text-slate-900 shadow-sm'}`}
                                                >
                                                    {eta}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 space-y-4">
                                        <button
                                            onClick={handleQuickAccept}
                                            disabled={isSubmitting}
                                            className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl text-[10px] shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Securing...' : (
                                                <>Quick Accept (${job.payout}) <Shield size={16} /></>
                                            )}
                                        </button>

                                        <div className="flex items-center gap-4 py-2">
                                            <div className="h-px bg-slate-200 flex-1" />
                                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">or counter bid</span>
                                            <div className="h-px bg-slate-200 flex-1" />
                                        </div>

                                        <button
                                            onClick={handleSubmitBid}
                                            disabled={isSubmitting}
                                            className="w-full py-5 bg-white border border-[#C5A059]/30 text-[#C5A059] font-bold rounded-2xl text-[10px] hover:bg-[#C5A059] hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm"
                                        >
                                            {isSubmitting ? 'Transmitting...' : (
                                                <>Propose Outcome Bid <Send size={16} /></>
                                            )}
                                        </button>
                                        <p className="text-center text-slate-400 text-[8px] mt-4 font-bold leading-relaxed">
                                            By submitting, you agree to the Proof of Repair <br /> stability guarantee and penalty terms.
                                        </p>
                                    </div>
                                </>
                            )}

                            {job.status === 'ASSIGNED' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
                                        <p className="text-indigo-600 font-bold text-sm">You are assigned to this job.</p>
                                        <p className="text-indigo-400 text-xs mt-1">Please proceed to the location and start the protocol.</p>
                                    </div>
                                    <button
                                        onClick={handleStartJob}
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl text-[10px] shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Initializing...' : (
                                            <>Start Job Protocol <Zap size={16} /></>
                                        )}
                                    </button>
                                </div>
                            )}

                            {['IN_PROGRESS', 'VERIFYING', 'COMPLETED'].includes(job.status) && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                                        <p className="text-emerald-600 font-bold text-sm">Protocol Active</p>
                                        <p className="text-emerald-400 text-xs mt-1">Job is currently in progress or completed.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/technician/complete/${job.id}`)}
                                        className="w-full py-5 bg-[#C5A059] text-white font-bold rounded-2xl text-[10px] shadow-lg hover:bg-[#b08d4b] transition-all flex items-center justify-center gap-3"
                                    >
                                        Continue to Evidence Sealing <ClipboardCheck size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-[2.5rem] text-center">
                        <Camera className="mx-auto text-slate-400 mb-4" size={32} />
                        <span className="text-[10px] font-bold text-slate-400">Pre-repair evidence upload</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
