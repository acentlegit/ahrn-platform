import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Camera, Share2, Info, Activity, LayoutGrid, CheckCircle, Mic, Square, Trash2, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';

const GLASS_STYLE = "bg-white/70 backdrop-blur-2xl border border-white shadow-premium rounded-[3.5rem]";

export const CompleteJob = () => {
    const { jobs, sealEvidence } = useData();
    const navigate = useNavigate();
    const { jobId } = useParams();
    const job = jobs.find(j => j.id === jobId);

    const [isSealing, setIsSealing] = useState(false);
    const [step, setStep] = useState(1);

    // Evidence State
    const [postRepairImage, setPostRepairImage] = useState<string | null>(null);
    const [serialImage, setSerialImage] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState<'post' | 'serial' | null>(null);
    const webcamRef = useRef<Webcam>(null);

    // Audio State
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    if (!job) return <div>Job not found</div>;

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            if (isCapturing === 'post') setPostRepairImage(imageSrc);
            if (isCapturing === 'serial') setSerialImage(imageSrc);
            setIsCapturing(null);
        }
    }, [isCapturing]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'post' | 'serial') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'post') setPostRepairImage(reader.result as string);
                if (type === 'serial') setSerialImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Microphone access is required to record voice proof.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const validateStep1 = () => {
        if (!postRepairImage) {
            alert('Please provide a Post-Repair photo.');
            return false;
        }
        if (!serialImage) {
            alert('Please provide a Serial Number photo.');
            return false;
        }
        if (!audioBlob) {
            alert('Please record a voice note as proof.');
            return false;
        }
        return true;
    };

    const [location, setLocation] = useState<{ lat: number; long: number; accuracy: number } | null>(null);

    // ... existing capture/recording code ...

    const handleSeal = async () => {
        setIsSealing(true);

        // 1. Capture Geolocation
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const locData = {
                lat: position.coords.latitude,
                long: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            setLocation(locData);

            // 2. Submit Evidence
            await sealEvidence(job.id, {
                technicianId: 'TECH-001',
                artifacts: ['post_repair_vibration.log', 'visual_confirmation.png', 'voice_proof.webm'],
                location: locData,
                timestamp: new Date().toISOString()
            });

            setIsSealing(false);
            navigate('/technician');

        } catch (error) {
            console.error("Geolocation error:", error);
            alert("Location access is mandatory for proof of presence. Please enable location services.");
            setIsSealing(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-10 pb-20">
            <header className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/technician')}
                    className="p-3 bg-white border border-black/5 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900 shadow-sm"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Proof of Repair</h2>
                    <p className="text-slate-500 text-xs font-medium">Seal cryptographic evidence for {job.deviceName}.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stepper Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { num: 1, label: 'Visual & Audio Evidence' },
                        { num: 2, label: 'Component Log' },
                        { num: 3, label: 'Telemetry Stabilization' },
                        { num: 4, label: 'Final Sealing' }
                    ].map((s) => (
                        <div
                            key={s.num}
                            className={`p-4 rounded-2xl border transition-all ${step === s.num ? 'bg-[#C5A059]/10 border-[#C5A059]/40 text-[#C5A059]' : (step > s.num ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-black/5 text-slate-500')}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${step >= s.num ? 'bg-current text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {step > s.num ? <CheckCircle size={14} className="text-white" /> : <span className={step === s.num ? 'text-white' : 'text-slate-500'}>{s.num}</span>}
                                </div>
                                <span className="text-sm font-bold">{s.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className={`${GLASS_STYLE} p-10 rounded-[2.5rem]`}>
                        {step === 1 && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-2xl font-bold text-slate-900">Evidence Collection</h3>
                                <p className="text-slate-500 text-sm">Mandatory visual and audio proof required for registry commits.</p>

                                {/* Camera Modal */}
                                {isCapturing && (
                                    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            className="rounded-3xl w-full max-w-lg mb-6 border-4 border-white/20"
                                        />
                                        <div className="flex gap-4">
                                            <button onClick={capture} className="px-8 py-3 bg-white text-black font-bold rounded-xl">Capture Photo</button>
                                            <button onClick={() => setIsCapturing(null)} className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl">Cancel</button>
                                        </div>
                                    </div>
                                )}

                                {/* Image Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Post Repair Photo */}
                                    <div className="space-y-3">
                                        <span className="text-xs font-bold text-slate-900 ml-1">Post-Repair Photo *</span>
                                        {postRepairImage ? (
                                            <div className="relative aspect-video rounded-3xl overflow-hidden group shadow-md">
                                                <img src={postRepairImage} alt="Post Repair" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setPostRepairImage(null)}
                                                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-[#C5A059] transition-all group">
                                                <button onClick={() => setIsCapturing('post')} className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-[#C5A059] transition-colors">
                                                    <Camera size={24} />
                                                    <span className="text-[10px] font-bold">Take Photo</span>
                                                </button>
                                                <div className="flex items-center gap-2 text-xs text-slate-300">
                                                    <span>or</span>
                                                    <label className="cursor-pointer hover:text-[#C5A059] underline">
                                                        upload
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'post')} />
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Serial Number Photo */}
                                    <div className="space-y-3">
                                        <span className="text-xs font-bold text-slate-900 ml-1">Serial Number Capture *</span>
                                        {serialImage ? (
                                            <div className="relative aspect-video rounded-3xl overflow-hidden group shadow-md">
                                                <img src={serialImage} alt="Serial Number" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setSerialImage(null)}
                                                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-[#C5A059] transition-all group">
                                                <button onClick={() => setIsCapturing('serial')} className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-[#C5A059] transition-colors">
                                                    <LayoutGrid size={24} />
                                                    <span className="text-[10px] font-bold">Take Photo</span>
                                                </button>
                                                <div className="flex items-center gap-2 text-xs text-slate-300">
                                                    <span>or</span>
                                                    <label className="cursor-pointer hover:text-[#C5A059] underline">
                                                        upload
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'serial')} />
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Voice Recorder */}
                                <div className="p-6 bg-slate-50 rounded-3xl border border-black/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Voice Attestation *</h4>
                                            <p className="text-xs text-slate-500 mt-1">Record a brief summary of the repair for the audit log.</p>
                                        </div>
                                        {audioUrl && <CheckCircle className="text-emerald-500" size={20} />}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {!isRecording ? (
                                            <button
                                                onClick={startRecording}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all ${audioUrl ? 'bg-slate-200 text-slate-600' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'}`}
                                            >
                                                <Mic size={16} /> {audioUrl ? 'Re-record' : 'Start Recording'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={stopRecording}
                                                className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 rounded-xl text-xs font-bold animate-pulse border border-red-200"
                                            >
                                                <Square size={16} fill="currentColor" /> Stop Recording ({isRecording ? 'Recording...' : ''})
                                            </button>
                                        )}

                                        {audioUrl && (
                                            <audio controls src={audioUrl} className="h-10 w-full max-w-xs md:max-w-md rounded-lg" />
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (validateStep1()) setStep(2);
                                    }}
                                    className="w-full py-5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-premium mt-4"
                                >
                                    Verify Evidence & Proceed
                                </button>
                            </section>
                        )}

                        {step === 2 && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-2xl font-bold text-slate-900">Component Inventory</h3>
                                <div className="space-y-4">
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-black/5 flex justify-between items-center shadow-inner">
                                        <div>
                                            <span className="text-[10px] text-slate-500 font-bold">Component Identifier</span>
                                            <p className="text-sm font-bold text-slate-900">AHRN-COMP-99x</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600">Verified</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-bold text-[#C5A059] hover:text-[#b08d4b]">
                                        + Add Supplemental Part
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="px-8 py-4 bg-white border border-black/5 text-slate-500 text-sm font-bold rounded-xl hover:text-slate-900">Back</button>
                                    <button onClick={() => setStep(3)} className="px-10 py-4 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800">Initialize Stabilization</button>
                                </div>
                            </section>
                        )}

                        {step === 3 && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">Node Stabilization</h3>
                                        <p className="text-slate-500 text-sm mt-1">Monitoring live vibration and thermal telemetry for baseline alignment.</p>
                                    </div>
                                    <Activity className="text-emerald-500 animate-pulse" size={32} />
                                </div>
                                <div className="h-48 bg-slate-50 rounded-3xl border border-black/5 overflow-hidden flex items-end p-4 gap-1 shadow-inner">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 10 }}
                                            animate={{ height: Math.random() * 80 + 20 }}
                                            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 + Math.random() }}
                                            className="flex-1 bg-emerald-500/20 rounded-t-sm"
                                        />
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                        <span className="text-[10px] text-emerald-600 font-bold">Confidence</span>
                                        <p className="text-xl font-bold text-emerald-500">99.2%</p>
                                    </div>
                                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                        <span className="text-[10px] text-emerald-600 font-bold">Alignment</span>
                                        <p className="text-xl font-bold text-emerald-500">Nominal</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="px-8 py-4 bg-white border border-black/5 text-slate-500 text-sm font-bold rounded-xl hover:text-slate-900">Back</button>
                                    <button onClick={() => setStep(4)} className="px-10 py-4 bg-[#C5A059] text-white text-sm font-bold rounded-xl hover:bg-[#b08d4b] shadow-lg shadow-[#C5A059]/20">Proceed to Sealing</button>
                                </div>
                            </section>
                        )}

                        {step === 4 && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl flex gap-6">
                                    <Info className="text-amber-500 flex-shrink-0" size={32} />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 mb-2">Final Attestation</h4>
                                        <p className="text-slate-500 text-xs leading-relaxed">
                                            By sealing this evidence, you hash the visual assets and telemetry data into the immutable AHRN ledger. This action triggers the smart-contract payout sequence and starts the 12-month stabilization guarantee.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(3)} className="px-8 py-4 bg-white border border-black/5 text-slate-500 text-sm font-bold rounded-xl hover:text-slate-900">Back</button>
                                    <button
                                        onClick={handleSeal}
                                        disabled={isSealing}
                                        className="flex-1 py-5 bg-[#C5A059] text-white font-bold rounded-2xl text-sm shadow-xl shadow-[#C5A059]/20 hover:bg-[#b08d4b] transition-all flex items-center justify-center gap-3"
                                    >
                                        {isSealing ? 'Sealing Transaction...' : <><ShieldCheck size={18} /> Seal Evidence Ledger</>}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
