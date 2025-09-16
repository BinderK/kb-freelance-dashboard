// Custom hook for invoice generation functionality

import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import { type InvoiceRequest, type InvoiceResponse, ApiError } from '../types/api';

export interface UseInvoiceReturn {
  // State
  isLoading: boolean;
  error: string | null;
  lastInvoice: InvoiceResponse | null;
  
  // Actions
  generateInvoice: (invoiceData: InvoiceRequest) => Promise<InvoiceResponse | null>;
  clearError: () => void;
  clearLastInvoice: () => void;
}

export const useInvoice = (): UseInvoiceReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInvoice, setLastInvoice] = useState<InvoiceResponse | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearLastInvoice = useCallback(() => {
    setLastInvoice(null);
  }, []);

  const handleApiError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      setError(error.message);
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  const generateInvoice = useCallback(async (invoiceData: InvoiceRequest): Promise<InvoiceResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.generateInvoice(invoiceData);
      
      if (response.success && response.data) {
        setLastInvoice(response.data);
        return response.data;
      } else {
        setError(response.error || 'Failed to generate invoice');
        return null;
      }
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  return {
    isLoading,
    error,
    lastInvoice,
    generateInvoice,
    clearError,
    clearLastInvoice,
  };
};
