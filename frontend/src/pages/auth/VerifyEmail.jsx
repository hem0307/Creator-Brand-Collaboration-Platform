import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const doVerify = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        setSuccess(res.data.message || 'Email verified successfully!');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Verification link is invalid or has expired.');
      } finally {
        setVerifying(false);
      }
    };
    
    if (token) {
      doVerify();
    }
  }, [token]);

  return (
    <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: '20px 0' }}>
      <div className="auth-header" style={{ marginBottom: '24px' }}>
        <h2 className="auth-title">Email Activation</h2>
      </div>

      {verifying && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <RefreshCw className="animate-float" size={48} style={{ color: 'var(--primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Activating your CreatorSync account...</p>
        </div>
      )}

      {error && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'var(--danger)' }}>
            <AlertTriangle size={56} />
          </div>
          <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '24px', lineHeight: '1.6' }}>
            {error}
          </p>
          <Link to="/register" className="btn btn-outline" style={{ width: '100%', padding: '12px' }}>
            Sign Up Again
          </Link>
        </div>
      )}

      {success && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'var(--success)' }}>
            <CheckCircle size={56} />
          </div>
          <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '24px', lineHeight: '1.6' }}>
            {success}
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            Proceed to Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
