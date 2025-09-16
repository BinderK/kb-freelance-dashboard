import { useState, useEffect } from 'react';
import TimeTracker from './components/TimeTracker';
import InvoiceGenerator from './components/InvoiceGenerator';
import { apiClient } from './services/api';

function App() {
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'tracker' | 'invoice'>('tracker');

  // Check API connection on mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await apiClient.healthCheck();
        setIsApiConnected(response.success);
      } catch (error) {
        setIsApiConnected(false);
      }
    };

    checkApiConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                🚀 KB Freelance Dashboard
              </h1>
            </div>
            
            {/* API Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isApiConnected === null 
                    ? 'bg-yellow-400' 
                    : isApiConnected 
                    ? 'bg-green-400' 
                    : 'bg-red-400'
                }`} />
                <span className="text-sm text-white/80">
                  {isApiConnected === null 
                    ? 'Connecting...' 
                    : isApiConnected 
                    ? 'API Connected' 
                    : 'API Disconnected'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tracker'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Time Tracker</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'invoice'
                  ? 'border-green-400 text-green-400'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Invoice Generator</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isApiConnected && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-red-200 font-semibold">API Connection Failed</h3>
                <p className="text-red-300 text-sm">
                  Make sure the Go API server is running on port 8080. 
                  <button 
                    onClick={() => window.location.reload()} 
                    className="underline hover:text-red-200 ml-1"
                  >
                    Retry connection
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {activeTab === 'tracker' && <TimeTracker />}
          {activeTab === 'invoice' && <InvoiceGenerator />}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Built with React, TypeScript, Tailwind CSS, and Go API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;