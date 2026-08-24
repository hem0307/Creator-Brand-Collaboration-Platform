import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Bookmark, BookmarkCheck, Plus, MapPin } from 'lucide-react';

const CreatorCard = ({ creator, isSaved, onSave, onInvite, isBrandUser }) => {
  const u = creator.userId || {};
  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'CS';
  const formatNumber = (n) => {
    if (!n) return 'N/A';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  return (
    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '80px', background: 'var(--primary-gradient)' }}>
        <div style={{
          position: 'absolute', bottom: '-28px', left: '20px',
          width: '56px', height: '56px', borderRadius: '50%',
          border: '3px solid var(--bg-primary)',
          background: 'var(--bg-secondary)',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff'
        }}>
          {u.profileImage ? <img src={u.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : getInitials(u.name)}
        </div>
      </div>

      <div style={{ padding: '36px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h5 style={{ fontWeight: 800, fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>{u.name || 'Creator'}</h5>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{creator.category || 'Content Creator'}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>{formatNumber(creator.followersCount)}</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Followers</div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--success)' }}>{creator.avgEngagement ? `${creator.avgEngagement}%` : 'N/A'}</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Engagement</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#d63384' }}>{creator.completedCampaigns || 0}</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Done</div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to={`/creators/${u._id}`} className="btn btn-primary w-100" style={{ fontSize: '0.83rem', padding: '9px' }}>
            <Eye size={14} style={{ marginRight: '6px' }} /> View Profile
          </Link>

          {isBrandUser && (
            <div className="d-flex gap-2">
              {onInvite && (
                <button onClick={() => onInvite(u)} className="btn btn-outline" style={{ flex: 1, fontSize: '0.78rem', padding: '7px' }}>
                  <Plus size={13} /> Invite
                </button>
              )}
              {onSave && (
                <button onClick={() => onSave(u._id)} className="btn btn-outline" style={{ flex: 1, fontSize: '0.78rem', padding: '7px' }}>
                  {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
