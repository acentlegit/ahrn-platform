import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Device from '../models/Device';
import Job from '../models/Job';
import User from '../models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
// Link removed
import mongoose from 'mongoose'; // Added import
import jwt from 'jsonwebtoken';
import { emailService } from '../services/email.service';

// ... (existing code top)

export const acceptBid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { bidId } = req.body;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

        const acceptedBid = job.bids.find((b: any) => b.id === bidId);
        if (!acceptedBid) return res.status(404).json({ success: false });

        job.status = 'ASSIGNED';
        job.bids = [acceptedBid];
        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const declineBid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { bidId } = req.body;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

        job.bids = job.bids.filter((b: any) => b.id !== bidId);
        await job.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const dismissJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

        job.dismissedByTech = true;
        await job.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const getDevices = async (req: Request, res: Response) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching devices' });
    }
};

export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ dismissedByTech: { $ne: true } });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs' });
    }
};

export const getMarketJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ status: 'BIDDING', dismissedByTech: { $ne: true } });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching market jobs' });
    }
};

export const createJob = async (req: AuthRequest, res: Response) => {
    try {
        const { deviceId, deviceName, severity, priority, payout, type, status } = req.body;
        const id = 'JOB-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const job = new Job({
            id,
            deviceId,
            deviceName,
            status: status || 'BIDDING', // Allow creating PREDICTED jobs
            type: type || 'REACTIVE',
            severity,
            priority,
            payout,
            bids: []
        });

        await job.save();
        res.status(201).json({ success: true, job });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ success: false, message: 'Error creating job' });
    }
};

export const releaseJob = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

        if (job.status !== 'PREDICTED') {
            return res.status(400).json({ success: false, message: 'Only PREDICTED jobs can be released to market.' });
        }

        job.status = 'BIDDING';
        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const acceptMarketJob = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        // const { technicianName } = req.body; // No longer needed from body, use auth

        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        if (job.status !== 'BIDDING') {
            return res.status(400).json({ success: false, message: 'Job is not in bidding status' });
        }

        const technician = req.user;
        if (!technician) return res.status(401).json({ success: false, message: 'Not authorized' });

        job.status = 'ASSIGNED';
        // Create strict bid record for the accepted job
        job.bids = [{
            id: 'BID-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            jobId: job.id,
            technicianId: technician._id,
            technicianName: technician.name,
            technicianRating: technician.technicianRating || 5.0,
            price: job.payout,
            guaranteeTarget: 12,
            pofScore: 100, // Quick accept implies high confidence/agreement
            eta: 'Immediate'
        }];

        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        console.error('Accept market job error:', error);
        res.status(500).json({ success: false });
    }
};

// ... acceptBid, declineBid, dismissJob ...

export const submitBid = async (req: AuthRequest, res: Response) => {
    try {
        const { jobId, price, eta, guaranteeTarget } = req.body;
        const job = await Job.findOne({ id: jobId });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        // Use authenticated technician
        const technician = req.user;
        if (!technician) return res.status(401).json({ success: false, message: 'Not authorized' });

        if (job.status !== 'BIDDING') {
            return res.status(400).json({ success: false, message: 'Job not open for bidding' });
        }

        const bidId = 'BID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const newBid = {
            id: bidId,
            jobId,
            technicianId: technician._id, // LINKED!
            technicianName: technician.name,
            technicianRating: technician.technicianRating || 5.0,
            price,
            guaranteeTarget: guaranteeTarget || 12,
            pofScore: 95, // System generated pof score
            eta
        };

        job.bids.push(newBid);
        await job.save();
        res.status(201).json({ success: true, bid: newBid });
    } catch (error) {
        console.error('Submit bid error:', error);
        res.status(500).json({ success: false });
    }
};

