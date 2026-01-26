import React, { useMemo } from 'react';
import {
    Search,
    Plus,
    Activity,
    TrendingUp,
    Lock,
    ShieldCheck,
    ArrowUpRight,
    Bell,
    Settings,
    UserCircle,
    Database,
    Zap,
    Filter,
    Download,
    LayoutDashboard,
    CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

import { RadarChart } from '../../components/common/RadarChart';
import { TrendChart } from '../../components/common/TrendChart';
import { useState } from 'react';
import { NotificationCenter } from '../../components/common/NotificationCenter';
import { SettingsCenter } from '../../components/common/SettingsCenter';
import { AuditModal } from '../../components/common/AuditModal';
import { Job, User as UserType } from '../../types';
import { ahrnApi } from '../../api';
import { Users, Shield, Trash2, Mail as MailIcon } from 'lucide-react';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RejectionDialog } from '../../components/common/RejectionDialog';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const AdminDashboard = () => {
    const { jobs, devices } = useData();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'predicted' | 'b2b_requests'>('audit');
    const [users, setUsers] = useState<UserType[]>([]);
    const [pendingUsers, setPendingUsers] = useState<UserType[]>([]);
    const [approvalDialog, setApprovalDialog] = useState<{ id: string, name: string } | null>(null);
    const [rejectionDialog, setRejectionDialog] = useState<{ id: string, name: string } | null>(null);

    React.useEffect(() => {
        if (activeTab === 'users') {
            ahrnApi.getUsers().then(setUsers);
        } else if (activeTab === 'b2b_requests') {
            ahrnApi.getPendingUsers().then(res => {
                if (res.success) setPendingUsers(res.users);
            });
        }
    }, [activeTab]);

    const handleApproveUser = (id: string, name: string) => {
        setApprovalDialog({ id, name });
    };

    const performApproveUser = async (id: string) => {
        const res = await ahrnApi.approveUser(id);
        if (res.success) {
            setPendingUsers(pendingUsers.filter(u => u._id !== id));
            // alert('User approved successfully'); // Dialog handles visual feedback mostly, maybe toast later?
        } else {
            alert('Failed to approve user: ' + res.message);
        }
    };

    const handleRejectUser = (id: string, name: string) => {
        setRejectionDialog({ id, name });
    };

    const performRejectUser = async (id: string, reason: string) => {
        const res = await ahrnApi.rejectUser(id, reason);
        if (res.success) {
            setPendingUsers(pendingUsers.filter(u => u._id !== id));
        } else {
            alert('Failed to reject user: ' + res.message);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const res = await ahrnApi.deleteUser(id);
            if (res.success) {
                setUsers(users.filter(u => u._id !== id));
            }
        }
    };

    const handlePromoteUser = async (id: string, role: string) => {
        const res = await ahrnApi.updateUser(id, { role });
        if (res.success) {
            setUsers(users.map(u => u._id === id ? { ...u, role: role as any } : u));
        }
    };

    const filteredJobs = useMemo(() => {
        return jobs
            .filter(j => j.status === 'COMPLETED')
            .filter(j =>
                j.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (j.evidenceHash && j.evidenceHash.toLowerCase().includes(searchTerm.toLowerCase()))
            );
    }, [jobs, searchTerm]);

    const handleExport = () => {
        const data = JSON.stringify(filteredJobs, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AHRN_Audit_Export_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const stats = useMemo(() => {
        const completedJobs = jobs.filter(j => j.status === 'COMPLETED');
        const escrowed = jobs.reduce((acc, j) => acc + j.payout, 0);
        const avgBids = jobs.length > 0 ? jobs.reduce((acc, j) => acc + j.bids.length, 0) / jobs.length : 0;
        const slaHealth = devices.length > 0 ? devices.reduce((acc, d) => acc + d.health, 0) / devices.length : 98.2;

        return [

            { label: 'Uptime', value: '99.99%', icon: Activity, color: 'bg-emerald-500', text: 'text-emerald-500' },
            { label: 'Bids / Job', value: avgBids.toFixed(1), icon: TrendingUp, color: 'bg-indigo-500', text: 'text-indigo-500' },
            { label: 'Escrowed', value: `$${(escrowed / 1000).toFixed(1)}k`, icon: Lock, color: 'bg-[#C5A059]', text: 'text-[#C5A059]' },
            { label: 'SLA Health', value: `${slaHealth.toFixed(1)}%`, icon: ShieldCheck, color: 'bg-rose-500', text: 'text-rose-500' }
        ];
    }, [jobs, devices]);

    const radarData = useMemo(() => [
        { label: 'Service Level Agreement Compliance', value: devices.length > 0 ? Math.round(devices.reduce((acc, d) => acc + d.health, 0) / devices.length) : 98 },
        { label: 'Throughput', value: Math.min(100, 70 + (jobs.filter(j => j.status === 'COMPLETED').length * 2)) },
        { label: 'Node Density', value: Math.min(100, 60 + (devices.length * 3)) },
        { label: 'Escrow Liquidity', value: 78 + (jobs.length % 10) },
        // { label: 'Proof of Fix Veracity', value: 95 + (jobs.filter(j => j.status === 'COMPLETED').length % 5) }
    ], [devices, jobs]);

    const trendData = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => 120 + i * 10 + Math.sin(i * 1.5) * 20);
    }, []);

    return (
        <div className="animate-fade-in space-y-10 pb-32 text-slate-900 px-4">
            {/* Header (Consistent with Image 4 / Profile style) */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-white border border-black/5 flex items-center justify-center text-[#C5A059] shadow-premium">
                        <LayoutDashboard size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900">Market Governance</h1>
                            <div className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] rounded-full border border-[#C5A059]/20 text-[9px] font-bold mt-1">Authorized Auditor</div>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 font-medium tracking-tight">Real-time oversight of the decentralized AHRN backbone.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationCenter />
                    <SettingsCenter />
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-premium p-1 flex items-center justify-center bg-slate-50">
                        <UserCircle size={38} className="text-slate-400" />
                    </div>
                </div>
            </header>

            {/* Dashboard Visualizations Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SLA Multi-Analysis Radar (Image 1 inspired) */}
                <div className={`${GLASS_STYLE} p-12 rounded-[3.5rem] relative overflow-hidden group border-white flex flex-col items-center justify-center min-h-[500px]`}>
                    <div className="absolute top-12 left-12">
                        <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight leading-tight">Platform Integrity</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#C5A059] rounded-full animate-pulse" /> Multi-Dimensional Audit
                        </p>
                    </div>

                    <div className="relative mt-8">
                        <RadarChart data={radarData} size={320} color="#C5A059" />
                        <div className="absolute inset-0 bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </div>

                    <div className="grid grid-cols-2 gap-12 w-full mt-10 pt-10 border-t border-black/5 px-8">
                        <div>
                            <span className="text-[8px] font-bold text-slate-400 block mb-1">Aggregate Score</span>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-serif font-bold text-slate-900 tracking-tighter">
                                    {(radarData.reduce((acc, d) => acc + d.value, 0) / radarData.length).toFixed(1)}
                                </p>
                                <span className="text-emerald-500 text-[10px] font-bold">+{(jobs.length % 3).toFixed(1)}%</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[8px] font-bold text-slate-400 block mb-1">Audit Status</span>
                            <p className="text-lg font-bold text-emerald-500 tracking-tighter">
                                {radarData[0].value > 95 ? 'Verified Clean' : 'Stable'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Growth & Throughput Timeline (Image 1/4 style) */}
                <div className={`${GLASS_STYLE} p-12 rounded-[3.5rem] relative overflow-hidden group border-white flex flex-col justify-between`}>
                    <div>
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight leading-tight">Network Activity</h3>
                                <p className="text-[10px] font-bold text-slate-400 mt-2">Provisioning Frequency</p>
                            </div>
                            <div className="px-4 py-2 bg-white border border-black/5 rounded-xl flex items-center gap-3 shadow-sm">
                                <TrendingUp size={16} className="text-[#C5A059]" />
                                <span className="text-[10px] font-bold text-slate-900">+22.4%</span>
                            </div>
                        </div>

                        <div className="h-64 flex flex-col justify-end relative">
                            <TrendChart data={trendData} height={200} color="#6366f1" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 pt-10 border-t border-black/5">
                        <div className="space-y-1">
                            <span className="text-[8px] font-bold text-slate-400 block">Active Nodes</span>
                            <p className="text-2xl font-bold text-slate-900">{devices.length}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-bold text-slate-400 block">Sealed Jobs</span>
                            <p className="text-2xl font-bold text-slate-900">{jobs.filter(j => j.status === 'COMPLETED').length}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-bold text-slate-400 block">Total Yield</span>
                            <p className="text-2xl font-bold text-[#C5A059]">{stats[2].value}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Matrix Oversight Stats */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`${GLASS_STYLE} p-8 rounded-[2.5rem] flex flex-col gap-6 group hover:border-[#C5A059]/30 transition-all border-white border`}>
                        <div className="flex justify-between items-start">
                            <div className={`p-4 rounded-2xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon size={24} className="text-white" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{stat.label}</span>
                        </div>
                        <div>
                            <p className="text-4xl font-serif font-bold text-slate-900 tracking-tight">{stat.value}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`w-1 h-1 rounded-full ${stat.text.replace('text-', 'bg-')}`} />
                                <span className={`text-[8px] font-bold ${stat.text}`}>Stable Protocol</span>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Management Utilities */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-4 bg-white/50 p-1.5 rounded-2xl border border-black/5">
                    <button
                        onClick={() => setActiveTab('audit')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'audit' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Audit Ledger
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('predicted')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'predicted' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Predicted Anomalies
                    </button>
                    <button
                        onClick={() => setActiveTab('b2b_requests')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'b2b_requests' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        B2B Requests
                    </button>
                </div>

                {activeTab === 'audit' && (
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-bold text-[#C5A059] hover:bg-slate-50 transition-all shadow-sm">
                            <Filter size={14} /> Filter Ledger
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                        >
                            <Download size={14} /> Export Audit
                        </button>
                    </div>
                )}

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C5A059] transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder={activeTab === 'audit' ? "Audit by hash, node, or Identifier..." : "Search..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-black/5 rounded-2xl pl-12 pr-6 py-4 text-xs w-96 focus:border-[#C5A059] outline-none transition-all shadow-sm text-slate-900 placeholder:text-slate-300"
                    />
                </div>
            </div>

            {/* Governance Ledger / User Management / Predicted */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] border border-[#C5A059]/20">
                            {activeTab === 'audit' ? <Database size={20} /> : activeTab === 'users' ? <Users size={20} /> : activeTab === 'b2b_requests' ? <UserCircle size={20} /> : <Activity size={20} />}
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                            {activeTab === 'audit' ? 'Forensic Evidence Ledger' : activeTab === 'users' ? 'Identity Governance' : activeTab === 'b2b_requests' ? 'B2B Registration Requests' : 'AI Anomaly Forecast'}
                        </h3>
                    </div>
                </div>

                <div className={`${GLASS_STYLE} rounded-[3rem] overflow-hidden border-white whitespace-nowrap`}>
                    {activeTab === 'audit' ? (
                        <table className="w-full text-left border-collapse">
                            {/* ... existing table head ... */}
                            <thead className="bg-slate-50/80 border-b border-black/5">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Event Signature</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Subject Node</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Validation Point</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Network Status</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {filteredJobs.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-all group/row">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center overflow-hidden shadow-inner">
                                                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Auditor" className="w-full h-full object-cover opacity-80 group-hover/row:opacity-100 transition-opacity" />
                                                </div>
                                                <div>
                                                    <span className="font-mono text-xs text-[#C5A059] tracking-tighter transition-all group-hover/row:text-slate-900 block">
                                                        {row.evidenceHash?.slice(0, 16) || 'SHA256:77A8B9C...'}
                                                    </span>
                                                    <span className="text-[7px] font-bold text-slate-400">Signed by Node-{i + 142}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-1">
                                                <span className="text-sm font-bold text-slate-900 block">{row.deviceName}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                                                    <span className="text-[8px] font-bold text-slate-400">Protocol: 0x882...PX</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-slate-900 font-bold block">{row.sealedAt ? new Date(row.sealedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Mar 12, 2026'}</span>
                                                <span className="text-[9px] text-slate-400 font-mono tracking-tighter">{row.sealedAt ? new Date(row.sealedAt).toLocaleTimeString() : '14:24:02 UTC'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[9px] font-bold">
                                                <CheckCircle2 size={10} /> Sealed & Proven
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Confirm payout to technician?')) {
                                                            await ahrnApi.resolveDispute(row.id, 'PAYOUT');
                                                            alert('Payout Authorized');
                                                        }
                                                    }}
                                                    className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-bold border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all"
                                                >
                                                    Auth Payout
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Confirm refund to homeowner?')) {
                                                            await ahrnApi.resolveDispute(row.id, 'REFUND');
                                                            alert('Refund Processed');
                                                        }
                                                    }}
                                                    className="px-3 py-2 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-bold border border-rose-100 hover:bg-rose-500 hover:text-white transition-all"
                                                >
                                                    Refund
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedJob(row);
                                                        setIsAuditModalOpen(true);
                                                    }}
                                                    className="inline-flex items-center gap-2 text-[#C5A059] hover:text-white transition-all px-4 py-2 hover:bg-[#C5A059] hover:text-white rounded-xl border border-[#C5A059]/30 group/btn font-bold text-[9px] bg-white shadow-sm"
                                                >
                                                    Audit <ArrowUpRight size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : activeTab === 'users' ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 border-b border-black/5">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Network Role</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400 text-right">Oversight Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((u, i) => (
                                    <tr key={u._id} className="hover:bg-slate-50 transition-all group/row">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-bold shadow-inner">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-slate-900 block">{u.name}</span>
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <MailIcon size={10} /> {u.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold ${u.role === 'ADMIN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                u.role === 'TECHNICIAN' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20'
                                                }`}>
                                                <Shield size={10} /> {u.role}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="text-[10px] text-slate-900 font-bold block">Active Node</div>
                                        </td>
                                        <td className="px-10 py-8 text-right space-x-2">
                                            {u.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => handlePromoteUser(u._id!, 'ADMIN')}
                                                    className="inline-flex items-center gap-2 text-indigo-500 hover:text-white transition-all px-4 py-2 hover:bg-indigo-500 rounded-xl border border-indigo-200 group/btn font-bold text-[9px] bg-white shadow-sm"
                                                >
                                                    Promote to Admin
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteUser(u._id!)}
                                                className="inline-flex items-center gap-2 text-rose-500 hover:text-white transition-all px-4 py-2 hover:bg-rose-500 rounded-xl border border-rose-200 group/btn font-bold text-[9px] bg-white shadow-sm"
                                            >
                                                <Trash2 size={14} /> Decommission
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : activeTab === 'b2b_requests' ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 border-b border-black/5">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Company / Applicant</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Details</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400 text-right">Approval Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {pendingUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-12 text-center text-slate-400 text-sm">No pending B2B requests.</td>
                                    </tr>
                                ) : (
                                    pendingUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-slate-50 transition-all group/row">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shadow-inner border border-indigo-100">
                                                        {u.companyInfo?.name?.charAt(0) || u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-slate-900 block">{u.companyInfo?.name || 'N/A'}</span>
                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                            {u.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] text-slate-600"><span className="font-bold text-slate-400">Email:</span> {u.email}</div>
                                                    <div className="text-[10px] text-slate-600"><span className="font-bold text-slate-400">Tax ID:</span> {u.companyInfo?.taxId || 'N/A'}</div>
                                                    <div className="text-[10px] text-slate-600"><span className="font-bold text-slate-400">Reg No:</span> {u.companyInfo?.registrationNumber || 'N/A'}</div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[9px] font-bold">
                                                    <Activity size={10} /> Pending Verification
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right space-x-2">
                                                <button
                                                    onClick={() => handleApproveUser(u._id!, u.name)}
                                                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-white transition-all px-4 py-2 hover:bg-emerald-500 rounded-xl border border-emerald-200 group/btn font-bold text-[9px] bg-white shadow-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectUser(u._id!, u.name)}
                                                    className="inline-flex items-center gap-2 text-rose-500 hover:text-white transition-all px-4 py-2 hover:bg-rose-500 rounded-xl border border-rose-200 group/btn font-bold text-[9px] bg-white shadow-sm"
                                                >
                                                    Decline
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            {/* PREDICTED JOBS */}
                            <thead className="bg-slate-50/80 border-b border-black/5">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Anomaly</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Severity</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400">Forecasted Yield</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {jobs.filter(j => j.status === 'PREDICTED').length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-12 text-center text-slate-400 text-sm">No new predicted anomalies.</td>
                                    </tr>
                                ) : (
                                    jobs.filter(j => j.status === 'PREDICTED').map((job) => (
                                        <tr key={job.id} className="hover:bg-slate-50 transition-all">
                                            <td className="px-10 py-8">
                                                <span className="text-sm font-bold text-slate-900 block">{job.deviceName} Restoration</span>
                                                <span className="text-[10px] text-slate-400">ID: {job.id}</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold ${job.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                    <Activity size={10} /> {job.severity}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-sm font-bold text-slate-900 ml-2">${job.payout}</span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button
                                                    onClick={async () => {
                                                        const res = await ahrnApi.releaseJob(job.id);
                                                        if (res.success) {
                                                            alert(`Job ${job.id} released to market`);
                                                            // Could refresh jobs here, but currently relying on context updates or manual refresh for simplicity
                                                            window.location.reload();
                                                        } else {
                                                            alert(`Error: ${res.message}`);
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-[#C5A059] text-white rounded-xl text-[9px] font-bold shadow-lg shadow-[#C5A059]/20 hover:bg-[#b08d4b] transition-all"
                                                >
                                                    Release to Market
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>

            <AuditModal
                isOpen={isAuditModalOpen}
                onClose={() => setIsAuditModalOpen(false)}
                job={selectedJob}
            />

            {/* Dialogs */}
            {approvalDialog && (
                <ConfirmDialog
                    isOpen={!!approvalDialog}
                    onClose={() => setApprovalDialog(null)}
                    title="Approve Registration"
                    message={`Are you sure you want to approve B2B registration for ${approvalDialog.name}?`}
                    onConfirm={() => performApproveUser(approvalDialog.id)}
                    confirmText="Approve"
                    confirmColor="bg-emerald-500"
                />
            )}

            {rejectionDialog && (
                <RejectionDialog
                    isOpen={!!rejectionDialog}
                    onClose={() => setRejectionDialog(null)}
                    title="Decline Registration"
                    message={`Please provide a reason for declining ${rejectionDialog.name}.`}
                    onConfirm={(reason) => performRejectUser(rejectionDialog.id, reason)}
                />
            )}
        </div>
    );
};

// Helper for motion
const motion_div = ({ children, className }: any) => (
    <div className={className}>{children}</div>
);
