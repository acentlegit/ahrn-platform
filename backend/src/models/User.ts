import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'HOMEOWNER' | 'TECHNICIAN' | 'ADMIN';

export interface IUser extends Document {
    email: string;
    password?: string;
    role: UserRole;
    name: string;
    // Role specific fields
    address?: string; // For Homeowner
    skills?: string[]; // For Technician
    certificationId?: string; // For Technician
    technicianRating?: number; // For Technician
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['HOMEOWNER', 'TECHNICIAN', 'ADMIN'], required: true },
    name: { type: String, required: true },
    address: { type: String },
    skills: { type: [String] },
    certificationId: { type: String },
    technicianRating: { type: Number, default: 5.0 }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
