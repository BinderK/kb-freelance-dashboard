// Custom hook for time tracking functionality

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/api';
import { type TimeEntry, type TodaySummary, ApiError } from '../types/api';

export interface UseTimeTrackerReturn {
  // State
  currentTimer: TimeEntry | null;
  todaySummary: TodaySummary | null;
  timeEntries: TimeEntry[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startTimer: (client: string, project: string, description?: string) => Promise<void>;
  stopTimer: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useTimeTracker = (): UseTimeTrackerReturn => {
  const [currentTimer, setCurrentTimer] = useState<TimeEntry | null>(null);
  const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      setError(error.message);
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [currentResponse, todayResponse, entriesResponse] = await Promise.all([
        apiClient.getCurrentTimer(),
        apiClient.getTodaySummary(),
        apiClient.getTimeEntries(),
      ]);

      if (currentResponse.success && currentResponse.data && currentResponse.data.is_running) {
        console.log('Setting current timer:', currentResponse.data);
        setCurrentTimer(currentResponse.data);
      } else {
        console.log('No current timer found or timer not running');
        setCurrentTimer(null);
      }

      if (todayResponse.success && todayResponse.data) {
        setTodaySummary(todayResponse.data);
      }

      if (entriesResponse.success && entriesResponse.data) {
        setTimeEntries(entriesResponse.data);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  const startTimer = useCallback(async (
    client: string, 
    project: string, 
    description?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.startTimer(client, project, description);
      
      if (response.success && response.data) {
        setCurrentTimer(response.data);
        // Refresh all data to get updated summary
        await refreshData();
      } else {
        setError(response.error || 'Failed to start timer');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [refreshData, handleApiError]);

  const stopTimer = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.stopTimer();
      
      if (response.success) {
        console.log('Timer stopped successfully, setting to null');
        // Immediately set timer to null to prevent race conditions
        setCurrentTimer(null);
        // Refresh data after a short delay to allow the backend to process
        setTimeout(() => {
          console.log('Refreshing data after stop timer');
          refreshData();
        }, 500);
      } else {
        setError(response.error || 'Failed to stop timer');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [refreshData, handleApiError]);

  // Auto-refresh data on mount
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      refreshData();
    }
  }, [refreshData]);

  return {
    currentTimer,
    todaySummary,
    timeEntries,
    isLoading,
    error,
    startTimer,
    stopTimer,
    refreshData,
    clearError,
  };
};
