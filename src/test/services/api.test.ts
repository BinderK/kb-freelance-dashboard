import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiClient } from '../../services/api'
import { ApiError } from '../../types/api'

// Mock fetch globally
global.fetch = vi.fn()

describe('ApiClient', () => {
    let apiClient: ApiClient
    const mockFetch = vi.mocked(fetch)

    beforeEach(() => {
        vi.clearAllMocks()
        apiClient = new ApiClient('http://localhost:8080')
    })

    describe('constructor', () => {
        it('should use default base URL when none provided', () => {
            const defaultClient = new ApiClient()
            expect(defaultClient).toBeInstanceOf(ApiClient)
        })

        it('should use provided base URL', () => {
            const customClient = new ApiClient('http://custom-api.com')
            expect(customClient).toBeInstanceOf(ApiClient)
        })
    })

    describe('request method', () => {
        it('should make successful GET request', async () => {
            const mockData = { id: '1', name: 'Test' }
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            } as Response)

            const result = await apiClient['request']('/test')

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/test', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            expect(result).toEqual(mockData)
        })

        it('should make successful POST request with body', async () => {
            const mockData = { success: true }
            const requestBody = { test: 'data' }

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            } as Response)

            const result = await apiClient['request']('/test', {
                method: 'POST',
                body: JSON.stringify(requestBody),
            })

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/test', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            expect(result).toEqual(mockData)
        })

        it('should handle HTTP error responses', async () => {
            const mockResponse = {
                ok: false,
                status: 404,
                statusText: 'Not Found',
                json: async () => ({ error: 'Not Found' }),
            } as Response

            mockFetch.mockResolvedValueOnce(mockResponse)

            await expect(apiClient['request']('/test')).rejects.toThrow('HTTP 404: Not Found')
        })

        it('should handle network errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'))

            await expect(apiClient['request']('/test')).rejects.toThrow('Network error: Network error')
        })

        it('should preserve custom headers', async () => {
            const mockData = { success: true }
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            } as Response)

            await apiClient['request']('/test', {
                headers: {
                    'Authorization': 'Bearer token',
                    'Custom-Header': 'value',
                },
            })

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/test', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token',
                    'Custom-Header': 'value',
                },
            })
        })
    })

    describe('time tracker methods', () => {
        describe('startTimer', () => {
            it('should start timer with all parameters', async () => {
                const mockResponse = {
                    success: true,
                    data: {
                        id: '1',
                        client: 'Test Client',
                        project: 'Test Project',
                        description: 'Test Description',
                        start_time: '2024-01-01T10:00:00Z',
                        is_running: true,
                    },
                }

                mockFetch.mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockResponse,
                } as Response)

                const result = await apiClient.startTimer('Test Client', 'Test Project', 'Test Description')

                expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/time/start', {
                    method: 'POST',
                    body: JSON.stringify({
                        client: 'Test Client',
                        project: 'Test Project',
                        description: 'Test Description',
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                expect(result).toEqual(mockResponse)
            })

            it('should start timer without description', async () => {
                const mockResponse = { success: true, data: {} }
                mockFetch.mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockResponse,
                } as Response)

                await apiClient.startTimer('Test Client', 'Test Project')

                expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/time/start', {
                    method: 'POST',
                    body: JSON.stringify({
                        client: 'Test Client',
                        project: 'Test Project',
                        description: '',
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            })
        })

        describe('stopTimer', () => {
            it('should stop timer', async () => {
                const mockResponse = { success: true, data: {} }
                mockFetch.mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockResponse,
                } as Response)

                const result = await apiClient.stopTimer()

                expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/time/stop', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                expect(result).toEqual(mockResponse)
            })
        })

        describe('getCurrentTimer', () => {
            it('should get current timer', async () => {
                const mockResponse = { success: true, data: null }
                mockFetch.mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockResponse,
                } as Response)

                const result = await apiClient.getCurrentTimer()

                expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/time/current', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                expect(result).toEqual(mockResponse)
            })
        })

        describe('getTodaySummary', () => {
            it('should get today summary', async () => {
                const mockResponse = {
                    success: true,
                    data: {
                        total_hours: 8,
                        total_minutes: 480,
                        entry_count: 3,
                        breakdown: [],
                    },
                }
                mockFetch.mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockResponse,
                } as Response)

                const result = await apiClient.getTodaySummary()

                expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/time/today', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                expect(result).toEqual(mockResponse)
            })
        })

        describe('getTimeEntries', () => {
            it('should get time entries', async () => {
                const mockResponse = { success: true, data: [] }
                mockFetch.mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockResponse,
                } as Response)

                const result = await apiClient.getTimeEntries()

                expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/time/entries', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                expect(result).toEqual(mockResponse)
            })
        })
    })

    describe('invoice methods', () => {
        describe('generateInvoice', () => {
            it('should generate invoice', async () => {
                const invoiceData = {
                    client_name: 'Test Client',
                    client_email: 'test@example.com',
                    line_items: [
                        {
                            description: 'Test Work',
                            hours: 2,
                            rate: 50,
                            amount: 100,
                        },
                    ],
                }

                const mockResponse = {
                    success: true,
                    data: {
                        success: true,
                        message: 'Invoice generated',
                        invoice_path: '/path/to/invoice.pdf',
                    },
                }

                mockFetch.mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockResponse,
                } as Response)

                const result = await apiClient.generateInvoice(invoiceData)

                expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/invoice/generate', {
                    method: 'POST',
                    body: JSON.stringify(invoiceData),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                expect(result).toEqual(mockResponse)
            })
        })
    })

    describe('health check', () => {
        it('should perform health check', async () => {
            const mockResponse = {
                success: true,
                data: {
                    status: 'healthy',
                    timestamp: '2024-01-01T10:00:00Z',
                },
            }

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            } as Response)

            const result = await apiClient.healthCheck()

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/health', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            expect(result).toEqual(mockResponse)
        })
    })

    describe('error handling', () => {
        it('should throw ApiError for HTTP errors', async () => {
            const mockResponse = {
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                json: async () => ({ error: 'Internal Server Error' }),
            } as Response

            mockFetch.mockResolvedValueOnce(mockResponse)

            await expect(apiClient.getCurrentTimer()).rejects.toThrow('HTTP 500: Internal Server Error')
        })

        it('should throw ApiError for network errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Connection failed'))

            await expect(apiClient.getCurrentTimer()).rejects.toThrow('Network error: Connection failed')
        })

        it('should preserve ApiError instances', async () => {
            const originalError = new ApiError('Original error', 400)
            mockFetch.mockRejectedValueOnce(originalError)

            await expect(apiClient.getCurrentTimer()).rejects.toThrow(originalError)
        })
    })
})
