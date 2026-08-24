import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Mail, ArrowRight, AlertTriangle, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');
    if (!email) {
      return setLocalError('Please enter your email address');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(res.data.message || 'Recovery link sent! Please check your email inbox.');
      setEmail('');
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message || 'Failed to request password recovery.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card animate-fade-in-up">
        {/* Wordmark Logo */}
        <div className="auth-card-logo">
          <div className="auth-card-logo-icon">
            <Sparkles size={16} />
          </div>
          <span>CreatorSync</span>
        </div>

        {/* Headline & Subtext */}
        <h1 className="auth-headline">Reset password</h1>
        <p className="auth-subtext">Enter your email and we'll send you a password recovery link.</p>

        {/* Glass Error Alert */}
        {localError && (
          <div className="auth-error-banner animate-fade-in">
            <AlertTriangle size={18} />
            <span>{localError}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="auth-error-banner animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.25)', color: '#10b981' }}>
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="forgot-email">Email address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@creatorsync.com"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              style={{ marginTop: '12px' }}
              disabled={loading}
            >
              {loading ? 'Sending link...' : (
                <>
                  Request recovery link
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.88rem',
              color: '#a1a1aa',
              textDecoration: 'none',
              transition: 'color 200ms ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#ffffff'}
            onMouseLeave={(e) => e.target.style.color = '#a1a1aa'}
          >
            <ArrowLeft size={16} />
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
