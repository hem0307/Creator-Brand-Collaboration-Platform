import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      background: 'var(--success-glow)',
      color: 'var(--success)',
      border: '1px solid rgba(0, 229, 160, 0.2)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '20px',
      fontSize: '0.88rem',
      fontWeight: 600
    }}>
      <CheckCircle size={18} />
      <span>{message}</span>
    </div>
  );
};

export default SuccessAlert;
