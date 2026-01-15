import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Camera, Share2, Info, Activity, LayoutGrid, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { JobStatusBadge } from '../../components/common/JobStatusBadge';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const CompleteJob = () => {
    const { jobs, sealEvidence } = useData();
    const navigate = useNavigate();
    const { jobId } = useParams();
    const job = jobs.find(j => j.id === jobId);

    const [isSealing, setIsSealing] = useState(false);
    const [step, setStep] = useState(1);

    if (!job) return <div>Job not found</div>;

    const handleSeal = async () => {
        setIsSealing(true);
        await sealEvidence(job.id, {
            technicianId: 'TECH-001',
            artifacts: ['post_repair_vibration.log', 'visual_confirmation.png'],
            timestamp: new Date().toISOString()
        });
        setIsSealing(false);
        navigate('/technician');
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
                    <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Proof of Repair</h2>
                    <p className="text-slate-500 text-xs font-medium">Seal cryptographic evidence for {job.deviceName}.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stepper Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { num: 1, label: 'Visual Evidence' },
                        { num: 2, label: 'Component Log' },
                        { num: 3, label: 'Telemetry Stabilization' },
                        { num: 4, label: 'Final Sealing' }
                    ].map((s) => (
                        <div
                            key={s.num}
                            className={`p-4 rounded-2xl border transition-all ${step === s.num ? 'bg-[#C5A059]/10 border-[#C5A059]/40 text-[#C5A059]' : (step > s.num ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-black/5 text-slate-500')}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${step >= s.num ? 'bg-current text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {step > s.num ? <CheckCircle size={14} className="text-white" /> : <span className={step === s.num ? 'text-white' : 'text-slate-500'}>{s.num}</span>}
                                </div>
                                <span className="text-sm font-bold">{s.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className={`${GLASS_STYLE} p-10 rounded-[2.5rem]`}>
                        {step === 1 && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-2xl font-bold text-slate-900">Visual Documentation</h3>
                                <p className="text-slate-500 text-sm">Upload pre- and post-intervention assets to the decentralized registry.</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="aspect-square bg-slate-50 border border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-slate-400 transition-all cursor-pointer group">
                                        <Camera className="text-slate-400 group-hover:text-slate-900 transition-colors" size={32} />
                                        <span className="text-[10px] font-bold text-slate-500">Post-Repair</span>
                                    </div>
                                    <div className="aspect-square bg-slate-50 border border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-slate-400 transition-all cursor-pointer group">
                                        <LayoutGrid className="text-slate-400 group-hover:text-slate-900 transition-colors" size={32} />
                                        <span className="text-[10px] font-bold text-slate-500">Serial Capture</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-10 py-4 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    Proceed to Component Log
                                </button>
                            </section>
                        )}

                        {step === 2 && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-2xl font-bold text-slate-900">Component Inventory</h3>
                                <div className="space-y-4">
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-black/5 flex justify-between items-center shadow-inner">
                                        <div>
                                            <span className="text-[10px] text-slate-500 font-bold">Component Identifier</span>
                                            <p className="text-sm font-bold text-slate-900">AHRN-COMP-99x</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600">Verified</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-bold text-[#C5A059] hover:text-[#b08d4b]">
                                        + Add Supplemental Part
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="px-8 py-4 bg-white border border-black/5 text-slate-500 text-sm font-bold rounded-xl hover:text-slate-900">Back</button>
                                    <button onClick={() => setStep(3)} className="px-10 py-4 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800">Initialize Stabilization</button>
                                </div>
                            </section>
                        )}

                        {step === 3 && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">Node Stabilization</h3>
                                        <p className="text-slate-500 text-sm mt-1">Monitoring live vibration and thermal telemetry for baseline alignment.</p>
                                    </div>
                                    <Activity className="text-emerald-500 animate-pulse" size={32} />
                                </div>
                                <div className="h-48 bg-slate-50 rounded-3xl border border-black/5 overflow-hidden flex items-end p-4 gap-1 shadow-inner">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 10 }}
                                            animate={{ height: Math.random() * 80 + 20 }}
                                            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 + Math.random() }}
                                            className="flex-1 bg-emerald-500/20 rounded-t-sm"
                                        />
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                        <span className="text-[10px] text-emerald-600 font-bold">Confidence</span>
                                        <p className="text-xl font-bold text-emerald-500">99.2%</p>
                                    </div>
                                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                        <span className="text-[10px] text-emerald-600 font-bold">Alignment</span>
                                        <p className="text-xl font-bold text-emerald-500">Nominal</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="px-8 py-4 bg-white border border-black/5 text-slate-500 text-sm font-bold rounded-xl hover:text-slate-900">Back</button>
                                    <button onClick={() => setStep(4)} className="px-10 py-4 bg-[#C5A059] text-white text-sm font-bold rounded-xl hover:bg-[#b08d4b] shadow-lg shadow-[#C5A059]/20">Proceed to Sealing</button>
                                </div>
                            </section>
                        )}

                        {step === 4 && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl flex gap-6">
                                    <Info className="text-amber-500 flex-shrink-0" size={32} />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 mb-2">Final Attestation</h4>
                                        <p className="text-slate-500 text-xs leading-relaxed">
                                            By sealing this evidence, you hash the visual assets and telemetry data into the immutable AHRN ledger. This action triggers the smart-contract payout sequence and starts the 12-month stabilization guarantee.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(3)} className="px-8 py-4 bg-white border border-black/5 text-slate-500 text-sm font-bold rounded-xl hover:text-slate-900">Back</button>
                                    <button
                                        onClick={handleSeal}
                                        disabled={isSealing}
                                        className="flex-1 py-5 bg-[#C5A059] text-white font-bold rounded-2xl text-sm shadow-xl shadow-[#C5A059]/20 hover:bg-[#b08d4b] transition-all flex items-center justify-center gap-3"
                                    >
                                        {isSealing ? 'Sealing Transaction...' : <><ShieldCheck size={18} /> Seal Evidence Ledger</>}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
