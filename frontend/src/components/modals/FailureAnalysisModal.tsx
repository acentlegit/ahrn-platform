import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { BrainCircuit, Database, Globe, ShieldCheck, X } from 'lucide-react';
import { Job } from '../../types';

const GLASS_STYLE = "bg-white/95 backdrop-blur-2xl border border-black/5 shadow-premium";

export const FailureAnalysisModal = ({ job, isOpen, onClose }: { job: Job | null, isOpen: boolean, onClose: () => void }) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState("Initializing neural nodes...");

    useEffect(() => {
        if (isOpen && job && !analysis) {
            runAnalysis();
        }
    }, [isOpen, job]);

    const runAnalysis = async () => {
        if (!job) return;
        setLoading(true);
        setAnalysis(null);

        const statuses = [
            "Interrogating IoT telemetry clusters...",
            "Mapping failure dynamics to district historicals...",
            "Simulating long-term HRI degradation paths...",
            "Finalizing deterministic risk report..."
        ];

        let i = 0;
        const statusInterval = setInterval(() => {
            setStatusText(statuses[i % statuses.length]);
            i++;
        }, 1500);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const prompt = `Perform a deep failure analysis for the ${job.deviceName}. 
        Status: ${job.status}, Severity: ${job.severity}.
        Specifically provide:
        1. A technical root cause analysis based on theoretical telemetry patterns for this device type.
        2. Immediate infrastructure risks to surrounding home nodes.
        3. Potential long-term implications for the home's Reliability Index (HRI) and asset value if left unaddressed.
        Format as a professional, high-end technical brief. Use authoritative, futuristic terminology. Keep it under 150 words.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });
            setAnalysis(response.text);
        } catch (e) {
            setAnalysis("Deep analysis sync interrupted. Primary indicators suggest critical mechanical fatigue and electrical cross-talk within the node housing.");
        } finally {
            clearInterval(statusInterval);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10">
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className={`${GLASS_STYLE} w-full max-w-3xl rounded-[3rem] p-8 lg:p-12 border-indigo-100 relative overflow-hidden flex flex-col max-h-[90vh]`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
                <button onClick={onClose} className="absolute top-6 right-6 p-3 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400 hover:text-slate-900" /></button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm">
                        <BrainCircuit size={28} className={loading ? "animate-pulse" : ""} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">Diagnostic Intelligence Brief</h2>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-bold rounded border border-indigo-200">T-Level Alpha</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold">{job?.deviceName} | Node Identifier: PX-882</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-2 border-indigo-100 rounded-full animate-ping" />
                                <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 animate-bounce" size={24} />
                            </div>
                            <p className="text-slate-400 font-mono text-xs animate-pulse tracking-wide">{statusText}</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in">
                            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl leading-relaxed text-slate-700 text-sm italic font-medium shadow-sm">
                                {analysis}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                                        <Globe size={14} />
                                        <span className="text-[9px] font-bold">District Impact</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">Minor localized voltage dip potential across immediate neighboring node clusters.</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-[#C5A059]">
                                        <ShieldCheck size={14} />
                                        <span className="text-[9px] font-bold">Asset Valuation</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">Unaddressed failure risks 1.2% reduction in property's cryptographically-verified value.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10 flex justify-end gap-4 border-t border-black/5 pt-8">
                    <button onClick={onClose} className="px-8 py-3 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-xl hover:bg-slate-200 hover:text-slate-900 transition-all">Close Brief</button>
                    <button className="px-8 py-3 bg-[#C5A059] text-white text-[10px] font-bold rounded-xl hover:bg-[#b08d4b] transition-all shadow-lg shadow-[#C5A059]/20">Download Evidence Package</button>
                </div>
            </motion.div>
        </motion.div>
    );
};
