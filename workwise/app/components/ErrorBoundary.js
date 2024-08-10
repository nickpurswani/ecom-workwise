"use client"
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
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-red-500 bg-red-100">
          <h1>Something went wrong.</h1>
          <p>{this.state.error.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
