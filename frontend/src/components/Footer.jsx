import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo gradient-text">CreatorSync</div>
        <ul className="footer-links">
          <li><Link to="/">Privacy Policy</Link></li>
          <li><Link to="/">Terms of Service</Link></li>
          <li><Link to="/">Support</Link></li>
        </ul>
        <p className="footer-text">© {new Date().getFullYear()} CreatorSync. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
