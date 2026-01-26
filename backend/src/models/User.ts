import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'HOMEOWNER' | 'TECHNICIAN' | 'ADMIN' | 'ORGANIZATION_ADMIN';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type AccountType = 'B2C' | 'B2B';

export interface IUser extends Document {
    email: string;
    password?: string;
    role: UserRole;
    name: string;

    // Verification fields
    accountType: AccountType;
    verificationStatus: VerificationStatus;
    verifiedAt?: Date;
    verifiedBy?: mongoose.Types.ObjectId; // Admin who verified
    rejectionReason?: string;
    isActive?: boolean; // For invited technicians
    inviteToken?: string; // For password setup
    resetToken?: string; // For password reset
    resetTokenExpiry?: Date; // Reset token expiration

    // B2B specific fields
    companyInfo?: {
        name: string;
        registrationNumber?: string;
        address?: string;
        taxId?: string;
    };

    // Role specific fields
    // Role specific fields
    address?: string; // For Homeowner, legacy
    homeProfile?: {
        address: string;
        sizeSqFt: number;
        yearBuilt: number;
    };
    reliabilityScore?: number; // For Homeowner (Credit Score for Home)

    skills?: string[]; // For Technician
    certificationId?: string; // For Technician
    technicianRating?: number; // Legacy
    reputation?: {
        score: number;
        completedJobs: number;
        verifiedFixes: number;
    };
    orgId?: string; // Vendor Organization Link
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['HOMEOWNER', 'TECHNICIAN', 'ADMIN', 'ORGANIZATION_ADMIN'], required: true },
    name: { type: String, required: true },

    // Verification fields
    accountType: { type: String, enum: ['B2C', 'B2B'], default: 'B2C' },
    verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'VERIFIED' },
    verifiedAt: { type: Date },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String },
    isActive: { type: Boolean, default: true },
    inviteToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },

    // B2B specific fields
    companyInfo: {
        name: { type: String },
        registrationNumber: { type: String },
        address: { type: String },
        taxId: { type: String }
    },

    // Homeowner
    address: { type: String },
    reliabilityScore: { type: Number, default: 0 },
    homeProfile: {
        address: { type: String },
        sizeSqFt: { type: Number },
        yearBuilt: { type: Number }
    },

    // Technician
    skills: { type: [String] },
    certificationId: { type: String },
    technicianRating: { type: Number, default: 5.0 },
    reputation: {
        score: { type: Number, default: 5.0 },
        completedJobs: { type: Number, default: 0 },
        verifiedFixes: { type: Number, default: 0 }
    },
    orgId: { type: String }
}, { timestamps: true });

// Add index for efficient verification status queries
UserSchema.index({ verificationStatus: 1 });

export default mongoose.model<IUser>('User', UserSchema);
