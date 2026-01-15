import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    confirmColor = "bg-red-500"
}: {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    title: string,
    message: string,
    confirmText?: string,
    confirmColor?: string
}) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className={`${GLASS_STYLE} w-full max-w-md rounded-[2.5rem] p-10 border border-red-100`}
                >
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 border border-red-100 shadow-sm">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-10">{message}</p>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 hover:text-slate-900 transition-colors shadow-sm">Cancel</button>
                        <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 py-4 ${confirmColor} text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-lg`}>{confirmText}</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
