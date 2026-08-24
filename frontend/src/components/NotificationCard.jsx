import React from 'react';
import { Bell, Check } from 'lucide-react';

const NotificationCard = ({ notification, onMarkRead }) => {
  return (
    <div className="glass-panel" style={{ padding: '16px', borderLeft: notification.isRead ? '1px solid var(--border-color)' : '3px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Bell size={18} style={{ color: notification.isRead ? 'var(--text-muted)' : 'var(--primary)', marginTop: '2px' }} />
        <div>
          <h5 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 2px' }}>{notification.title}</h5>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 4px' }}>{notification.body}</p>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(notification.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      {!notification.isRead && onMarkRead && (
        <button onClick={() => onMarkRead(notification._id)} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
          <Check size={12} /> Mark Read
        </button>
      )}
    </div>
  );
};

export default NotificationCard;
