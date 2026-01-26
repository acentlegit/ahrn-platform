import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ahrnApi } from '../../api';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Invalid reset token');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const data = await ahrnApi.resetPassword(token, password);

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full text-white mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Password Reset!</h1>
                    <p className="text-slate-600 mb-6">Your password has been changed successfully. Redirecting to login...</p>
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
                        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">New Password</h1>
                        <p className="text-slate-500 text-sm">Create a new secure password for your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all font-medium shadow-inner placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all font-medium shadow-inner placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                                <AlertCircle size={18} className="text-rose-500" />
                                <p className="text-rose-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            disabled={isLoading || !token}
                            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-black/5 text-center">
                        <p className="text-[9px] text-slate-400 font-mono uppercase tracking-[0.2em] leading-relaxed">
                            Secured by AHRN Mesh Protocol
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
