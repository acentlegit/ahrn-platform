import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
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
    owner?: mongoose.Types.ObjectId;
    telemetry: {
        temp: number;
        vibration: 'Normal' | 'Erratic' | 'High';
        dutyCycle: number;
    };
}

const DeviceSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    health: { type: Number, required: true, default: 100 },
    risk: { type: Number, required: true, default: 0 },
    lastServiced: { type: String, required: true, default: () => new Date().toISOString().split('T')[0] },
    forecast: { type: String, required: true, default: 'Optimal Performance' },
    type: { type: String, enum: ['HVAC', 'Plumbing', 'Electrical', 'Appliances'], required: true },
    zone: { type: String, required: true },
    manufacturer: { type: String },
    modelNumber: { type: String },
    serialNumber: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    telemetry: {
        temp: { type: Number, required: true, default: 72 },
        vibration: { type: String, enum: ['Normal', 'Erratic', 'High'], required: true, default: 'Normal' },
        dutyCycle: { type: Number, required: true, default: 0 }
    }
});

export default mongoose.model<IDevice>('Device', DeviceSchema);
