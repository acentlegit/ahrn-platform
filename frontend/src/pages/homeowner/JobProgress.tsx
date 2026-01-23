import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, MapPin, Wrench, Clock, ShieldCheck, CheckCircle2, Zap, Shield, FileCheck, Share2, Download, Activity, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { JobStatusBadge } from '../../components/common/JobStatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

import { AssignTechnicianModal } from '../../components/common/AssignTechnicianModal';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const JobProgress = () => {
    const { jobs, sealEvidence, refetch } = useData();
    const navigate = useNavigate();
    const { jobId } = useParams();
    const job = jobs.find(j => j.id === jobId);

    const [isSealing, setIsSealing] = useState(false);
    const [showSealConfirm, setShowSealConfirm] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [paymentReleased, setPaymentReleased] = useState(false);

    if (!job) return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 border border-black/5 shadow-premium">
                <Info size={40} className="text-slate-200" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Registry Entry Not Found</h2>
            <p className="text-slate-400 max-w-xs mx-auto">The requested intervention token is no longer active or does not exist in the current node cluster.</p>
            <button onClick={() => navigate('/homeowner')} className="mt-8 px-8 py-3 bg-white border border-black/5 text-slate-400 text-[10px] font-bold rounded-xl hover:text-slate-900 transition-all shadow-sm">Return to Control Center</button>
        </div>
    );

    const steps = [
        { label: 'Forecasted', status: 'completed', icon: Info, desc: 'AI neural mapping identified failure vector.' },
        { label: 'Bidding', status: job.status !== 'PREDICTED' ? 'completed' : 'active', icon: Zap, desc: 'Strategy auction finalized via distributed consensus.' },
        { label: 'Assigned', status: ['ASSIGNED', 'IN_PROGRESS', 'VERIFYING', 'COMPLETED'].includes(job.status) ? 'completed' : (job.status === 'BIDDING' ? 'upcoming' : 'upcoming'), icon: Shield, desc: 'Technician resource secured and authenticated.' },
        { label: 'Execution', status: ['IN_PROGRESS', 'VERIFYING', 'COMPLETED'].includes(job.status) ? (job.status === 'IN_PROGRESS' ? 'active' : 'completed') : 'upcoming', icon: Wrench, desc: 'On-site intervention and hardware replacement.' },
        { label: 'Verification', status: ['VERIFYING', 'COMPLETED'].includes(job.status) ? (job.status === 'VERIFYING' ? 'active' : 'completed') : 'upcoming', icon: CheckCircle2, desc: 'Telemetry audit and performance validation.' },
        { label: 'Sealed', status: job.status === 'COMPLETED' ? 'active' : 'upcoming', icon: ShieldCheck, desc: 'Cryptographic proof-of-fix recorded to registry.' },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === 'active');

    const handleSealEvidence = async () => {
        setIsSealing(true);
        try {
            await sealEvidence(job.id, { timestamp: Date.now(), hash: '0x' + Math.random().toString(16).slice(2) });
            // Simulation: wait a bit for "cryptographic sealing"
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) { console.error(e) }
        setIsSealing(false);
        setShowSealConfirm(false);
    };
    const handleShare = async () => {
        const shareData = {
            title: `AHRN Intervention: ${job.deviceName}`,
            text: `View real-time restoration progress for ${job.deviceName} on AHRN platform.`,
            url: window.location.href,
        };
        if (navigator.share) {
            try { await navigator.share(shareData) } catch (e) { console.error(e) }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Protocol Link Copied to Clipboard');
        }
    };

    const handleDownload = () => {
        const data = JSON.stringify(job, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AHRN_Intervention_${job.id}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    return (
        <div className="animate-fade-in space-y-10 pb-32 text-slate-900">
            <ConfirmDialog
                isOpen={showSealConfirm}
                onClose={() => setShowSealConfirm(false)}
                onConfirm={handleSealEvidence}
                title="Seal Cryptographic Proof"
                message="By sealing this evidence, you finalize the intervention strategy and record the proof-of-fix to the immutable AHRN registry. This action cannot be undone."
                confirmText={isSealing ? "Sealing..." : "Seal Proof-of-Fix"}
            />

            <AssignTechnicianModal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                jobId={job.id}
                onAssign={() => {
                    refetch();
                }}
            />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/homeowner')}
                        className="w-14 h-14 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:scale-105 shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Protocol Registry</h2>
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[8px] font-bold mt-1 shadow-sm">Live Tracking</div>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 font-medium tracking-tight">Monitoring real-time node restoration for {job.deviceName}.</p>
                    </div>
                </div>
                {job.status === 'BIDDING' && (
                    <button
                        onClick={() => setShowAssignModal(true)}
                        className="p-4 px-6 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                    >
                        Find Technician <ChevronRight size={16} />
                    </button>
                )}
                <div className="flex gap-3">
                    <button onClick={handleShare} className="p-3 bg-white border border-black/5 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm"><Share2 size={20} /></button>
                    <button onClick={handleDownload} className="p-3 bg-white border border-black/5 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm"><Download size={20} /></button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Progress Logic */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={`${GLASS_STYLE} p-10 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Activity size={120} className="text-slate-900" />
                        </div>

                        <div className="flex justify-between items-start mb-16 relative z-10">
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">{job.deviceName} Restoration</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                                        <MapPin size={12} className="text-[#C5A059]" /> Node Cluster: {job.deviceId}
                                    </div>
                                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                    <span className="text-[10px] text-slate-400 font-bold">Service Level Agreement: 12h Recovery</span>
                                </div>
                            </div>
                            <JobStatusBadge status={job.status} className="scale-125 origin-right" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 relative">
                            {/* Vertical Line for Mobile/Tablet */}
                            <div className="absolute top-0 bottom-0 left-[21px] w-px bg-slate-100 hidden lg:block" />

                            {steps.map((step, i) => (
                                <div key={i} className="flex gap-6 relative group">
                                    <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center z-10 shrink-0 transition-all duration-500 shadow-sm ${step.status === 'completed' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : step.status === 'active' ? 'bg-[#C5A059] text-white animate-pulse ring-4 ring-[#C5A059]/10 shadow-[0_0_30px_rgba(197,160,89,0.3)]' : 'bg-slate-50 border border-black/5 text-slate-300 shadow-inner'}`}>
                                        <step.icon size={20} />
                                    </div>
                                    <div className="py-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className={`text-xs font-bold transition-colors ${step.status === 'upcoming' ? 'text-slate-300' : 'text-slate-900'}`}>
                                                {step.label}
                                            </h4>
                                            {step.status === 'completed' && <FileCheck size={12} className="text-emerald-500" />}
                                        </div>
                                        <p className={`text-[10px] leading-relaxed transition-colors ${step.status === 'upcoming' ? 'text-slate-200' : 'text-slate-400 font-medium'}`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                    {/* Horizontal Line between grid items */}
                                    {i < steps.length - 1 && (
                                        <div className="absolute top-6 left-12 right-0 h-px bg-slate-100 -z-10 hidden lg:block" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {job.status === 'COMPLETED' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-20 p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-lg">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">Intervention Complete</h4>
                                        <p className="text-slate-400 text-xs font-medium">Technician has sealed the evidence. Please release funds.</p>
                                    </div>
                                </div>

                                {!paymentReleased ? (
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Release payment to the technician? This action is final.")) {
                                                setPaymentReleased(true);
                                                // Here we would call the actual payment API
                                                alert("Funds released to technician wallet.");
                                            }
                                        }}
                                        className="px-10 py-5 bg-slate-900 text-white text-[10px] font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-premium shrink-0"
                                    >
                                        Release Payment (${job.payout.toFixed(2)})
                                    </button>
                                ) : (
                                    <div className="px-10 py-5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-2xl border border-emerald-200 shadow-inner flex items-center gap-2">
                                        <CheckCircle2 size={16} /> Payment Released
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Live Telemetry Simulation View */}
                    <div className={`${GLASS_STYLE} p-10 bg-slate-50/50`}>
                        {/* ... telemetry content ... */}
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <h4 className="text-[10px] font-bold text-slate-400">Real-Time Telemetry Stream</h4>
                            </div>
                            <span className="font-mono text-[10px] text-slate-300">Active Node Transmission Streams</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Duty Cycle', value: '42.2%', trend: 'down' },
                                { label: 'Stability Index', value: '98.5', trend: 'up' },
                                { label: 'Latency', value: '14ms', trend: 'down' },
                                { label: 'Voltage Log', value: '12.4V', trend: 'stable' }
                            ].map((tm, i) => (
                                <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                                    <span className="text-[8px] font-bold text-slate-300 block mb-1 tracking-tighter">{tm.label}</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-slate-900 leading-none">{tm.value}</span>
                                        {tm.trend === 'up' && <TrendingUp size={10} className="text-emerald-500" />}
                                        {tm.trend === 'down' && <TrendingDown size={10} className="text-emerald-500 rotate-180" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Protocol Info */}
                <div className="space-y-8">
                    <div className={`${GLASS_STYLE} p-10`}>
                        <h4 className="text-[10px] font-bold text-slate-400 mb-10 pb-6 border-b border-black/5 flex items-center justify-between">
                            Provider Credentials <Shield size={14} className="text-slate-200" />
                        </h4>
                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-16 h-16 rounded-[1.75rem] bg-slate-50 border-2 border-white overflow-hidden shadow-premium">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.id}`} alt="provider" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <span className="text-lg font-serif font-bold text-slate-900 block leading-tight">NexGen HVAC Protocols</span>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    <span className="text-[10px] text-emerald-600 font-bold">AHRN Verified</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 bg-slate-50/50 rounded-[1.75rem] border border-black/5 shadow-inner">
                                <span className="text-[8px] font-bold text-slate-400 block mb-1">Intervention Budget</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-serif font-bold text-slate-900">${job.payout.toFixed(2)}</span>
                                    <span className="text-[8px] text-slate-300 font-bold">Locked</span>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50/50 rounded-[1.75rem] border border-black/5 shadow-inner">
                                <span className="text-[8px] font-bold text-slate-400 block mb-1">Resilience Guarantee</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-serif font-bold text-slate-900">12 Months</span>
                                    <span className="text-[8px] text-slate-300 font-bold">Aggregated</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-[#C5A059]/5 rounded-[1.75rem] border border-[#C5A059]/10">
                            <p className="text-[10px] text-[#C5A059] leading-relaxed font-bold mb-4">Registry Access Protocol</p>
                            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">This intervention is being recorded to the Austin-North district registry. All telemetry is cryptographically sealed for insurance and valuation audits.</p>
                        </div>
                    </div>

                    <div className={`${GLASS_STYLE} p-10 bg-[#C5A059] text-white shadow-lg`}>
                        <h4 className="text-[10px] font-bold mb-6 opacity-60">System Recommendation</h4>
                        <p className="text-sm font-serif font-bold leading-relaxed mb-8">Maintain ambient temperature at 72°F during initial 24h stabilization cycle to ensure adhesive set-points.</p>
                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-bold shadow-premium hover:bg-slate-800 transition-all">Set Auto-Buffer</button>
                    </div>
                </div>
            </div>
        </div>
    );
};



