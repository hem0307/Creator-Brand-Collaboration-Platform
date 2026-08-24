import React from 'react';

const Button = ({ children, variant = 'primary', size = 'medium', className = '', ...props }) => {
  const variantClass = `btn-${variant}`;
  return (
    <button className={`btn ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
