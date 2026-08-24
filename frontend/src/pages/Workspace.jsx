import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CheckCircle, Clock, Link as LinkIcon, MessageSquare, Send, ShieldAlert, Star, ArrowLeft, Building, Eye, Briefcase } from 'lucide-react';

const Workspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitNotes, setSubmitNotes] = useState('');
  const [submittingId, setSubmittingId] = useState(null); // stores milestone ID being submitted
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Review states
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submitReviewError, setSubmitReviewError] = useState(null);

  const fetchWorkspace = async () => {
    try {
      const { data } = await api.get(`/workspaces/${id}`);
      setWorkspace(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    
    // Set up polling for messages every 5 seconds
    const interval = setInterval(() => {
      fetchWorkspace();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const { data } = await api.post(`/workspaces/${id}/messages`, { text: message });
      setWorkspace(prev => ({ ...prev, messages: data }));
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err.message);
    }
  };

  const handleSubmitMilestone = async (e) => {
    e.preventDefault();
    if (!submitUrl) return;
    setActionLoading(true);

    try {
      const { data } = await api.post(`/workspaces/${id}/milestones`, {
        milestoneId: submittingId,
        submissionUrl: submitUrl,
        submissionNotes: submitNotes
      });
      setWorkspace(data);
      setSubmitUrl('');
      setSubmitNotes('');
      setSubmittingId(null);
    } catch (err) {
      console.error('Milestone submission failed:', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveMilestone = async (mId) => {
    try {
      const { data } = await api.patch(`/workspaces/${id}/milestones/${mId}`);
      setWorkspace(data);
    } catch (err) {
      console.error('Milestone approval failed:', err.message);
    }
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    setSubmitReviewError(null);
    try {
      await api.post('/reviews', {
        projectId: workspace.projectId?._id || workspace.projectId,
        revieweeId: partner._id,
        rating: feedbackRating,
        comment: feedbackComment
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      setSubmitReviewError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 40px' }}>
        <div style={{
          width: '48px', height: '48px', border: '4px solid var(--border-color)',
          borderTopColor: 'var(--primary)', borderRadius: '50%',
          margin: '0 auto 20px', animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>Loading collaboration workspace...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div style={{
        padding: '60px 40px', textAlign: 'center', maxWidth: '600px', margin: '60px auto',
        borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)',
        boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
      }}>
        <ShieldAlert size={48} style={{ color: '#b91c1c', display: 'block', margin: '0 auto 16px' }} />
        <h3 style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Workspace Access Error</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.95rem' }}>{error || 'Workspace could not be fetched.'}</p>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '10px', marginTop: '20px',
            fontSize: '0.9rem', fontWeight: 800, background: '#f1f5f9',
            color: '#475569', border: '1.5px solid var(--border-color)', textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const partner = user.role === 'creator' ? workspace.brandId : workspace.creatorId;
  const totalMilestones = workspace.milestones?.length || 0;
  const approvedMilestones = workspace.milestones?.filter(m => m.status === 'approved').length || 0;
  const progressPct = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', gradient: 'linear-gradient(90deg, #047857, #10b981, #34d399)' };
      case 'completed': return { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd', gradient: 'linear-gradient(90deg, #0369a1, #38bdf8)' };
      case 'paused': return { bg: '#fffbeb', color: '#b45309', border: '#fde68a', gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)' };
      default: return { bg: '#f1f5f9', color: '#475569', border: 'var(--border-color)', gradient: 'linear-gradient(90deg, var(--text-muted), #94a3b8)' };
    }
  };

  const statusColors = getStatusColor(workspace.status);

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '12px', marginBottom: '28px',
          fontSize: '0.9rem', fontWeight: 800, background: '#ffffff',
          color: 'var(--primary)', border: '1.5px solid #bfdbfe', cursor: 'pointer',
          transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(var(--text-primary-rgb), 0.04)'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f5e9e6'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(var(--primary-rgb), 0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(var(--text-primary-rgb), 0.04)'; }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Workspace Header Card */}
      <div style={{
        padding: '0', overflow: 'hidden', borderRadius: '20px',
        background: '#ffffff', border: '1.5px solid var(--border-color)',
        boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)', marginBottom: '28px'
      }}>
        {/* Status Color Top Bar */}
        <div style={{ height: '5px', background: statusColors.gradient }} />

        <div style={{ padding: '28px 32px' }}>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
              {/* Partner Avatar */}
              <div style={{
                width: '60px', height: '60px', borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0,
                boxShadow: '0 4px 14px rgba(var(--primary-rgb), 0.2)'
              }}>
                {partner?.profileImage
                  ? <img src={partner.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} alt="" />
                  : (partner?.name ? partner.name.substring(0, 2).toUpperCase() : 'CS')
                }
              </div>
              <div>
                <span style={{
                  padding: '5px 14px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 900,
                  background: statusColors.bg, color: statusColors.color,
                  border: `1.5px solid ${statusColors.border}`,
                  textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '6px'
                }}>
                  {workspace.status === 'active' ? '🟢' : workspace.status === 'completed' ? '🏆' : '⏸️'} {workspace.status}
                </span>
                <h1 style={{
                  fontSize: '1.65rem', fontWeight: 900, margin: '8px 0 6px 0',
                  color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)", lineHeight: '1.3'
                }}>
                  {workspace.projectId?.title || 'Project Workspace'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={15} /> Partner: <strong style={{ color: 'var(--text-primary)' }}>{partner?.name}</strong>
                  <span style={{
                    padding: '2px 10px', background: '#f1f5f9', borderRadius: '9999px',
                    fontSize: '0.72rem', fontWeight: 800, color: '#475569', border: '1px solid var(--border-color)',
                    textTransform: 'capitalize'
                  }}>{partner?.role}</span>
                </p>
              </div>
            </div>

            {/* Progress Circle */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: `conic-gradient(var(--primary) ${progressPct * 3.6}deg, var(--border-color) ${progressPct * 3.6}deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px'
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', background: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1rem', color: 'var(--primary)'
                }}>
                  {progressPct}%
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>
                {approvedMilestones}/{totalMilestones} Done
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Feedback Panel (when completed) */}
      {workspace.status === 'completed' && (
        <div style={{
          padding: '0', overflow: 'hidden', borderRadius: '20px',
          background: '#ffffff', border: '1.5px solid var(--border-color)',
          boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)', marginBottom: '28px'
        }}>
          <div style={{ height: '5px', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
          <div style={{ padding: '28px 32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '16px', color: 'var(--text-primary)' }}>
              🎉 Collaboration Completed!
            </h3>
            {feedbackSubmitted ? (
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle size={24} style={{ color: '#047857' }} />
                <p style={{ color: '#047857', fontWeight: 800, margin: 0, fontSize: '0.95rem' }}>Thank you! Your feedback review has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} style={{ maxWidth: '600px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                  Leave a feedback review for your partner: <strong style={{ color: 'var(--text-primary)' }}>{partner?.name}</strong>
                </p>
                
                {submitReviewError && (
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
                    <p style={{ color: '#b91c1c', fontSize: '0.88rem', margin: 0, fontWeight: 700 }}>{submitReviewError}</p>
                  </div>
                )}
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Rating Score (1-5 Stars)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                          transition: 'transform 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Star
                          size={32}
                          style={{
                            fill: star <= feedbackRating ? '#f59e0b' : 'none',
                            stroke: star <= feedbackRating ? '#f59e0b' : '#94a3b8',
                            transition: 'fill 0.2s ease'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Review Comment
                  </label>
                  <textarea
                    className="form-input"
                    placeholder="Share details of your experience working together..."
                    rows="3"
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    required
                    style={{ padding: '14px 18px', fontSize: '0.92rem', borderRadius: '12px', border: '1.5px solid var(--border-color)' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem' }}
                >
                  ⭐ Submit Collaboration Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Milestones + Chat */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '28px', alignItems: 'start' }}>

        {/* Left: Milestones */}
        <div>
          <h2 style={{
            fontSize: '1.25rem', fontWeight: 900, marginBottom: '20px',
            color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)",
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <Briefcase size={20} style={{ color: 'var(--primary)' }} /> Campaign Milestones
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {workspace.milestones.map((m) => {
              const getMilestoneStyle = (status) => {
                if (status === 'approved') return { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857', icon: '✅', label: 'Approved' };
                if (status === 'submitted') return { bg: '#fffbeb', border: '#fde68a', color: '#b45309', icon: '⏳', label: 'Submitted' };
                return { bg: 'var(--bg-tertiary)', border: 'var(--border-color)', color: 'var(--text-muted)', icon: '📌', label: 'Pending' };
              };
              const mStyle = getMilestoneStyle(m.status);

              return (
                <div
                  key={m._id}
                  style={{
                    padding: '0', overflow: 'hidden', borderRadius: '16px',
                    background: '#ffffff', border: `1.5px solid ${mStyle.border}`,
                    boxShadow: '0 2px 12px rgba(var(--text-primary-rgb), 0.04)',
                    transition: 'box-shadow 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(var(--text-primary-rgb), 0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(var(--text-primary-rgb), 0.04)'}
                >
                  {/* Milestone Top Accent */}
                  <div style={{ height: '4px', background: m.status === 'approved' ? 'linear-gradient(90deg, #047857, #10b981)' : m.status === 'submitted' ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #94a3b8, #cbd5e1)' }} />

                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.05rem', margin: 0 }}>{m.title}</h4>
                      <span style={{
                        padding: '4px 14px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 900,
                        background: mStyle.bg, color: mStyle.color,
                        border: `1px solid ${mStyle.border}`, display: 'inline-flex', alignItems: 'center', gap: '5px'
                      }}>
                        {mStyle.icon} {mStyle.label}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>{m.description}</p>

                    {/* Submission output details */}
                    {m.status === 'submitted' && (
                      <div style={{
                        background: '#fffbeb', padding: '14px 18px', borderRadius: '12px',
                        marginBottom: '14px', fontSize: '0.88rem', border: '1.5px solid #fde68a'
                      }}>
                        <span style={{ color: '#92400e', display: 'block', fontWeight: 800, marginBottom: '6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          🔗 Submission Link:
                        </span>
                        <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" style={{
                          color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px',
                          fontWeight: 700, textDecoration: 'none', wordBreak: 'break-all'
                        }}>
                          <LinkIcon size={14} />
                          {m.submissionUrl}
                        </a>
                        {m.submissionNotes && (
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #fde68a' }}>
                            <span style={{ color: '#92400e', display: 'block', fontWeight: 800, marginBottom: '4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>📝 Notes:</span>
                            <p style={{ color: '#78350f', margin: 0, fontSize: '0.88rem' }}>{m.submissionNotes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Approve Action (Brand only) */}
                    {m.status === 'submitted' && user.role === 'brand' && (
                      <button
                        onClick={() => handleApproveMilestone(m._id)}
                        className="btn btn-primary"
                        style={{
                          padding: '10px 22px', fontSize: '0.9rem', borderRadius: '10px',
                          fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px'
                        }}
                      >
                        <CheckCircle size={16} /> Approve Deliverable
                      </button>
                    )}

                    {/* Submit Trigger (Creator only) */}
                    {m.status === 'pending' && user.role === 'creator' && submittingId !== m._id && (
                      <button
                        onClick={() => setSubmittingId(m._id)}
                        style={{
                          padding: '8px 18px', fontSize: '0.88rem', borderRadius: '10px',
                          fontWeight: 800, background: '#f5e9e6', color: 'var(--primary)',
                          border: '1.5px solid #bfdbfe', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(var(--primary-rgb), 0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f5e9e6'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        📤 Submit Proof of Work
                      </button>
                    )}

                    {/* Submit Form Drawer (Creator only) */}
                    {submittingId === m._id && (
                      <form onSubmit={handleSubmitMilestone} style={{
                        borderTop: '1.5px solid var(--border-color)', paddingTop: '20px', marginTop: '16px'
                      }}>
                        <div style={{ marginBottom: '14px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Deliverable Verification Link (URL)
                          </label>
                          <input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            className="form-input"
                            value={submitUrl}
                            onChange={(e) => setSubmitUrl(e.target.value)}
                            required
                            style={{ padding: '12px 16px', fontSize: '0.92rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', marginBottom: 0 }}
                          />
                        </div>
                        <div style={{ marginBottom: '18px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Notes for Sponsor
                          </label>
                          <textarea
                            placeholder="Provide timestamps or live statistics details..."
                            rows="3"
                            className="form-input"
                            value={submitNotes}
                            onChange={(e) => setSubmitNotes(e.target.value)}
                            style={{ padding: '12px 16px', fontSize: '0.92rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', marginBottom: 0 }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: '10px 22px', fontSize: '0.9rem', borderRadius: '10px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Submitting...' : '🚀 Send Submission'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSubmittingId(null)}
                            style={{
                              padding: '10px 22px', fontSize: '0.9rem', borderRadius: '10px', fontWeight: 800,
                              background: '#fef2f2', color: '#b91c1c', border: '1.5px solid #fecaca',
                              cursor: 'pointer', transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Approved confirmation */}
                    {m.status === 'approved' && (
                      <div style={{
                        background: '#ecfdf5', padding: '12px 16px', borderRadius: '10px',
                        border: '1.5px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '8px'
                      }}>
                        <CheckCircle size={16} style={{ color: '#047857' }} />
                        <span style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 700 }}>
                          Deliverable approved — budget escrow locked for payout.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Message Board / Workspace Chat */}
        <div style={{
          borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)',
          boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
          display: 'flex', flexDirection: 'column', height: '620px', overflow: 'hidden',
          position: 'sticky', top: '100px'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '20px 24px', borderBottom: '1.5px solid var(--border-color)',
            display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-tertiary)'
          }}>
            <MessageSquare size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>Workspace Activity</h3>
            <span style={{
              marginLeft: 'auto', padding: '3px 10px', background: '#f5e9e6',
              border: '1px solid #bfdbfe', borderRadius: '9999px',
              fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)'
            }}>
              {workspace.messages.length} msg{workspace.messages.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Messages Feed list */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {workspace.messages.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <MessageSquare size={40} style={{ color: '#cbd5e1', display: 'block', margin: '0 auto 12px' }} />
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontStyle: 'italic' }}>
                  No messages yet. Send a greeting to start collaborating! 👋
                </p>
              </div>
            ) : (
              workspace.messages.map((msg, i) => {
                const isMe = msg.senderId === user._id;
                return (
                  <div key={i} style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: isMe ? '#f5e9e6' : '#ffffff',
                    border: isMe ? '1.5px solid #bfdbfe' : '1.5px solid var(--border-color)',
                    padding: '12px 18px',
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    boxShadow: '0 1px 4px rgba(var(--text-primary-rgb), 0.04)'
                  }}>
                    <span style={{
                      fontSize: '0.72rem', color: isMe ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: 800, display: 'block', marginBottom: '4px'
                    }}>
                      {isMe ? 'You' : partner?.name}
                    </span>
                    <p style={{ fontSize: '0.92rem', lineHeight: '1.5', wordBreak: 'break-word', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{msg.text}</p>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', textAlign: 'right' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} style={{
            padding: '16px 20px', borderTop: '1.5px solid var(--border-color)',
            display: 'flex', gap: '10px', background: 'var(--bg-tertiary)'
          }}>
            <input
              type="text"
              placeholder="Send message or link..."
              className="form-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ fontSize: '0.92rem', padding: '12px 18px', marginBottom: 0, borderRadius: '12px', border: '1.5px solid var(--border-color)', flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px 16px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
