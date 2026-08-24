import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color = 'var(--primary)' }) => {
  return (
    <div className="card glass-panel border-0 shadow-sm" style={{ padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {title}
          </span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
            {value}
          </h3>
        </div>
        {icon && (
          <div style={{
            width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {icon}
          </div>
        )}
      </div>
      {subtitle && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
};

export default StatCard;
