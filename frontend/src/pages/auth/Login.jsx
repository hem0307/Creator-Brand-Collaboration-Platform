import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      return setLocalError('Please fill in all fields');
    }
    
    setLoading(true);
    try {
      const user = await login(email, password, rememberMe);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'brand') {
        navigate('/company/dashboard');
      } else if (user.role === 'creator') {
        navigate('/creator/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    alert(`${provider} sign in is currently in demo mode. Please use email sign in.`);
  };

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
        <h1 className="auth-headline">Sign in to sync up</h1>
        <p className="auth-subtext">Welcome back! Please enter your details.</p>

        {/* Glass Error Alert */}
        {localError && (
          <div className="auth-error-banner animate-fade-in">
            <AlertTriangle size={18} />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="login-email">Email</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                id="login-email"
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
            <label className="auth-input-label" htmlFor="login-password">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 22px 0', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#a1a1aa' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 200ms ease', fontSize: '0.82rem' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--secondary)'}
              onMouseLeave={(e) => e.target.style.color = '#a1a1aa'}
            >
              Forgot password?
            </Link>
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            className="auth-btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : (
              <>
                Sign in
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
          Don't have an account?{' '}
          <Link to="/register" className="auth-footer-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
