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
    manufacturer?: string;
    modelNumber?: string;
    serialNumber?: string;
    telemetry: {
        temp: number;
        vibration: 'Normal' | 'Erratic' | 'High';
        dutyCycle: number;
    };
}

export interface Bid {
    id: string;
    jobId: string;
    technicianId: string; // NEW
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
    type: 'PREVENTIVE' | 'REACTIVE'; // NEW
    forecastId?: string; // NEW
    severity: Severity;
    priority: Priority;
    payout: number;
    bids: Bid[];
    // Rich Evidence Object
    evidence?: {
        hash: string;
        location?: { lat: number; long: number; accuracy?: number };
        timestamp: string;
        mediaUrls: string[];
    };
    // Legacy fields
    evidenceHash?: string;
    sealedAt?: string;
    dismissedByTech?: boolean;
}

export interface User {
    _id?: string;
    email: string;
    role: 'HOMEOWNER' | 'TECHNICIAN' | 'ADMIN' | 'ORGANIZATION_ADMIN';
    name: string;
    // Homeowner
    address?: string;
    reliabilityScore?: number; // NEW
    homeProfile?: {
        address: string;
        sizeSqFt: number;
        yearBuilt: number;
    };

    // Technician
    skills?: string[];
    certificationId?: string;
    technicianRating?: number;
    reputation?: {
        score: number;
        completedJobs: number;
        verifiedFixes: number;
    };
    orgId?: string;

    // Verification fields
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    accountType?: 'B2C' | 'B2B';
    companyInfo?: {
        name: string;
        registrationNumber?: string;
        address?: string;
        taxId?: string;
    };
}
