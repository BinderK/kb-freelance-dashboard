import React, { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Mock the API client
export const mockApiClient = {
    getCurrentTimer: vi.fn(),
    getTodaySummary: vi.fn(),
    getTimeEntries: vi.fn(),
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
    generateInvoice: vi.fn(),
}

// Mock the API module
vi.mock('../services/api', () => ({
    apiClient: mockApiClient,
}))

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockTimeEntry = (overrides: Partial<import('../types/api').TimeEntry> = {}): import('../types/api').TimeEntry => ({
    id: '1',
    client: 'Test Client',
    project: 'Test Project',
    description: 'Test Description',
    start_time: '2024-01-01T10:00:00Z',
    end_time: '2024-01-01T11:00:00Z',
    duration_minutes: 60,
    is_running: false,
    ...overrides,
})

export const createMockTodaySummary = (overrides: Partial<import('../types/api').TodaySummary> = {}): import('../types/api').TodaySummary => ({
    total_hours: 8,
    total_minutes: 490,
    entry_count: 3,
    breakdown: [
        {
            client_project: 'Test Client/Test Project',
            hours: 2.5,
            minutes: 150,
        },
        {
            client_project: 'Another Client/Another Project',
            hours: 5.5,
            minutes: 330,
        },
    ],
    ...overrides,
})

export const createMockApiResponse = <T extends unknown>(data: T, success = true) => ({
    success,
    data: success ? data : undefined,
    error: success ? undefined : 'Test error',
    message: success ? 'Success' : 'Error',
})
