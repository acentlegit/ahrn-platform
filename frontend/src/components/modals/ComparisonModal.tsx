import React from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, Activity, Lock, CheckCircle2, Clock, Scale, Sparkles, Trophy } from 'lucide-react';
import { Bid } from '../../types';

const GLASS_STYLE = "bg-white/90 backdrop-blur-2xl border border-black/5 shadow-premium rounded-[3.5rem]";

export const ComparisonModal = ({ bids, isOpen, onClose, onAccept }: { bids: Bid[], isOpen: boolean, onClose: () => void, onAccept: (id: string) => void }) => {
    if (!isOpen || bids.length === 0) return null;

    const metrics = [
        // { label: 'PoF Score', key: 'pofScore', icon: ShieldCheck, higherIsBetter: true },
        { label: 'Price', key: 'price', icon: Activity, higherIsBetter: false, isCurrency: true },
        { label: 'Guarantee', key: 'guaranteeTarget', icon: Lock, higherIsBetter: true, suffix: 'mo' },
        { label: 'Rating', key: 'technicianRating', icon: CheckCircle2, higherIsBetter: true },
        { label: 'Arrival Estimate', key: 'eta', icon: Clock, higherIsBetter: false }
    ];

    const winnersByMetric: Record<string, string[]> = {};
    metrics.forEach(m => {
        const allVals = bids.map(b => (b as any)[m.key]);
        const bestVal = m.higherIsBetter
            ? Math.max(...allVals.filter(v => typeof v === 'number'))
            : m.key === 'eta'
                ? allVals.sort()[0]
                : Math.min(...allVals.filter(v => typeof v === 'number'));
        winnersByMetric[m.key] = bids.filter(b => (b as any)[m.key] === bestVal).map(b => b.id);
    });

    const winCounts = bids.map(bid => ({
        id: bid.id,
        count: metrics.filter(m => winnersByMetric[m.key].includes(bid.id)).length
    }));
    const maxWins = Math.max(...winCounts.map(w => w.count));
    const overallLeaders = winCounts.filter(w => w.count === maxWins && maxWins > 0).map(w => w.id);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10">
            <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} className={`${GLASS_STYLE} w-full max-w-7xl rounded-[3rem] p-6 lg:p-12 relative overflow-hidden flex flex-col max-h-[90vh]`}>
                <button onClick={onClose} className="absolute top-6 lg:top-10 right-6 lg:right-10 p-4 hover:bg-slate-100 rounded-full transition-colors z-50"><X size={24} className="text-slate-400" /></button>
                <div className="mb-8 lg:mb-12 shrink-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold rounded-lg border border-[#C5A059]/20 mb-4"><Scale size={14} /> Analytical Benchmark</div>
                    <h2 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">Side-by-Side Analysis</h2>
                    <p className="text-slate-500 text-sm lg:text-base mt-2">Cryptographically verified technician efficiency and outcome projections.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 overflow-y-auto no-scrollbar pb-10">
                    <div className="lg:col-span-1 pt-[180px] hidden lg:block">
                        <div className="space-y-[72px]">{metrics.map(m => (<div key={m.label} className="flex items-center gap-3 text-slate-500"><m.icon size={16} /><span className="text-[10px] font-bold">{m.label}</span></div>))}</div>
                    </div>
                    <div className="lg:col-span-5 flex gap-4 lg:gap-8 overflow-x-auto no-scrollbar">
                        {bids.map((bid, idx) => {
                            const isOverallLeader = overallLeaders.includes(bid.id);
                            const wonMetrics = metrics.filter(m => winnersByMetric[m.key].includes(bid.id));
                            return (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={bid.id} className={`min-w-[280px] lg:min-w-[320px] flex-1 rounded-[2.5rem] p-8 border transition-all duration-500 flex flex-col relative ${isOverallLeader ? 'bg-amber-50/50 border-[#C5A059] ring-1 ring-[#C5A059]/20 shadow-[0_0_50px_rgba(197,160,89,0.15)]' : 'bg-white border-black/5 hover:border-black/10'}`}>
                                    {isOverallLeader && (<div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#C5A059] text-white text-[9px] font-bold rounded-full flex items-center gap-2 shadow-xl"><Sparkles size={12} /> Optimal Choice</div>)}

                                    <div className="text-center mb-6">
                                        <div className={`w-20 h-20 mx-auto rounded-3xl border mb-5 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 ${isOverallLeader ? 'border-[#C5A059] p-0.5' : 'border-slate-100'}`}><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bid.technicianName}`} alt="tech" className="w-full h-full object-cover" /></div>
                                        <h4 className="text-xl font-bold text-slate-900 truncate px-2">{bid.technicianName}</h4>
                                        <div className="flex items-center justify-center gap-1 mt-2">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(bid.technicianRating) ? 'bg-[#C5A059]' : 'bg-slate-200'}`} />))}</div>
                                    </div>

                                    {/* Best In Class Indicator Row */}
                                    <div className="flex justify-center gap-1.5 mb-8 h-8">
                                        {wonMetrics.map(m => (
                                            <div key={m.label} className="w-8 h-8 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shadow-sm" title={`Best in ${m.label}`}>
                                                <m.icon size={12} />
                                            </div>
                                        ))}
                                        {wonMetrics.length === 0 && <span className="text-[8px] font-bold text-slate-400 mt-2 italic">Standard Tier</span>}
                                    </div>

                                    <div className="space-y-6 flex-1">{metrics.map(m => { const isWinner = winnersByMetric[m.key].includes(bid.id); const val = (bid as any)[m.key]; return (<div key={m.label} className="flex flex-col items-center"><span className="lg:hidden text-[8px] font-bold text-slate-500 mb-2">{m.label}</span><motion.div layout className={`w-full py-4 px-4 rounded-2xl border flex flex-col items-center justify-center transition-all duration-500 relative ${isWinner ? 'bg-[#C5A059]/10 border-[#C5A059]/40 text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.15)] ring-1 ring-[#C5A059]/20' : 'bg-slate-50 border-black/5 text-slate-400'}`}>{isWinner && <Trophy size={14} className="absolute -top-2 -right-2 text-[#C5A059] drop-shadow-sm animate-bounce" />}<span className={`text-2xl font-serif font-bold ${isWinner ? 'text-slate-900' : 'text-slate-400'}`}>{m.isCurrency ? '$' : ''}{val}{m.suffix || ''}</span>{isWinner && <span className="text-[7px] font-bold mt-1 text-[#C5A059]">Top Tier Result</span>}</motion.div></div>); })}</div>
                                    <button onClick={() => onAccept(bid.id)} className={`w-full mt-10 py-5 font-bold text-[11px] rounded-[1.5rem] transition-all duration-300 active:scale-95 shadow-xl ${isOverallLeader ? 'bg-[#C5A059] text-white hover:bg-[#E5C079]' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Select Provider</button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
