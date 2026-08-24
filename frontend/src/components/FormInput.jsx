import React from 'react';

const FormInput = ({ label, icon: Icon, error, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />}
        <input
          className="form-input"
          style={Icon ? { paddingLeft: '48px' } : {}}
          {...props}
        />
      </div>
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{error}</span>}
    </div>
  );
};

export default FormInput;
