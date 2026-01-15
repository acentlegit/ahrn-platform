import Job from './models/Job';

export const startSimulation = () => {
    console.log('Starting simulation loop...');
    setInterval(async () => {
        try {
            const jobs = await Job.find({ status: { $in: ['BIDDING', 'PREDICTED', 'ASSIGNED'] } });

            for (const job of jobs) {
                let changed = false;

                // 1. Randomly add bids to active jobs
                if (job.status === 'BIDDING' && Math.random() > 0.8 && job.bids.length < 5) {
                    const techNames = ['Aria Maintenance', 'Swift Repairs', 'Grid Masters', 'Precision Flow', 'Voltage Guard'];
                    const newBid = {
                        id: `b-${Math.random().toString(36).substr(2, 5)}`,
                        jobId: job.id,
                        technicianName: techNames[Math.floor(Math.random() * techNames.length)],
                        technicianRating: parseFloat((4 + Math.random()).toFixed(1)),
                        price: job.payout - Math.floor(Math.random() * 50),
                        guaranteeTarget: Math.random() > 0.5 ? 12 : 6,
                        pofScore: Math.floor(Math.random() * 20) + 80,
                        eta: `${Math.floor(Math.random() * 4) + 1}h`
                    };
                    job.bids.push(newBid);
                    changed = true;
                }

                // 2. Randomly progress PREDICTED jobs to BIDDING
                if (job.status === 'PREDICTED' && Math.random() > 0.95) {
                    job.status = 'BIDDING';
                    changed = true;
                }

                // 3. Randomly progress ASSIGNED jobs to IN_PROGRESS
                if (job.status === 'ASSIGNED' && Math.random() > 0.9) {
                    job.status = 'IN_PROGRESS';
                    changed = true;
                }

                if (changed) {
                    await job.save();
                }
            }
        } catch (error) {
            console.error('Simulation error:', error);
        }
    }, 5000);
};
