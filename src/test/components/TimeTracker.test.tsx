import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockApiClient, createMockTimeEntry, createMockTodaySummary, createMockApiResponse } from '../utils'
import TimeTracker from '../../components/TimeTracker'

// Mock the useTimeTracker hook
const mockUseTimeTracker = vi.fn()
vi.mock('../../hooks/useTimeTracker', () => ({
    useTimeTracker: () => mockUseTimeTracker(),
}))

describe('TimeTracker Component', () => {
    const user = userEvent.setup()

    beforeEach(() => {
        vi.clearAllMocks()
        mockUseTimeTracker.mockReturnValue({
            currentTimer: null,
            todaySummary: null,
            timeEntries: [],
            isLoading: false,
            error: null,
            startTimer: vi.fn(),
            stopTimer: vi.fn(),
            refreshData: vi.fn(),
            clearError: vi.fn(),
        })
    })

    describe('rendering', () => {
        it('should render the component with correct title', () => {
            render(<TimeTracker />)

            expect(screen.getByText('Time Tracker')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /refresh data/i })).toBeInTheDocument()
        })

        it('should render start timer form when no timer is running', () => {
            render(<TimeTracker />)

            expect(screen.getByLabelText(/client/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/project/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument()
        })

        it('should render running timer when timer is active', () => {
            const mockTimer = createMockTimeEntry({
                client: 'Test Client',
                project: 'Test Project',
                description: 'Test Description',
                is_running: true,
            })

            mockUseTimeTracker.mockReturnValue({
                currentTimer: mockTimer,
                todaySummary: null,
                timeEntries: [],
                isLoading: false,
                error: null,
                startTimer: vi.fn(),
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            expect(screen.getByText('Timer Running')).toBeInTheDocument()
            expect(screen.getByText('Test Client - Test Project')).toBeInTheDocument()
            expect(screen.getByText('Test Description')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /stop timer/i })).toBeInTheDocument()
        })
    })

    describe('form interactions', () => {
        it('should update form fields when user types', async () => {
            render(<TimeTracker />)

            const clientInput = screen.getByLabelText(/client/i)
            const projectInput = screen.getByLabelText(/project/i)
            const descriptionInput = screen.getByLabelText(/description/i)

            await user.type(clientInput, 'Test Client')
            await user.type(projectInput, 'Test Project')
            await user.type(descriptionInput, 'Test Description')

            expect(clientInput).toHaveValue('Test Client')
            expect(projectInput).toHaveValue('Test Project')
            expect(descriptionInput).toHaveValue('Test Description')
        })

        it('should call startTimer when form is submitted', async () => {
            const mockStartTimer = vi.fn()
            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: null,
                timeEntries: [],
                isLoading: false,
                error: null,
                startTimer: mockStartTimer,
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            const clientInput = screen.getByLabelText(/client/i)
            const projectInput = screen.getByLabelText(/project/i)
            const descriptionInput = screen.getByLabelText(/description/i)
            const submitButton = screen.getByRole('button', { name: /start timer/i })

            await user.type(clientInput, 'Test Client')
            await user.type(projectInput, 'Test Project')
            await user.type(descriptionInput, 'Test Description')
            await user.click(submitButton)

            expect(mockStartTimer).toHaveBeenCalledWith('Test Client', 'Test Project', 'Test Description')
        })

        it('should not submit form with empty required fields', async () => {
            const mockStartTimer = vi.fn()
            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: null,
                timeEntries: [],
                isLoading: false,
                error: null,
                startTimer: mockStartTimer,
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            const submitButton = screen.getByRole('button', { name: /start timer/i })

            expect(submitButton).toBeDisabled()
            expect(mockStartTimer).not.toHaveBeenCalled()
        })

        it('should clear form after starting timer', async () => {
            const mockStartTimer = vi.fn().mockResolvedValue(undefined)
            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: null,
                timeEntries: [],
                isLoading: false,
                error: null,
                startTimer: mockStartTimer,
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            const clientInput = screen.getByLabelText(/client/i)
            const projectInput = screen.getByLabelText(/project/i)
            const descriptionInput = screen.getByLabelText(/description/i)
            const submitButton = screen.getByRole('button', { name: /start timer/i })

            await user.type(clientInput, 'Test Client')
            await user.type(projectInput, 'Test Project')
            await user.type(descriptionInput, 'Test Description')
            await user.click(submitButton)

            await waitFor(() => {
                expect(clientInput).toHaveValue('')
                expect(projectInput).toHaveValue('')
                expect(descriptionInput).toHaveValue('')
            })
        })
    })

    describe('timer controls', () => {
        it('should call stopTimer when stop button is clicked', async () => {
            const mockStopTimer = vi.fn()
            const mockTimer = createMockTimeEntry({ is_running: true })

            mockUseTimeTracker.mockReturnValue({
                currentTimer: mockTimer,
                todaySummary: null,
                timeEntries: [],
                isLoading: false,
                error: null,
                startTimer: vi.fn(),
                stopTimer: mockStopTimer,
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            const stopButton = screen.getByRole('button', { name: /stop timer/i })
            await user.click(stopButton)

            expect(mockStopTimer).toHaveBeenCalled()
        })

        it('should call refreshData when refresh button is clicked', async () => {
            const mockRefreshData = vi.fn()
            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: null,
                timeEntries: [],
                isLoading: false,
                error: null,
                startTimer: vi.fn(),
                stopTimer: vi.fn(),
                refreshData: mockRefreshData,
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            const refreshButton = screen.getByRole('button', { name: /refresh data/i })
            await user.click(refreshButton)

            expect(mockRefreshData).toHaveBeenCalled()
        })
    })

    describe('today summary', () => {
        it('should render today summary when available', () => {
            const mockSummary = createMockTodaySummary({
                total_minutes: 480,
                entry_count: 3,
                breakdown: [
                    {
                        client_project: 'Test Client/Test Project',
                        hours: 2.5,
                        minutes: 150,
                    },
                ],
            })

            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: mockSummary,
                timeEntries: [],
                isLoading: false,
                error: null,
                startTimer: vi.fn(),
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            expect(screen.getByText("Today's Summary")).toBeInTheDocument()
            expect(screen.getByText('8h 0m')).toBeInTheDocument() // 480 minutes
            expect(screen.getByText('3')).toBeInTheDocument() // entry count
            expect(screen.getByText('2h 30m')).toBeInTheDocument() // average
        })

        it('should render recent entries when breakdown is available', () => {
            const mockSummary = createMockTodaySummary({
                breakdown: [
                    {
                        client_project: 'Test Client/Test Project',
                        hours: 2.5,
                        minutes: 150,
                    },
                    {
                        client_project: 'Another Client/Another Project',
                        hours: 1.0,
                        minutes: 60,
                    },
                ],
            })

            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: mockSummary,
                timeEntries: [],
                isLoading: false,
                error: null,
                startTimer: vi.fn(),
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            expect(screen.getByText('Recent Entries')).toBeInTheDocument()
            expect(screen.getByText('Test Client/Test Project')).toBeInTheDocument()
            expect(screen.getByText('Another Client/Another Project')).toBeInTheDocument()
            expect(screen.getByText('2h 30m')).toBeInTheDocument()
            expect(screen.getByText('1h 0m')).toBeInTheDocument()
        })

        it('should handle null breakdown gracefully', () => {
            const mockSummary = createMockTodaySummary({
                breakdown: null,
            })

            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: mockSummary,
                timeEntries: [],
                isLoading: false,
                error: null,
                startTimer: vi.fn(),
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            expect(screen.getByText("Today's Summary")).toBeInTheDocument()
            expect(screen.queryByText('Recent Entries')).not.toBeInTheDocument()
        })
    })

    describe('error handling', () => {
        it('should display error message when error exists', () => {
            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: null,
                timeEntries: [],
                isLoading: false,
                error: 'Test error message',
                startTimer: vi.fn(),
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            expect(screen.getByText('Test error message')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /✕/i })).toBeInTheDocument()
        })

        it('should call clearError when error close button is clicked', async () => {
            const mockClearError = vi.fn()
            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: null,
                timeEntries: [],
                isLoading: false,
                error: 'Test error message',
                startTimer: vi.fn(),
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: mockClearError,
            })

            render(<TimeTracker />)

            const closeButton = screen.getByRole('button', { name: /✕/i })
            await user.click(closeButton)

            expect(mockClearError).toHaveBeenCalled()
        })
    })

    describe('loading states', () => {
        it('should disable buttons when loading', () => {
            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: null,
                timeEntries: [],
                isLoading: true,
                error: null,
                startTimer: vi.fn(),
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            expect(screen.getByRole('button', { name: /refresh data/i })).toBeDisabled()
            expect(screen.getByRole('button', { name: /starting/i })).toBeDisabled()
        })

        it('should show loading text on start button when loading', () => {
            mockUseTimeTracker.mockReturnValue({
                currentTimer: null,
                todaySummary: null,
                timeEntries: [],
                isLoading: true,
                error: null,
                startTimer: vi.fn(),
                stopTimer: vi.fn(),
                refreshData: vi.fn(),
                clearError: vi.fn(),
            })

            render(<TimeTracker />)

            expect(screen.getByText('Starting...')).toBeInTheDocument()
        })
    })
})
