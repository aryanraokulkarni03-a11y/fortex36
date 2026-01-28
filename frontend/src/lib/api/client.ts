import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Axios instance with interceptors for error handling
 */
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor (can add auth tokens if needed)
apiClient.interceptors.request.use(
    (config) => {
        // Could add JWT here if backend requires
        // const token = localStorage.getItem('token')
        // if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor with comprehensive error handling
apiClient.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
        // Network timeout
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please check your connection and try again.')
        }

        // Network error (offline/server down)
        if (!error.response) {
            throw new Error('Network error. Please check if you\'re online and the backend is running.')
        }

        const status = error.response.status
        const data = error.response.data as { detail?: string; message?: string }

        // Categorize errors by HTTP status
        switch (status) {
            case 401:
                throw new Error('Please sign in again to continue.')

            case 403:
                throw new Error('You don\'t have permission to access this.')

            case 404:
                throw new Error('Resource not found. It may have been removed.')

            case 422: {
                // Validation error - try to get detail from FastAPI response
                const detail = data?.detail || 'Invalid data. Please check your input.'
                throw new Error(typeof detail === 'string' ? detail : 'Validation error')
            }

            case 429:
                throw new Error('Too many requests. Please wait a moment and try again.')

            case 500:
                throw new Error('Server error. Our team has been notified and is fixing it!')

            case 503:
                throw new Error('Service temporarily unavailable. Please try again in a few moments.')

            default:
                throw new Error(data?.message || 'Something went wrong. Please try again.')
        }
    }
)

/**
 * Health check
 */
export async function checkHealth(): Promise<{ status: string; graph_nodes: number }> {
    return apiClient.get('/health')
}

export default apiClient