export const updatePriority = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

        job.priority = priority;
        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const startJob = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

        // Verify ownership
        const isAssigned = job.bids.some((b: any) => b.technicianId?.toString() === req.user._id.toString());
        if (!isAssigned) return res.status(403).json({ message: 'Not authorized for this job' });

        if (job.status !== 'ASSIGNED') {
            return res.status(400).json({ success: false, message: 'Job must be ASSIGNED to start.' });
        }

        job.status = 'IN_PROGRESS';
        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const finishWork = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

        // Verify ownership
        const isAssigned = job.bids.some((b: any) => b.technicianId?.toString() === req.user._id.toString());
        if (!isAssigned) return res.status(403).json({ message: 'Not authorized for this job' });

        if (job.status !== 'IN_PROGRESS') {
            return res.status(400).json({ success: false, message: 'Job must be IN_PROGRESS to finish.' });
        }

        job.status = 'VERIFYING';
        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const sealEvidence = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { data, location, mediaUrls } = req.body; // Expect rich data
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

        // Allow sealing if VERIFYING or IN_PROGRESS (flexibility)
        if (!['VERIFYING', 'IN_PROGRESS'].includes(job.status)) {
            return res.status(400).json({ success: false, message: 'Job must be ready for verification.' });
        }

        const timestamp = new Date();
        const evidencePayload = {
            data,
            location,
            mediaUrls,
            timestamp
        };

        const hash = crypto.createHash('sha256').update(JSON.stringify(evidencePayload)).digest('hex');

        job.status = 'COMPLETED';
        // Save Rich Evidence
        job.evidence = {
            hash: '0x' + hash,
            location: location,
            timestamp: timestamp,
            mediaUrls: mediaUrls || []
        };
        // Backwards compatibility
        job.evidenceHash = '0x' + hash;
        job.sealedAt = timestamp.toISOString();

        await job.save();

        // Update corresponding device
        // Update Reputation of Technician (Step 2 of Plan)
        // We find the winning bid to get the technicianId
        const winningBid = job.bids.length > 0 ? job.bids[0] : null;
        if (winningBid && winningBid.technicianId) {
            const tech = await User.findById(winningBid.technicianId);
            if (tech) {
                tech.reputation = tech.reputation || { score: 5.0, completedJobs: 0, verifiedFixes: 0 };
                tech.reputation.completedJobs += 1;
                tech.reputation.verifiedFixes += 1;
                // Simple reputation increment logic
                tech.reputation.score = Math.min(5.0, tech.reputation.score + 0.1);
                await tech.save();
            }
        }

        const device = await Device.findOne({ id: job.deviceId });
        if (device) {
            device.health = 100;
            device.risk = 0;
            device.forecast = 'System Restored - 12mo Stability Lock';
            await device.save();
        }

        res.json(job);
    } catch (error) {
        console.error("Seal Evidence Error", error);
        res.status(500).json({ success: false });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const {
            email,
            password,
            role,
            name,
            address,
            skills,
            certificationId,
            accountType,
            companyInfo
        } = req.body;

        // Simple check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine verification status based on account type
        const isB2B = accountType === 'B2B';
        const verificationStatus = isB2B ? 'PENDING' : 'VERIFIED';

        const user = new User({
            email,
            password: hashedPassword,
            role,
            name,
            address,
            skills,
            certificationId,
            accountType: accountType || 'B2C',
            verificationStatus,
            companyInfo: isB2B ? companyInfo : undefined
        });

        await user.save();

        // Send appropriate email based on account type
        if (isB2B) {
            // Send pending verification email to user
            emailService.sendPendingVerificationEmail(email, name).catch(err => {
                console.error('Failed to send pending verification email:', err);
            });

            // Notify admins of pending B2B signup
            const admins = await User.find({ role: 'ADMIN' });
            admins.forEach(admin => {
                emailService.sendAdminNotificationEmail(admin.email, {
                    userName: name,
                    userEmail: email,
                    companyName: companyInfo?.name || 'N/A',
                    role
                }).catch(err => {
                    console.error(`Failed to send admin notification to ${admin.email}:`, err);
                });
            });

            // Don't return token for B2B users - they need verification first
            return res.status(201).json({
                success: true,
                message: 'Registration successful. Your account is pending admin verification.',
                user: { email: user.email, role: user.role, name: user.name, verificationStatus: 'PENDING' }
            });
        } else {
            // B2C flow - immediate access
            // Send welcome email (fire-and-forget, don't block registration)
            emailService.sendWelcomeEmail(email, name).catch(err => {
                console.error('Failed to send welcome email:', err);
            });

            // Create JWT
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                token,
                user: { email: user.email, role: user.role, name: user.name }
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Error during registration' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check verification status
        if (user.verificationStatus === 'PENDING') {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending admin verification. Please wait for approval.'
            });
        }

        if (user.verificationStatus === 'REJECTED') {
            return res.status(403).json({
                success: false,
                message: user.rejectionReason
                    ? `Your account has been rejected. Reason: ${user.rejectionReason}`
                    : 'Your account has been rejected. Please contact support for more information.'
            });
        }

        // Check if account is active (for invited technicians)
        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'Please complete your account setup using the invitation link sent to your email.'
            });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Error during login' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};

export const createDevice = async (req: Request, res: Response) => {
    try {
        const { name, type, zone, manufacturer, modelNumber, serialNumber, ownerEmail } = req.body;

        let ownerId = null;
        if (ownerEmail) {
            const user = await User.findOne({ email: ownerEmail });
            ownerId = user?._id;
        }

        const id = 'DEV-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const device = new Device({
            id,
            name,
            type,
            zone,
            manufacturer,
            modelNumber,
            serialNumber,
            owner: ownerId,
            health: 100,
            risk: 0,
            lastServiced: new Date().toISOString().split('T')[0],
            forecast: 'Optimized',
            telemetry: {
                temp: 72,
                vibration: 'Normal',
                dutyCycle: 0
            }
        });

        await device.save();
        res.status(201).json({ success: true, device });
    } catch (error) {
        console.error('Create device error:', error);
        res.status(500).json({ success: false, message: 'Error creating device' });
    }
};

export const getRecommendedTechnicians = async (req: Request, res: Response) => {
    try {
        // In a real app, filtering would be based on skills matching job requirements
        const technicians = await User.find({ role: 'TECHNICIAN' }, '-password');
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching technicians' });
    }
};

