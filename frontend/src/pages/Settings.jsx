import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  Settings as SettingsIcon,
  Users,
  Palette,
  Lock,
  Shield,
  Save,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState(user?.language || 'en');
  const [profPublic, setProfPublic] = useState(user?.privacySettings?.profilePublic ?? true);
  const [emailAlert, setEmailAlert] = useState(user?.notificationSettings?.emailAlerts ?? true);
  const [inAppAlert, setInAppAlert] = useState(user?.notificationSettings?.inAppAlerts ?? true);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setLoading(true);
    try {
      const payload = {
        name: profileName,
        profileImage,
        language: lang,
        themePreference: theme,
        privacySettings: { profilePublic: profPublic },
        notificationSettings: { emailAlerts: emailAlert, inAppAlerts: inAppAlert }
      };

      if (password) {
        payload.password = password;
      }

      await updateProfile(payload);
      setSuccess(true);
      setPassword('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const doubleCheck = window.confirm(
      'WARNING: Deleting your account will suspend your campaigns, erase your settings profiles, and delete all workspaces records. Proceed?'
    );
    if (!doubleCheck) return;

    try {
      await api.delete('/users/profile');
      logout();
    } catch (err) {
      console.warn('Failed to delete account:', err.message);
      setError('Failed to delete account.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in-up">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Account Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your profile settings, safety preferences, and notifications</p>
      </div>

      {success && (
        <div style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <CheckCircle2 size={18} />
          <span>Preferences and settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--danger)', background: 'var(--danger-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(var(--danger-rgb), 0.2)' }}>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon size={22} style={{ color: 'var(--primary)' }} />
          Account & Security Parameters
        </h3>

        <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Left Block: Profile Info */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16} /> Basic Profile</h4>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar image link</label>
              <input type="text" className="form-input" value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          {/* Right Block: Preferences */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Palette size={16} /> Preferences</h4>
            <div className="form-group">
              <label className="form-label">System Language</label>
              <select className="form-select form-input" value={lang} onChange={(e) => setLang(e.target.value)}>
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </div>

          </div>
        </div>

        <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          {/* Security & Password */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={16} /> Password & Security</h4>
            <div className="form-group">
              <label className="form-label">Change Password (Leave blank to preserve)</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password (Min 6 chars)" />
            </div>
          </div>

          {/* Privacy & Alerts */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={16} /> Privacy & Alerts</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={profPublic} onChange={(e) => setProfPublic(e.target.checked)} />
                Public Portfolio Visibility
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={emailAlert} onChange={(e) => setEmailAlert(e.target.checked)} />
                Simulated Email Alerts
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={inAppAlert} onChange={(e) => setInAppAlert(e.target.checked)} />
                In-App Dashboard Alerts
              </label>
            </div>
          </div>
        </div>

        {/* Action buttons & Danger Zone */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={18} />
            {loading ? 'Saving Changes...' : 'Save Settings Changes'}
          </button>

          <button type="button" onClick={handleDeleteAccount} className="btn" style={{ background: 'var(--danger-glow)', color: 'var(--danger)', border: '1px solid rgba(var(--danger-rgb), 0.2)' }}>
            Delete Account Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
