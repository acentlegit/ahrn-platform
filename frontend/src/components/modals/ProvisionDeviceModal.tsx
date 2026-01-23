import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ChevronRight,
    Thermometer,
    Droplets,
    Zap,
    Monitor,
    MapPin,
    Cpu,
    CheckCircle2,
    ChevronLeft,
    Radio
} from 'lucide-react';
import { Device } from '../../types';
import { ahrnApi } from '../../api';
import { useAuth } from '../../context/AuthContext';

interface ProvisionDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const DEVICE_TYPES = [
    { id: 'HVAC', title: 'HVAC System', desc: 'Heating, Ventilation & AC', icon: Thermometer, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'Plumbing', title: 'Plumbing', desc: 'Water & drainage systems', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'Electrical', title: 'Electrical', desc: 'Power & circuits', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'Appliances', title: 'Appliances', desc: 'Smart home devices', icon: Monitor, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

const ZONES = [
    'Living Room', 'Kitchen', 'Master Bedroom', 'Bedroom 2', 'Bedroom 3',
    'Bathroom', 'Garage', 'Basement', 'Attic', 'Outdoor', 'Utility Room', 'Office'
];

export const ProvisionDeviceModal = ({ isOpen, onClose, onSuccess }: ProvisionDeviceModalProps) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        zone: '',
        manufacturer: '',
        modelNumber: '',
        serialNumber: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [consentGiven, setConsentGiven] = useState(false);

    const selectedTypeInfo = DEVICE_TYPES.find(t => t.id === selectedType);

    React.useEffect(() => {
        if (step === 4) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [step, onClose]);

    const handleContinue = async () => {
        setError(null);
        if (step === 1 && selectedType) {
            setStep(2);
        } else if (step === 2) {
            if (!formData.name || !formData.zone) return;
            setStep(3);
        } else if (step === 3) {
            if (!consentGiven) {
                setError("You must provide data usage consent to proceed.");
                return;
            }
            setIsLoading(true);
            try {
                const res = await ahrnApi.createDevice({
                    ...formData,
                    type: selectedType,
                    ownerEmail: user?.email,
                    dataConsent: true,
                    consentTimestamp: new Date().toISOString()
                });
                if (res && res.success) {
                    setStep(4);
                    onSuccess();
                } else {
                    setError(res?.message || 'Failed to provision device. Please try again.');
                }
            } catch (err) {
                console.error(err);
                setError('Network error occurred.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 text-slate-900">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-white"
                >
                    {/* Header */}
                    <div className="p-8 flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 leading-none">Provision Edge Node</h3>
                                <p className="text-slate-400 text-[10px] font-bold mt-2">Register a new device to your network</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Stepper */}
                    <div className="px-12 py-4">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2" />
                            <div className={`absolute top-1/2 left-0 h-0.5 bg-emerald-400 -translate-y-1/2 transition-all duration-500 ${step === 2 ? 'w-1/3' :
                                step === 3 ? 'w-2/3' :
                                    step === 4 ? 'w-full' : 'w-0'
                                }`} />

                            {[1, 2, 3].map((s) => (
                                <div key={s} className="relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step > s ? 'bg-emerald-400 text-white' :
                                        step === s ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                        {step > s ? <CheckCircle2 size={16} /> : s}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-12 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Select Device Type</h4>
                                        <p className="text-slate-400 text-xs font-medium">Choose the category that best describes your device</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {DEVICE_TYPES.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setSelectedType(type.id)}
                                                className={`group p-6 rounded-3xl border text-left transition-all ${selectedType === type.id
                                                    ? 'bg-white border-amber-500 shadow-lg shadow-amber-500/5'
                                                    : 'bg-white border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl ${type.bg} ${type.color} flex items-center justify-center mb-4 shadow-inner`}>
                                                    <type.icon size={20} />
                                                </div>
                                                <h5 className="text-sm font-bold text-slate-900 mb-1">{type.title}</h5>
                                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{type.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Device Information</h4>
                                        <p className="text-slate-400 text-xs font-medium">Enter the details for your {selectedType} device</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Device Name *</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Main HVAC Unit"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-amber-500 transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location Zone *</label>
                                            <select
                                                value={formData.zone}
                                                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-amber-500 transition-all font-medium appearance-none"
                                            >
                                                <option value="">Select a zone...</option>
                                                {ZONES.map(z => (
                                                    <option key={z} value={z}>{z}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Manufacturer</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Carrier, LG"
                                                    value={formData.manufacturer}
                                                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-amber-500 transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Model Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., XR15-2024"
                                                    value={formData.modelNumber}
                                                    onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-amber-500 transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Serial Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter device serial number"
                                                value={formData.serialNumber}
                                                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-amber-500 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Review & Confirm</h4>
                                        <p className="text-slate-400 text-xs font-medium">Verify the information before provisioning</p>
                                    </div>

                                    <div className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 space-y-4">
                                        {/* ... Existing Review UI ... */}
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-3xl bg-white shadow-premium flex items-center justify-center text-blue-500">
                                                {selectedTypeInfo && <selectedTypeInfo.icon size={32} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h5 className="text-2xl font-serif font-bold text-slate-900 leading-none">{formData.name}</h5>
                                                        <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-tight">
                                                            {selectedTypeInfo?.title} • {formData.zone}
                                                        </p>
                                                    </div>
                                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[8px] font-bold flex items-center gap-1">
                                                        <Radio size={10} /> Ready to Connect
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-slate-100">
                                            {/* ... Details ... */}
                                            <div>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Manufacturer</span>
                                                <p className="text-xs font-bold text-slate-900">{formData.manufacturer || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Model</span>
                                                <p className="text-xs font-bold text-slate-900">{formData.modelNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Consent Checkbox */}
                                    <div className="p-4 bg-white border border-slate-200 rounded-2xl flex gap-3 shadow-sm hover:border-amber-400 transition-colors cursor-pointer" onClick={() => setConsentGiven(!consentGiven)}>
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${consentGiven ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-slate-50'}`}>
                                            {consentGiven && <CheckCircle2 size={14} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-900">Data Usage Consent</p>
                                            <p className="text-[10px] text-slate-500 leading-tight mt-1">
                                                I agree to allow AHRN to collect and analyze telemetry data from this device for the purpose of predictive maintenance forecasting.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                            <Zap size={16} />
                                        </div>
                                        <div>
                                            <h6 className="text-xs font-bold text-amber-900 mb-1">Network Handshake</h6>
                                            <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                                                Once provisioned, the device will sync telemetry.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-emerald-50/50">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h4 className="text-2xl font-serif font-bold text-slate-900 mb-2">Handshake Successful</h4>
                                    <p className="text-slate-400 text-sm font-medium max-w-xs">
                                        Your new edge node has been provisioned and is now broadcasting telemetry to the mesh network.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>


                    {/* Error Display */}
                    {error && (
                        <div className="px-8 pb-4">
                            <p className="text-center text-rose-500 text-xs font-bold">{error}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
                        <button
                            onClick={step === 1 ? onClose : () => setStep(step - 1)}
                            className="text-slate-400 text-xs font-bold hover:text-slate-900 transition-colors flex items-center gap-2"
                        >
                            {(step > 1 && step < 4) && <ChevronLeft size={16} />}
                            {(step === 1 || step === 4) ? 'Cancel' : 'Back'}
                        </button>

                        <button
                            disabled={isLoading || (step === 1 && !selectedType) || (step === 2 && (!formData.name || !formData.zone)) || (step === 3 && !consentGiven)}
                            onClick={step === 4 ? onClose : handleContinue}
                            className={`px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${isLoading || (step === 3 && !consentGiven) ? 'bg-slate-100 text-slate-400' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                                }`}
                        >
                            {isLoading ? 'Decrypting...' : step === 4 ? 'Done' : step === 3 ? <><Cpu size={16} /> Provision Node</> : 'Continue'}
                            {(step < 3 && !isLoading) && <ChevronRight size={16} />}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
