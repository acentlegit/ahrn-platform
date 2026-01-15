import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
    id: string; // explicitly keeping string id specific to the frontend logic
    name: string;
    health: number;
    risk: number;
    lastServiced: string;
    forecast: string;
    type: 'HVAC' | 'Plumbing' | 'Electrical' | 'Appliances';
    telemetry: {
        temp: number;
        vibration: 'Normal' | 'Erratic' | 'High';
        dutyCycle: number;
    };
}

const DeviceSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    health: { type: Number, required: true },
    risk: { type: Number, required: true },
    lastServiced: { type: String, required: true },
    forecast: { type: String, required: true },
    type: { type: String, enum: ['HVAC', 'Plumbing', 'Electrical', 'Appliances'], required: true },
    telemetry: {
        temp: { type: Number, required: true },
        vibration: { type: String, enum: ['Normal', 'Erratic', 'High'], required: true },
        dutyCycle: { type: Number, required: true }
    }
});

export default mongoose.model<IDevice>('Device', DeviceSchema);
