import { describe, it, expect } from 'vitest'
import { TimeEntry, TodaySummary, BreakdownEntry, ApiError } from '../../types/api'

describe('API Types', () => {
    describe('TimeEntry', () => {
        it('should create a valid TimeEntry object', () => {
            const timeEntry: TimeEntry = {
                id: '1',
                client: 'Test Client',
                project: 'Test Project',
                description: 'Test Description',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-01T11:00:00Z',
                duration_minutes: 60,
                is_running: false,
            }

            expect(timeEntry.id).toBe('1')
            expect(timeEntry.client).toBe('Test Client')
            expect(timeEntry.project).toBe('Test Project')
            expect(timeEntry.description).toBe('Test Description')
            expect(timeEntry.start_time).toBe('2024-01-01T10:00:00Z')
            expect(timeEntry.end_time).toBe('2024-01-01T11:00:00Z')
            expect(timeEntry.duration_minutes).toBe(60)
            expect(timeEntry.is_running).toBe(false)
        })

        it('should allow optional end_time and duration_minutes for running timers', () => {
            const runningTimer: TimeEntry = {
                id: '2',
                client: 'Test Client',
                project: 'Test Project',
                description: 'Running Timer',
                start_time: '2024-01-01T10:00:00Z',
                is_running: true,
            }

            expect(runningTimer.end_time).toBeUndefined()
            expect(runningTimer.duration_minutes).toBeUndefined()
            expect(runningTimer.is_running).toBe(true)
        })
    })

    describe('BreakdownEntry', () => {
        it('should create a valid BreakdownEntry object', () => {
            const breakdownEntry: BreakdownEntry = {
                client_project: 'Test Client/Test Project',
                hours: 2.5,
                minutes: 150,
            }

            expect(breakdownEntry.client_project).toBe('Test Client/Test Project')
            expect(breakdownEntry.hours).toBe(2.5)
            expect(breakdownEntry.minutes).toBe(150)
        })
    })

    describe('TodaySummary', () => {
        it('should create a valid TodaySummary object', () => {
            const todaySummary: TodaySummary = {
                total_hours: 8,
                total_minutes: 480,
                entry_count: 3,
                breakdown: [
                    {
                        client_project: 'Test Client/Test Project',
                        hours: 2.5,
                        minutes: 150,
                    },
                ],
            }

            expect(todaySummary.total_hours).toBe(8)
            expect(todaySummary.total_minutes).toBe(480)
            expect(todaySummary.entry_count).toBe(3)
            expect(todaySummary.breakdown).toHaveLength(1)
        })

        it('should allow optional breakdown', () => {
            const todaySummary: TodaySummary = {
                total_hours: 0,
                total_minutes: 0,
                entry_count: 0,
                breakdown: null,
            }

            expect(todaySummary.breakdown).toBeNull()
        })
    })

    describe('ApiError', () => {
        it('should create an ApiError with message only', () => {
            const error = new ApiError('Test error message')

            expect(error.message).toBe('Test error message')
            expect(error.name).toBe('ApiError')
            expect(error.status).toBeUndefined()
            expect(error.response).toBeUndefined()
        })

        it('should create an ApiError with message and status', () => {
            const error = new ApiError('Not found', 404)

            expect(error.message).toBe('Not found')
            expect(error.status).toBe(404)
            expect(error.response).toBeUndefined()
        })

        it('should create an ApiError with all properties', () => {
            const response = { detail: 'Resource not found' }
            const error = new ApiError('Not found', 404, response)

            expect(error.message).toBe('Not found')
            expect(error.status).toBe(404)
            expect(error.response).toEqual(response)
        })

        it('should be an instance of Error', () => {
            const error = new ApiError('Test error')
            expect(error).toBeInstanceOf(Error)
        })
    })
})
