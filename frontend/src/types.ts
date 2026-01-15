export interface SectionProps {
    id: string;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export interface Laureate {
    name: string;
    image: string; // placeholder url
    role: string;
    desc: string;
}

export type JobStatus = 'PREDICTED' | 'BIDDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'VERIFYING' | 'COMPLETED';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Device {
    id: string;
    name: string;
    health: number;
    risk: number;
    lastServiced: string;
    forecast: string;
    type: 'HVAC' | 'Plumbing' | 'Electrical' | 'Appliances';
    zone: string;
    telemetry: {
        temp: number;
        vibration: 'Normal' | 'Erratic' | 'High';
        dutyCycle: number;
    };
}

export interface Bid {
    id: string;
    jobId: string;
    technicianName: string;
    technicianRating: number;
    price: number;
    guaranteeTarget: number;
    pofScore: number;
    eta: string;
}

export interface Job {
    id: string;
    deviceId: string;
    deviceName: string;
    status: JobStatus;
    severity: Severity;
    priority: Priority;
    payout: number;
    bids: Bid[];
    evidenceHash?: string;
    sealedAt?: string;
    dismissedByTech?: boolean;
}
