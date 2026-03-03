import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Quicksand', sans-serif",
                    background: '#f2f4ef',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ color: '#4B5320', marginBottom: '10px' }}>Something went wrong.</h1>
                    <p style={{ color: '#708238', marginBottom: '20px' }}>
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: '#708238',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '10px 24px',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
