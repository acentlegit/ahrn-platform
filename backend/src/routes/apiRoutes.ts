import express from 'express';
import {
    getDevices,
    getJobs,
    acceptBid,
    declineBid,
    dismissJob,
    updatePriority,
    sealEvidence,
    register,
    login,
    createJob,
    getMarketJobs,
    acceptMarketJob,
    submitBid,
    startJob,
    finishWork,
    getUsers,
    updateUser,
    deleteUser,
    createDevice,
    getRecommendedTechnicians,
    assignJob
} from '../controllers/apiController';

const router = express.Router();

router.get('/devices', getDevices);
router.get('/jobs', getJobs);
router.get('/jobs/market', getMarketJobs);
router.post('/jobs/create', createJob);
router.post('/jobs/submit-bid', submitBid);

router.post('/jobs/:id/accept-bid', acceptBid);
router.post('/jobs/:id/decline-bid', declineBid);
router.post('/jobs/:id/dismiss', dismissJob);
router.post('/jobs/:id/priority', updatePriority);
router.post('/jobs/:id/seal', sealEvidence);
router.post('/jobs/:id/start', startJob);
router.post('/jobs/:id/finish', finishWork);
router.post('/jobs/:id/accept-market', acceptMarketJob);

router.post('/register', register);
router.post('/login', login);

router.get('/technicians/recommended', getRecommendedTechnicians);
router.post('/jobs/:id/assign', assignJob);

// Device Management
router.post('/devices', createDevice);

// User Management
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
