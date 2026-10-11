import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AgriSense AI ErrorBoundary caught an uncaught exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    // Unregister service worker and clear caches if corrupted
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister());
      });
    }
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((k) => caches.delete(k));
      });
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4 py-12">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-stone-200/80 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                Farm Interface Temporarily Paused
              </h1>
              <p className="text-sm text-stone-600 leading-relaxed">
                A client-side display error occurred while rendering the agricultural dashboard.
                Your simulated telemetry and sensor data are safe.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs font-mono text-stone-700 max-h-36 overflow-auto">
                <div className="font-bold text-amber-700 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{this.state.error.name}: {this.state.error.message}</span>
                </div>
                {this.state.error.stack && (
                  <pre className="text-[11px] text-stone-500 whitespace-pre-wrap">
                    {this.state.error.stack.slice(0, 300)}...
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#279e5a] hover:bg-[#1f8249] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#279e5a]/20 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
