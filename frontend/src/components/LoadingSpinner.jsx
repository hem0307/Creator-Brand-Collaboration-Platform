import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px' }}>
      <div className="spinner-border" style={{ width: '36px', height: '36px', borderWidth: '3px', color: 'var(--primary)' }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
