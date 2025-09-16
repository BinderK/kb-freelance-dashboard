// API Types for Go API Integration

export interface TimeEntry {
  id: string;
  client: string;
  project: string;
  description: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  is_running: boolean;
}

export interface BreakdownEntry {
  client_project: string;
  hours: number;
  minutes: number;
}

export interface TodaySummary {
  total_hours: number;
  total_minutes: number;
  entry_count: number;
  breakdown?: BreakdownEntry[] | null;
}

export interface InvoiceLineItem {
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface InvoiceRequest {
  client_name: string;
  client_email: string;
  line_items: InvoiceLineItem[];
  notes?: string;
  date?: string;
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
  invoice_path?: string;
  download_url?: string;
  filename?: string;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Error types
export class ApiError extends Error {
  public status?: number;
  public response?: any;

  constructor(message: string, status?: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}
