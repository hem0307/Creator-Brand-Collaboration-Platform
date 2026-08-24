import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Share2, X, LogOut } from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen, navItems }) => {
  const { user, logout } = useAuth();
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

  return (
    <aside className={`dashboard-sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="dashboard-sidebar-header d-flex justify-content-between align-items-center">
        <Link to="/" className="nav-logo gradient-text" style={{ fontSize: '1.25rem' }}>
          <Share2 size={20} />
          CreatorSync
        </Link>
        <button className="btn-icon close-sidebar-btn" onClick={() => setMobileOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <nav className="dashboard-nav" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 160px)', paddingRight: '4px' }}>
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={isItemActive(item.path) ? "dashboard-nav-item active" : "dashboard-nav-item"}
            onClick={() => setMobileOpen(false)}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="dashboard-sidebar-footer">
        <div className="dashboard-user-card">
          <div className="dashboard-avatar">
            {getInitials(user?.name)}
          </div>
          <div className="dashboard-user-info">
            <span className="dashboard-user-name">{user?.name}</span>
            <span className="dashboard-user-role" style={{ color: 'var(--primary)', fontWeight: 700 }}>{user?.role}</span>
          </div>
        </div>

        <button onClick={logout} className="btn btn-primary" style={{ marginTop: '8px', padding: '10px 16px', width: '100%' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
