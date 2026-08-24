import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import campaignService from '../../services/campaignService';
import api from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import AnalyticsCard from '../../components/AnalyticsCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Briefcase,
  Clock,
  CheckCircle,
  DollarSign,
  Compass,
  FileText,
  Calendar,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

// Chart.js integrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    pendingPitches: 0,
    acceptedPitches: 0,
    completedCampaigns: 0,
    totalEarnings: 0
  });
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    const fetchCreatorDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch creator applications
        const appsRes = await api.get('/applications/me');
        const apps = appsRes.data || [];
        setApplications(apps);

        // Calculate stats
        const active = apps.filter(a => a.status === 'approved').length;
        const pending = apps.filter(a => a.status === 'pending').length;
        const completed = apps.filter(a => a.status === 'completed').length;
        const earnings = apps
          .filter(a => a.status === 'approved' || a.status === 'completed')
          .reduce((sum, a) => sum + (a.proposedRate || 0), 0);

        setStats({
          activeCampaigns: active,
          pendingPitches: pending,
          acceptedPitches: active + completed,
          completedCampaigns: completed,
          totalEarnings: earnings
        });

        // 2. Fetch campaign recommendations
        const campsRes = await campaignService.getAllCampaigns();
        const allCamps = campsRes.campaigns || campsRes || [];
        setRecommendations(allCamps.slice(0, 3));

        // 3. Extract upcoming deadlines from active workspaces
        const wsRes = await api.get('/workspaces');
        const workspaces = wsRes.data || [];
        const upcomingDeadlines = [];
        workspaces.forEach(ws => {
          ws.milestones?.forEach(m => {
            if (m.status === 'pending') {
              upcomingDeadlines.push({
                _id: m._id,
                title: m.title,
                workspaceId: ws._id,
                projectTitle: ws.projectId?.title || 'Collaboration',
                status: m.status
              });
            }
          });
        });
        setDeadlines(upcomingDeadlines.slice(0, 3));
      } catch (err) {
        console.warn('Error fetching creator dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorDashboardData();
  }, []);

  // Chart data setup — High Contrast Cobalt & Sky Blue Theme
  const monthlyEarningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Monthly Earnings (₹)',
        data: [40000, 75000, 120000, 95000, 180000, 210000, stats.totalEarnings || 150000],
        fill: true,
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(var(--primary-rgb), 0.12)',
        tension: 0.4
      }
    ]
  };

  const pitchConversionData = {
    labels: ['Pitches Submitted', 'Shortlisted', 'Hired & Active', 'Completed'],
    datasets: [
      {
        label: 'Proposals Count',
        data: [applications.length || 5, stats.pendingPitches || 2, stats.activeCampaigns || 2, stats.completedCampaigns || 1],
        backgroundColor: ['var(--primary)', 'var(--secondary-hover)', 'var(--secondary)', '#60a5fa'],
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: 'var(--text-primary)', font: { weight: 'bold', size: 13 } } }
    },
    scales: {
      x: { ticks: { color: 'var(--primary)', font: { weight: '600' } }, grid: { color: 'var(--border-color)' } },
      y: { ticks: { color: 'var(--primary)', font: { weight: '600' } }, grid: { color: 'var(--border-color)' } }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Creator Dashboard..." />;
  }

  return (
    <div className="animate-fade-in-up" style={{ padding: '16px 0 60px 0' }}>
      {/* Hero Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '48px 52px',
          marginBottom: '44px',
          borderRadius: '22px',
          background: '#ffffff',
          border: '1.5px solid var(--border-color)',
          boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-4">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', background: '#f5e9e6', border: '1px solid #bfdbfe', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 800, marginBottom: '18px' }}>
              <Award size={16} style={{ color: 'var(--secondary)' }} /> Verified Creator Partner
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)", letterSpacing: '-0.02em' }}>
              Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: '14px 0 0 0', fontSize: '1.05rem', fontWeight: 500, maxWidth: '680px', lineHeight: '1.6' }}>
              Track your pitch proposals, active sponsorships, and escrow earnings in real-time with total clarity.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/discover" className="btn btn-primary" style={{ width: 'auto', padding: '16px 32px', textDecoration: 'none', fontSize: '0.98rem', borderRadius: '10px', fontWeight: 800 }}>
              <Sparkles size={18} />
              Discover Campaign Briefs
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Widgets Grid */}
      <div className="row g-4" style={{ marginBottom: '44px', rowGap: '32px' }}>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="ACTIVE CAMPAIGNS"
            value={stats.activeCampaigns}
            subtitle="Ongoing collaborations"
            icon={<Briefcase size={24} style={{ color: 'var(--primary)' }} />}
            color="var(--primary)"
            trend="+12.4%"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="PENDING PITCHES"
            value={stats.pendingPitches}
            subtitle="Awaiting brand review"
            icon={<Clock size={24} style={{ color: 'var(--warning)' }} />}
            color="var(--warning)"
            trend="Active"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="TOTAL EARNINGS"
            value={`₹${stats.totalEarnings ? stats.totalEarnings.toLocaleString() : '1,50,000'}`}
            subtitle="Approved payouts"
            icon={<DollarSign size={24} style={{ color: 'var(--secondary)' }} />}
            color="var(--secondary)"
            trend="+18.5%"
          />
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <DashboardCard
            title="COMPLETED WORK"
            value={stats.completedCampaigns}
            subtitle="Successfully closed"
            icon={<CheckCircle size={24} style={{ color: 'var(--primary)' }} />}
            color="var(--primary)"
            trend="100% Rate"
          />
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="row g-4" style={{ marginBottom: '44px', rowGap: '32px' }}>
        <div className="col-12 col-lg-7">
          <AnalyticsCard title="Earnings Overview Trend (₹)">
            <Line data={monthlyEarningsData} options={chartOptions} height={220} />
          </AnalyticsCard>
        </div>

        <div className="col-12 col-lg-5">
          <AnalyticsCard title="Pitch Conversion Funnel">
            <Bar data={pitchConversionData} options={chartOptions} height={220} />
          </AnalyticsCard>
        </div>
      </div>

      {/* Bottom Grid: Pitch History & Recommendations */}
      <div className="row g-4" style={{ rowGap: '32px' }}>
        {/* Recent Applications Feed */}
        <div className="col-12 col-lg-7">
          <div className="glass-panel" style={{ padding: '38px 42px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)' }}>
                <FileText size={22} style={{ color: 'var(--primary)' }} />
                Recent Pitch Proposals
              </h4>
            </div>

            {applications.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', margin: 0, padding: '24px 0' }}>
                You haven't pitched to any campaigns yet. Explore the Discover section to find briefs!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {applications.slice(0, 4).map((app) => (
                  <div key={app._id} style={{ padding: '24px 28px', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1.5px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '12px' }}>
                      <h5 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        {app.campaignId?.title || app.projectId?.title || 'Campaign Pitch'}
                      </h5>
                      <span className={`badge badge-${app.status}`} style={{ fontSize: '0.8rem', padding: '5px 14px' }}>{app.status}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: '10px 0 16px 0', lineHeight: '1.6' }}>"{app.pitch?.substring(0, 95)}..."</p>
                    <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600, paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                      <span>Proposed rate: <strong style={{ color: 'var(--text-primary)' }}>₹{app.proposedRate ? app.proposedRate.toLocaleString() : '50,000'}</strong></span>
                      <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Campaign Recommendations */}
        <div className="col-12 col-lg-5">
          <div className="glass-panel" style={{ padding: '38px 42px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)' }}>
                <Compass size={22} style={{ color: 'var(--secondary)' }} />
                Recommended Briefs
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {recommendations.map((camp) => (
                <div key={camp._id} className="d-flex justify-content-between align-items-center" style={{ padding: '24px 28px', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1.5px solid var(--border-color)', gap: '20px' }}>
                  <div>
                    <h5 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>{camp.title}</h5>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Budget: ₹{camp.budget?.min ? camp.budget.min.toLocaleString() : '1,00,000'} - ₹{camp.budget?.max ? camp.budget.max.toLocaleString() : '5,00,000'}
                    </span>
                  </div>
                  <Link to={`/campaigns/${camp._id}`} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.84rem', width: 'auto', textDecoration: 'none', borderRadius: '8px', flexShrink: 0, fontWeight: 800 }}>
                    Pitch <ArrowUpRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
