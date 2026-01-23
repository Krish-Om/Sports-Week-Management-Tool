import React, { type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component that catches errors in child components
 * Provides a graceful error UI and recovery mechanism
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', _error, errorInfo);
    this.setState({
      error: _error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
                <p className="text-gray-600 mb-4">
                  We encountered an unexpected error. Please try refreshing the page or go back to the previous page.
                </p>

                {this.state.error && (
                  <details className="mb-6 text-left bg-gray-100 rounded p-4 text-sm">
                    <summary className="font-semibold text-gray-700 cursor-pointer hover:text-gray-900">
                      Error Details
                    </summary>
                    <pre className="mt-2 text-red-600 overflow-auto whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack && (
                        <>
                          {'\n\nComponent Stack:\n'}
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </details>
                )}

                <div className="flex gap-3 flex-col sm:flex-row">
                  <button
                    onClick={this.resetError}
                    className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Go to Home
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  If the problem persists, please contact support or refresh your browser.
                </p>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
