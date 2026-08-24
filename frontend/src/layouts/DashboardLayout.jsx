import React, { useState } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  UserCircle,
  LogOut,
  Menu,
  X,
  Share2,
  Sparkles,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  BarChart2,
  Settings,
  PlusCircle,
  Users,
  CreditCard,
  AlertOctagon,
  TrendingUp,
  CheckSquare,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CS';
  };

  const isItemActive = (itemPath) => {
    const currentPath = location.pathname + location.search;
    if (itemPath === '/dashboard?tab=dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard/' || currentPath.startsWith('/dashboard?tab=dashboard');
    }
    return currentPath.startsWith(itemPath);
  };

  // Grouped Navigation Items per Role
  const getNavGroups = () => {
    if (user?.role === 'admin') {
      return [
        {
          title: 'ADMINISTRATION',
          items: [
            { label: 'Admin Dashboard', path: '/dashboard?tab=dashboard', icon: <LayoutDashboard size={18} /> },
            { label: 'Manage Users', path: '/dashboard?tab=users', icon: <Users size={18} /> },
            { label: 'Moderate Projects', path: '/dashboard?tab=projects', icon: <Briefcase size={18} /> },
            { label: 'Flagged Reports', path: '/dashboard?tab=reports', icon: <AlertOctagon size={18} /> },
            { label: 'Revenue Logs', path: '/dashboard?tab=revenue', icon: <CreditCard size={18} /> },
            { label: 'Platform Metrics', path: '/dashboard?tab=analytics', icon: <TrendingUp size={18} /> }
          ]
        },
        {
          title: 'PREFERENCES',
          items: [
            { label: 'Account Settings', path: '/dashboard/settings', icon: <Settings size={18} /> }
          ]
        }
      ];
    } else if (user?.role === 'creator') {
      return [
        {
          title: 'STUDIO OVERVIEW',
          items: [
            { label: 'Dashboard', path: '/dashboard?tab=dashboard', icon: <LayoutDashboard size={18} /> },
            { label: 'My Creator Profile', path: '/dashboard/profile', icon: <UserCircle size={18} /> },
            { label: 'Discover Campaigns', path: '/discover', icon: <Compass size={18} /> }
          ]
        },
        {
          title: 'COLLABORATIONS',
          items: [
            { label: 'My Applications', path: '/dashboard?tab=applications', icon: <FileText size={18} /> },
            { label: 'Active Collaborations', path: '/dashboard?tab=active-collaborations', icon: <Briefcase size={18} /> },
            { label: 'Completed Projects', path: '/dashboard?tab=completed-collaborations', icon: <CheckSquare size={18} /> }
          ]
        },
        {
          title: 'COMMUNICATION',
          items: [
            { label: 'Messages Inbox', path: '/dashboard?tab=messages', icon: <MessageSquare size={18} /> },
            { label: 'Activity Center', path: '/dashboard?tab=notifications', icon: <Bell size={18} /> },
            { label: 'Earnings Analytics', path: '/dashboard?tab=analytics', icon: <BarChart2 size={18} /> }
          ]
        },
        {
          title: 'PREFERENCES',
          items: [
            { label: 'Account Settings', path: '/dashboard/settings', icon: <Settings size={18} /> }
          ]
        }
      ];
    } else {
      // BRAND / COMPANY ROLE
      return [
        {
          title: 'ENTERPRISE OVERVIEW',
          items: [
            { label: 'Brand Dashboard', path: '/dashboard?tab=dashboard', icon: <LayoutDashboard size={18} /> },
            { label: 'Company Profile', path: '/dashboard?tab=profile', icon: <UserCircle size={18} /> },
            { label: 'Post New Campaign', path: '/dashboard?tab=create', icon: <PlusCircle size={18} /> }
          ]
        },
        {
          title: 'CAMPAIGNS & CREATORS',
          items: [
            { label: 'My Campaigns', path: '/dashboard?tab=campaigns', icon: <Briefcase size={18} /> },
            { label: 'Pitches Received', path: '/dashboard?tab=applications', icon: <FileText size={18} /> },
            { label: 'Shortlisted Creators', path: '/dashboard?tab=shortlist', icon: <Users size={18} /> },
            { label: 'Brand Collaborations', path: '/dashboard?tab=collaborations', icon: <Briefcase size={18} /> }
          ]
        },
        {
          title: 'FINANCE & CHAT',
          items: [
            { label: 'Inbox Messages', path: '/dashboard?tab=messages', icon: <MessageSquare size={18} /> },
            { label: 'Campaign Analytics', path: '/dashboard?tab=analytics', icon: <BarChart2 size={18} /> },
            { label: 'Escrow Payments', path: '/dashboard?tab=payments', icon: <CreditCard size={18} /> }
          ]
        },
        {
          title: 'PREFERENCES',
          items: [
            { label: 'Account Settings', path: '/dashboard/settings', icon: <Settings size={18} /> }
          ]
        }
      ];
    }
  };

  const navGroups = getNavGroups();

  // Get active page title for top header
  const getPageTitle = () => {
    const search = location.search;
    if (location.pathname.includes('/settings')) return 'Account Settings & Preferences';
    if (location.pathname.includes('/profile')) return 'My Profile & Portfolio';
    if (search.includes('tab=applications')) return user?.role === 'brand' ? 'Pitches Received' : 'My Campaign Applications';
    if (search.includes('tab=active-collaborations')) return 'Active Sponsorship Workspace';
    if (search.includes('tab=completed-collaborations')) return 'Completed Collaborations History';
    if (search.includes('tab=messages')) return 'Messages & Direct Communication';
    if (search.includes('tab=notifications')) return 'Notification Activity Center';
    if (search.includes('tab=analytics')) return 'Performance & Revenue Analytics';
    if (search.includes('tab=create')) return 'Create New Campaign Brief';
    if (search.includes('tab=campaigns')) return 'Managed Brand Campaigns';
    if (search.includes('tab=shortlist')) return 'Shortlisted Talent Roster';
    if (search.includes('tab=collaborations')) return 'Brand Sponsorship Workspaces';
    if (search.includes('tab=payments')) return 'Escrow Financial Ledger';
    return user?.role === 'creator' ? 'Creator Studio Overview' : (user?.role === 'brand' ? 'Brand Enterprise Suite' : 'Admin Operations Control');
  };

  return (
    <div className="cs-dock-layout-wrapper">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="cs-dock-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Modern Floating Dark Glass Dock Sidebar */}
      <aside className={`cs-glass-dock-sidebar ${mobileOpen ? 'cs-dock-mobile-show' : ''}`}>
        {/* Dock Brand Header */}
        <div className="cs-dock-brand">
          <Link to="/" className="cs-dock-brand-link">
            <div className="cs-dock-logo">
              <Share2 size={20} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <span className="cs-dock-title">CreatorSync</span>
              <span className="cs-dock-subtitle">
                {user?.role === 'creator' ? '⭐ Creator Studio' : (user?.role === 'brand' ? '🏢 Brand Enterprise' : '⚡ Admin Console')}
              </span>
            </div>
          </Link>
          <button className="cs-dock-close-mobile" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Dock Scrollable Navigation */}
        <nav className="cs-dock-nav">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="cs-dock-group">
              <span className="cs-dock-group-title">{group.title}</span>
              <div className="cs-dock-links">
                {group.items.map((item, iIdx) => {
                  const active = isItemActive(item.path);
                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      className={`cs-dock-link ${active ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="cs-dock-icon">{item.icon}</span>
                      <span className="cs-dock-label">{item.label}</span>
                      {active && <span className="cs-dock-active-dot" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Dock User Profile Footer */}
        <div className="cs-dock-footer">
          <div className="cs-dock-user-card">
            <div className="cs-dock-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="cs-dock-user-info">
              <span className="cs-dock-user-name">{user?.name || 'User Profile'}</span>
              <span className="cs-dock-user-status">● Live Connected</span>
            </div>
          </div>

          <button onClick={logout} className="cs-dock-logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="cs-dock-main-content">
        {/* Sticky Top Header */}
        <header className="cs-dock-top-header">
          <div className="cs-dock-header-left">
            <button className="cs-dock-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu size={20} />
            </button>
            <div className="cs-dock-breadcrumb">
              <span className="cs-dock-role-badge">{user?.role?.toUpperCase()}</span>
              <ChevronRight size={14} style={{ color: '#94a3b8' }} />
              <h2 className="cs-dock-page-heading">{getPageTitle()}</h2>
            </div>
          </div>

          <div className="cs-dock-header-right">
            {/* Action Shortcut */}
            {user?.role === 'creator' ? (
              <Link to="/discover" className="btn btn-outline cs-dock-action-btn">
                <Compass size={16} /> Discover Campaigns
              </Link>
            ) : user?.role === 'brand' ? (
              <Link to="/dashboard?tab=create" className="btn btn-primary cs-dock-action-btn">
                <PlusCircle size={16} /> Post Campaign
              </Link>
            ) : null}

            {/* Notifications Shortcut Bell */}
            <Link to="/dashboard?tab=notifications" className="cs-dock-bell" title="Activity Notifications">
              <Bell size={18} />
              <span className="cs-dock-bell-badge" />
            </Link>

            {/* Avatar Settings Shortcut */}
            <Link to="/dashboard/settings" className="cs-dock-user-avatar-btn" title="Account Settings">
              <div className="cs-dock-header-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Outlet Body */}
        <main className="cs-dock-page-body animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      {/* Custom Styles for Modern Floating Dark Glass Dock */}
      <style>{`
        .cs-dock-layout-wrapper {
          display: flex;
          min-height: 100vh;
          background: var(--bg-tertiary);
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ────────────────────────────────────────────────── */
        /* FLOATING PURE WHITE GLASS DOCK SIDEBAR             */
        /* ────────────────────────────────────────────────── */
        .cs-glass-dock-sidebar {
          width: 260px;
          position: fixed;
          top: 16px;
          left: 16px;
          bottom: 16px;
          height: calc(100vh - 32px);
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(20px);
          border: 1.5px solid var(--border-color);
          border-radius: 24px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: 0 12px 36px rgba(var(--text-primary-rgb), 0.06), 0 0 20px rgba(var(--primary-rgb), 0.05);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cs-dock-brand {
          padding: 22px 20px;
          border-bottom: 1.5px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cs-dock-brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .cs-dock-logo {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary-hover) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(var(--secondary-rgb), 0.35);
        }

        .cs-dock-title {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--text-primary);
          display: block;
          line-height: 1.2;
        }

        .cs-dock-subtitle {
          font-size: 0.7rem;
          font-weight: 800;
          color: #047857;
          display: block;
          margin-top: 2px;
        }

        .cs-dock-close-mobile {
          display: none;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .cs-dock-nav {
          flex: 1;
          overflow-y: auto;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cs-dock-nav::-webkit-scrollbar {
          width: 4px;
        }

        .cs-dock-nav::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .cs-dock-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cs-dock-group-title {
          font-size: 0.68rem;
          font-weight: 900;
          color: #94a3b8;
          letter-spacing: 0.08em;
          padding: 0 12px;
          text-transform: uppercase;
        }

        .cs-dock-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cs-dock-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 14px;
          color: #475569;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 700;
          position: relative;
          transition: all 0.22s ease;
        }

        .cs-dock-link:hover {
          background: #f1f5f9;
          color: var(--primary);
          transform: translateX(4px);
        }

        .cs-dock-link.active {
          background: linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%);
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(var(--primary-rgb), 0.28);
        }

        .cs-dock-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .cs-dock-link.active .cs-dock-icon {
          color: #ffffff;
        }

        .cs-dock-active-dot {
          position: absolute;
          right: 12px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 8px #60a5fa;
        }

        .cs-dock-footer {
          padding: 16px 14px;
          border-top: 1.5px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cs-dock-user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 14px;
          background: var(--bg-tertiary);
          border: 1.5px solid var(--border-color);
        }

        .cs-dock-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--primary);
          color: #ffffff;
          font-weight: 900;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .cs-dock-user-info {
          flex: 1;
          min-width: 0;
        }

        .cs-dock-user-name {
          font-size: 0.84rem;
          font-weight: 800;
          color: var(--text-primary);
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cs-dock-user-status {
          font-size: 0.7rem;
          font-weight: 800;
          color: #047857;
          display: block;
        }

        .cs-dock-logout-btn {
          width: 100%;
          padding: 9px 14px;
          border-radius: 12px;
          background: #fef2f2;
          color: #b91c1c;
          border: 1.5px solid #fecaca;
          font-size: 0.82rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .cs-dock-logout-btn:hover {
          background: #fee2e2;
          color: #991b1b;
        }

        /* ────────────────────────────────────────────────── */
        /* MAIN CONTENT AREA & HEADER WITH DOCK MARGIN        */
        /* ────────────────────────────────────────────────── */
        .cs-dock-main-content {
          flex: 1;
          margin-left: 292px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .cs-dock-top-header {
          height: 70px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1.5px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 90;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
        }

        .cs-dock-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cs-dock-hamburger {
          display: none;
          background: #f1f5f9;
          border: 1.5px solid #cbd5e1;
          color: var(--text-primary);
          border-radius: 10px;
          padding: 8px;
          cursor: pointer;
        }

        .cs-dock-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cs-dock-role-badge {
          font-size: 0.72rem;
          font-weight: 900;
          padding: 3px 10px;
          background: #f5e9e6;
          color: var(--primary);
          border-radius: 9999px;
          border: 1px solid #bfdbfe;
        }

        .cs-dock-page-heading {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--text-primary);
          margin: 0;
        }

        .cs-dock-header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .cs-dock-action-btn {
          padding: 8px 16px !important;
          font-size: 0.82rem !important;
          font-weight: 800 !important;
          border-radius: 10px !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .cs-dock-bell {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #ffffff;
          border: 1.5px solid var(--border-color);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .cs-dock-bell:hover {
          background: var(--bg-tertiary);
          color: var(--primary);
        }

        .cs-dock-bell-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: #dc2626;
          border-radius: 50%;
          border: 2px solid #ffffff;
        }

        .cs-dock-header-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--primary);
          color: #ffffff;
          font-weight: 900;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 2px solid var(--primary);
        }

        .cs-dock-page-body {
          flex: 1;
          padding: 32px;
        }

        /* ────────────────────────────────────────────────── */
        /* RESPONSIVE BREAKPOINTS                             */
        /* ────────────────────────────────────────────────── */
        @media (max-width: 991px) {
          .cs-glass-dock-sidebar {
            top: 0;
            left: 0;
            bottom: 0;
            height: 100vh;
            border-radius: 0;
            transform: translateX(-100%);
          }

          .cs-glass-dock-sidebar.cs-dock-mobile-show {
            transform: translateX(0);
          }

          .cs-dock-main-content {
            margin-left: 0;
          }

          .cs-dock-hamburger {
            display: flex;
          }

          .cs-dock-close-mobile {
            display: flex;
          }

          .cs-dock-mobile-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(var(--text-primary-rgb), 0.6);
            backdrop-filter: blur(4px);
            z-index: 999;
          }

          .cs-dock-top-header {
            padding: 0 16px;
          }

          .cs-dock-page-body {
            padding: 16px;
          }

          .cs-dock-action-btn span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
