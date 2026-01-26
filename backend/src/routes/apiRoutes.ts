import express from 'express';
import { protect, admin } from '../middleware/auth';
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
    assignJob,
    releaseJob,
    getPendingUsers,
    approveUser,
    rejectUser,
    inviteTechnician,
    getOrganizationTechnicians,
    setupPassword,
    requestPasswordReset,
    resetPassword
} from '../controllers/apiController';

const router = express.Router();

router.get('/devices', getDevices);
router.get('/jobs', getJobs);
router.get('/jobs/market', getMarketJobs);
router.post('/jobs/create', protect, admin, createJob); // Admin only
router.post('/jobs/submit-bid', protect, submitBid);

router.post('/jobs/:id/accept-bid', protect, acceptBid);
router.post('/jobs/:id/decline-bid', protect, declineBid);
router.post('/jobs/:id/dismiss', protect, dismissJob);
router.post('/jobs/:id/priority', protect, updatePriority);
router.post('/jobs/:id/seal', protect, sealEvidence);
router.post('/jobs/:id/start', protect, startJob);
router.post('/jobs/:id/finish', protect, finishWork);
router.post('/jobs/:id/accept-market', protect, acceptMarketJob);
router.post('/jobs/:id/release', protect, admin, releaseJob);

router.post('/register', register);
router.post('/login', login);
router.post('/setup-password', setupPassword);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

router.get('/technicians/recommended', getRecommendedTechnicians);
router.post('/jobs/:id/assign', assignJob);

// Device Management
router.post('/devices', createDevice);

// User Management
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Admin Verification Routes
router.get('/admin/pending-users', protect, admin, getPendingUsers);
router.post('/admin/users/:id/approve', protect, admin, approveUser);
router.post('/admin/users/:id/reject', protect, admin, rejectUser);

// Organization Routes
router.post('/org/invite', protect, inviteTechnician);
router.get('/org/technicians', protect, getOrganizationTechnicians);

export default router;
