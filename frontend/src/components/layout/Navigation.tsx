import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NotificationCenter } from '../common/NotificationCenter';
import { SettingsCenter } from '../common/SettingsCenter';

export const Navigation = () => {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-black/5 shadow-premium">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate(`/${role?.toLowerCase()}`)}>
                <div className="w-10 h-10 bg-[#C5A059] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[#C5A059]/10 transition-transform group-hover:scale-105">A</div>
                <div className="flex flex-col">
                    <span className="font-serif font-bold text-xl tracking-tight leading-none text-slate-900">AHRN</span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wide">Autonomous Reliability</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-xs font-bold text-[#C5A059] px-3 py-1 bg-[#C5A059]/5 rounded-full border border-[#C5A059]/10 capitalize">{role?.toLowerCase()} Access</span>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationCenter />
                    <SettingsCenter />
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-black/5 flex items-center justify-center overflow-hidden ml-2 shadow-inner">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="avatar" />
                    </div>
                </div>
            </div>
        </nav>
    );
};
