import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Compass, ExternalLink, RefreshCw } from 'lucide-react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('');
  const [minBudget, setMinBudget] = useState('');

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (niche) params.niche = niche;
      if (platform) params.platform = platform;
      if (minBudget) params.minBudget = minBudget;

      const { data } = await api.get('/campaigns', { params });
      setCampaigns(data.campaigns || data || []);
    } catch (error) {
      console.warn('Failed to fetch campaigns from DB:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [search, niche, platform, minBudget]);

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Explore Campaigns</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Find and apply to brand sponsorships matching your target niche</p>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search keywords..."
            className="form-input"
            style={{ paddingLeft: '48px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <select className="form-select" value={niche} onChange={(e) => setNiche(e.target.value)}>
            <option value="">All Niches</option>
            <option value="Fitness">Fitness</option>
            <option value="Gaming">Gaming</option>
            <option value="Tech">Tech</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Fashion">Fashion</option>
          </select>
        </div>

        <div>
          <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="">All Platforms</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter">Twitter</option>
          </select>
        </div>

        <div>
          <input
            type="number"
            placeholder="Min Budget ($)"
            className="form-input"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <RefreshCw className="animate-float" size={32} style={{ color: 'var(--primary)' }} />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <Compass size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No active campaigns found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Try modifying your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {campaigns.map((camp) => (
            <div key={camp._id} className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: '1.4' }}>{camp.title}</h3>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {camp.niche?.map((n, i) => (
                    <span key={i} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{n}</span>
                  ))}
                  {camp.targetPlatforms?.map((p, i) => (
                    <span key={i} className="badge badge-approved" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>{p}</span>
                  ))}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {camp.description}
                </p>
              </div>

              <div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Budget Range</span>
                    <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.1rem' }}>
                      ${camp.budget?.min?.toLocaleString()} - ${camp.budget?.max?.toLocaleString()}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {camp.deliverables?.length || 0} Deliverable(s)
                  </span>
                </div>

                <Link to={`/campaigns/${camp._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                  View Campaign Brief
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
