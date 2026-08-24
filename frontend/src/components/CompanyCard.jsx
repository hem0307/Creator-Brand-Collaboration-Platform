import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const CompanyCard = ({ brand }) => {
  const u = brand.userId || {};
  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'CS';

  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '240px' }}>
      <div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'var(--secondary-glow)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            {u.profileImage ? <img src={u.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : getInitials(brand.companyName)}
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)' }}>{brand.companyName}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{brand.industry}</span>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.5', marginBottom: '16px' }}>
          {brand.description || 'Verified brand on CreatorSync.'}
        </p>
      </div>
      <Link to={`/brands/${u._id}`} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', fontSize: '0.8rem' }}>
        View Brand <ExternalLink size={14} style={{ marginLeft: '4px' }} />
      </Link>
    </div>
  );
};

export default CompanyCard;
