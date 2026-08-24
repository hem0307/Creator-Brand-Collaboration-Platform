import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, LayoutDashboard, Share2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar animate-fade-in">
      <Link to="/" className="nav-logo gradient-text">
        <Share2 size={24} />
        CreatorSync
      </Link>
      <nav>
        <ul className="nav-links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
          <li><NavLink to="/discover" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Discover</NavLink></li>
          <li><NavLink to="/campaigns" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Campaigns</NavLink></li>
        </ul>
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-outline" style={{ padding: '8px 16px' }}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <button onClick={logout} className="btn btn-primary" style={{ padding: '8px 16px' }}>
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{ fontWeight: 600 }}>Login</Link>
            <Link to="/register" className="btn btn-primary">Join Now</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
