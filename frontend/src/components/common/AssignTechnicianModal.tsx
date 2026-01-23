
import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, MapPin, Search, CheckCircle2 } from 'lucide-react';
import { ahrnApi } from '../../api';
import { User } from '../../types';

interface AssignTechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    onAssign: () => void;
}

const GLASS_STYLE = "bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-3xl";

export const AssignTechnicianModal: React.FC<AssignTechnicianModalProps> = ({ isOpen, onClose, jobId, onAssign }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [technicians, setTechnicians] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [assigningId, setAssigningId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadTechnicians();
        }
    }, [isOpen]);

    const loadTechnicians = async () => {
        setLoading(true);
        const techs = await ahrnApi.getRecommendedTechnicians();
        setTechnicians(techs);
        setLoading(false);
    };

    const handleAssign = async (techId: string) => {
        if (window.confirm("Are you sure you want to assign this job directly? This will bypass the bidding process.")) {
            setAssigningId(techId);
            const res = await ahrnApi.assignJob(jobId, techId);
            if (res.success) {
                onAssign();
                onClose();
            } else {
                alert(res.message || 'Failed to assign job');
            }
            setAssigningId(null);
        }
    };

    if (!isOpen) return null;

    const filteredTechnicians = technicians.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.skills && t.skills.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`${GLASS_STYLE} w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200`}>

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900">Find a Professional</h2>
                        <p className="text-sm text-slate-500 font-medium">Select a verified technician for immediate assignment</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:scale-105 transition-all shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 pb-2">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C5A059] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or skill (e.g., 'HVAC', 'Plumbing')..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40 space-y-3">
                            <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-bold text-slate-400">Locating nearby experts...</span>
                        </div>
                    ) : filteredTechnicians.length > 0 ? (
                        filteredTechnicians.map((tech) => (
                            <div key={tech._id} className="group bg-white border border-slate-100 rounded-2xl p-5 hover:border-[#C5A059]/30 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl shadow-inner">
                                        {tech.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 group-hover:text-[#C5A059] transition-colors">{tech.name}</h3>
                                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                                                <ShieldCheck size={10} /> Verified
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1 text-[#C5A059]">
                                                <Star size={12} fill="#C5A059" />
                                                {tech.technicianRating || '5.0'}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            {tech.address && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} /> {tech.address}
                                                </span>
                                            )}
                                        </div>

                                        {tech.skills && tech.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {tech.skills.slice(0, 3).map((skill: string, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAssign(tech._id!)}
                                    disabled={assigningId === tech._id}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-[#C5A059] transition-all shadow-lg hover:shadow-[#C5A059]/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[100px]"
                                >
                                    {assigningId === tech._id ? 'Assigning...' : 'Hire Direct'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Search size={24} />
                            </div>
                            <h3 className="text-slate-900 font-bold">No technicians found</h3>
                            <p className="text-slate-400 text-sm mt-1">Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
