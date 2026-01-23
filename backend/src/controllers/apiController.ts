import { Request, Response } from 'express';
import Device from '../models/Device';
import Job from '../models/Job';
import User from '../models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export const createJob = async (req: Request, res: Response) => {
    try {
        const { deviceId, deviceName, severity, priority, payout } = req.body;
        const id = 'JOB-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const job = new Job({
            id,
            deviceId,
            deviceName,
            status: 'BIDDING',
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

export const acceptMarketJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { technicianName } = req.body;

        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        if (job.status !== 'BIDDING') {
            return res.status(400).json({ success: false, message: 'Job is not in bidding status' });
        }

        job.status = 'ASSIGNED';
        // Add a mock bid that was "accepted"
        job.bids = [{
            id: 'BID-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            jobId: job.id,
            technicianName,
            technicianRating: 4.8,
            price: job.payout,
            guaranteeTarget: 12,
            pofScore: 98,
            eta: 'ASAP'
        }];

        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        console.error('Accept market job error:', error);
        res.status(500).json({ success: false });
    }
};

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

export const submitBid = async (req: Request, res: Response) => {
    try {
        const { jobId, technicianName, price, eta, guaranteeTarget } = req.body;
        const job = await Job.findOne({ id: jobId });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        if (job.status !== 'BIDDING') {
            return res.status(400).json({ success: false, message: 'Job not open for bidding' });
        }

        const bidId = 'BID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const newBid = {
            id: bidId,
            jobId,
            technicianName,
            technicianRating: 4.8, // Default rating for now
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

export const startJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

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

export const finishWork = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

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

export const sealEvidence = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data } = req.body;
        const job = await Job.findOne({ id });
        if (!job) return res.status(404).json({ success: false });

        // Allow sealing if VERIFYING or IN_PROGRESS (flexibility)
        if (!['VERIFYING', 'IN_PROGRESS'].includes(job.status)) {
            return res.status(400).json({ success: false, message: 'Job must be ready for verification.' });
        }

        const hash = crypto.createHash('sha256').update(JSON.stringify(data) + Date.now()).digest('hex');
        job.status = 'COMPLETED';
        job.evidenceHash = '0x' + hash;
        job.sealedAt = new Date().toISOString();
        await job.save();

        // Update corresponding device
        const device = await Device.findOne({ id: job.deviceId });
        if (device) {
            device.health = 100;
            device.risk = 0;
            device.forecast = 'System Restored - 12mo Stability Lock';
            await device.save();
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, name, address, skills, certificationId } = req.body;

        // Simple check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            password: hashedPassword,
            role,
            name,
            address,
            skills,
            certificationId
        });

        await user.save();

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
