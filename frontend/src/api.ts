import axios from 'axios';
import { Device, Job, Priority } from './types';

const API_URL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('ahrn_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const ahrnApi = {
    getDevices: async (): Promise<Device[]> => {
        try {
            const response = await axios.get(`${API_URL}/devices`);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getJobs: async (): Promise<Job[]> => {
        try {
            const response = await axios.get(`${API_URL}/jobs`);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    acceptBid: async (jobId: string, bidId: string) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/${jobId}/accept-bid`, { bidId });
            return response.data;
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    },

    declineBid: async (jobId: string, bidId: string) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/${jobId}/decline-bid`, { bidId });
            return response.data;
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    },

    dismissJob: async (jobId: string) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/${jobId}/dismiss`);
            return response.data;
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    },

    updatePriority: async (jobId: string, priority: Priority) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/${jobId}/priority`, { priority });
            return response.data;
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    },

    sealEvidence: async (jobId: string, data: any) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/${jobId}/seal`, { data });
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            return response.data;
        } catch (error: any) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    },

    register: async (userData: any) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (error: any) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    },

    createJob: async (jobData: any) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/create`, jobData);
            return response.data;
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    },

    getMarketJobs: async (): Promise<Job[]> => {
        try {
            const response = await axios.get(`${API_URL}/jobs/market`);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    acceptMarketJob: async (jobId: string, technicianName: string) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/${jobId}/accept-market`, { technicianName });
            return response.data;
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    },

    submitBid: async (bidData: any) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/submit-bid`, bidData);
            return response.data;
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    },

    startJob: async (jobId: string) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/${jobId}/start`);
            return response.data;
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    },

    finishWork: async (jobId: string) => {
        try {
            const response = await axios.post(`${API_URL}/jobs/${jobId}/finish`);
            return response.data;
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    }
};
