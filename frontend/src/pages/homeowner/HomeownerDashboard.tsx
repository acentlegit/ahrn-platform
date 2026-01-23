import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    TrendingUp,
    ChevronRight,
    Lock,
    Zap,
    Scale,
    Activity,
    Shield,
    Calendar,
    ArrowRight,
    Cpu,
    Cloud,
    Thermometer,
    Bell,
    Settings,
    UserCircle,
    Monitor,
    Radio,
    Droplets,
    Wind
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { JobStatusBadge } from '../../components/common/JobStatusBadge';
import { NotificationCenter } from '../../components/common/NotificationCenter';
import { SettingsCenter } from '../../components/common/SettingsCenter';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RequestInterventionModal } from '../../components/modals/RequestInterventionModal';
import { ProvisionDeviceModal } from '../../components/modals/ProvisionDeviceModal';
import { Device } from '../../types';

import { RadarChart } from '../../components/common/RadarChart';
import { TrendChart } from '../../components/common/TrendChart';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[2.5rem]";

export const HomeownerDashboard = () => {
    const { devices, jobs } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [showProvisionModal, setShowProvisionModal] = useState(false);
    const [selectedDeviceForJob, setSelectedDeviceForJob] = useState<Device | null>(null);

    const hriScore = useMemo(() => {
        if (devices.length === 0) return 0;
        return Math.round(devices.reduce((acc, d) => acc + d.health, 0) / devices.length);
    }, [devices]);

    const activeInterventions = jobs.filter(j => ['ASSIGNED', 'IN_PROGRESS'].includes(j.status));
    const predictedRiskCount = jobs.filter(j => j.status === 'PREDICTED' || j.status === 'BIDDING').length;

    const radarData = useMemo(() => [
        { label: 'Reliability', value: hriScore },
        { label: 'Efficiency', value: Math.min(100, Math.round(hriScore * 0.95 + (devices.length * 2))) },
        { label: 'Latency', value: Math.max(0, Math.min(100, 100 - (activeInterventions.length * 5))) },
        { label: 'Load', value: Math.round(devices.reduce((acc, d) => acc + d.telemetry.dutyCycle, 0) / (devices.length || 1)) },
        { label: 'Security', value: 98 - (predictedRiskCount * 2) }
    ], [hriScore, devices, activeInterventions, predictedRiskCount]);

    const trendData = useMemo(() => {
        const base = hriScore;
        // Generate a 10-point curve ending at the current HRI score
        return Array.from({ length: 10 }, (_, i) => Math.max(0, Math.min(100, base - (9 - i) * 2 + Math.sin(i) * 3)));
    }, [hriScore]);

    const deviceCards = [
        { icon: Monitor, color: 'bg-indigo-50', iconColor: 'text-indigo-600', name: 'Smart Node Alpha' },
        { icon: Radio, color: 'bg-emerald-50', iconColor: 'text-emerald-600', name: 'Router Node' },
        { icon: Droplets, color: 'bg-blue-50', iconColor: 'text-blue-600', name: 'Liquid Sensor' },
        { icon: Wind, color: 'bg-amber-50', iconColor: 'text-amber-600', name: 'Air Purifier' }
    ];

    return (
        <div className="animate-fade-in space-y-10 relative pb-20 text-slate-900">
            {/* Top Navigation & Welcome */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#C5A059] to-[#E5C079] p-[2px] shadow-lg shadow-[#C5A059]/10">
                        <div className="w-full h-full bg-white rounded-[inherit] flex items-center justify-center">
                            <UserCircle size={32} className="text-[#C5A059]" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900">Hi {user?.name?.split(' ')[0] || 'Member'}!</h1>
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                <Cloud size={14} className="text-[#C5A059]" /> {20 + (devices.length % 10)}°C Outdoor
                            </div>
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            <p className="text-slate-400 text-xs font-bold">
                                System Health: <span className={hriScore > 70 ? 'text-emerald-500' : 'text-amber-500'}>{hriScore > 90 ? 'Optimal' : hriScore > 70 ? 'Stable' : 'Degraded'}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-4 bg-white/50 px-3 py-2 rounded-full border border-black/5 shadow-sm">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden -ml-3 first:ml-0 shadow-sm">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="member" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <span className="text-[10px] font-bold text-slate-400 ml-1">Family Cluster</span>
                    </div>
                    <NotificationCenter />
                    <SettingsCenter />
                </div>
            </header>

            {/* Environment & Stability Matrix */}
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Reliability Index Hero */}
                <div className={`${GLASS_STYLE} lg:col-span-3 p-12 relative overflow-hidden flex flex-col justify-center min-h-[440px] group border-white`}>
                    <div className="absolute top-0 right-0 p-12">
                        <Activity size={84} className="text-slate-100 group-hover:text-[#C5A059]/10 transition-all duration-1000 rotate-12" />
                    </div>
                    <div className="absolute -top-48 -left-48 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 mb-6 shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-bold text-emerald-600">Network Synchronized</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#C5A059] mb-4 block">AHRN Reliability Index</span>
                                <div className="flex items-baseline gap-8">
                                    <h2 className="font-serif text-[11rem] leading-none font-bold text-slate-900 tracking-tighter drop-shadow-sm">
                                        {hriScore}
                                    </h2>
                                    <div className="space-y-2">
                                        <span className="text-slate-200 font-serif text-5xl block">/100</span>
                                        <div className="inline-flex items-center gap-2 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                            <TrendingUp size={14} /> +4.2% This Month
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-md space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <p className="text-slate-400 text-[10px] font-bold">Stabilization Timeline</p>
                                        <span className="text-[8px] font-bold text-emerald-500">Verified Growth</span>
                                    </div>
                                    <div className="h-16 w-full opacity-40">
                                        <TrendChart data={trendData} height={60} />
                                    </div>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-[1px] border border-black/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${hriScore}%` }}
                                        className="h-full bg-gradient-to-r from-[#C5A059] to-[#E5C079] rounded-full shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Radar Meta-Analysis */}
                        <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-[3rem] border border-white relative group/radar shadow-inner">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent opacity-0 group-hover/radar:opacity-100 transition-opacity rounded-[3rem]" />
                            <RadarChart data={radarData} size={280} />
                            <div className="mt-8 grid grid-cols-2 gap-12 w-full px-6">
                                <div className="text-center">
                                    <span className="text-[8px] font-bold text-slate-400 block mb-1">Peak Performance</span>
                                    <p className="text-lg font-bold text-slate-900 tracking-tighter">Secured</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-[8px] font-bold text-slate-400 block mb-1">Audit Score</span>
                                    <p className="text-lg font-bold text-[#C5A059] tracking-tighter">A-Class</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Alerts/Active Forecasts */}
                <div className={`${GLASS_STYLE} p-10 flex flex-col justify-between border-white relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Thermometer size={120} />
                    </div>
                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[10px] font-bold text-slate-400">Anomaly Forecast</h3>
                            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.4)]" />
                        </div>

                        <div className="space-y-4">
                            <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-white text-center group-hover:border-slate-200 transition-colors relative h-32 flex flex-col items-center justify-center shadow-inner">
                                <span className="text-[8px] font-bold text-slate-400 block mb-1">Risk Severity</span>
                                <div className="flex items-center gap-2">
                                    <p className="text-5xl font-serif font-bold text-amber-500 leading-none">{predictedRiskCount > 0 ? 'Medium' : 'Low'}</p>
                                </div>
                                <div className="absolute bottom-4 left-6 right-6 h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className={`h-full ${predictedRiskCount > 0 ? 'bg-amber-400 w-1/2' : 'bg-emerald-400 w-1/4'}`} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
                                    <span className="text-[7px] font-bold text-slate-400 block mb-1">Nodes</span>
                                    <p className="text-lg font-bold text-slate-900 leading-none">{devices.length}</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-sm transition-all hover:border-emerald-100">
                                    <span className="text-[7px] font-bold text-slate-400 block mb-1">Uptime</span>
                                    <p className="text-lg font-bold text-emerald-500 leading-none">99.9%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setIsScanning(true);
                            setTimeout(() => setIsScanning(false), 3000);
                        }}
                        className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl text-[10px] shadow-premium flex items-center justify-center gap-3 mt-6"
                    >
                        {isScanning ? 'Synchronizing Cluster...' : 'System Deep Scan'} <Cpu size={16} className={isScanning ? 'animate-spin' : ''} />
                    </button>
                </div>
            </section>

            {/* Action Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {/* Forecast Matrix Card */}
                <motion.div
                    whileHover={{ y: -8 }}
                    onClick={() => navigate('/homeowner/forecast')}
                    className={`${GLASS_STYLE} p-10 cursor-pointer group relative overflow-hidden`}
                >
                    <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/5 rounded-full blur-[80px] group-hover:bg-indigo-500/10 transition-all duration-700" />
                    <div className="flex justify-between items-start mb-12">
                        <div className="p-5 bg-indigo-50 text-indigo-600 rounded-3xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm shadow-indigo-500/5">
                            <Zap size={32} />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-full text-[10px] font-bold text-slate-400 group-hover:bg-slate-50 transition-colors shadow-sm">
                            Predictive <ArrowRight size={14} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-4 tracking-tight text-slate-900">Failure Analytics</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-[240px]">
                        AI neural mapping of upcoming hardware fatigue points.
                    </p>
                    <div className="flex items-end gap-3">
                        <span className="text-6xl font-serif font-bold text-slate-900 leading-none">{predictedRiskCount}</span>
                        <div className="pb-1">
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">Live Risks</span>
                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-indigo-500" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Marketplace Matrix Card */}
                <motion.div
                    whileHover={{ y: -8 }}
                    onClick={() => navigate('/homeowner/bids')}
                    className={`${GLASS_STYLE} p-10 cursor-pointer group relative overflow-hidden`}
                >
                    <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#C5A059]/5 rounded-full blur-[80px] group-hover:bg-[#C5A059]/10 transition-all duration-700" />
                    <div className="flex justify-between items-start mb-12">
                        <div className="p-5 bg-[#C5A059]/5 text-[#C5A059] rounded-3xl border border-[#C5A059]/10 group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500 shadow-sm shadow-[#C5A059]/5">
                            <Scale size={32} />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-full text-[10px] font-bold text-slate-400 group-hover:bg-slate-50 transition-colors shadow-sm">
                            Liquidity <ArrowRight size={14} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-4 tracking-tight text-slate-900">Outcome Market</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-[240px]">
                        Aggregated service bids with immutable Proof of Repair scores.
                    </p>
                    <div className="flex items-end gap-3">
                        <span className="text-6xl font-serif font-bold text-slate-900 leading-none">{jobs.filter(j => j.status === 'BIDDING').length}</span>
                        <div className="pb-1">
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">Active Bids</span>
                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-[#C5A059]" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Service Stream Progress */}
                <div className={`${GLASS_STYLE} p-10 flex flex-col group`}>
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[10px] font-bold text-slate-400">Protocol Registry</h3>
                        <Shield size={20} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1 space-y-6 overflow-y-auto max-h-[220px] pr-2 scrollbar-hide">
                        {activeInterventions.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-4 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                                <Calendar className="text-slate-200 mb-4" size={40} />
                                <span className="text-[10px] font-bold text-slate-300">Registry Synchronized</span>
                                <p className="text-[8px] text-slate-400 mt-2 font-bold tracking-tighter">No active session tokens found</p>
                            </div>
                        ) : (
                            activeInterventions.map(job => (
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    key={job.id}
                                    onClick={() => navigate(`/homeowner/job/${job.id}`)}
                                    className="p-6 bg-white rounded-[2rem] border border-black/5 hover:border-[#C5A059]/30 transition-all cursor-pointer group/item relative overflow-hidden shadow-sm"
                                >
                                    <div className="flex justify-between items-center mb-4 relative z-10">
                                        <div>
                                            <span className="text-[8px] font-bold text-slate-400 block mb-1">Device Node</span>
                                            <h4 className="text-sm font-bold text-slate-900 truncate max-w-[120px] leading-none">{job.deviceName}</h4>
                                        </div>
                                        <JobStatusBadge status={job.status} />
                                    </div>
                                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden relative z-10">
                                        <div className={`h-full bg-gradient-to-r from-[#C5A059] to-[#E5C079] transition-all duration-1000 ${job.status === 'IN_PROGRESS' ? 'w-2/3' : 'w-1/3'}`} />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Smart Devices Tiles */}
            <section className="mt-24 px-4 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 mb-3 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold text-emerald-600">Network Synchronized</span>
                        </div>
                        <h3 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">System Infrastructure</h3>
                        <p className="text-slate-400 text-xs font-bold mt-2 opacity-60">Edge Node Telemetry & Stabilization</p>
                    </div>
                    <button
                        onClick={() => setShowProvisionModal(true)}
                        className="group flex items-center gap-3 px-8 py-4 bg-white border border-black/5 rounded-2xl text-[10px] font-bold text-slate-500 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all shadow-premium"
                    >
                        Provision Node <Plus size={16} className="text-[#C5A059] group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {devices.map((device, idx) => {
                        const Config = deviceCards[idx % deviceCards.length];
                        return (
                            <motion.div
                                key={device.id}
                                whileHover={{ scale: 1.03, y: -4 }}
                                className={`${GLASS_STYLE} p-10 border-white group relative overflow-hidden transition-all duration-500`}
                            >
                                {/* Tile Content */}
                                <div className="space-y-8 relative z-10 text-slate-900">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-5 rounded-[2rem] ${Config.color} ${Config.iconColor} shadow-inner transition-transform group-hover:rotate-[10deg] duration-700`}>
                                            <Config.icon size={32} className="drop-shadow-sm" />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                                <div className="w-12 h-6 bg-slate-100 rounded-full border border-black/5 p-1 transition-all duration-500 group-hover/toggle:border-slate-300 shadow-inner">
                                                    <div className={`w-4 h-4 rounded-full transition-all duration-500 shadow-sm ${device.health > 80 ? 'translate-x-6 bg-emerald-500' : 'translate-x-0 bg-slate-300'}`} />
                                                </div>
                                            </label>
                                            <span className="text-[10px] font-bold text-slate-300 mt-3 tracking-tighter">Protocol: On</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-3xl font-serif font-bold text-slate-900 mb-2 leading-tight tracking-tight">{device.name}</h4>
                                        <div className="flex items-center gap-2 mb-8">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-100 shadow-inner" />
                                            <p className="text-[10px] text-slate-400 font-bold leading-none">{device.zone}</p>
                                        </div>

                                        <div className="space-y-3 pt-6 border-t border-black/5">
                                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                                <span>Health Stream</span>
                                                <span className={device.health > 80 ? 'text-emerald-500' : 'text-amber-500'}>{device.health}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${device.health}%` }}
                                                    className={`h-full ${device.health > 80 ? 'bg-emerald-500' : 'bg-amber-500'} opacity-70 shadow-sm`}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDeviceForJob(device);
                                            }}
                                            className="w-full mt-8 py-4 bg-slate-50 border border-black/5 rounded-2xl text-[9px] font-bold text-slate-400 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            Request Intervention <Zap size={14} className="group-hover/btn:animate-pulse" />
                                        </button>
                                    </div>
                                </div>

                                {/* Background Accents */}
                                <div className={`absolute -bottom-20 -left-20 w-48 h-48 ${Config.color} opacity-0 group-hover:opacity-100 rounded-full blur-[60px] transition-opacity duration-1000`} />
                                <div className="absolute top-4 right-6 text-slate-50 transition-colors font-serif text-8xl font-black italic -rotate-12 pointer-events-none group-hover:text-slate-100/50">
                                    0{idx + 1}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
            {/* Provision Modal */}
            <ProvisionDeviceModal
                isOpen={showProvisionModal}
                onClose={() => setShowProvisionModal(false)}
                onSuccess={() => {
                    refetch();
                }}
            />

            {/* Scanning Overlay */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-12"
                    >
                        <div className="relative w-80 h-80 mb-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-[#C5A059]/10 rounded-full shadow-premium"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border border-indigo-200 rounded-full border-dashed"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Cpu size={80} className="text-[#C5A059] animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4 tracking-tight">System-Wide Forensic Scan</h2>
                        <p className="text-slate-400 text-[10px] font-bold mb-8">Analyzing Node Telemetry & Cryptographic Signatures</p>
                        <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                animate={{ x: [-256, 256] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full h-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Request Intervention Modal */}
            <RequestInterventionModal
                isOpen={!!selectedDeviceForJob}
                onClose={() => setSelectedDeviceForJob(null)}
                device={selectedDeviceForJob}
            />
        </div>
    );
};

// Helper for UI
const Plus = ({ size, className }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
