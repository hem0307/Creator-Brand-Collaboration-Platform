import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
      <button onClick={() => onPageChange(Math.max(1, page - 1))} className="btn-icon" disabled={page === 1}>
        <ChevronLeft size={18} />
      </button>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        Page {page} of {totalPages}
      </span>
      <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} className="btn-icon" disabled={page === totalPages}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
