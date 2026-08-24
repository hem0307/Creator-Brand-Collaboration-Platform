import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  const bUser = campaign.brandId || {};
  const formattedDeadline = campaign.deadline
    ? new Date(campaign.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'CS';

  return (
    <div className="card glass-panel glass-panel-hover border-0 shadow-sm" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-gradient)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
              {bUser.profileImage ? <img src={bUser.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : getInitials(bUser.name)}
            </div>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{bUser.name || 'Sponsor Brand'}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {campaign.location || 'Global'}</span>
            </div>
          </div>
          <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.95rem', background: 'var(--success-glow)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(0, 229, 160, 0.2)' }}>
            ${campaign.budget?.min?.toLocaleString()} - ${campaign.budget?.max?.toLocaleString()}
          </span>
        </div>

        <div className="mb-2">
          <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '4px', marginBottom: '8px', color: 'var(--text-primary)' }}>{campaign.title}</h4>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {campaign.niche?.map((n, idx) => (
              <span key={idx} className="badge badge-primary">{n}</span>
            ))}
            {campaign.targetPlatforms?.map((p, idx) => (
              <span key={idx} className="badge badge-shortlisted">{p}</span>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {campaign.description}
        </p>
      </div>

      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>CREATORS REQUIRED</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>{campaign.creatorsRequired || 1} Creator(s)</span>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>APPLICATION DEADLINE</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)' }}>{formattedDeadline}</span>
          </div>
        </div>

        <Link to={`/campaigns/${campaign._id}`} className="btn btn-primary w-100" style={{ display: 'flex', justifyContent: 'center', fontWeight: 700 }}>
          Apply Now <ExternalLink size={15} style={{ marginLeft: '6px' }} />
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
