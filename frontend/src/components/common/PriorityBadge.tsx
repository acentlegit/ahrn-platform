import React from 'react';
import { motion } from 'framer-motion';
import { Flag, ChevronDown } from 'lucide-react';
import { Priority } from '../../types';

const PRIORITY_CONFIG: Record<Priority, { color: string, label: string }> = {
    HIGH: { color: 'bg-red-50 text-red-600 border-red-200', label: 'High Priority' },
    MEDIUM: { color: 'bg-amber-50 text-amber-600 border-amber-200', label: 'Normal' },
    LOW: { color: 'bg-slate-100 text-slate-500 border-black/5', label: 'Backlog' },
};

export const PriorityBadge = ({ priority, className = "", onClick }: { priority: Priority, className?: string, onClick?: () => void }) => {
    const config = PRIORITY_CONFIG[priority];
    return (
        <motion.div
            layout
            onClick={onClick}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest cursor-pointer hover:brightness-125 transition-all ${config.color} ${className}`}
        >
            <Flag size={8} />
            {config.label}
            {onClick && <ChevronDown size={8} className="ml-0.5 opacity-50" />}
        </motion.div>
    );
};
