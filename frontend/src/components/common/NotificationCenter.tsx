import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, AlertCircle, Info, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

const GLASS_STYLE = "bg-white/95 backdrop-blur-2xl border border-black/5 shadow-premium";

export const NotificationCenter = () => {
    const { notifications, clearNotifications, markNotificationAsRead } = useData();
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-white border border-black/5 rounded-2xl text-slate-400 hover:text-slate-900 transition-all relative shadow-sm"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#C5A059] rounded-full animate-pulse shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay to close */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`${GLASS_STYLE} absolute right-0 mt-4 w-96 rounded-[2rem] z-50 overflow-hidden shadow-premium`}
                        >
                            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Protocol Notifications</h3>
                                <div className="flex gap-4">
                                    <button onClick={clearNotifications} className="text-slate-300 hover:text-rose-500 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-black/5 shadow-inner">
                                            <Bell className="text-slate-100" size={20} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Registry Clear</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => markNotificationAsRead(n.id)}
                                            className={`p-6 border-b border-black/5 last:border-0 hover:bg-slate-50/50 cursor-pointer transition-all relative group ${!n.read ? 'bg-[#C5A059]/5' : ''}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`mt-1 p-2 rounded-lg shadow-sm border ${n.type === 'SUCCESS' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' :
                                                    n.type === 'ALERT' ? 'bg-rose-50 border-rose-100 text-rose-500' :
                                                        'bg-indigo-50 border-indigo-100 text-indigo-500'
                                                    }`}>
                                                    {n.type === 'SUCCESS' ? <CheckCircle2 size={14} /> :
                                                        n.type === 'ALERT' ? <AlertCircle size={14} /> :
                                                            <Info size={14} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">{n.title}</h4>
                                                        <span className="text-[8px] font-black text-slate-300 uppercase">{n.time}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                                                </div>
                                            </div>
                                            {!n.read && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A059]" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-4 bg-slate-50/50 text-center border-t border-black/5">
                                <button className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#C5A059] transition-colors">
                                    View Systematic Audit Log
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
