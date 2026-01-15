import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, Lock, Wrench, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { JobStatus } from '../../types';

export const STATUS_CONFIG: Record<JobStatus, { color: string, icon: any, label: string, pulse?: boolean }> = {
    PREDICTED: { color: 'bg-slate-100 text-slate-500 border-black/5', icon: Clock, label: 'Forecasted' },
    BIDDING: { color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Activity, label: 'Market Active', pulse: true },
    ASSIGNED: { color: 'bg-indigo-50 text-indigo-600 border-indigo-200', icon: Lock, label: 'Secured' },
    IN_PROGRESS: { color: 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]', icon: Wrench, label: 'In Progress', pulse: true },
    VERIFYING: { color: 'bg-purple-50 text-purple-600 border-purple-200', icon: BrainCircuit, label: 'Verifying' },
    COMPLETED: { color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle2, label: 'Sealed & Proven' },
};

export const JobStatusBadge = ({ status, className = "" }: { status: JobStatus, className?: string }) => {
    const config = STATUS_CONFIG[status];
    if (!config) return null;
    const Icon = config.icon;

    return (
        <motion.div
            layout
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-bold text-[10px] shadow-lg transition-all duration-300 ${config.color} ${className}`}
        >
            <div className="relative">
                <Icon size={12} className="shrink-0 relative z-10" />
                {config.pulse && (
                    <span className="absolute inset-0 bg-current rounded-full animate-ping opacity-40" />
                )}
            </div>
            {config.label}
        </motion.div >
    );
};
