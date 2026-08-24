import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { computeMatchScore, matchTierColor } from '../utils/matchScore';
import {
  Search,
  SlidersHorizontal,
  Users,
  Building,
  Briefcase,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  Bookmark,
  BookmarkCheck,
  Plus,
  MapPin,
  CheckCircle,
  Filter,
  X,
  RefreshCw,
  Eye
} from 'lucide-react';

const Discover = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Creator-specific filters
  const [category, setCategory] = useState('');
  const [skill, setSkill] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [platform, setPlatform] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [availability, setAvailability] = useState('');
  const [minEngagement, setMinEngagement] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Project-specific filters
  const [minBudget, setMinBudget] = useState('');
  const [remote, setRemote] = useState('');

  // Results & Pagination
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Creator action states
  const [savedCreators, setSavedCreators] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [inviteModal, setInviteModal] = useState(null); // creatorUserId
  const [inviteModalName, setInviteModalName] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');

  const fetchDiscoverResults = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (activeTab === 'creators') {
        const params = new URLSearchParams({
          search, category, skill, minFollowers, platform,
          country, language, availability, minEngagement,
          sortBy, page, limit: 9
        });
        res = await api.get(`/discover/creators?${params}`);
        setResults(res.data.creators || []);
        setTotalPages(res.data.pages || 1);
        setTotalItems(res.data.total || 0);
      } else if (activeTab === 'brands') {
        res = await api.get(`/discover/brands?search=${search}&industry=${category}&page=${page}&limit=9`);
        setResults(res.data.brands || []);
        setTotalPages(res.data.pages || 1);
        setTotalItems(res.data.total || 0);
      } else {
        res = await api.get(`/campaigns?search=${search}&niche=${category}&platform=${platform}&minBudget=${minBudget}&country=${country}&remote=${remote}&sortBy=${sortBy}&page=${page}&limit=9`);
        setResults(res.data.campaigns || []);
        setTotalPages(res.data.pages || 1);
        setTotalItems(res.data.total || 0);
      }
    } catch (err) {
      console.warn('Discover fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, category, skill, minFollowers, platform, country, language, availability, minEngagement, sortBy, minBudget, remote, page]);

  useEffect(() => {
    setPage(1);
    setResults([]);
  }, [activeTab]);

  useEffect(() => {
    fetchDiscoverResults();
  }, [fetchDiscoverResults]);

  // Load brand campaigns for invite
  useEffect(() => {
    if (user?.role === 'brand') {
      api.get('/campaigns/me').then(res => setCampaigns(res.data || [])).catch(() => {});
    }
  }, [user]);

  // Load the logged-in creator's own profile once, so every project card
  // can show a "Match Score" against it without a per-card API call.
  const [myCreatorProfile, setMyCreatorProfile] = useState(null);
  useEffect(() => {
    if (user?.role === 'creator' && user?._id) {
      api.get(`/creators/${user._id}`).then(res => setMyCreatorProfile(res.data.creator || res.data)).catch(() => {});
    }
  }, [user]);

  const handleClearFilters = () => {
    setCategory('');
    setSkill('');
    setMinFollowers('');
    setPlatform('');
    setCountry('');
    setLanguage('');
    setAvailability('');
    setMinEngagement('');
    setMinBudget('');
    setSearch('');
    setRemote('');
    setSortBy('newest');
  };

  const handleToggleSave = async (creatorUserId) => {
    if (!user || user.role !== 'brand') return;
    setSavingId(creatorUserId);
    try {
      const res = await api.post(`/creators/${creatorUserId}/bookmark`);
      setSavedCreators(prev => ({ ...prev, [creatorUserId]: res.data.isSaved }));
    } catch (err) {
      console.warn('Bookmark toggle failed:', err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleInvite = async () => {
    if (!selectedCampaign || !inviteModal) return;
    setInviting(true);
    try {
      await api.post(`/campaigns/${selectedCampaign}/invite`, { creatorId: inviteModal });
      const camp = campaigns.find(c => c._id === selectedCampaign);
      setInviteSuccess(`Invitation sent to ${inviteModalName} for: "${camp?.title}"`);
      setInviteModal(null);
      setInviteModalName('');
      setSelectedCampaign('');
      setTimeout(() => setInviteSuccess(''), 4000);
    } catch (err) {
      console.warn('Invite failed:', err.message);
    } finally {
      setInviting(false);
    }
  };

  const formatNumber = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const getPartnerAvatarInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'CS';

  const activeFiltersCount = [category, skill, minFollowers, platform, country, language, availability, minEngagement, minBudget].filter(Boolean).length;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '16px 0 80px 0' }} className="animate-fade-in-up">

      {/* Invite Success Toast */}
      {inviteSuccess && (
        <div style={{
          position: 'fixed', top: '90px', right: '28px', zIndex: 9999,
          background: '#f5e9e6', color: 'var(--primary)', padding: '16px 24px',
          borderRadius: '14px', border: '1.5px solid #bfdbfe',
          boxShadow: '0 8px 30px rgba(var(--primary-rgb), 0.15)',
          display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, fontSize: '0.92rem'
        }}>
          <CheckCircle size={22} style={{ color: 'var(--secondary)' }} /> {inviteSuccess}
        </div>
      )}

      {/* Page Title & Navigation Tabs Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
            Explore CreatorSync Ecosystem
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '4px 0 0 0', fontWeight: 500 }}>
            Discover top-tier creators, verified brands, and lucrative sponsorship campaign briefs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#ffffff',
          padding: '6px',
          borderRadius: '14px',
          border: '1.5px solid var(--border-color)',
          boxShadow: '0 4px 16px rgba(var(--text-primary-rgb), 0.04)',
          gap: '6px'
        }}>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              background: activeTab === 'projects' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'transparent',
              color: activeTab === 'projects' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'projects' ? '0 4px 14px rgba(var(--primary-rgb), 0.25)' : 'none'
            }}
          >
            <Briefcase size={18} /> Discover Briefs
          </button>

          <button
            onClick={() => setActiveTab('creators')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              background: activeTab === 'creators' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'transparent',
              color: activeTab === 'creators' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'creators' ? '0 4px 14px rgba(var(--primary-rgb), 0.25)' : 'none'
            }}
          >
            <Users size={18} /> Find Creators
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              background: activeTab === 'brands' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'transparent',
              color: activeTab === 'brands' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'brands' ? '0 4px 14px rgba(var(--primary-rgb), 0.25)' : 'none'
            }}
          >
            <Building size={18} /> Find Brands
          </button>
        </div>
      </div>

      {/* ━━━━━ CREATOR SEARCH TAB ━━━━━ */}
      {activeTab === 'creators' && (
        <>
          {/* Search Bar & Horizontal Controls Bar */}
          <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '28px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
            <div className="d-flex gap-3 flex-wrap align-items-center">
              {/* Search Input */}
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search creators by name, handle, or keywords..."
                  className="form-input"
                  style={{ paddingLeft: '46px', paddingRight: '16px', paddingHeight: '14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', marginBottom: 0, fontSize: '0.95rem' }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-select"
                style={{ marginBottom: 0, width: 'auto', minWidth: '170px', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.9rem', fontWeight: 700 }}
              >
                <option value="newest">Newest First</option>
                <option value="followers">Most Followers</option>
                <option value="engagement">Best Engagement</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 800, position: 'relative' }}
              >
                <Filter size={16} /> Filters
                {activeFiltersCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'var(--primary)', color: '#ffffff',
                    fontSize: '0.72rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{activeFiltersCount}</span>
                )}
              </button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button onClick={handleClearFilters} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 20px', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--danger)', borderColor: '#fecaca', fontWeight: 800 }}>
                  <X size={16} /> Reset
                </button>
              )}
            </div>

            {/* Expandable Filter Grid */}
            {showFilters && (
              <div className="row g-3" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1.5px solid #f1f5f9' }}>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category / Niche</label>
                  <select className="form-select" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.88rem' }} value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Tech">Tech & Gadgets</option>
                    <option value="Comedy & Entertainment">Comedy & Entertainment</option>
                    <option value="Gaming & Esports">Gaming & Esports</option>
                    <option value="Finance & Fintech">Finance & Fintech</option>
                    <option value="Lifestyle & Vlog">Lifestyle & Vlog</option>
                    <option value="Fitness & Health">Fitness & Health</option>
                    <option value="Fashion & Beauty">Fashion & Beauty</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</label>
                  <select className="form-select" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.88rem' }} value={platform} onChange={e => setPlatform(e.target.value)}>
                    <option value="">All Platforms</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Followers</label>
                  <select className="form-select" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.88rem' }} value={minFollowers} onChange={e => setMinFollowers(e.target.value)}>
                    <option value="">Any Reach</option>
                    <option value="1000">1K+</option>
                    <option value="10000">10K+</option>
                    <option value="50000">50K+</option>
                    <option value="100000">100K+</option>
                    <option value="500000">500K+</option>
                    <option value="1000000">1M+</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Engagement (%)</label>
                  <select className="form-select" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.88rem' }} value={minEngagement} onChange={e => setMinEngagement(e.target.value)}>
                    <option value="">Any Rate</option>
                    <option value="1">1%+</option>
                    <option value="3">3%+</option>
                    <option value="5">5%+</option>
                    <option value="8">8%+</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Country</label>
                  <input
                    type="text"
                    placeholder="e.g. India, USA..."
                    className="form-input"
                    style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '0.88rem' }}
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  />
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Language</label>
                  <select className="form-select" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.88rem' }} value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="">Any Language</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</label>
                  <select className="form-select" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.88rem' }} value={availability} onChange={e => setAvailability(e.target.value)}>
                    <option value="">Any Status</option>
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Video Editing..."
                    className="form-input"
                    style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '0.88rem' }}
                    value={skill}
                    onChange={e => setSkill(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Count Header */}
          {!loading && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>
                {totalItems > 0 ? <>Showing <strong style={{ color: 'var(--text-primary)', fontWeight: 900 }}>{totalItems}</strong> verified creator{totalItems !== 1 ? 's' : ''}</> : 'No creators found'}
              </p>
            </div>
          )}

          {/* Creator Cards Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '320px', flexDirection: 'column', gap: '16px' }}>
              <div className="spinner-border text-primary" style={{ width: '40px', height: '40px', borderWidth: '3.5px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 700 }}>Searching creator directory...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)' }}>
              <Search size={48} style={{ color: '#94a3b8', display: 'block', margin: '0 auto 16px' }} />
              <h4 style={{ fontWeight: 900, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>No creators match your filters</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Try clearing filters or broadening your search query.</p>
              <button onClick={handleClearFilters} className="btn btn-outline" style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '10px', fontWeight: 800 }}>
                <RefreshCw size={16} /> Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-4">
                {results.map((c) => {
                  const u = c.userId || {};
                  const isSaved = savedCreators[u._id] ?? false;
                  const isCurrentlySaving = savingId === u._id;

                  return (
                    <div key={c._id} className="col-12 col-md-6 col-lg-4">
                      <div className="glass-panel" style={{
                        padding: '0', overflow: 'hidden', height: '100%',
                        borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)',
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(var(--primary-rgb), 0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'; }}
                      >
                        {/* Card Top: Gradient Banner + Avatar */}
                        <div style={{ position: 'relative', height: '96px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
                          {/* Availability Badge */}
                          {c.availability && (
                            <span style={{
                              position: 'absolute', top: '12px', right: '12px',
                              padding: '4px 12px',
                              background: c.availability === 'Available' ? '#ecfdf5' : '#fffbeb',
                              color: c.availability === 'Available' ? '#047857' : '#b45309',
                              border: c.availability === 'Available' ? '1px solid #a7f3d0' : '1px solid #fde68a',
                              borderRadius: '9999px',
                              fontSize: '0.75rem', fontWeight: 800
                            }}>
                              ● {c.availability}
                            </span>
                          )}

                          {/* Avatar */}
                          <div style={{
                            position: 'absolute', bottom: '-30px', left: '20px',
                            width: '64px', height: '64px', borderRadius: '50%',
                            border: '4px solid #ffffff',
                            background: '#ffffff',
                            overflow: 'hidden', boxShadow: '0 6px 18px rgba(var(--text-primary-rgb), 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {u.profileImage
                              ? <img src={u.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={u.name} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, background: 'var(--primary)', color: '#ffffff', fontSize: '1.2rem' }}>
                                  {getPartnerAvatarInitials(u.name)}
                                </div>
                            }
                          </div>
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: '40px 24px 20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          {/* Name + Category */}
                          <div style={{ marginBottom: '14px' }}>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <h5 style={{ fontWeight: 900, fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{u.name || 'Creator'}</h5>
                            </div>
                            <div className="d-flex align-items-center gap-2 flex-wrap mt-1">
                              {c.category && (
                                <span style={{ fontSize: '0.75rem', padding: '3px 10px', background: '#f5e9e6', border: '1px solid #bfdbfe', color: 'var(--primary)', borderRadius: '9999px', fontWeight: 800 }}>
                                  {c.category}
                                </span>
                              )}
                              {c.primaryPlatform && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'capitalize' }}>
                                  📱 {c.primaryPlatform}
                                </span>
                              )}
                              {u.country && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={12} /> {u.country}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div style={{ display: 'flex', gap: '3px' }}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={14}
                                  fill={star <= Math.round(c.avgRating || 0) ? '#f59e0b' : 'none'}
                                  style={{ color: '#f59e0b' }}
                                />
                              ))}
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--warning)' }}>
                              {c.avgRating > 0 ? c.avgRating : 'New Creator'}
                            </span>
                          </div>

                          {/* Stats Grid */}
                          <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '8px', marginBottom: '20px',
                            padding: '12px', background: 'var(--bg-tertiary)',
                            borderRadius: '14px', border: '1.5px solid var(--border-color)'
                          }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>{formatNumber(c.followersCount)}</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Followers</div>
                            </div>
                            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669' }}>
                                {c.avgEngagement ? `${c.avgEngagement}%` : 'N/A'}
                              </div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Engagement</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#7c3aed' }}>{c.completedCampaigns || 0}</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Projects</div>
                            </div>
                          </div>

                          {/* Niche Tags */}
                          {c.niche?.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              {c.niche.slice(0, 3).map((n, i) => (
                                <span key={i} style={{ fontSize: '0.72rem', padding: '3px 10px', background: '#f1f5f9', border: '1px solid var(--border-color)', borderRadius: '9999px', color: '#475569', fontWeight: 700 }}>{n}</span>
                              ))}
                              {c.niche.length > 3 && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>+{c.niche.length - 3}</span>}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* Primary: View Profile */}
                            <Link
                              to={`/creators/${u._id}`}
                              className="btn btn-primary"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', padding: '12px', borderRadius: '10px', fontWeight: 800 }}
                            >
                              <Eye size={16} /> View Creator Profile
                            </Link>

                            {/* Secondary row: Invite + Save */}
                            {user?.role === 'brand' && (
                              <div className="d-flex gap-2">
                                <button
                                  onClick={() => { setInviteModal(u._id); setInviteModalName(u.name); }}
                                  className="btn btn-outline"
                                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '10px', borderRadius: '10px', fontWeight: 800 }}
                                >
                                  <Plus size={15} /> Invite
                                </button>
                                <button
                                  onClick={() => handleToggleSave(u._id)}
                                  disabled={isCurrentlySaving}
                                  className="btn"
                                  style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    fontSize: '0.85rem', padding: '10px', borderRadius: '10px', fontWeight: 800,
                                    background: isSaved ? '#fce7f3' : 'var(--bg-tertiary)',
                                    color: isSaved ? '#be185d' : '#475569',
                                    border: isSaved ? '1px solid #fbcfe8' : '1px solid var(--border-color)'
                                  }}
                                >
                                  {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                                  {isSaved ? 'Saved' : 'Save'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '36px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px' }} disabled={page === 1}>
                    <ChevronLeft size={18} /> Previous
                  </button>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px' }} disabled={page === totalPages}>
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ━━━━━ BRANDS TAB ━━━━━ */}
      {activeTab === 'brands' && (
        <>
          {/* Search Bar & Horizontal Controls Bar */}
          <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '28px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
            <div className="d-flex gap-3 flex-wrap align-items-center">
              {/* Search Input */}
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search brands by company name, industry, or keywords..."
                  className="form-input"
                  style={{ paddingLeft: '46px', paddingRight: '16px', paddingHeight: '14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', marginBottom: 0, fontSize: '0.95rem' }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 800, position: 'relative' }}
              >
                <Filter size={16} /> Filters
                {activeFiltersCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'var(--primary)', color: '#ffffff',
                    fontSize: '0.72rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{activeFiltersCount}</span>
                )}
              </button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button onClick={handleClearFilters} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 20px', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--danger)', borderColor: '#fecaca', fontWeight: 800 }}>
                  <X size={16} /> Reset
                </button>
              )}
            </div>

            {/* Expandable Filter Grid */}
            {showFilters && (
              <div className="row g-3" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1.5px solid #f1f5f9' }}>
                <div className="col-12 col-md-6">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Industry</label>
                  <select className="form-select" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.88rem' }} value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All Industries</option>
                    <option value="Tech">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Finance">Finance</option>
                    <option value="Fashion">Fashion & Apparel</option>
                    <option value="Beauty">Beauty & Personal Care</option>
                    <option value="Food">Food & Beverage</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Brands Result Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', height: '280px', alignItems: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Searching sponsor brands...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)' }}>
              <Search size={40} style={{ color: '#94a3b8', marginBottom: '16px' }} />
              <h4 style={{ fontWeight: 900, color: 'var(--text-primary)' }}>No brands found</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Try clearing your filters or search keywords.</p>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-4">
                {results.map((b) => {
                  const u = b.userId || {};
                  return (
                    <div key={b._id} className="col-12 col-md-6 col-lg-4">
                      <div className="glass-panel glass-panel-hover" style={{ padding: '28px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
                        <div>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '18px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#f5e9e6', border: '1.5px solid #bfdbfe', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }}>
                              {u.profileImage ? <img src={u.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : getPartnerAvatarInitials(b.companyName)}
                            </div>
                            <div>
                              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'block', fontFamily: "'Playfair Display', var(--font-sans)" }}>{b.companyName || u.name}</span>
                              {b.industry && (
                                <span style={{ fontSize: '0.78rem', padding: '3px 10px', background: '#f5e9e6', border: '1px solid #bfdbfe', color: 'var(--primary)', borderRadius: '9999px', fontWeight: 800, marginTop: '4px', display: 'inline-block' }}>
                                  {b.industry}
                                </span>
                              )}
                            </div>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: '#475569', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.6', marginBottom: '20px' }}>
                            {b.description || 'Verified brand sponsor on CreatorSync platform.'}
                          </p>
                        </div>
                        <Link to={`/brands/${u._id}`} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.9rem', padding: '12px', borderRadius: '10px', fontWeight: 800 }}>
                          View Brand Profile <ExternalLink size={16} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px' }} disabled={page === 1}><ChevronLeft size={18} /> Previous</button>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px' }} disabled={page === totalPages}>Next <ChevronRight size={18} /></button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ━━━━━ PROJECTS/CAMPAIGNS TAB ━━━━━ */}
      {activeTab === 'projects' && (
        <>
          {/* Search Bar & Horizontal Controls Bar */}
          <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '28px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
            <div className="d-flex gap-3 flex-wrap align-items-center">
              {/* Search Input */}
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search campaign briefs by title, brand, or keywords..."
                  className="form-input"
                  style={{ paddingLeft: '46px', paddingRight: '16px', paddingHeight: '14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', marginBottom: 0, fontSize: '0.95rem' }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-select"
                style={{ marginBottom: 0, width: 'auto', minWidth: '170px', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.9rem', fontWeight: 700 }}
              >
                <option value="newest">Newest First</option>
                <option value="highest-budget">Highest Budget</option>
                <option value="deadline">Upcoming Deadline</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 800, position: 'relative' }}
              >
                <Filter size={16} /> Filters
                {activeFiltersCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'var(--primary)', color: '#ffffff',
                    fontSize: '0.72rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{activeFiltersCount}</span>
                )}
              </button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button onClick={handleClearFilters} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 20px', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--danger)', borderColor: '#fecaca', fontWeight: 800 }}>
                  <X size={16} /> Reset
                </button>
              )}
            </div>

            {/* Expandable Filter Grid */}
            {showFilters && (
              <div className="row g-3" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1.5px solid #f1f5f9' }}>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Niche / Category</label>
                  <select className="form-select" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.88rem' }} value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All Niches</option>
                    <option value="Tech">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Channels</label>
                  <select className="form-select" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.88rem' }} value={platform} onChange={e => setPlatform(e.target.value)}>
                    <option value="">All Channels</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Budget ($)</label>
                  <input type="number" placeholder="e.g. 500" className="form-input" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '0.88rem' }} value={minBudget} onChange={e => setMinBudget(e.target.value)} />
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Country</label>
                  <input type="text" placeholder="e.g. United States" className="form-input" style={{ marginBottom: 0, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '0.88rem' }} value={country} onChange={e => setCountry(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Campaign Briefs Result Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}>
              <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Loading campaign briefs...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)' }}>
              <Search size={40} style={{ color: '#94a3b8', marginBottom: '16px' }} />
              <h4 style={{ fontWeight: 900, color: 'var(--text-primary)' }}>No campaign briefs matched</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Try clearing filters or checking your search parameters.</p>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-4">
                {results.map((p) => {
                  const bUser = p.brandId || {};
                  const formattedDeadline = p.deadline ? new Date(p.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
                  const match = myCreatorProfile ? computeMatchScore(myCreatorProfile, p) : null;
                  return (
                    <div key={p._id} className="col-12 col-md-6 col-lg-4">
                      <div className="glass-panel glass-panel-hover" style={{ padding: '28px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-3">
                              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, color: '#ffffff', flexShrink: 0 }}>
                                {bUser.profileImage ? <img src={bUser.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : getPartnerAvatarInitials(bUser.name)}
                              </div>
                              <div>
                                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)', display: 'block' }}>{bUser.name || 'Sponsor Brand'}</span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location: {p.location || 'Global'} {p.isRemote && '(Remote)'}</span>
                              </div>
                            </div>
                            <span style={{ fontWeight: 900, color: '#047857', fontSize: '0.95rem', background: '#ecfdf5', padding: '6px 14px', borderRadius: '9999px', border: '1.5px solid #a7f3d0' }}>
                              ${p.budget?.min?.toLocaleString()} - ${p.budget?.max?.toLocaleString()}
                            </span>
                          </div>

                          {match && (
                            <div
                              title={match.reasons.map(r => `${r.met ? '✓' : '✗'} ${r.label}`).join('  ·  ')}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                background: matchTierColor[match.tier].bg,
                                color: matchTierColor[match.tier].text,
                                border: `1px solid ${matchTierColor[match.tier].border}`,
                                padding: '4px 12px', borderRadius: '9999px',
                                fontSize: '0.78rem', fontWeight: 900, marginBottom: '14px', cursor: 'help'
                              }}
                            >
                              <Star size={12} fill="currentColor" /> {match.score}% Match for You
                            </div>
                          )}

                          <div className="mb-3">
                            <h4 style={{ fontWeight: 900, fontSize: '1.2rem', marginTop: '6px', marginBottom: '10px', color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{p.title}</h4>
                            <div className="d-flex flex-wrap gap-1 mb-3">
                              {p.niche?.map((n, idx) => (
                                <span key={idx} style={{ padding: '3px 10px', background: '#f5e9e6', border: '1px solid #bfdbfe', color: 'var(--primary)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>{n}</span>
                              ))}
                              {p.targetPlatforms?.map((plat, idx) => (
                                <span key={idx} style={{ padding: '3px 10px', background: '#f1f5f9', border: '1px solid var(--border-color)', color: '#475569', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>{plat}</span>
                              ))}
                            </div>
                          </div>

                          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginBottom: '20px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                            {p.description}
                          </p>
                        </div>

                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-tertiary)', padding: '14px 16px', borderRadius: '14px', marginBottom: '20px', border: '1.5px solid var(--border-color)' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>SLOTS OPEN</span>
                              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>{p.creatorsRequired || 1} Creator(s)</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>DEADLINE</span>
                              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)' }}>{formattedDeadline}</span>
                            </div>
                          </div>

                          <Link to={`/campaigns/${p._id}`} className="btn btn-primary w-100" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '12px', borderRadius: '10px', fontWeight: 800, fontSize: '0.92rem' }}>
                            Apply For Brief <ExternalLink size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px' }} disabled={page === 1}><ChevronLeft size={18} /> Previous</button>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px' }} disabled={page === totalPages}>Next <ChevronRight size={18} /></button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ━━━━━ INVITE MODAL ━━━━━ */}
      {inviteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(var(--text-primary-rgb), 0.75)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{ padding: '36px', maxWidth: '460px', width: '100%', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 12px 40px rgba(var(--text-primary-rgb), 0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-primary)' }}>Invite Creator to Campaign</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Select an active campaign brief to send a direct invitation to <strong>{inviteModalName}</strong>:
            </p>
            {campaigns.filter(c => c.status === 'active').length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '24px' }}>No active campaigns available. Please create a campaign brief first.</p>
            ) : (
              <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)} className="form-select" style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: '#ffffff', fontSize: '0.9rem', fontWeight: 700 }}>
                <option value="">— Select Campaign —</option>
                {campaigns.filter(c => c.status === 'active').map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            )}
            <div className="d-flex gap-3">
              <button onClick={handleInvite} disabled={!selectedCampaign || inviting} className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 800 }}>
                {inviting ? 'Sending...' : 'Send Invitation'}
              </button>
              <button onClick={() => { setInviteModal(null); setSelectedCampaign(''); }} className="btn btn-outline" style={{ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 800 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
