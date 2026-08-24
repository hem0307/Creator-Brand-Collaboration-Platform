import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import campaignService from '../../services/campaignService';
import notificationService from '../../services/notificationService';
import api from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import AnalyticsCard from '../../components/AnalyticsCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Briefcase,
  Users,
  DollarSign,
  FileText,
  PlusCircle,
  Bell,
  MessageSquare,
  TrendingUp,
  UserCheck,
  Building2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

// Chart.js integrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar as BarChart, Doughnut as DoughnutChart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState({
    totalAllocated: 0,
    totalSpent: 0,
    remainingBudget: 0
  });

  useEffect(() => {
    const fetchCompanyDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch company campaigns
        const campsRes = await campaignService.getCompanyCampaigns();
        const camps = campsRes.campaigns || campsRes || [];
        setCampaigns(camps);

        // Calculate total budget allocated
        const totalBudget = camps.reduce((sum, c) => sum + (c.budget?.max || 0), 0);

        // 2. Fetch applications across campaigns
        const appsRes = await api.get('/applications/company');
        const allApps = appsRes.data || [];
        setApplications(allApps);

        const totalSpent = allApps
          .filter(a => a.status === 'approved' || a.status === 'completed')
          .reduce((sum, a) => sum + (a.proposedRate || 0), 0);

        setBudgetSummary({
          totalAllocated: totalBudget,
          totalSpent: totalSpent,
          remainingBudget: Math.max(0, totalBudget - totalSpent)
        });

        // 3. Fetch notifications
        const notifRes = await notificationService.getNotifications();
        setNotifications(notifRes.notifications || notifRes || []);

        // 4. Fetch inbox messages
        const msgRes = await api.get('/messages/inbox');
        setMessages(msgRes.data || []);
      } catch (err) {
        console.warn('Error fetching company dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDashboardData();
  }, []);

  // Chart data setup
  const budgetAllocationData = {
    labels: campaigns.map(c => c.title?.substring(0, 15) + '...') || ['Campaign 1', 'Campaign 2'],
    datasets: [
      {
        label: 'Budget Allocated ($)',
        data: campaigns.map(c => c.budget?.max || 1000),
        backgroundColor: ['var(--primary)', '#a855f7', '#d946ef', 'var(--secondary)', '#f43f5e'],
        borderRadius: 6
      }
    ]
  };

  const applicationStatusData = {
    labels: ['Pending Review', 'Approved Creators', 'Rejected'],
    datasets: [
      {
        data: [
          applications.filter(a => a.status === 'pending').length || 3,
          applications.filter(a => a.status === 'approved').length || 2,
          applications.filter(a => a.status === 'rejected').length || 1
        ],
        backgroundColor: ['#f59e0b', '#10b981', '#f43f5e'],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#cbd5e1' } }
    },
    scales: {
      x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.06)' } },
      y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.06)' } }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Company Dashboard..." />;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero Welcome Glass Banner */}
      <div
        className="glass-panel mb-4"
        style={{
          padding: '32px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(var(--secondary-rgb), 0.16) 0%, rgba(var(--primary-rgb), 0.18) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '9999px', background: 'rgba(var(--secondary-rgb), 0.2)', border: '1px solid rgba(var(--secondary-rgb), 0.4)', color: 'var(--secondary)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
              <Building2 size={14} /> Brand Sponsor Portal
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, color: '#ffffff', fontFamily: "'Playfair Display', var(--font-sans)" }}>
              Welcome, <span className="gradient-text-sec">{user?.name}</span> 💼
            </h1>
            <p style={{ color: '#cbd5e1', margin: '6px 0 0 0', fontSize: '0.98rem' }}>
              Manage active campaign briefs, review applicant pitches, and track influencer marketing ROI.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/company/post-campaign" className="auth-btn-primary" style={{ width: 'auto', padding: '12px 24px', textDecoration: 'none', fontSize: '0.9rem' }}>
              <PlusCircle size={16} />
              Post New Campaign Brief
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Overview Metric Stat Widgets */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="TOTAL CAMPAIGNS"
            value={campaigns.length}
            subtitle="Active sponsor briefs"
            icon={<Briefcase size={20} style={{ color: 'var(--primary)' }} />}
            color="var(--primary)"
            trend="Active Pool"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="TOTAL APPLICATIONS"
            value={applications.length}
            subtitle="Creator pitches received"
            icon={<FileText size={20} style={{ color: '#f59e0b' }} />}
            color="#f59e0b"
            trend="Review Ready"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="BUDGET ALLOCATED"
            value={`$${budgetSummary.totalAllocated.toLocaleString()}`}
            subtitle="Campaign fund pool"
            icon={<DollarSign size={20} style={{ color: '#10b981' }} />}
            color="#10b981"
            trend="+15.2%"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="HIRED CREATORS"
            value={applications.filter(a => a.status === 'approved').length}
            subtitle="Active collaborations"
            icon={<UserCheck size={20} style={{ color: 'var(--secondary)' }} />}
            color="var(--secondary)"
            trend="99.4% Verified"
          />
        </div>
      </div>

      {/* Charts & Budget Summary Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <AnalyticsCard title="Campaign Budget Allocations ($)">
            <BarChart data={budgetAllocationData} options={chartOptions} height={220} />
          </AnalyticsCard>
        </div>

        <div className="col-12 col-lg-5">
          <AnalyticsCard title="Application Review Status">
            <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
              <DoughnutChart data={applicationStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {/* Applications Review Feed & Notifications */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
                <Users size={20} style={{ color: 'var(--primary)' }} />
                Recent Creator Applications
              </h4>
              <Link to="/company/campaigns" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '9999px' }}>
                View All
              </Link>
            </div>

            {applications.length === 0 ? (
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
                No creator applications received yet. Post a brief to start receiving pitches!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.slice(0, 4).map((app) => (
                  <div key={app._id} className="p-3" style={{ background: '#140d24', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff' }}>
                          {app.creatorId?.name || 'Creator'}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#8b85a3' }}>Rate: ${app.proposedRate}</span>
                      </div>
                      <span className={`badge badge-${app.status}`} style={{ fontSize: '0.75rem' }}>{app.status}</span>
                    </div>
                    <p style={{ fontSize: '0.83rem', color: '#cbd5e1', margin: '4px 0 8px 0' }}>"{app.pitch}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications & Messaging Thread Summary */}
        <div className="col-12 col-lg-5">
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
              <Bell size={20} style={{ color: '#f59e0b' }} />
              Notifications & Activity
            </h4>
            {notifications.length === 0 ? (
              <p style={{ color: '#a1a1aa', fontSize: '0.88rem', fontStyle: 'italic', margin: 0 }}>No new notifications.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.slice(0, 4).map((n) => (
                  <div key={n._id} className="p-3" style={{ background: '#140d24', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontWeight: 700, display: 'block', color: '#ffffff', fontSize: '0.88rem' }}>{n.title}</span>
                    <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{n.body}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
