import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';

// Layouts (Loaded eagerly for layout shell stability)
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Lazy-loaded Pages
const Landing = lazy(() => import('../pages/Landing'));
const Discover = lazy(() => import('../pages/Discover'));
const Campaigns = lazy(() => import('../pages/Campaigns'));
const CampaignDetails = lazy(() => import('../pages/CampaignDetails'));
const CreatorDetails = lazy(() => import('../pages/CreatorDetails'));
const BrandDetails = lazy(() => import('../pages/BrandDetails'));
const Workspace = lazy(() => import('../pages/Workspace'));
const Settings = lazy(() => import('../pages/Settings'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));

// Lazy Auth Module Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));

// Lazy Creator Module Pages
const CreatorDashboard = lazy(() => import('../pages/creator/CreatorDashboard'));
const CreatorProfile = lazy(() => import('../pages/creator/CreatorProfile'));
const DiscoverCampaigns = lazy(() => import('../pages/creator/DiscoverCampaigns'));
const CreatorCollaborations = lazy(() => import('../pages/creator/CreatorCollaborations'));

// Lazy Company Module Pages
const CompanyDashboard = lazy(() => import('../pages/company/CompanyDashboard'));
const CompanyProfile = lazy(() => import('../pages/company/CompanyProfile'));
const PostCampaign = lazy(() => import('../pages/company/PostCampaign'));
const ManageCampaigns = lazy(() => import('../pages/company/ManageCampaigns'));
const CompanyAnalytics = lazy(() => import('../pages/company/CompanyAnalytics'));

// Lazy Admin Module Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Validating user session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="Loading view..." />}>
        <Routes>
          {/* Main Public Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/creators/:id" element={<CreatorDetails />} />
            <Route path="/brands/:id" element={<BrandDetails />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
          </Route>

          {/* Protected Dashboard Layout Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/workspace/:id" element={<Workspace />} />

            {/* Dedicated Creator Module Routes */}
            <Route path="/creator/dashboard" element={<ProtectedRoute allowedRoles={['creator']}><CreatorDashboard /></ProtectedRoute>} />
            <Route path="/creator/profile" element={<ProtectedRoute allowedRoles={['creator']}><CreatorProfile /></ProtectedRoute>} />
            <Route path="/creator/discover" element={<ProtectedRoute allowedRoles={['creator']}><DiscoverCampaigns /></ProtectedRoute>} />
            <Route path="/creator/collaborations" element={<ProtectedRoute allowedRoles={['creator']}><CreatorCollaborations /></ProtectedRoute>} />

            {/* Dedicated Company/Brand Module Routes */}
            <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['brand']}><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/company/profile" element={<ProtectedRoute allowedRoles={['brand']}><CompanyProfile /></ProtectedRoute>} />
            <Route path="/company/post-campaign" element={<ProtectedRoute allowedRoles={['brand']}><PostCampaign /></ProtectedRoute>} />
            <Route path="/company/campaigns" element={<ProtectedRoute allowedRoles={['brand']}><ManageCampaigns /></ProtectedRoute>} />
            <Route path="/company/analytics" element={<ProtectedRoute allowedRoles={['brand']}><CompanyAnalytics /></ProtectedRoute>} />

            {/* Dedicated Admin Module Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
