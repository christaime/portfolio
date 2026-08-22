import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex items-center justify-center p-6">
          <div className="bg-[#0a1f33] border border-[#ef4444]/40 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[#d4e4fa] mb-2">
              Something went wrong
            </h2>
            <p className="text-xs text-[#9cb2cd] mb-6 leading-relaxed">
              An unexpected error occurred while rendering this interface.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00a6e0] hover:bg-[#38bdf8] text-[#00374d] text-xs font-bold rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
