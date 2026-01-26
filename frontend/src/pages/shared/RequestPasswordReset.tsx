import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ahrnApi } from '../../api';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const RequestPasswordReset = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await ahrnApi.requestPasswordReset(email);
            setSuccess(true);
            // We always show success for security reasons, even if email doesn't exist
        } catch (err) {
            setError('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden text-slate-900">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1558494949-efdeb6bf8d71?q=80&w=2834&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`${GLASS_STYLE} w-full max-w-xl p-12 rounded-[3.5rem] relative z-10 text-center`}
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full text-white mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Check Your Email</h1>
                    <p className="text-slate-600 mb-8">
                        If an account exists for <strong>{email}</strong>, we have sent password reset instructions.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-slate-500 font-bold hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden text-slate-900">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1558494949-efdeb6bf8d71?q=80&w=2834&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${GLASS_STYLE} w-full max-w-xl p-12 rounded-[3.5rem] relative z-10`}
            >
                <div className="space-y-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C5A059] rounded-xl text-white font-serif font-bold text-2xl mb-6 shadow-lg shadow-[#C5A059]/30">A</div>
                        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">Reset Password</h1>
                        <p className="text-slate-500 text-sm">Enter your email to receive recovery instructions</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all font-medium shadow-inner placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {error && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}

                        <button
                            disabled={isLoading}
                            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                        >
                            {isLoading ? 'Sending...' : <><ArrowRight size={18} /> Send Reset Link</>}
                        </button>
                    </form>

                    <div className="flex flex-col gap-4 text-center">
                        <button onClick={() => navigate('/login')} className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">
                            Remember your password? Login
                        </button>
                        <div className="pt-6 border-t border-black/5">
                            <p className="text-[9px] text-slate-400 font-mono uppercase tracking-[0.2em] leading-relaxed">
                                AHRN Security System
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
