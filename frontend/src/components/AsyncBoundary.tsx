import React, { ReactNode, useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface AsyncBoundaryProps {
  children: ReactNode;
}

/**
 * Async Boundary component that handles unhandled promise rejections
 * Works in conjunction with ErrorBoundary for comprehensive error handling
 */
export const AsyncBoundary: React.FC<AsyncBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setError(event.reason?.message || 'An unexpected async error occurred');
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Network Error</h1>
            <p className="text-gray-600 mb-4">
              {error || 'An unexpected network error occurred. Please try again.'}
            </p>

            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => {
                  setHasError(false);
                  setError('');
                }}
                className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
