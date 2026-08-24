import React from 'react';

const Table = ({ headers, children }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table" style={{ width: '100%', color: 'var(--text-primary)', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            {headers.map((h, idx) => (
              <th key={idx} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
