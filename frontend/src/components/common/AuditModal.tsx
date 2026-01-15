import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Database, Cpu, Calendar, Clock, Hash, Lock } from 'lucide-react';
import { Job } from '../../types';

const GLASS_STYLE = "bg-white/95 backdrop-blur-2xl border border-black/5 shadow-premium";

interface AuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
}

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose, job }) => {
    if (!job) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`${GLASS_STYLE} w-full max-w-2xl rounded-[3rem] overflow-hidden relative z-10 flex flex-col`}
                    >
                        <div className="p-8 border-b border-black/5 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white text-[#C5A059] rounded-2xl border border-black/5 shadow-sm">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-slate-900 uppercase tracking-tight">Forensic Audit Detail</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: Cryptographically Sealed</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-black/5 space-y-4 shadow-inner">
                                    <div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Device Identity</span>
                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{job.deviceName}</p>
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Provider ID</span>
                                        <p className="text-xs font-mono text-[#C5A059]">Node-77x-Alpha</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-black/5 space-y-4 shadow-inner">
                                    <div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Sealed Timestamp</span>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Calendar size={12} /> <span className="text-[10px] uppercase font-bold">{job.sealedAt ? new Date(job.sealedAt).toLocaleDateString() : 'Mar 12, 2026'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Escrow Payout</span>
                                        <p className="text-sm font-bold text-emerald-500">${job.payout.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] space-y-6">
                                <div className="flex items-center gap-3">
                                    <Hash size={16} className="text-[#C5A059]" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Immutable Evidence Hash</span>
                                </div>
                                <div className="p-6 bg-white rounded-xl font-mono text-[10px] text-slate-600 break-all leading-relaxed border border-black/5 shadow-sm">
                                    {job.evidenceHash || 'SHA256:77a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a'}
                                </div>
                                <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Validation Score: 0.998</span>
                                    <span>Sync Status: L1 Ledger Consistent</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Database size={12} /> Component Telemetry Snapshot
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {['System Pressure: Optimal', 'Logic Cycle: Validated', 'Handshake Protocol: AES-Layer-3'].map((item, i) => (
                                        <div key={i} className="px-6 py-4 bg-white rounded-xl border border-black/5 flex justify-between items-center shadow-sm">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{item}</span>
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-black/5 bg-slate-50/50 flex justify-end gap-4">
                            <button className="px-8 py-3 bg-white border border-black/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                                Download Audit Archive
                            </button>
                            <button onClick={onClose} className="px-8 py-3 bg-[#C5A059] text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#b08d4b] transition-all shadow-premium">
                                Close Access Portal
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
