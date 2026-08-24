import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Send, ShieldAlert, UserCheck } from 'lucide-react';

const CampaignDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [hasApplied, setHasApplied] = useState(null);
  const [pitch, setPitch] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ success: '', error: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const campRes = await api.get(`/campaigns/${id}`);
      setCampaign(campRes.data);

      if (user?.role === 'creator') {
        const appsRes = await api.get('/applications/me');
        const match = (appsRes.data || []).find(a => a.campaignId?._id === id);
        if (match) setHasApplied(match);
      } else if (user?.role === 'brand' && campRes.data.brandId?._id === user._id) {
        const appsRes = await api.get(`/campaigns/${id}/applications`);
        setApplicants(appsRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching campaign details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setFeedback({ success: '', error: '' });
    setActionLoading(true);

    try {
      const { data } = await api.post('/applications', {
        projectId: id,
        campaignId: id,
        pitch,
        proposedRate: Number(proposedRate)
      });
      setFeedback({ success: 'Proposal submitted successfully!', error: '' });
      setHasApplied(data);
      setPitch('');
      setProposedRate('');
      fetchData();
    } catch (err) {
      setFeedback({ success: '', error: err.response?.data?.message || 'Failed to submit proposal.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setFeedback({ success: '', error: '' });
    try {
      await api.put(`/applications/${appId}`, { status: newStatus });
      setFeedback({ success: `Applicant status updated to '${newStatus}'!`, error: '' });
      fetchData();
    } catch (err) {
      setFeedback({ success: '', error: err.response?.data?.message || 'Failed to update applicant status.' });
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading campaign details...</div>;
  }

  if (!campaign) {
    return (
      <div className="glass-panel animate-fade-in-up" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <ShieldAlert size={40} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
        <h3>Campaign brief not found</h3>
        <Link to="/campaigns" className="btn btn-outline" style={{ marginTop: '16px' }}>Back to Campaigns</Link>
      </div>
    );
  }

  const isOwner = user?.role === 'brand' && campaign.brandId?._id === user._id;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '24px', padding: '8px 16px' }}>
        <ArrowLeft size={16} />
        Back
      </button>

      {feedback.success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--success-glow)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          <CheckCircle size={18} />
          <span>{feedback.success}</span>
        </div>
      )}

      {feedback.error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--danger-glow)', color: 'var(--danger)', border: '1px solid rgba(var(--danger-rgb), 0.2)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          <AlertCircle size={18} />
          <span>{feedback.error}</span>
        </div>
      )}

      <div className="grid-container" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'start' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>Brief specifications</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Posted by {campaign.brandId?.name || 'Company'}</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>{campaign.title}</h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {campaign.niche?.map((n, i) => (
              <span key={i} className="badge badge-primary">{n}</span>
            ))}
            {campaign.targetPlatforms?.map((p, i) => (
              <span key={i} className="badge badge-approved" style={{ textTransform: 'uppercase' }}>{p}</span>
            ))}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Campaign Description</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '32px', whiteSpace: 'pre-wrap' }}>
            {campaign.description}
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Required Deliverables</h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            {campaign.deliverables?.map((deliv, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{deliv}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Allocated Budget</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
              ${campaign.budget?.min?.toLocaleString()} - ${campaign.budget?.max?.toLocaleString()}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Currency: {campaign.budget?.currency || 'USD'}</p>
          </div>

          {user?.role === 'creator' && (
            hasApplied ? (
              <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-focus)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary)' }}>
                  <Clock size={20} />
                  <span style={{ fontWeight: 700 }}>Proposal Submitted</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  You submitted a rate proposal of <strong>${hasApplied.proposedRate}</strong> for this brief.
                </p>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
                  <span className={`badge badge-${hasApplied.status}`} style={{ fontSize: '0.8rem' }}>{hasApplied.status}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Apply for Sponsorship</h3>
                
                <div className="form-group">
                  <label className="form-label">Proposed rate ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    className="form-input"
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Application Pitch / Why you?</label>
                  <textarea
                    placeholder="Describe how your audience aligns with this brief and details of your channels..."
                    rows="5"
                    className="form-input"
                    style={{ resize: 'vertical' }}
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={actionLoading}>
                  <Send size={16} />
                  {actionLoading ? 'Submitting proposal...' : 'Submit Pitch Proposal'}
                </button>
              </form>
            )
          )}

          {isOwner && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                Applicants ({applicants.length})
              </h3>
              {applicants.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                  No creators have applied to this brief yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {applicants.map((app) => (
                    <div key={app._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div className="dashboard-avatar" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>
                          {app.creatorId?.name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block' }}>{app.creatorId?.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Creator Rate: ${app.proposedRate}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                        {app.pitch}
                      </p>

                      {app.status === 'approved' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                          <UserCheck size={16} />
                          Active Workspace Formed
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'approved')}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'rejected')}
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
