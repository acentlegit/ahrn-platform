import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, User, Shield, Terminal, LogOut, Cpu, HardDrive, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GLASS_STYLE = "bg-white/95 backdrop-blur-2xl border border-black/5 shadow-premium";

export const SettingsCenter = () => {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const options = [
        { icon: User, label: 'Profile Intelligence', desc: 'Manage cryptographical identity' },
        { icon: Shield, label: 'Security Protocols', desc: 'AES-256 layer configuration' },
        { icon: Terminal, label: 'Network Access', desc: 'API keys & Node integration' },
        { icon: HardDrive, label: 'Ledger Storage', desc: 'Evidence retention policies' },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-white border border-black/5 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
            >
                <Settings size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className={`${GLASS_STYLE} absolute right-0 mt-4 w-80 rounded-[2.5rem] z-50 overflow-hidden shadow-premium`}
                        >
                            <div className="p-8 bg-slate-50/50 border-b border-black/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C5A059] to-slate-200 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {user?.name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{user?.name}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role} ACCESS</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 w-fit">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Biometric Verified</span>
                                </div>
                            </div>

                            <div className="p-4 space-y-2">
                                {options.map((opt, i) => (
                                    <button
                                        key={i}
                                        className="w-full p-4 rounded-2xl flex items-center gap-4 hover:bg-slate-50 transition-all text-left group"
                                    >
                                        <div className="p-2 rounded-lg bg-slate-100 text-slate-400 group-hover:text-[#C5A059] transition-colors shadow-sm">
                                            <opt.icon size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{opt.label}</p>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{opt.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="p-4 bg-slate-50">
                                <button
                                    onClick={handleLogout}
                                    className="w-full p-4 rounded-2xl flex items-center gap-4 hover:bg-rose-50 text-rose-500 transition-all text-left"
                                >
                                    <div className="p-2 rounded-lg bg-rose-50 text-rose-400 shadow-sm">
                                        <LogOut size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Terminate Session</p>
                                        <p className="text-[8px] text-rose-400 font-bold uppercase tracking-tighter">Securely sign out of AHRN</p>
                                    </div>
                                </button>
                            </div>

                            <div className="p-6 text-center">
                                <p className="text-[7px] text-slate-300 font-black uppercase tracking-[0.3em] mb-1">AHRN CORE v2.4.0</p>
                                <p className="text-[6px] text-slate-200 font-bold uppercase tracking-widest">BUILD_PX_CLUSTER_FINAL</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
