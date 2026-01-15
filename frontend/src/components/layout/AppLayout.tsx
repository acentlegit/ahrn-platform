import React from 'react';
import { Outlet } from 'react-router-dom';
import { RefreshCw, Lock } from 'lucide-react';
import { Navigation } from './Navigation';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const AppLayout = () => {
    const { role } = useAuth();
    const { isSyncing } = useData();

    return (
        <div className="min-h-screen bg-ahrn-bg text-ahrn-text selection:bg-[#C5A059] selection:text-white">
            <Navigation />

            <main className="container mx-auto px-6 pt-32 max-w-7xl">
                <header className="mb-12 relative">
                    <div className="absolute -top-12 -left-20 w-40 h-40 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white border border-black/5 text-slate-400 text-[9px] tracking-[0.2em] uppercase font-black rounded-lg w-fit shadow-sm"><Lock size={10} /> Secure Node Cluster: PX-882</div>
                            <h1 className="text-5xl font-serif font-bold text-slate-900 tracking-tight uppercase">{role === 'HOMEOWNER' && 'Control Center'}{role === 'TECHNICIAN' && 'Field Ops'}{role === 'ADMIN' && 'Governance Hub'}</h1>
                        </div>
                        <div className={`transition-opacity duration-300 ${isSyncing ? 'opacity-100' : 'opacity-20'}`}><div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-black/5 shadow-sm"><RefreshCw size={12} className={`text-[#C5A059] ${isSyncing ? 'animate-spin' : ''}`} /><span className="text-[8px] font-black tracking-widest text-slate-500 uppercase">Real-Time Sync</span></div></div>
                    </div>
                    <div className="flex items-center gap-4 mt-2"><p className="text-slate-500 text-sm font-medium tracking-wide">{role === 'HOMEOWNER' && 'Predict. Compete. Prevent. Verify.'}{role === 'TECHNICIAN' && 'Evidence-grade field execution system.'}{role === 'ADMIN' && 'Market oversight and cryptographic audit log.'}</p><div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 to-transparent" /></div>
                </header>

                <Outlet />
            </main>

            <footer className="mt-40 pb-20 border-t border-black/5 flex flex-col items-center"><div className="mt-12 flex gap-12 text-slate-400 text-[10px] font-bold uppercase tracking-widest"><span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Disclosure</span><span className="hover:text-slate-900 cursor-pointer transition-colors">Legal Evidence Standards</span><span className="hover:text-slate-900 cursor-pointer transition-colors">IoT Policy</span></div><p className="text-[10px] text-slate-300 font-black uppercase tracking-[1em] mt-12 mb-2">AHRN PLATFORM v2.4.0</p><p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">© 2024 AUTONOMOUS HOME RELIABILITY NETWORK</p></footer>
        </div>
    );
};
