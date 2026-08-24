import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Save,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Briefcase,
  Plus,
  Trash2,
  Award,
  ExternalLink,
  User as UserCircle,
  Globe,
  Camera,
  Layers,
  TrendingUp,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Facebook,
  ShieldCheck,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, error, setError } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Base profile details
  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [password, setPassword] = useState('');

  // Creator basic information
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [coverBanner, setCoverBanner] = useState('');

  // Creator professional details
  const [category, setCategory] = useState('');
  const [primaryPlatform, setPrimaryPlatform] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [languages, setLanguages] = useState('');
  const [availability, setAvailability] = useState('Available');

  // Creator social media links
  const [instagramUrl, setInstagramUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [xUrl, setXUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Creator audience statistics
  const [followersCount, setFollowersCount] = useState(0);
  const [avgEngagement, setAvgEngagement] = useState(0);
  const [avgReach, setAvgReach] = useState(0);
  const [monthlyViews, setMonthlyViews] = useState(0);

  // Skills dynamic list
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  // Work Showcase
  const [showcase, setShowcase] = useState([]);

  // Brand specific fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [images, setImages] = useState([]);
  const [companyLogo, setCompanyLogo] = useState('');
  const [address, setAddress] = useState('');
  const [productsServices, setProductsServices] = useState('');
  const [mission, setMission] = useState('');

  // Hydrate details from API on mount
  useEffect(() => {
    const fetchDetails = async () => {
      if (!user) return;
      try {
        if (user.role === 'creator') {
          const res = await api.get(`/creators/${user._id}`);
          const c = res.data.creator || {};
          const u = res.data.creator?.userId || {};

          setUsername(u.username || '');
          setPhone(u.phone || '');
          setCountry(u.country || '');
          setCity(u.city || '');

          setCoverBanner(c.coverBanner || '');
          setBio(c.bio || '');
          setCategory(c.category || '');
          setPrimaryPlatform(c.primaryPlatform || '');
          setExperienceYears(c.experienceYears || 0);
          setLanguages(c.languages?.join(', ') || '');
          setAvailability(c.availability || 'Available');

          setInstagramUrl(c.instagramUrl || '');
          setYoutubeUrl(c.youtubeUrl || '');
          setLinkedinUrl(c.linkedinUrl || '');
          setXUrl(c.xUrl || c.twitterUrl || '');
          setFacebookUrl(c.facebookUrl || '');
          setWebsiteUrl(c.websiteUrl || '');

          setFollowersCount(c.followersCount || 0);
          setAvgEngagement(c.avgEngagement || 0);
          setAvgReach(c.avgReach || 0);
          setMonthlyViews(c.monthlyViews || 0);

          setSkillsList(c.skills || []);
          setShowcase(c.showcase || []);
        } else if (user.role === 'brand') {
          const res = await api.get(`/brands/${user._id}`);
          const b = res.data.brand || {};
          const u = res.data.brand?.userId || {};

          setPhone(u.phone || '');
          setCountry(u.country || '');
          setCity(u.city || '');

          setCompanyName(b.companyName || user.name || '');
          setIndustry(b.industry || '');
          setWebsite(b.website || '');
          setDescription(b.description || '');
          setCompanyLogo(b.companyLogo || '');
          setCoverBanner(b.coverBanner || '');
          setAddress(b.address || '');
          setProductsServices(b.productsServices || '');
          setMission(b.mission || '');

          setLinkedinUrl(b.linkedinUrl || '');
          setInstagramUrl(b.instagramUrl || '');
          setFacebookUrl(b.facebookUrl || '');
          setYoutubeUrl(b.youtubeUrl || '');
          setXUrl(b.twitterUrl || '');

          setSocialLinks(b.socialLinks || []);
          setImages(b.images || []);
        }
      } catch (err) {
        console.warn('Failed to fetch detailed profile:', err);
      }
    };

    fetchDetails();
  }, [user]);

  // Skill tag handlers
  const handleAddSkillTag = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkillTag = (tag) => {
    setSkillsList(skillsList.filter(s => s !== tag));
  };

  // Showcase Handlers
  const handleAddShowcase = () => {
    setShowcase([...showcase, { title: '', platform: 'youtube', description: '', url: '', thumbnail: '' }]);
  };

  const handleRemoveShowcase = (idx) => {
    setShowcase(showcase.filter((_, i) => i !== idx));
  };

  const handleShowcaseChange = (idx, field, val) => {
    const updated = [...showcase];
    updated[idx][field] = val;
    setShowcase(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const baseProfileData = {
      name,
      profileImage
    };

    if (password) {
      baseProfileData.password = password;
    }

    try {
      // 1. Update Core user credentials
      await updateProfile(baseProfileData);

      // 2. Update Role specific database schemas
      if (user.role === 'creator') {
        const creatorData = {
          skills: skillsList,
          bio,
          username,
          phone,
          country,
          city,
          coverBanner,
          category,
          primaryPlatform,
          experienceYears: Number(experienceYears) || 0,
          languages: languages.split(',').map(s => s.trim()).filter(Boolean),
          availability,
          instagramUrl,
          youtubeUrl,
          linkedinUrl,
          xUrl,
          facebookUrl,
          websiteUrl,
          followersCount: Number(followersCount) || 0,
          avgEngagement: Number(avgEngagement) || 0,
          avgReach: Number(avgReach) || 0,
          monthlyViews: Number(monthlyViews) || 0,
          showcase
        };
        await api.put('/creators/me', creatorData);
      } else {
        const brandData = {
          companyName,
          industry,
          website,
          description,
          companyLogo,
          coverBanner,
          phone,
          country,
          city,
          address,
          productsServices,
          mission,
          linkedinUrl,
          instagramUrl,
          facebookUrl,
          youtubeUrl,
          twitterUrl: xUrl,
          socialLinks,
          images
        };
        await api.put('/brands/me', brandData);
      }

      setSuccess(true);
      setPassword('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Profile save failed.');
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompletionScore = () => {
    let score = 0;
    if (user?.role === 'creator') {
      if (name) score += 15;
      if (profileImage) score += 15;
      if (bio) score += 20;
      if (category) score += 15;
      if (skillsList && skillsList.length > 0) score += 10;
      if (instagramUrl || youtubeUrl || linkedinUrl || xUrl) score += 15;
      if (showcase && showcase.length > 0) score += 10;
    } else {
      if (companyName) score += 15;
      if (companyLogo) score += 15;
      if (coverBanner) score += 15;
      if (industry) score += 15;
      if (website) score += 10;
      if (description) score += 15;
      if (linkedinUrl || instagramUrl || facebookUrl || youtubeUrl || xUrl) score += 15;
    }
    return Math.min(score, 100);
  };

  const completionPct = getProfileCompletionScore();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px 0 80px 0' }} className="animate-fade-in-up">
      {/* Top Title & Public Link Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
            Profile Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '4px 0 0 0', fontWeight: 500 }}>
            Update your public portfolio parameters, social connections, and brand outreach credentials.
          </p>
        </div>

        {user?.role === 'creator' && (
          <Link to={`/creators/${user._id}`} className="btn btn-outline" style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: 800, textDecoration: 'none' }}>
            <ExternalLink size={18} />
            View Public Portfolio
          </Link>
        )}
        {user?.role === 'brand' && (
          <Link to={`/brands/${user._id}`} className="btn btn-outline" style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: 800, textDecoration: 'none' }}>
            <ExternalLink size={18} />
            View Public Brand Profile
          </Link>
        )}
      </div>

      {/* Success Notification Alert */}
      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          background: '#f5e9e6',
          color: 'var(--primary)',
          border: '1.5px solid #bfdbfe',
          borderRadius: '14px',
          marginBottom: '28px',
          fontWeight: 700,
          boxShadow: '0 4px 16px rgba(var(--primary-rgb), 0.08)'
        }}>
          <CheckCircle size={22} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
          <span>Profile parameters updated and saved successfully!</span>
        </div>
      )}

      {/* Error Notification Alert */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          background: '#fef2f2',
          color: '#991b1b',
          border: '1.5px solid #fecaca',
          borderRadius: '14px',
          marginBottom: '28px',
          fontWeight: 700
        }}>
          <AlertTriangle size={22} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Header Preview Card with Cover Banner & Avatar */}
      <div className="glass-panel" style={{ borderRadius: '22px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '36px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)', position: 'relative' }}>
        {/* Banner Image / Gradient Container */}
        <div style={{
          height: '180px',
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
          background: coverBanner ? `url(${coverBanner}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          position: 'relative'
        }}>
          <span style={{ position: 'absolute', right: '20px', top: '16px', background: 'rgba(var(--text-primary-rgb), 0.75)', color: '#ffffff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
            Cover Banner Preview
          </span>
        </div>

        {/* User Details Bar Below Banner (No overflow hidden, avatar never cut off) */}
        <div style={{ padding: '0 36px 28px 36px', background: '#ffffff', borderRadius: '0 0 20px 20px' }}>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-4">
            {/* Avatar & User Name info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '-48px' }}>
              <div style={{
                width: '98px',
                height: '98px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '4px solid #ffffff',
                boxShadow: '0 8px 24px rgba(var(--text-primary-rgb), 0.16)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--primary)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 10
              }}>
                {profileImage || companyLogo ? (
                  <img src={profileImage || companyLogo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  name?.substring(0, 2).toUpperCase() || 'CS'
                )}
              </div>

              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  {name || 'User Name'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {username && <span style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 700 }}>@{username}</span>}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f5e9e6', border: '1px solid #bfdbfe', color: 'var(--primary)', padding: '4px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800 }}>
                    <ShieldCheck size={16} style={{ color: 'var(--secondary)' }} /> Verified {user?.role === 'creator' ? 'Creator Partner' : 'Brand Sponsor'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completeness Box */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '18px 24px', borderRadius: '16px', border: '1.5px solid var(--border-color)', minWidth: '280px', maxWidth: '340px', marginTop: '24px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PROFILE COMPLETENESS</span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{completionPct}%</span>
              </div>
              <div className="progress" style={{ height: '10px', background: 'var(--border-color)', borderRadius: '9999px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${completionPct}%`,
                    background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
                    borderRadius: '9999px'
                  }}
                  aria-valuenow={completionPct}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Edit Form */}
      <form onSubmit={handleSubmit}>

        {/* 1. Core Credentials Card */}
        <div className="glass-panel" style={{ padding: '36px 40px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 24px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '16px' }}>
            <UserCircle size={22} style={{ color: 'var(--primary)' }} />
            Account Credentials & Media
          </h3>

          <div className="row g-4 mb-3">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Full Name / Display Name *</label>
                <input type="text" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Profile Image URL</label>
                <input type="url" placeholder="https://..." className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={profileImage} onChange={(e) => setProfileImage(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="row g-4 mb-3">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Username handle</label>
                <input type="text" placeholder="@username" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Cover Banner URL</label>
                <input type="url" placeholder="https://..." className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={coverBanner} onChange={(e) => setCoverBanner(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="row g-4 mb-3">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Account Email (Non-editable)</label>
                <input type="email" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }} value={user?.email || ''} disabled />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label className="form-label">Change Password (leave blank to keep current)</label>
                <input type="password" placeholder="••••••••" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="row g-4 mb-2">
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="form-label">Country</label>
                <input type="text" placeholder="India" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="form-label">City / Region</label>
                <input type="text" placeholder="Mumbai / Delhi" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-group mt-3">
            <label className="form-label">Biography Summary</label>
            <textarea placeholder="Write a short pitch or biography about your content creation focus..." rows="3" className="form-input" style={{ padding: '14px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)', lineHeight: '1.6' }} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </div>

        {/* 2. Creator Specific Professional Card */}
        {user?.role === 'creator' && (
          <>
            <div className="glass-panel" style={{ padding: '36px 40px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 24px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '16px' }}>
                <Briefcase size={22} style={{ color: 'var(--primary)' }} />
                Professional Specifications
              </h3>

              <div className="row g-4 mb-3">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Primary Creator Category</label>
                    <select className="form-select" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: '#ffffff' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="">Select Category</option>
                      <option value="Tech & Gadgets">Tech & Gadgets</option>
                      <option value="Comedy & Entertainment">Comedy & Entertainment</option>
                      <option value="Gaming & Esports">Gaming & Esports</option>
                      <option value="Finance & Fintech">Finance & Fintech</option>
                      <option value="Lifestyle & Vlog">Lifestyle & Vlog</option>
                      <option value="Fitness & Health">Fitness & Health</option>
                      <option value="Fashion & Beauty">Fashion & Beauty</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Primary Social Platform</label>
                    <select className="form-select" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: '#ffffff' }} value={primaryPlatform} onChange={(e) => setPrimaryPlatform(e.target.value)}>
                      <option value="">Select Platform</option>
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">X (Twitter)</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-3">
                <div className="col-12 col-md-4">
                  <div className="form-group">
                    <label className="form-label">Creation Experience (Years)</label>
                    <input type="number" min="0" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="form-group">
                    <label className="form-label">Availability Status</label>
                    <select className="form-select" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: '#ffffff' }} value={availability} onChange={(e) => setAvailability(e.target.value)}>
                      <option value="Available">Available for Sponsorships</option>
                      <option value="Busy">Busy / Limited Slot</option>
                      <option value="On Vacation">On Vacation</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="form-group">
                    <label className="form-label">Content Languages</label>
                    <input type="text" placeholder="Hindi, English" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={languages} onChange={(e) => setLanguages(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Social Connections Card */}
            <div className="glass-panel" style={{ padding: '36px 40px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 24px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '16px' }}>
                <Globe size={22} style={{ color: 'var(--secondary)' }} />
                Social Media Handles & Portfolios
              </h3>

              <div className="row g-4 mb-3">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Instagram size={16} style={{ color: '#e1306c' }} /> Instagram Profile Link
                    </label>
                    <input type="url" placeholder="https://instagram.com/..." className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Youtube size={16} style={{ color: '#ff0000' }} /> YouTube Channel Link
                    </label>
                    <input type="url" placeholder="https://youtube.com/..." className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-3">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Linkedin size={16} style={{ color: '#0a66c2' }} /> LinkedIn Profile Link
                    </label>
                    <input type="url" placeholder="https://linkedin.com/in/..." className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Twitter size={16} style={{ color: '#1da1f2' }} /> X (Twitter) Handle Link
                    </label>
                    <input type="url" placeholder="https://x.com/..." className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={xUrl} onChange={(e) => setXUrl(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Facebook size={16} style={{ color: '#1877f2' }} /> Facebook Page Link
                    </label>
                    <input type="url" placeholder="https://facebook.com/..." className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Globe size={16} style={{ color: 'var(--primary)' }} /> Personal Website / Portfolio Link
                    </label>
                    <input type="url" placeholder="https://..." className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Audience Reach & Statistics Card */}
            <div className="glass-panel" style={{ padding: '36px 40px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 24px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '16px' }}>
                <TrendingUp size={22} style={{ color: 'var(--primary)' }} />
                Audience Metrics & Media Reach
              </h3>

              <div className="row g-4 mb-3">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Total Followers / Subscribers Count</label>
                    <input type="number" min="0" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={followersCount} onChange={(e) => setFollowersCount(e.target.value)} />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Average Engagement Rate (%)</label>
                    <input type="number" min="0" step="0.01" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={avgEngagement} onChange={(e) => setAvgEngagement(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Average Reach Per Post</label>
                    <input type="number" min="0" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={avgReach} onChange={(e) => setAvgReach(e.target.value)} />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Monthly Impressions / Views</label>
                    <input type="number" min="0" className="form-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-color)' }} value={monthlyViews} onChange={(e) => setMonthlyViews(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Skills Tags Card */}
            <div className="glass-panel" style={{ padding: '36px 40px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 24px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '16px' }}>
                <Sparkles size={22} style={{ color: 'var(--secondary)' }} />
                Skills & Creator Specializations
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                {skillsList.length === 0 ? (
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No skill tags added yet. Enter skills below.</span>
                ) : (
                  skillsList.map((tag) => (
                    <span key={tag} style={{ padding: '8px 18px', borderRadius: '9999px', background: '#f5e9e6', border: '1px solid #bfdbfe', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillTag(tag)}
                        style={{ border: 'none', background: 'none', color: 'var(--primary)', padding: 0, cursor: 'pointer', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', maxWidth: '560px' }}>
                <input
                  type="text"
                  placeholder="Add skill (e.g. 4K Video Editing, Tech Reviews)"
                  className="form-input"
                  style={{ padding: '12px 18px', borderRadius: '10px', border: '1.5px solid var(--border-color)', flex: '1 1 280px', minWidth: '260px', height: '46px', fontSize: '0.92rem' }}
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddSkillTag}
                  className="btn btn-outline"
                  style={{ padding: '0 24px', height: '46px', borderRadius: '10px', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                >
                  <Plus size={16} /> Add Skill
                </button>
              </div>
            </div>

            {/* 6. Work Showcase Card */}
            <div className="glass-panel" style={{ padding: '36px 40px', borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3" style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Layers size={22} style={{ color: 'var(--primary)' }} />
                  Featured Work Showcase Items
                </h3>
                <button type="button" onClick={handleAddShowcase} className="btn btn-outline" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800 }}>
                  <Plus size={16} /> Add Showcase Item
                </button>
              </div>

              {showcase.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontStyle: 'italic', margin: 0, padding: '16px 0' }}>
                  No featured video or project showcase items added yet. Click "Add Showcase Item" above.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {showcase.map((item, idx) => (
                    <div key={idx} style={{ padding: '24px 28px', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1.5px solid var(--border-color)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          SHOWCASE ITEM #{idx + 1}
                        </span>
                        <button type="button" onClick={() => handleRemoveShowcase(idx)} className="btn btn-outline" style={{ padding: '4px 10px', color: 'var(--danger)', borderColor: '#fecaca', fontSize: '0.78rem' }}>
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-12 col-md-6">
                          <input
                            type="text"
                            placeholder="Showcase Title (e.g. boAt Airdopes Review Video)"
                            className="form-input"
                            style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)' }}
                            value={item.title}
                            onChange={(e) => handleShowcaseChange(idx, 'title', e.target.value)}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <select
                            className="form-select"
                            style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: '#ffffff' }}
                            value={item.platform}
                            onChange={(e) => handleShowcaseChange(idx, 'platform', e.target.value)}
                          >
                            <option value="youtube">YouTube Video</option>
                            <option value="instagram">Instagram Reel</option>
                            <option value="portfolio">Portfolio Website</option>
                          </select>
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-12 col-md-6">
                          <input
                            type="url"
                            placeholder="Video / Project URL (https://...)"
                            className="form-input"
                            style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)' }}
                            value={item.url}
                            onChange={(e) => handleShowcaseChange(idx, 'url', e.target.value)}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <input
                            type="url"
                            placeholder="Thumbnail Image URL (https://...)"
                            className="form-input"
                            style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)' }}
                            value={item.thumbnail}
                            onChange={(e) => handleShowcaseChange(idx, 'thumbnail', e.target.value)}
                          />
                        </div>
                      </div>

                      <textarea
                        placeholder="Brief description or performance metrics achieved (e.g. 1.2M views)..."
                        rows="2"
                        className="form-input"
                        style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border-color)' }}
                        value={item.description}
                        onChange={(e) => handleShowcaseChange(idx, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Action Button Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              padding: '16px 44px',
              fontSize: '1.05rem',
              fontWeight: 800,
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(var(--primary-rgb), 0.2)'
            }}
          >
            <Save size={20} />
            {loading ? 'Saving Parameters...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
