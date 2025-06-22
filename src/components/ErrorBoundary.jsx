import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Optionally log error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#fff0f0',
          color: '#b00020',
          padding: '2rem',
          borderRadius: '8px',
          margin: '2rem',
          fontFamily: 'monospace',
          zIndex: 9999,
          position: 'relative',
        }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            {this.state.error && this.state.error.toString()}
            {'\n'}
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 