import mongoose, { Schema, Document } from 'mongoose';

export interface IBid {
    id: string;
    jobId: string;
    technicianName: string;
    technicianRating: number;
    price: number;
    guaranteeTarget: number;
    pofScore: number;
    eta: string;
}

export interface IJob extends Document {
    id: string;
    deviceId: string;
    deviceName: string;
    status: 'PREDICTED' | 'BIDDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'VERIFYING' | 'COMPLETED';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    payout: number;
    bids: IBid[];
    evidenceHash?: string;
    sealedAt?: string;
    dismissedByTech?: boolean;
}

const BidSchema = new Schema({
    id: { type: String, required: true },
    jobId: { type: String, required: true },
    technicianName: { type: String, required: true },
    technicianRating: { type: Number, required: true },
    price: { type: Number, required: true },
    guaranteeTarget: { type: Number, required: true },
    pofScore: { type: Number, required: true },
    eta: { type: String, required: true }
});

const JobSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    deviceId: { type: String, required: true },
    deviceName: { type: String, required: true },
    status: { type: String, enum: ['PREDICTED', 'BIDDING', 'ASSIGNED', 'IN_PROGRESS', 'VERIFYING', 'COMPLETED'], required: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
    payout: { type: Number, required: true },
    bids: [BidSchema],
    evidenceHash: { type: String },
    sealedAt: { type: String },
    dismissedByTech: { type: Boolean, default: false }
});

export default mongoose.model<IJob>('Job', JobSchema);
