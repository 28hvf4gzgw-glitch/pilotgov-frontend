import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-ink-950 text-white flex items-center justify-center p-6 relative selection:bg-emerald2-500/30">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-emerald2-500/10 blur-[130px]" />
            <div className="absolute right-1/4 bottom-1/4 h-[250px] w-[250px] rounded-full bg-rose-500/10 blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-xl w-full rounded-3xl border border-white/10 bg-ink-900/90 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-black/80 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6 shadow-lg shadow-amber-500/10">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase mb-3">
              Application Notice
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Unable to render this view
            </h1>

            <p className="text-sm sm:text-base text-white/60 mb-8 leading-relaxed max-w-md mx-auto">
              A temporary issue occurred while loading this section. You can reload the page or return to the main portal.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald2-500 px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-emerald2-400 transition-all shadow-lg shadow-emerald2-500/20 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.1] transition-all backdrop-blur-sm cursor-pointer"
              >
                <Home className="h-4 w-4" />
                Return to Home
              </button>
            </div>

            {/* Collapsible Error Details for debugging */}
            {this.state.error && (
              <div className="text-left border-t border-white/10 pt-5 mt-5">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="flex items-center justify-between w-full text-xs font-medium text-white/40 hover:text-white/70 transition-colors py-1 focus:outline-none"
                >
                  <span>Diagnostic Details</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {this.state.showDetails && (
                  <div className="mt-3 p-4 rounded-xl bg-ink-950/80 border border-white/10 text-xs font-mono text-rose-300/90 overflow-x-auto max-h-48 scrollbar-thin">
                    <p className="font-semibold text-rose-400 mb-1">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="text-[11px] text-white/40 whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
