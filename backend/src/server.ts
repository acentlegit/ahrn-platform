import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import apiRoutes from './routes/apiRoutes';
import Device from './models/Device';
import Job from './models/Job';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

const seedData = async () => {
    const deviceCount = await Device.countDocuments();
    if (deviceCount === 0) {
        console.log('Seeding Data...');
        const devices = [
            { id: 'dev-1', name: 'Main HVAC Unit', health: 68, risk: 72, lastServiced: '2023-11-12', forecast: 'Compressor degradation: 22 days to failure', type: 'HVAC', telemetry: { temp: 74, vibration: 'Erratic', dutyCycle: 85 } },
            { id: 'dev-2', name: 'Water Main Valve', health: 94, risk: 5, lastServiced: '2024-01-05', forecast: 'Stable performance', type: 'Plumbing', telemetry: { temp: 55, vibration: 'Normal', dutyCycle: 10 } },
            { id: 'dev-3', name: 'Electrical Panel A', health: 81, risk: 12, lastServiced: '2023-08-20', forecast: 'Voltage flux within limits', type: 'Electrical', telemetry: { temp: 98, vibration: 'Normal', dutyCycle: 40 } },
            { id: 'dev-4', name: 'Kitchen Refrigerator', health: 45, risk: 88, lastServiced: '2022-05-15', forecast: 'Thermal sensor failure imminent', type: 'Appliances', telemetry: { temp: 38, vibration: 'High', dutyCycle: 95 } },
        ];
        await Device.insertMany(devices);

        const jobs = [
            {
                id: 'job-1',
                deviceId: 'dev-1',
                deviceName: 'Main HVAC Unit',
                status: 'BIDDING',
                severity: 'HIGH',
                priority: 'MEDIUM',
                payout: 240,
                bids: [
                    { id: 'b-1', jobId: 'job-1', technicianName: 'Aria Maintenance', technicianRating: 4.9, price: 210, guaranteeTarget: 12, pofScore: 94, eta: '2h' },
                    { id: 'b-2', jobId: 'job-1', technicianName: 'Swift Repairs', technicianRating: 4.7, price: 185, guaranteeTarget: 6, pofScore: 81, eta: '1h' },
                ]
            },
            { id: 'job-2', deviceId: 'dev-4', deviceName: 'Kitchen Refrigerator', status: 'PREDICTED', severity: 'CRITICAL', priority: 'HIGH', payout: 120, bids: [] },
        ];
        await Job.insertMany(jobs);
        console.log('Data Seeded');
    }
};

import { startSimulation } from './simulation';
import { seedAdminUser } from './config/userSeeder';

// Start Server
connectDB().then(() => {
    seedData();
    seedAdminUser();
    startSimulation();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
