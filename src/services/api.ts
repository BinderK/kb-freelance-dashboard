// API Client Service for Go API Integration

import { 
  type TimeEntry, 
  type TodaySummary, 
  type InvoiceRequest, 
  type InvoiceResponse, 
  type ApiResponse,
  ApiError 
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        error
      );
    }
  }

  // Time Tracker API Methods
  async startTimer(client: string, project: string, description?: string): Promise<ApiResponse<TimeEntry>> {
    return this.request<TimeEntry>('/api/time/start', {
      method: 'POST',
      body: JSON.stringify({
        client,
        project,
        description: description || '',
      }),
    });
  }

  async stopTimer(): Promise<ApiResponse<TimeEntry>> {
    return this.request<TimeEntry>('/api/time/stop', {
      method: 'POST',
    });
  }

  async getCurrentTimer(): Promise<ApiResponse<TimeEntry | null>> {
    return this.request<TimeEntry | null>('/api/time/current');
  }

  async getTodaySummary(): Promise<ApiResponse<TodaySummary>> {
    return this.request<TodaySummary>('/api/time/today');
  }

  async getTimeEntries(): Promise<ApiResponse<TimeEntry[]>> {
    return this.request<TimeEntry[]>('/api/time/entries');
  }

  // Invoice Generator API Methods
  async generateInvoice(invoiceData: InvoiceRequest): Promise<ApiResponse<InvoiceResponse>> {
    return this.request<InvoiceResponse>('/api/invoice/generate', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/api/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export { ApiClient };
