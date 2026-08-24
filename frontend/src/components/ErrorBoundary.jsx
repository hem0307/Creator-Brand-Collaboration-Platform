import React, { Component } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by React ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '400px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '32px'
        }}>
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
            <ShieldAlert size={48} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Something went wrong
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: '1.5' }}>
              An unexpected error occurred in this view. Try refreshing the page or navigating back.
            </p>
            <button onClick={this.handleReload} className="btn btn-primary">
              <RefreshCw size={16} style={{ marginRight: '6px' }} />
              Reload View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
