import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div className="glass-panel" style={{ padding: '32px', maxWidth: '500px', width: '100%', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
        <button onClick={onClose} className="btn-icon" style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <X size={18} />
        </button>
        {title && <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
