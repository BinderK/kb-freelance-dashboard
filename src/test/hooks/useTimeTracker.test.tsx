import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimeTracker } from '../../hooks/useTimeTracker'

// Mock the API module
vi.mock('../../services/api', () => ({
    apiClient: {
        getCurrentTimer: vi.fn().mockResolvedValue({ success: true, data: null }),
        getTodaySummary: vi.fn().mockResolvedValue({ success: true, data: null }),
        getTimeEntries: vi.fn().mockResolvedValue({ success: true, data: [] }),
        startTimer: vi.fn(),
        stopTimer: vi.fn(),
        generateInvoice: vi.fn(),
    },
}))

describe('useTimeTracker', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('initial state', () => {
        it('should have correct initial state properties', () => {
            const { result } = renderHook(() => useTimeTracker())

            // Test that all expected properties exist and have correct types
            expect(result.current.currentTimer).toBeNull()
            expect(result.current.todaySummary).toBeNull()
            expect(result.current.timeEntries).toEqual([])
            expect(typeof result.current.isLoading).toBe('boolean')
            expect(result.current.error).toBeNull()
            expect(typeof result.current.startTimer).toBe('function')
            expect(typeof result.current.stopTimer).toBe('function')
            expect(typeof result.current.refreshData).toBe('function')
            expect(typeof result.current.clearError).toBe('function')
        })
    })

    describe('clearError', () => {
        it('should clear error state', () => {
            const { result } = renderHook(() => useTimeTracker())

            act(() => {
                result.current.clearError()
            })

            expect(result.current.error).toBeNull()
        })
    })

    describe('form interactions', () => {
        it('should handle startTimer call', async () => {
            const { result } = renderHook(() => useTimeTracker())

            // Test that startTimer is callable
            act(() => {
                expect(() => {
                    result.current.startTimer('Test Client', 'Test Project', 'Test Description')
                }).not.toThrow()
            })
        })

        it('should handle stopTimer call', async () => {
            const { result } = renderHook(() => useTimeTracker())

            // Test that stopTimer is callable
            act(() => {
                expect(() => {
                    result.current.stopTimer()
                }).not.toThrow()
            })
        })

        it('should handle refreshData call', async () => {
            const { result } = renderHook(() => useTimeTracker())

            // Test that refreshData is callable
            act(() => {
                expect(() => {
                    result.current.refreshData()
                }).not.toThrow()
            })
        })
    })
})