export const assignJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { technicianId } = req.body;

        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        const technician = await User.findById(technicianId);
        if (!technician) return res.status(404).json({ success: false, message: 'Technician not found' });

        if (job.status !== 'BIDDING' && job.status !== 'PREDICTED') {
            return res.status(400).json({ success: false, message: 'Job cannot be assigned in current status' });
        }

        // Create a synthetic bid for the assignment
        const syntheticBid = {
            id: 'BID-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            jobId: job.id,
            technicianId: technician._id, // LINKED!
            technicianName: technician.name,
            technicianRating: technician.technicianRating || 5.0,
            price: job.payout, // Default to job payout
            guaranteeTarget: 12,
            pofScore: 100,
            eta: 'Assigned'
        };

        job.status = 'ASSIGNED';
        job.bids = [syntheticBid as any]; // Force assignment
        await job.save();

        res.json({ success: true, job });
    } catch (error) {
        console.error('Assign job error:', error);
        res.status(500).json({ success: false, message: 'Error assigning job' });
    }
};

export const getPendingUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ verificationStatus: 'PENDING' }).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching pending users:', error);
        res.status(500).json({ success: false, message: 'Error fetching pending users' });
    }
};

export const approveUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const adminId = req.user._id;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.verificationStatus === 'VERIFIED') {
            return res.status(400).json({ success: false, message: 'User is already verified' });
        }

        user.verificationStatus = 'VERIFIED';
        user.verifiedAt = new Date();
        user.verifiedBy = adminId;
        user.rejectionReason = undefined; // Clear any previous rejection

        await user.save();

        // Send approval email
        emailService.sendApprovalEmail(user.email, user.name).catch(err => {
            console.error(`Failed to send approval email to ${user.email}:`, err);
        });

        res.json({ success: true, message: 'User approved successfully', user });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ success: false, message: 'Error approving user' });
    }
};

export const rejectUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.verificationStatus = 'REJECTED';
        user.rejectionReason = reason;

        await user.save();

        // Send rejection email
        emailService.sendRejectionEmail(user.email, user.name, reason).catch(err => {
            console.error(`Failed to send rejection email to ${user.email}:`, err);
        });

        res.json({ success: true, message: 'User rejected successfully' });
    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({ success: false, message: 'Error rejecting user' });
    }
};

export const inviteTechnician = async (req: AuthRequest, res: Response) => {
    try {
        const { email, name, skills } = req.body;
        const orgAdminIndex = req.user._id;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Generate secure invite token
        const inviteToken = crypto.randomBytes(32).toString('hex');

        // Create temporary password (won't be used, but required by schema)
        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        const newTechnician = new User({
            email,
            password: hashedPassword,
            role: 'TECHNICIAN',
            name,
            skills: skills || [],
            orgId: orgAdminIndex, // Link to organization
            verificationStatus: 'VERIFIED', // Trusted invite
            accountType: 'B2B', // Part of organization
            isActive: false, // Inactive until password is set
            inviteToken
        });

        await newTechnician.save();

        // Send invitation email with setup link
        const setupUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/setup-password?token=${inviteToken}`;
        emailService.sendInvitationEmail(
            email,
            name,
            req.user.companyInfo?.name || 'Your Organization',
            setupUrl
        ).catch(err => {
            console.error('Failed to email invitation:', err);
        });

        res.status(201).json({ success: true, message: 'Invitation sent', user: newTechnician });
    } catch (error) {
        console.error('Invite error:', error);
        res.status(500).json({ success: false, message: 'Failed to invite technician' });
    }
};

export const getOrganizationTechnicians = async (req: AuthRequest, res: Response) => {
    try {
        const orgAdminId = req.user._id;

        // Find all technicians linked to this organization
        const technicians = await User.find({
            orgId: orgAdminId,
            role: 'TECHNICIAN'
        }).select('-password');

        res.json({
            success: true,
            technicians,
            total: technicians.length
        });
    } catch (error) {
        console.error('Error fetching organization technicians:', error);
        res.status(500).json({ success: false, message: 'Error fetching technicians' });
    }
};

export const setupPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ success: false, message: 'Token and password are required' });
        }

        // Find user by invite token
        const user = await User.findOne({ inviteToken: token });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid or expired invitation token' });
        }

        // Check if already activated
        if (user.isActive) {
            return res.status(400).json({ success: false, message: 'Account is already activated' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user
        user.password = hashedPassword;
        user.isActive = true;
        user.inviteToken = undefined; // Clear the token
        await user.save();

        // Create JWT for immediate login
        const jwtToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Password set successfully. You can now login.',
            token: jwtToken,
            user: {
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Setup password error:', error);
        res.status(500).json({ success: false, message: 'Error setting up password' });
    }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Return success even if user not found for security
            return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        emailService.sendPasswordResetEmail(user.email, user.name, resetUrl).catch(err => {
            console.error('Failed to send reset email:', err);
        });

        res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Request password reset error:', error);
        res.status(500).json({ success: false, message: 'Error processing request' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Error resetting password' });
    }
};
