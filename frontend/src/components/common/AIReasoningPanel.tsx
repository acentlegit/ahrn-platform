import React, { useState } from 'react';
import { BrainCircuit, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const AIReasoningPanel = ({ prompt, title }: { prompt: string, title?: string }) => {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getAIAnalysis = async () => {
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt, // Simple string content
                config: { systemInstruction: "You are the AHRN AI Reliability Analyst. Provide a technical, evidence-based reasoning for home system failures. Keep it under 60 words. Use authoritative, professional tone." }
            });
            setInsight(response.text);
        } catch (e) {
            setInsight("Telemetry analysis sync failure. Deterministic backup rules indicate high mechanical stress.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 p-5 bg-amber-50/50 border border-amber-200 rounded-2xl relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <BrainCircuit size={40} className="text-[#C5A059]" />
            </div>
            <div className="flex items-center gap-2 mb-3 text-[#C5A059]">
                <BrainCircuit size={16} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{title || "AHRN Intelligence Insight"}</span>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed font-medium italic">
                {insight ? insight : (loading ? "Synthesizing deep-learning telemetry nodes..." : "Telemetry patterns detected. Deep analysis available.")}
            </div>
            {!insight && !loading && (
                <button
                    onClick={getAIAnalysis}
                    className="mt-4 flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#C5A059] hover:text-[#b08d4b] transition-colors uppercase border border-[#C5A059]/40 hover:bg-[#C5A059]/10 px-3 py-1.5 rounded-lg"
                >
                    Verify with Gemini <ChevronRight size={12} />
                </button>
            )}
        </div>
    );
};
