import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Login } from './pages/shared/Login';
import { Signup } from './pages/shared/Signup';
import { SetupPassword } from './pages/shared/SetupPassword';
import { RequestPasswordReset } from './pages/shared/RequestPasswordReset';
import { ResetPassword } from './pages/shared/ResetPassword';
import { AppLayout } from './components/layout/AppLayout';
import { HomeownerDashboard } from './pages/homeowner/HomeownerDashboard';
import { SystemForecast } from './pages/homeowner/SystemForecast';
import { BidComparison } from './pages/homeowner/BidComparison';
import { JobProgress } from './pages/homeowner/JobProgress';
import { TechnicianDashboard } from './pages/technician/TechnicianDashboard';
import { OpportunityFeed } from './pages/technician/OpportunityFeed';
import { JobDetails as TechJobDetails } from './pages/technician/JobDetails';
import { CompleteJob } from './pages/technician/CompleteJob';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { OrganizationDashboard } from './pages/shared/OrganizationDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
    const { role, isAuthenticated } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Redirect to their default dashboard if they try to access another role's page
        if (role === 'HOMEOWNER') return <Navigate to="/homeowner" replace />;
        if (role === 'TECHNICIAN') return <Navigate to="/technician" replace />;
        if (role === 'ADMIN') return <Navigate to="/admin" replace />;
        if (role === 'ORGANIZATION_ADMIN') return <Navigate to="/organization" replace />;
    }

    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/setup-password" element={<SetupPassword />} />
            <Route path="/forgot-password" element={<RequestPasswordReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/homeowner" element={<ProtectedRoute allowedRoles={['HOMEOWNER']}><HomeownerDashboard /></ProtectedRoute>} />
                <Route path="/homeowner/forecast" element={<ProtectedRoute allowedRoles={['HOMEOWNER']}><SystemForecast /></ProtectedRoute>} />
                <Route path="/homeowner/bids" element={<ProtectedRoute allowedRoles={['HOMEOWNER']}><BidComparison /></ProtectedRoute>} />
                <Route path="/homeowner/job/:jobId" element={<ProtectedRoute allowedRoles={['HOMEOWNER']}><JobProgress /></ProtectedRoute>} />

                <Route path="/technician" element={<ProtectedRoute allowedRoles={['TECHNICIAN']}><TechnicianDashboard /></ProtectedRoute>} />
                <Route path="/technician/radar" element={<ProtectedRoute allowedRoles={['TECHNICIAN']}><OpportunityFeed /></ProtectedRoute>} />
                <Route path="/technician/job/:jobId" element={<ProtectedRoute allowedRoles={['TECHNICIAN']}><TechJobDetails /></ProtectedRoute>} />
                <Route path="/technician/complete/:jobId" element={<ProtectedRoute allowedRoles={['TECHNICIAN']}><CompleteJob /></ProtectedRoute>} />

                <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/organization" element={<ProtectedRoute allowedRoles={['ORGANIZATION_ADMIN']}><OrganizationDashboard /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <AppRoutes />
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
