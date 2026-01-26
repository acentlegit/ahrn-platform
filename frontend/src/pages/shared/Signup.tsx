import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Wrench, LayoutDashboard, ChevronLeft, ArrowRight, User, Mail, Lock, MapPin, Award, CheckCircle2, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ahrnApi } from '../../api';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

type Role = 'HOMEOWNER' | 'TECHNICIAN' | 'ADMIN' | 'ORGANIZATION';

export const Signup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState<Role | null>(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        skills: '',
        certificationId: '',
        companyName: '',
        registrationNumber: '',
        taxId: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let payload: any = {
                ...formData,
                role: role === 'ORGANIZATION' ? 'ORGANIZATION_ADMIN' : role,
                skills: (role === 'TECHNICIAN' || role === 'ORGANIZATION') && formData.skills ? formData.skills.split(',').map(s => s.trim()) : undefined
            };

            if (role === 'ORGANIZATION') {
                payload.accountType = 'B2B';
                payload.companyInfo = {
                    name: formData.companyName,
                    registrationNumber: formData.registrationNumber,
                    taxId: formData.taxId
                };
            }

            const data = await ahrnApi.register(payload);

            if (data.success) {
                setStep(3);
                // Redirect logic handled in render based on role or response
                if (role !== 'ORGANIZATION') {
                    setTimeout(() => navigate('/login'), 3000);
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
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
                className={`${GLASS_STYLE} w-full max-w-4xl p-12 rounded-[3.5rem] relative z-10 overflow-hidden`}
            >
                {/* Background Decor */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-[100px]" />

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C5A059] rounded-2xl text-white font-serif font-bold text-3xl mb-6 shadow-lg shadow-[#C5A059]/30">A</div>
                                <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Initialize Credentials</h1>
                                <p className="text-slate-400 text-lg">Select your role in the AHRN decentralized network</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                <button onClick={() => handleRoleSelect('HOMEOWNER')} className="group p-6 md:p-8 rounded-3xl bg-white border border-black/5 hover:bg-[#C5A059] hover:border-[#C5A059] transition-all duration-500 shadow-premium hover:shadow-2xl flex flex-col items-center gap-4 text-center">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-100 group-hover:bg-white/20 flex items-center justify-center text-[#C5A059] group-hover:text-white transition-colors">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-white mb-1 transition-colors">Homeowner</h3>
                                    <p className="text-slate-400 text-[10px] md:text-xs group-hover:text-white/80 transition-colors">Manage node</p>
                                </button>

                                <button onClick={() => handleRoleSelect('TECHNICIAN')} className="group p-6 md:p-8 rounded-3xl bg-white border border-black/5 hover:bg-indigo-500 hover:border-indigo-500 transition-all duration-500 shadow-premium hover:shadow-2xl flex flex-col items-center gap-4 text-center">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-100 group-hover:bg-white/20 flex items-center justify-center text-indigo-500 group-hover:text-white transition-colors">
                                        <Wrench size={28} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-white mb-1 transition-colors">Technician</h3>
                                    <p className="text-slate-400 text-[10px] md:text-xs group-hover:text-white/80 transition-colors">Interventions</p>
                                </button>

                                <button onClick={() => handleRoleSelect('ORGANIZATION')} className="group p-6 md:p-8 rounded-3xl bg-white border border-black/5 hover:bg-blue-600 hover:border-blue-600 transition-all duration-500 shadow-premium hover:shadow-2xl flex flex-col items-center gap-4 text-center">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-100 group-hover:bg-white/20 flex items-center justify-center text-blue-600 group-hover:text-white transition-colors">
                                        <Building2 size={28} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-white mb-1 transition-colors">Organization</h3>
                                    <p className="text-slate-400 text-[10px] md:text-xs group-hover:text-white/80 transition-colors">B2B Services</p>
                                </button>

                                <button onClick={() => handleRoleSelect('ADMIN')} className="group p-6 md:p-8 rounded-3xl bg-white border border-black/5 hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-500 shadow-premium hover:shadow-2xl flex flex-col items-center gap-4 text-center">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-100 group-hover:bg-white/20 flex items-center justify-center text-emerald-500 group-hover:text-white transition-colors">
                                        <LayoutDashboard size={28} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-white mb-1 transition-colors">Governance</h3>
                                    <p className="text-slate-400 text-[10px] md:text-xs group-hover:text-white/80 transition-colors">Protocol</p>
                                </button>
                            </div>
                            <div className="text-center">
                                <p className="text-slate-500 text-sm">Already have access? <button onClick={() => navigate('/login')} className="text-[#C5A059] font-bold hover:underline">Sign In</button></p>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-black uppercase tracking-widest">
                                <ChevronLeft size={16} /> Back to roles
                            </button>

                            <div>
                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">{role} Registration</h2>
                                <p className="text-slate-500">Provide node verification details</p>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="John Doe" className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all shadow-inner placeholder:text-slate-300 font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Hash</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="john@ahrn.net" className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all shadow-inner placeholder:text-slate-300 font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Protocol (Password)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input required name="password" value={formData.password} onChange={handleInputChange} type="password" placeholder="••••••••" className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all shadow-inner placeholder:text-slate-300 font-medium" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {role === 'HOMEOWNER' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-right-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Node Physical Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input required name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="123 Reliant St, Austin, TX" className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-[#C5A059] transition-all shadow-inner placeholder:text-slate-300 font-medium" />
                                            </div>
                                        </div>
                                    )}

                                    {role === 'TECHNICIAN' && (
                                        <>
                                            <div className="space-y-2 animate-in fade-in slide-in-from-right-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialized Clusters (Skills)</label>
                                                <div className="relative">
                                                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input required name="skills" value={formData.skills} onChange={handleInputChange} type="text" placeholder="HVAC, Plumbing, Electrical" className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-300 font-medium" />
                                                </div>
                                                <p className="text-[9px] text-slate-400 ml-1 uppercase font-bold tracking-tighter">Separate by commas</p>
                                            </div>
                                            <div className="space-y-2 animate-in fade-in slide-in-from-right-4 transition-delay-100">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Certification ID</label>
                                                <div className="relative">
                                                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input required name="certificationId" value={formData.certificationId} onChange={handleInputChange} type="text" placeholder="CERT-99x-AHRN" className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-300 font-medium" />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {role === 'ORGANIZATION' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization Name</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input required name="companyName" value={formData.companyName} onChange={handleInputChange} type="text" placeholder="Acme Inc." className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-inner placeholder:text-slate-300 font-medium" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Registration / EIN</label>
                                                <div className="relative">
                                                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input required name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} type="text" placeholder="XX-XXXXXXX" className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-inner placeholder:text-slate-300 font-medium" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tax ID / VAT</label>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input name="taxId" value={formData.taxId} onChange={handleInputChange} type="text" placeholder="Optional" className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-inner placeholder:text-slate-300 font-medium" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {role === 'ADMIN' && (
                                        <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl animate-in fade-in slide-in-from-right-4 shadow-sm">
                                            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <ShieldCheck size={16} /> Governance Notice
                                            </h4>
                                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                                Admin accounts require second-layer cryptographic validation by three existing nodes. Your registration will enter a pending audit state.
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-6">
                                        {error && <p className="text-rose-500 text-[10px] font-bold uppercase mb-4 text-center">{error}</p>}
                                        <button
                                            disabled={isLoading}
                                            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                                        >
                                            {isLoading ? 'Encrypting Request...' : <><ArrowRight size={18} /> Complete Registration</>}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-premium ring-4 ring-emerald-50/50">
                                <CheckCircle2 size={48} />
                            </div>
                            {role === 'ORGANIZATION' ? (
                                <>
                                    <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Application Under Review</h2>
                                    <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">Your B2B account request has been submitted. You will receive an email once an admin reviews and approves your organization.</p>
                                    <button onClick={() => navigate('/login')} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                                        Return to Login
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Registration Sealed</h2>
                                    <p className="text-slate-400 text-lg mb-8">Node cluster integration complete. Redirecting to portal...</p>
                                    <div className="w-48 h-1.5 bg-slate-200 rounded-full mx-auto overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 3 }}
                                            className="h-full bg-emerald-500"
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
