// Secure API service with CSRF protection and proper error handling
import { CSRFProtection, sanitizeInput } from '@/utils/security'

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean
  skipCSRF?: boolean
  timeout?: number
}

interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

class SecureApiService {
  private baseUrl: string
  private csrfToken: string | null = null

  constructor(baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api') {
    this.baseUrl = baseUrl
  }

  private async getCSRFToken(): Promise<string> {
    if (!this.csrfToken) {
      this.csrfToken = CSRFProtection.generateToken()
    }
    return this.csrfToken
  }

  private async validateCSRFToken(token: string): Promise<boolean> {
    return CSRFProtection.validateToken(token)
  }

  private sanitizeHeaders(headers: HeadersInit = {}): Record<string, string> {
    const sanitized: Record<string, string> = {}
    
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sanitized[sanitizeInput(key)] = sanitizeInput(value)
      } else {
        sanitized[key] = String(value)
      }
    })

    return sanitized
  }


  private async makeRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      requireAuth = true,
      skipCSRF = false,
      timeout = 10000,
      ...fetchOptions
    } = options


    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.sanitizeHeaders(fetchOptions.headers),
    }

    // Add authentication
    if (requireAuth) {
      const token = this.getAuthToken()
      if (!token) {
        throw new Error('Authentication required')
      }
      headers['Authorization'] = `Bearer ${token}`
    }

    // Add CSRF protection for state-changing requests
    if (!skipCSRF && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      const csrfToken = await this.getCSRFToken()
      headers['X-CSRF-Token'] = csrfToken
    }

    // Add security headers
    headers['X-Requested-With'] = 'XMLHttpRequest'

    // Sanitize request body
    let sanitizedBody = fetchOptions.body
    if (fetchOptions.body && typeof fetchOptions.body === 'string') {
      try {
        const parsed = JSON.parse(fetchOptions.body)
        const sanitized = this.sanitizeObject(parsed)
        sanitizedBody = JSON.stringify(sanitized)
      } catch {
        // If not JSON, sanitize as string
        sanitizedBody = sanitizeInput(fetchOptions.body as string)
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
        body: sanitizedBody,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Handle different response types
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response)
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await this.parseResponse<T>(response)
      
      // Validate CSRF token in response for state-changing requests
      if (!skipCSRF && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
        const responseCSRFToken = response.headers.get('X-CSRF-Token')
        if (responseCSRFToken && !(await this.validateCSRFToken(responseCSRFToken))) {
          throw new Error('CSRF token validation failed')
        }
      }

      return {
        data,
        success: true,
        message: response.headers.get('X-Message') || undefined,
      }
    } catch (error: any) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.')
      }

      // Don't expose internal error details
      const safeError = this.sanitizeError(error)
      throw safeError
    }
  }

  private sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj
    }

    if (typeof obj === 'string') {
      return sanitizeInput(obj)
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item))
    }

    if (typeof obj === 'object') {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        sanitized[sanitizeInput(key)] = this.sanitizeObject(value)
      }
      return sanitized
    }

    return obj
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      return await response.json()
    }
    
    if (contentType?.includes('text/')) {
      const text = await response.text()
      return sanitizeInput(text) as T
    }
    
    return await response.blob() as T
  }

  private async parseErrorResponse(response: Response): Promise<{ message: string; errors?: string[] }> {
    try {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const errorData = await response.json()
        return {
          message: sanitizeInput(errorData.message || 'An error occurred'),
          errors: errorData.errors?.map((error: string) => sanitizeInput(error))
        }
      }
    } catch {
      // Fallback to status text
    }

    return {
      message: sanitizeInput(response.statusText || 'An error occurred')
    }
  }

  private sanitizeError(error: Error): Error {
    // Remove stack traces and sensitive information
    const message = sanitizeInput(error.message)
    const sanitizedError = new Error(message)
    
    // Don't include stack trace in production
    if (import.meta.env.PROD) {
      delete (sanitizedError as any).stack
    }
    
    return sanitizedError
  }


  private getAuthToken(): string | null {
    return localStorage.getItem('token')
  }

  // Public API methods
  async get<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // File upload with additional security
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(sanitizeInput(key), sanitizeInput(String(value)))
      })
    }

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    })
  }
}

export const secureApiService = new SecureApiService()
export default secureApiService
