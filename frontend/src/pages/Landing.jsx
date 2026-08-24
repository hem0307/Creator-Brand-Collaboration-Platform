import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, Zap, Target, ShieldCheck, TrendingUp, Users, CheckCircle2, ArrowUpRight, Award, Youtube, Instagram, Star, Shield, Building2, Flame } from 'lucide-react';

const Landing = () => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px', background: '#ffffff', color: 'var(--text-primary)' }}>
      
      {/* ═══════════════════════════════════════════════
         HERO SECTION — Cobalt Blue & Deep Navy Palette
         ═══════════════════════════════════════════════ */}
      <section style={{
        textAlign: 'center',
        padding: '80px 20px 50px 20px',
        maxWidth: '1150px',
        margin: '0 auto',
        position: 'relative'
      }}>

        {/* Top Announcement Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 20px',
          borderRadius: '9999px',
          background: '#f5e9e6',
          border: '1.5px solid var(--primary)',
          color: 'var(--primary)',
          fontWeight: 800,
          fontSize: '0.88rem',
          marginBottom: '28px',
          boxShadow: '0 2px 8px rgba(var(--primary-rgb), 0.1)'
        }}>
          <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
          CreatorSync India — Live Collaboration Network
        </div>
        
        {/* Hero Title */}
        <h1 style={{
          fontSize: '4.2rem',
          fontWeight: 900,
          lineHeight: '1.1',
          letterSpacing: '-0.035em',
          marginBottom: '24px',
          color: 'var(--text-primary)',
          fontFamily: "'Playfair Display', var(--font-sans)"
        }}>
          India's Premier <br />
          <span style={{ color: 'var(--primary)' }}>Creator</span> & <span style={{ color: 'var(--secondary)' }}>Brand</span> Ecosystem.
        </h1>
        
        {/* Hero Subtitle */}
        <p style={{
          fontSize: '1.25rem',
          color: '#475569',
          lineHeight: '1.65',
          maxWidth: '740px',
          margin: '0 auto 44px auto',
          fontWeight: 500
        }}>
          Connect with top Indian creators like Technical Guruji & CarryMinati. Negotiate campaign briefs, track milestones in real-time, and process 100% secure escrow payments.
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '68px' }}>
          <Link to="/register" style={{
            background: 'var(--primary)',
            color: '#ffffff',
            padding: '15px 36px',
            fontSize: '1.05rem',
            fontWeight: 700,
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(var(--primary-rgb), 0.25)',
            transition: 'transform 0.2s ease'
          }}>
            Join CreatorSync Free
            <ChevronRight size={20} />
          </Link>

          <Link to="/discover" style={{
            background: '#ffffff',
            color: 'var(--primary)',
            padding: '15px 32px',
            fontSize: '1.05rem',
            fontWeight: 700,
            borderRadius: '8px',
            border: '2px solid var(--primary)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s ease'
          }}>
            Browse Active Briefs
          </Link>
        </div>

        {/* Live Workspace Preview Card */}
        <div style={{
          padding: '32px',
          borderRadius: '20px',
          maxWidth: '1000px',
          margin: '0 auto',
          border: '2px solid var(--border-color)',
          background: '#ffffff',
          boxShadow: '0 12px 36px rgba(var(--text-primary-rgb), 0.08)'
        }}>
          {/* Mock Window Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger)' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--warning)' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--secondary)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '12px', fontWeight: 600 }}>creatorsync.in/live-workspace/boat-lifestyle</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-approved" style={{ fontSize: '0.78rem', padding: '5px 14px', background: '#f5e9e6', border: '1px solid #bfdbfe', color: 'var(--primary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', display: 'inline-block', marginRight: '8px' }} />
                Live Sync Connected
              </span>
            </div>
          </div>

          {/* Real Indian Demo Workspace Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
            
            {/* Card 1: boAt & Technical Guruji */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '22px',
              borderRadius: '14px',
              border: '1.5px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>boAt Campaign Brief</span>
                <span style={{ fontSize: '0.92rem', color: 'var(--secondary)', fontWeight: 900, fontFamily: "'Playfair Display', var(--font-sans)" }}>₹4,50,000</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>boAt Airdopes 500 ANC Launch</h4>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '16px' }}>4K Review & Delhi Metro ANC Test</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400" alt="Technical Guruji" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 800 }}>Technical Guruji</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>23.5M YouTube Subscribers</div>
                </div>
              </div>
            </div>

            {/* Card 2: CRED & CarryMinati */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '22px',
              borderRadius: '14px',
              border: '1.5px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CRED Pay Brief</span>
                <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>Approved</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>Comedy Sketch Commercial</h4>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Milestone 2 of 3 • Script Approved</p>
              <div style={{ background: '#f5e9e6', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 14px', fontSize: '0.83rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <CheckCircle2 size={16} style={{ color: 'var(--secondary)' }} />
                ₹6,00,000 Escrow Protected
              </div>
            </div>

            {/* Card 3: Reach Analytics */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '22px',
              borderRadius: '14px',
              border: '1.5px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Reach</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--secondary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> +38.5%
                </span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>45M+ Monthly Views</h4>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Avg. 8.8% Engagement Rate across India</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ height: '6px', flex: 1, background: 'var(--primary)', borderRadius: '4px' }} />
                <div style={{ height: '6px', flex: 1, background: 'var(--secondary-hover)', borderRadius: '4px' }} />
                <div style={{ height: '6px', flex: 1, background: 'var(--secondary)', borderRadius: '4px' }} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         FEATURED INDIAN CREATORS SHOWCASE
         ═══════════════════════════════════════════════ */}
      <section style={{ maxWidth: '1150px', margin: '70px auto 0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: '#f5e9e6',
            border: '1px solid #bfdbfe',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '14px'
          }}>
            <Flame size={14} style={{ color: 'var(--secondary)' }} />
            Featured Indian Creators
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Collaborate with India's Top <span style={{ color: 'var(--primary)' }}>Creators</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          
          {/* Creator 1: Technical Guruji */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1.5px solid var(--border-color)', boxShadow: '0 4px 14px rgba(var(--text-primary-rgb), 0.05)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', padding: '2px' }}>
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400" alt="Technical Guruji" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Gaurav Chaudhary</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>Technical Guruji</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '18px' }}>
              India's largest tech reviewer testing smartphones, ANC audio gear, & smart wearables in Hindi.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                <Youtube size={14} style={{ marginRight: '6px' }} /> 23.5M Subs
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>Tech & Electronics</span>
            </div>
          </div>

          {/* Creator 2: CarryMinati */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1.5px solid var(--border-color)', boxShadow: '0 4px 14px rgba(var(--text-primary-rgb), 0.05)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--secondary)', padding: '2px' }}>
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400" alt="CarryMinati" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Ajey Nagar</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 700 }}>CarryMinati</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '18px' }}>
              India's premier gaming & roast comedy creator shaping youth pop culture & viral campaigns.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <span className="badge badge-shortlisted" style={{ fontSize: '0.75rem' }}>
                <Youtube size={14} style={{ marginRight: '6px' }} /> 41.2M Subs
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 700 }}>Gaming & Comedy</span>
            </div>
          </div>

          {/* Creator 3: BB Ki Vines */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1.5px solid var(--border-color)', boxShadow: '0 4px 14px rgba(var(--text-primary-rgb), 0.05)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', padding: '2px' }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" alt="BB Ki Vines" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Bhuvan Bam</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>BB Ki Vines</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '18px' }}>
              Pioneer Indian digital comedy artist, actor, singer & original character storyteller.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                <Youtube size={14} style={{ marginRight: '6px' }} /> 26.4M Subs
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--warning)', fontWeight: 700 }}>Comedy & Acting</span>
            </div>
          </div>

          {/* Creator 4: Tech Burner */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1.5px solid var(--border-color)', boxShadow: '0 4px 14px rgba(var(--text-primary-rgb), 0.05)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--secondary)', padding: '2px' }}>
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" alt="Tech Burner" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Shlok Srivastava</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 700 }}>Tech Burner</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '18px' }}>
              Fun, high-energy tech experiments, teardowns & gadget reviews making tech entertaining.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                <Youtube size={14} style={{ marginRight: '6px' }} /> 11.4M Subs
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>Tech & Innovation</span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         HOW CREATORSYNC WORKS — first-time visitor explainer
         ═══════════════════════════════════════════════ */}
      <section style={{ maxWidth: '1150px', margin: '70px auto 0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px',
            borderRadius: '9999px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 800, marginBottom: '14px'
          }}>
            <Zap size={14} style={{ color: 'var(--secondary)' }} />
            New here? Start in 3 steps
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            How CreatorSync Works
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '560px', margin: '10px auto 0 auto' }}>
            One platform, two sides of the same collaboration — pick the path that's you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>

          {/* Creator path */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid var(--border-color)', padding: '32px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={22} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>I'm a Creator</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Get discovered & paid</h3>
              </div>
            </div>
            {[
              { n: '1', t: 'Build your profile', d: 'Add your niche, platforms, follower count & portfolio so brands know exactly what you offer.' },
              { n: '2', t: 'Apply to campaign briefs', d: "Browse briefs in Discover — each one shows your Match Score so you know what's worth applying to." },
              { n: '3', t: 'Deliver & get paid', d: 'Collaborate in the shared workspace, hit your milestones, and collect payment plus a review.' }
            ].map(step => (
              <div key={step.n} style={{ display: 'flex', gap: '14px', marginBottom: '18px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, flexShrink: 0 }}>{step.n}</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 3px 0' }}>{step.t}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{step.d}</p>
                </div>
              </div>
            ))}
            <Link to="/register" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', borderRadius: '10px', fontWeight: 800, fontSize: '0.88rem', marginTop: '6px' }}>
              Join as a Creator <ChevronRight size={15} />
            </Link>
          </div>

          {/* Brand path */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid var(--border-color)', padding: '32px', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={22} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>I'm a Brand</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Find the right creators</h3>
              </div>
            </div>
            {[
              { n: '1', t: 'Post a campaign brief', d: 'Set your budget, niche, target platforms & follower/engagement minimums in a few fields.' },
              { n: '2', t: 'Review & invite creators', d: 'See applicants ranked by fit, or search Discover directly and invite creators to apply.' },
              { n: '3', t: 'Track delivery & pay safely', d: 'Approve milestones in the shared workspace and release payment only when work is done.' }
            ].map(step => (
              <div key={step.n} style={{ display: 'flex', gap: '14px', marginBottom: '18px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--secondary-glow)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, flexShrink: 0 }}>{step.n}</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 3px 0' }}>{step.t}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{step.d}</p>
                </div>
              </div>
            ))}
            <Link to="/register" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', borderRadius: '10px', fontWeight: 800, fontSize: '0.88rem', marginTop: '6px' }}>
              Join as a Brand <ChevronRight size={15} />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         INDIAN PLATFORM SCALE METRICS
         ═══════════════════════════════════════════════ */}
      <section style={{ maxWidth: '1150px', margin: '70px auto 0 auto', padding: '0 20px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '2px solid var(--border-color)',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          boxShadow: '0 4px 14px rgba(var(--text-primary-rgb), 0.05)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px', fontFamily: "'Playfair Display', var(--font-sans)" }}>₹45 Cr+</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>Creator Payout Volume</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '4px', fontFamily: "'Playfair Display', var(--font-sans)" }}>50,000+</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>Verified Creators</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px', fontFamily: "'Playfair Display', var(--font-sans)" }}>4,200+</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>Indian Brand Campaigns</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '4px', fontFamily: "'Playfair Display', var(--font-sans)" }}>99.9%</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>Escrow Milestone Protection</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
