import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Shield, AlertTriangle, Cpu, DollarSign, Send } from 'lucide-react';
import { Device } from '../../types';
import { useData } from '../../context/DataContext';

const GLASS_STYLE = "bg-white/95 backdrop-blur-2xl border border-black/5 shadow-premium";

interface RequestInterventionModalProps {
    isOpen: boolean;
    onClose: () => void;
    device: Device | null;
}

export const RequestInterventionModal: React.FC<RequestInterventionModalProps> = ({ isOpen, onClose, device }) => {
    const { createJob, addNotification } = useData();
    const [payout, setPayout] = useState(150);
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!device) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await createJob({
                deviceId: device.id,
                deviceName: device.name,
                severity: device.health < 40 ? 'HIGH' : 'MEDIUM',
                priority,
                payout
            });
            addNotification({
                title: 'Intervention Requested',
                message: `${device.name} restoration posted to the open market.`,
                type: 'INFO'
            });
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        className={`${GLASS_STYLE} w-full max-w-xl rounded-[3rem] overflow-hidden relative z-10 flex flex-col`}
                    >
                        <div className="p-8 border-b border-black/5 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white text-[#C5A059] rounded-2xl border border-black/5 shadow-sm">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Request Intervention</h3>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">Registry: Open Market Protocol</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-black/5 flex items-center gap-6 shadow-inner">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#C5A059] shadow-sm">
                                    <Cpu size={32} />
                                </div>
                                <div>
                                    <span className="text-[8px] font-bold text-slate-400 block mb-1">Target Device</span>
                                    <h4 className="text-lg font-bold text-slate-900">{device.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${device.health > 70 ? 'bg-emerald-500' : device.health > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                        <span className="text-[10px] text-slate-500 font-bold tracking-tight">Health Index: {device.health}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                        <DollarSign size={12} /> Strategy Payout
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={payout}
                                            onChange={(e) => setPayout(Number(e.target.value))}
                                            className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-xl font-bold text-slate-900 focus:border-[#C5A059] outline-none transition-all shadow-inner"
                                        />
                                    </div>
                                    <p className="text-[8px] text-slate-400 font-bold">Estimated Market Floor: $120.00</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                        <Shield size={12} /> Response Priority
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPriority(p)}
                                                className={`py-4 rounded-xl border text-[9px] font-bold transition-all ${priority === p ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' : 'bg-white border-black/5 text-slate-400 hover:text-slate-900'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                                <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                    Listing this anomaly on the open market will invite independent service nodes to provide competing strategies. All bids are verified through AHRN Proof of Repair veracity audits.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 border-t border-black/5 bg-slate-50/50 flex justify-end gap-4">
                            <button onClick={onClose} className="px-8 py-4 bg-white border border-black/5 rounded-2xl text-[10px] font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-10 py-4 bg-[#C5A059] text-white font-bold rounded-2xl text-[10px] hover:bg-[#b08d4b] transition-all flex items-center gap-3 disabled:opacity-50 shadow-premium"
                            >
                                {isSubmitting ? 'Transmitting Registry...' : <>Post to Market <Send size={14} /></>}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
