import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, UserPlus, Mail, Settings, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ahrnApi } from '../../api';
import { Job } from '../../types';
import { NotificationCenter } from '../../components/common/NotificationCenter';
import { SettingsCenter } from '../../components/common/SettingsCenter';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const OrganizationDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ name: '', email: '', skills: '' });

    useEffect(() => {
        // Fetch market jobs and technicians
        const fetchData = async () => {
            const marketJobs = await ahrnApi.getMarketJobs();
            setJobs(marketJobs);

            const techData = await ahrnApi.getOrganizationTechnicians();
            if (techData.success) {
                setTechnicians(techData.technicians);
            }
        };
        fetchData();
    }, []);

    const handleInvite = async () => {
        if (!inviteData.email || !inviteData.name) {
            alert("Name and Email are required");
            return;
        }

        const res = await ahrnApi.inviteTechnician({
            ...inviteData,
            skills: inviteData.skills.split(',').map(s => s.trim()).filter(s => s)
        });

        if (res.success) {
            alert(`Invitation sent to ${inviteData.email}`);
            setIsInviteModalOpen(false);
            setInviteData({ name: '', email: '', skills: '' });

            // Refresh technicians list
            const techData = await ahrnApi.getOrganizationTechnicians();
            if (techData.success) {
                setTechnicians(techData.technicians);
            }
        } else {
            alert(`Failed: ${res.message}`);
        }
    };

    return (
        <div className="animate-fade-in space-y-10 pb-32 text-slate-900 px-4">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-white border border-black/5 flex items-center justify-center text-blue-600 shadow-premium">
                        <Briefcase size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900">Organization Governance</h1>
                            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-[9px] font-bold mt-1">
                                {user?.companyInfo?.name || 'Enterprise Node'}
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 font-medium tracking-tight">Manage workforce and marketplace opportunities.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-lg hover:bg-slate-800 transition-all"
                    >
                        <UserPlus size={16} /> Invite Technician
                    </button>
                    <NotificationCenter />
                    <SettingsCenter />
                </div>
            </header>

            <section className={`${GLASS_STYLE} p-8`}>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-serif font-bold text-slate-900">Marketplace Opportunities</h3>
                    <div className="text-xs font-bold text-slate-400">{jobs.length} Active Jobs</div>
                </div>

                <div className="overflow-hidden rounded-[2.5rem] border border-black/5">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 border-b border-black/5">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400">Job ID</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400">Device / Issue</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400">Payout</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {jobs.map(job => (
                                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-6 text-xs font-mono text-slate-500">{job.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-slate-900">{job.deviceName}</div>
                                        <div className="text-[10px] text-slate-400">{job.severity} Priority</div>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-emerald-600">${job.payout}</td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-bold border border-blue-100">
                                            {job.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 text-sm">No active market jobs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Workforce Management Section */}
            <section className={`${GLASS_STYLE} p-8`}>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-serif font-bold text-slate-900">Workforce Management</h3>
                    <div className="text-xs font-bold text-slate-400">{technicians.length} Technicians</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Verified Technicians */}
                    <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-black/5">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 size={20} className="text-emerald-600" />
                            <h4 className="text-lg font-bold text-slate-900">Active Technicians</h4>
                            <span className="ml-auto text-xs font-bold text-emerald-600">
                                {technicians.filter(t => t.isActive !== false).length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {technicians.filter(t => t.isActive !== false).map(tech => (
                                <div key={tech._id} className="bg-white rounded-xl p-4 border border-black/5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-900">{tech.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">{tech.email}</div>
                                            {tech.skills && tech.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {tech.skills.map((skill: string, idx: number) => (
                                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-bold border border-blue-100">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold border border-emerald-100">
                                                ACTIVE
                                            </div>
                                            {tech.reputation && (
                                                <div className="text-xs text-slate-400">
                                                    ⭐ {tech.reputation.score.toFixed(1)} ({tech.reputation.completedJobs} jobs)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {technicians.filter(t => t.isActive !== false).length === 0 && (
                                <div className="text-center text-slate-400 text-sm py-8">No active technicians yet</div>
                            )}
                        </div>
                    </div>

                    {/* Pending Invites */}
                    <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-black/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail size={20} className="text-amber-600" />
                            <h4 className="text-lg font-bold text-slate-900">Pending Invites</h4>
                            <span className="ml-auto text-xs font-bold text-amber-600">
                                {technicians.filter(t => t.isActive === false).length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {technicians.filter(t => t.isActive === false).map(tech => (
                                <div key={tech._id} className="bg-white rounded-xl p-4 border border-black/5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-900">{tech.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">{tech.email}</div>
                                            {tech.skills && tech.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {tech.skills.map((skill: string, idx: number) => (
                                                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-bold">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-bold border border-amber-100">
                                            PENDING SETUP
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {technicians.filter(t => t.isActive === false).length === 0 && (
                                <div className="text-center text-slate-400 text-sm py-8">No pending invites</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className={`${GLASS_STYLE} w-full max-w-lg p-10 relative`}
                        >
                            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-slate-900 text-white rounded-xl"><UserPlus size={20} /></div>
                                Invite Technician
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-black/5 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                                        placeholder="Jane Doe"
                                        value={inviteData.name}
                                        onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border border-black/5 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                                        placeholder="jane@example.com"
                                        value={inviteData.email}
                                        onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Skills (Comma Separated)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-black/5 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                                        placeholder="HVAC, Plumbing, Electrical"
                                        value={inviteData.skills}
                                        onChange={e => setInviteData({ ...inviteData, skills: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button onClick={() => setIsInviteModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold text-xs uppercase hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                                <button onClick={handleInvite} className="flex-1 py-3 bg-blue-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">Send Invitation</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
