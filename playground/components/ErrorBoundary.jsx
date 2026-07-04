'use client';

import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in development; a production deployment would send to an error reporting service
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary]', this.props.panelName, error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="pg-error-boundary"
          role="alert"
          aria-live="assertive"
          aria-label={`Error in ${this.props.panelName || 'panel'}`}
        >
          <div className="pg-error-boundary-icon" aria-hidden="true">⚠</div>
          <div className="pg-error-boundary-title">
            {this.props.panelName ? `${this.props.panelName} error` : 'Panel error'}
          </div>
          <div className="pg-error-boundary-message">
            {this.state.error?.message || 'An unexpected error occurred in this panel.'}
          </div>
          <button
            className="pg-error-boundary-btn"
            onClick={this.handleReset}
            aria-label={`Retry ${this.props.panelName || 'panel'}`}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
