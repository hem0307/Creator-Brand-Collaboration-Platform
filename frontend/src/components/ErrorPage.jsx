import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const ErrorPage = ({ title = 'Page Not Found', message = 'The requested resource could not be loaded.' }) => {
  return (
    <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
      <AlertCircle size={48} style={{ color: 'var(--danger)', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
      <h3 style={{ fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{message}</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
};

export default ErrorPage;
