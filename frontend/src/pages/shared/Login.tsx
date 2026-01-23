import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ahrnApi } from '../../api';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await ahrnApi.login({ email, password });

            if (data.success) {
                login(data.user, data.token);
                const role = data.user.role;
                if (role === 'HOMEOWNER') navigate('/homeowner');
                else if (role === 'TECHNICIAN') navigate('/technician');
                else if (role === 'ADMIN') navigate('/admin');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

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
                        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">Access Portal</h1>
                        <p className="text-slate-500 text-sm">Synchronize with the AHRN backbone</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Node Identifier (Email)</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="node@cluster.ahrn"
                                    className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all font-medium shadow-inner placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Protocol (Password)</label>
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

                        {error && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}

                        <button
                            disabled={isLoading}
                            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                        >
                            {isLoading ? 'Verifying Node...' : <><ArrowRight size={18} /> Authenticate Session</>}
                        </button>
                    </form>

                    <div className="flex flex-col gap-4 text-center">
                        <p className="text-slate-500 text-sm">
                            Not registered? <button onClick={() => navigate('/signup')} className="text-[#C5A059] font-bold hover:underline">Provision New Node</button>
                        </p>
                        <div className="pt-6 border-t border-black/5">
                            <p className="text-[9px] text-slate-400 font-mono uppercase tracking-[0.2em] leading-relaxed">
                                Restricted Access • AES-256 Encryption Layer Active<br />
                                Secured by AHRN Mesh Protocol
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
