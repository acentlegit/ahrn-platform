import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Device, Job, Priority } from '../types';
import { ahrnApi } from '../api';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'INFO' | 'ALERT' | 'SUCCESS';
    read: boolean;
}

interface DataContextType {
    devices: Device[];
    jobs: Job[];
    notifications: Notification[];
    loading: boolean;
    isSyncing: boolean;
    refetch: () => Promise<void>;
    updatePriority: (id: string, p: Priority) => Promise<void>;
    acceptBid: (jId: string, bId: string) => Promise<void>;
    declineBid: (jId: string, bId: string) => Promise<void>;
    dismissJob: (jId: string) => Promise<void>;
    sealEvidence: (jId: string, data: any) => Promise<void>;
    addNotification: (n: Omit<Notification, 'id' | 'time' | 'read'>) => void;
    clearNotifications: () => void;
    markNotificationAsRead: (id: string) => void;
    createJob: (data: any) => Promise<void>;
    getMarketJobs: () => Promise<Job[]>;
    acceptMarketJob: (id: string, tech: string) => Promise<void>;
    submitBid: (data: any) => Promise<void>;
    startJob: (id: string) => Promise<void>;
    finishWork: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [prevJobs, setPrevJobs] = useState<Job[]>([]);

    const fetchData = async () => {
        setIsSyncing(true);
        try {
            const [d, j] = await Promise.all([ahrnApi.getDevices(), ahrnApi.getJobs()]);
            setDevices(d);
            setJobs(prev => {
                // If status changed, add notification
                j.forEach(newJob => {
                    const oldJob = prev.find(oj => oj.id === newJob.id);
                    if (oldJob && oldJob.status !== newJob.status) {
                        addNotification({
                            title: 'Status Update',
                            message: `${newJob.deviceName} has transitioned to ${newJob.status}`,
                            type: newJob.status === 'COMPLETED' ? 'SUCCESS' : 'INFO'
                        });
                    } else if (!oldJob && prev.length > 0) {
                        addNotification({
                            title: 'New Anomaly',
                            message: `New threat detected: ${newJob.deviceName}`,
                            type: 'ALERT'
                        });
                    }
                });
                return j;
            });
        } catch (e) { console.error(e) }
        setLoading(false);
        setTimeout(() => setIsSyncing(false), 500);
    };

    const addNotification = (n: Omit<Notification, 'id' | 'time' | 'read'>) => {
        const newN: Notification = {
            ...n,
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
        };
        setNotifications(prev => [newN, ...prev].slice(0, 10));
    };

    const clearNotifications = () => setNotifications([]);

    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 4000);
        return () => clearInterval(interval);
    }, []);

    const updatePriority = async (id: string, p: Priority) => {
        await ahrnApi.updatePriority(id, p);
        await fetchData();
    };

    const acceptBid = async (jId: string, bId: string) => {
        await ahrnApi.acceptBid(jId, bId);
        await fetchData();
    };

    const declineBid = async (jId: string, bId: string) => {
        await ahrnApi.declineBid(jId, bId);
        await fetchData();
    };

    const dismissJob = async (jId: string) => {
        await ahrnApi.dismissJob(jId);
        await fetchData();
    };

    const sealEvidence = async (jId: string, data: any) => {
        await ahrnApi.sealEvidence(jId, data);
        await fetchData();
    };

    const createJob = async (data: any) => {
        await ahrnApi.createJob(data);
        await fetchData();
    };

    const getMarketJobs = async (): Promise<Job[]> => {
        return await ahrnApi.getMarketJobs();
    };

    const acceptMarketJob = async (id: string, tech: string) => {
        await ahrnApi.acceptMarketJob(id, tech);
        await fetchData();
    };

    const submitBid = async (data: any) => {
        await ahrnApi.submitBid(data);
        await fetchData();
    };

    const startJob = async (id: string) => {
        await ahrnApi.startJob(id);
        await fetchData();
    };

    const finishWork = async (id: string) => {
        await ahrnApi.finishWork(id);
        await fetchData();
    };

    return (
        <DataContext.Provider value={{
            devices,
            jobs,
            notifications,
            loading,
            isSyncing,
            refetch: fetchData,
            updatePriority,
            acceptBid,
            declineBid,
            dismissJob,
            sealEvidence,
            addNotification,
            clearNotifications,
            markNotificationAsRead,
            createJob,
            getMarketJobs,
            acceptMarketJob,
            submitBid,
            startJob,
            finishWork
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};
