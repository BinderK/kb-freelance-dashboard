// Time Tracker Component

import React, { useState } from 'react';
import { useTimeTracker } from '../hooks/useTimeTracker';

const TimeTracker: React.FC = () => {
  const {
    currentTimer,
    todaySummary,
    isLoading,
    error,
    startTimer,
    stopTimer,
    refreshData,
    clearError,
  } = useTimeTracker();

  const [client, setClient] = useState('');
  const [project, setProject] = useState('');
  const [description, setDescription] = useState('');

  const handleStartTimer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !project.trim()) return;

    await startTimer(client.trim(), project.trim(), description.trim() || undefined);

    // Clear form after starting
    setClient('');
    setProject('');
    setDescription('');
  };

  const handleStopTimer = async () => {
    await stopTimer();
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timeString: string): string => {
    return new Date(timeString).toLocaleTimeString();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Time Tracker</h2>
        <button
          onClick={refreshData}
          disabled={isLoading}
          aria-label="Refresh data"
          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-200">{error}</p>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Current Timer Status */}
      {currentTimer ? (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-200">Timer Running</h3>
              <p className="text-green-300">
                {currentTimer.client} - {currentTimer.project}
              </p>
              {currentTimer.description && (
                <p className="text-green-400 text-sm">{currentTimer.description}</p>
              )}
              <p className="text-green-400 text-sm">
                Started: {formatTime(currentTimer.start_time)}
              </p>
            </div>
            <button
              onClick={handleStopTimer}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Stop Timer
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleStartTimer} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="client-input" className="block text-sm font-medium text-white/80 mb-2">
                Client
              </label>
              <input
                id="client-input"
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Enter client name"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="project-input" className="block text-sm font-medium text-white/80 mb-2">
                Project
              </label>
              <input
                id="project-input"
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="description-input" className="block text-sm font-medium text-white/80 mb-2">
              Description (Optional)
            </label>
            <input
              id="description-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !client.trim() || !project.trim()}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Starting...' : 'Start Timer'}
          </button>
        </form>
      )}

      {/* Today's Summary */}
      {todaySummary && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Today's Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm">Total Time</p>
              <p className="text-2xl font-bold text-white">
                {formatDuration(todaySummary.total_minutes)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm">Individual Entries</p>
              <p className="text-2xl font-bold text-white">{todaySummary.entry_count}</p>
              <p className="text-white/40 text-xs mt-1">
                {todaySummary.breakdown?.length ?? 0} client/project groups
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm">Average</p>
              <p className="text-2xl font-bold text-white">
                {todaySummary.entry_count > 0
                  ? formatDuration(Math.round(todaySummary.total_minutes / todaySummary.entry_count))
                  : '0h 0m'
                }
              </p>
            </div>
          </div>

          {/* Recent Entries */}
          {(() => {
            const breakdown = todaySummary.breakdown;
            if (breakdown && Array.isArray(breakdown) && breakdown.length > 0) {
              return (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-white mb-3">Recent Entries</h4>
                  <div className="space-y-2">
                    {breakdown.slice(0, 5).map((entry, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">
                              {entry.client_project}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">
                              {formatDuration(entry.minutes)}
                            </p>
                            <p className="text-white/60 text-sm">
                              {entry.hours.toFixed(2)}h
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
