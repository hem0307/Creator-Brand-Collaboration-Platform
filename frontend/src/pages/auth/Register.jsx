import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, ArrowRight, ArrowLeft, AlertTriangle, Sparkles, Briefcase, CheckCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('creator');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!name || !email || !password || !confirmPassword) {
      return setLocalError('Please fill in all required fields');
    }

    if (password !== confirmPassword) {
      return setLocalError('Passwords do not match');
    }

    if (password.length < 6) {
      return setLocalError('Password must be at least 6 characters long');
    }

    if (!agreeTerms) {
      return setLocalError('Please accept the Terms of Service & Privacy Policy');
    }

    setLoading(true);
    try {
      const res = await register(name, email, password, role);
      setSuccessMessage(res.message || 'Registration successful! Please check your email inbox to verify your account.');
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    alert(`${provider} sign up is currently in demo mode. Please use the registration form.`);
  };

  if (successMessage) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-card animate-fade-in-up" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: '#10b981' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <CheckCircle size={36} />
            </div>
          </div>
          <h2 className="auth-headline" style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Check Your Email</h2>
          <p className="auth-subtext" style={{ marginBottom: '28px', lineHeight: '1.6' }}>
            {successMessage}
          </p>
          <Link to="/login" className="auth-btn-primary" style={{ textDecoration: 'none' }}>
            Proceed to Sign In
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card animate-fade-in-up">
        {/* Back to Home Navigation Button */}
        <div style={{ marginBottom: '16px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#a1a1aa',
              textDecoration: 'none',
              transition: 'color 200ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Understated Wordmark Logo */}
        <div className="auth-card-logo">
          <div className="auth-card-logo-icon">
            <Sparkles size={16} />
          </div>
          <span>CreatorSync</span>
        </div>

        {/* Headline & Subtitle */}
        <h1 className="auth-headline">Join the sync</h1>
        <p className="auth-subtext">Create your account to get started with CreatorSync.</p>

        {/* Glass Error Alert */}
        {localError && (
          <div className="auth-error-banner animate-fade-in">
            <AlertTriangle size={18} />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Toggle Tabs */}
          <div className="auth-role-tabs">
            <button
              type="button"
              className={`auth-role-tab ${role === 'creator' ? 'active' : ''}`}
              onClick={() => setRole('creator')}
            >
              <Sparkles size={16} />
              Creator
            </button>
            <button
              type="button"
              className={`auth-role-tab ${role === 'brand' ? 'active' : ''}`}
              onClick={() => setRole('brand')}
            >
              <Briefcase size={16} />
              Brand
            </button>
          </div>

          {/* Full Name Field */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="register-name">Full name</label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input
                id="register-name"
                type="text"
                placeholder="Alex Rivers"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="register-email">Email address</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                id="register-email"
                type="email"
                placeholder="you@creatorsync.com"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="register-password">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="register-password"
                type="password"
                placeholder="•••••••• (min. 6 characters)"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="register-confirm">Confirm password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="register-confirm"
                type="password"
                placeholder="••••••••"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div style={{ margin: '14px 0 22px 0', fontSize: '0.82rem', color: '#a1a1aa' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', lineHeight: '1.4' }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  flexShrink: 0
                }}
                required
              />
              <span>
                I agree to the <a href="/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Terms of Service</a> & <a href="/" style={{ color: 'var(--secondary)', textDecoration: 'underline' }}>Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            className="auth-btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : (
              <>
                Create account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-text">or continue with</span>
        </div>

        {/* Outlined Social Login Buttons */}
        <div className="auth-social-grid">
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => handleSocialAuth('Google')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#ea4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z" />
              <path fill="#4285f4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#fbbc05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.3C.6 9.3 0 11.6 0 14s.6 4.7 1.6 6.7l3.7-2.9z" />
              <path fill="#34a853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
            </svg>
            Google
          </button>

          <button
            type="button"
            className="auth-social-btn"
            onClick={() => handleSocialAuth('GitHub')}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Footer Navigation Link */}
        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-footer-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
