import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, XCircle } from 'lucide-react';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const RejectionDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message
}: {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: (reason: string) => void,
    title: string,
    message: string
}) => {
    const [reason, setReason] = useState('');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        className={`${GLASS_STYLE} w-full max-w-md rounded-[2.5rem] p-10 border border-slate-100`}
                    >
                        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 border border-rose-100 shadow-sm">
                            <XCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">{message}</p>

                        <div className="mb-8">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Reason for Rejection</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:border-rose-300 resize-none h-32"
                                placeholder="Enter reason..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 hover:text-slate-900 transition-colors shadow-sm">Cancel</button>
                            <button
                                onClick={() => {
                                    if (reason.trim()) {
                                        onConfirm(reason);
                                        onClose();
                                        setReason('');
                                    } else {
                                        alert("Please enter a reason");
                                    }
                                }}
                                className={`flex-1 py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-lg ${!reason.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Decline
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
