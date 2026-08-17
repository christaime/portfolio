import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected rendering error occurred',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.warn('Caught error in React ErrorBoundary:', error, errorInfo);
  }

  handleReload = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-[#0b1f36] border border-[#1b3552] p-8 rounded-2xl max-w-md w-full shadow-lg flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-sm text-[#94a3b8]">
              {this.state.errorMessage || 'An unexpected error occurred. Please try reloading.'}
            </p>
            <button
              onClick={this.handleReload}
              className="mt-2 bg-[#00374d] text-[#00a6e0] hover:bg-[#00a6e0] hover:text-[#051424] font-semibold text-xs px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
