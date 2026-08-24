import React from 'react';

const Spinner = ({ size = 'medium', fullPage = false }) => {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px'
  };

  const spinnerContent = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <div
        style={{
          width: sizeMap[size] || sizeMap.medium,
          height: sizeMap[size] || sizeMap.medium,
          border: '3px solid var(--border-color)',
          borderTop: '3px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default Spinner;
