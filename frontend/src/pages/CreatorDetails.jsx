import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Youtube,
  Instagram,
  Twitter,
  Globe,
  Award,
  BookOpen,
  Calendar,
  Briefcase,
  Star,
  Users,
  Video,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Activity,
  BarChart2,
  Clock,
  Zap,
  Heart,
  Eye,
  Play,
  RefreshCw,
  ThumbsUp,
  Target,
  Shield,
  AlertCircle,
  Plus,
  Mail,
  MapPin,
  Phone,
  Link as LinkIcon,
  ChevronRight,
  Facebook,
  Linkedin,
  ExternalLink
} from 'lucide-react';

const CreatorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [inviteModal, setInviteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchCreatorProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/creators/${id}`);
      setData(res.data);
      setIsSaved(res.data.isSaved || false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load creator profile.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCreatorProfile();
    }
  }, [id, fetchCreatorProfile]);

  useEffect(() => {
    if (user?.role === 'brand') {
      api.get('/campaigns/me').then(res => setCampaigns(res.data || [])).catch(() => {});
    }
  }, [user]);

  const handleToggleSave = async () => {
    if (!user || user.role !== 'brand') return;
    setSavingToggle(true);
    try {
      const res = await api.post(`/creators/${id}/bookmark`);
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.warn('Bookmark toggle failed:', err.message);
    } finally {
      setSavingToggle(false);
    }
  };

  const handleInvite = async () => {
    if (!selectedCampaign) return;
    setInviting(true);
    try {
      await api.post(`/campaigns/${selectedCampaign}/invite`, { creatorId: id });
      const camp = campaigns.find(c => c._id === selectedCampaign);
      setInviteSuccess(`Invitation sent for: "${camp?.title}"`);
      setInviteModal(false);
      setSelectedCampaign('');
      setTimeout(() => setInviteSuccess(''), 4000);
    } catch (err) {
      console.warn('Invite failed:', err.message);
    } finally {
      setInviting(false);
    }
  };

  const formatNumber = (n) => {
    if (!n && n !== 0) return 'N/A';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '16px' }}>
        <div className="spinner-border" style={{ width: '40px', height: '40px', borderWidth: '3px', color: 'var(--primary)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading creator performance report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle size={48} style={{ color: 'var(--danger)', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
        <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Profile Unavailable</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'Creator profile data not found.'}</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const { creator, reviews, avgRating, totalReviews } = data;
  const userDetails = creator.userId || {};

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '80px' }} className="animate-fade-in-up">
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', padding: '7px 14px', marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'var(--primary-gradient)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: '#fff' }}>
            {userDetails.profileImage ? <img src={userDetails.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : userDetails.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>{userDetails.name}</h1>
            <p style={{ color: 'var(--primary)', fontWeight: 700, margin: '4px 0 12px' }}>{creator.category || 'Creator'} • {creator.primaryPlatform || 'YouTube'}</p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Followers: <strong>{formatNumber(creator.followersCount)}</strong></span>
              <span>Engagement: <strong>{creator.avgEngagement || '3.5'}%</strong></span>
              <span>Rating: <strong>★ {avgRating || '5.0'} ({totalReviews || 0})</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '16px' }}>Bio & Background</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
          {creator.bio || 'Professional content creator dedicated to producing high quality engagement.'}
        </p>

        {creator.niche?.length > 0 && (
          <div className="mb-4">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Target Niches</h4>
            <div className="d-flex flex-wrap gap-2">
              {creator.niche.map((n, i) => (
                <span key={i} className="badge badge-primary">{n}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDetails;
