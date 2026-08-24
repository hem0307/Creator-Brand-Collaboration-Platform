import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = ({ title = 'No items found', description = 'Try adjusting your filters.', icon: Icon = Search, action }) => {
  return (
    <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
      <Icon size={48} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
      <h4 style={{ fontWeight: 800, margin: '0 0 8px', color: 'var(--text-primary)' }}>{title}</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{description}</p>
      {action && <div style={{ marginTop: '16px' }}>{action}</div>}
    </div>
  );
};

export default EmptyState;
