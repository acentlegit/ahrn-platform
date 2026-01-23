import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, Star, ShieldCheck, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ahrnApi } from '../../api';

interface AssignTechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    onAssign: () => void;
}

export const AssignTechnicianModal = ({ isOpen, onClose, jobId, onAssign }: AssignTechnicianModalProps) => {
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadTechnicians();
        }
    }, [isOpen]);

    const loadTechnicians = async () => {
        setLoading(true);
        const data = await ahrnApi.getRecommendedTechnicians();
        setTechnicians(data);
        setLoading(false);
    };

    const handleAssign = async (techId: string) => {
        setAssigningId(techId);
        setError(null);
        const res = await ahrnApi.assignJob(jobId, techId);
        if (res.success) {
            onAssign();
            onClose();
        } else {
            setError(res.message || 'Failed to assign technician');
            setAssigningId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 text-slate-900">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-white max-h-[85vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 leading-none">Find Technician</h3>
                            <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-wide">Recommended for your job</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {loading ? (
                            <div className="text-center py-12 text-slate-400 text-sm">Finding best matches...</div>
                        ) : technicians.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">No technicians found nearby.</div>
                        ) : (
                            technicians.map((tech) => (
                                <div key={tech._id} className="group p-6 rounded-3xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all bg-white relative overflow-hidden">
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg">
                                            {tech.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-900 text-lg">{tech.name}</h4>
                                                <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">
                                                    <Star size={12} fill="currentColor" />
                                                    {tech.technicianRating || 5.0}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-slate-400 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                    <span className="font-medium text-slate-500">Verified Pro</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    <span>{tech.address || 'Local'}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {tech.skills?.map((skill: string) => (
                                                    <span key={skill} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            disabled={assigningId !== null}
                                            onClick={() => handleAssign(tech._id)}
                                            className="self-center ml-4 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 group-hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {assigningId === tech._id ? (
                                                'Assigning...'
                                            ) : (
                                                <>Hire <ChevronRight size={14} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {error && (
                        <div className="px-8 pb-4 bg-white border-t border-slate-50">
                            <p className="text-center text-rose-500 text-xs font-bold mt-4">{error}</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
