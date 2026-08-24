import React from 'react';

const AnalyticsCard = ({ title, children, action }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '38px 42px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1.5px solid var(--border-color)',
        boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ marginBottom: '28px' }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{title}</h4>
        {action}
      </div>
      <div style={{ marginTop: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export default AnalyticsCard;
