import { User, AuthTokens, LoginCredentials, RegisterData } from '@/types'
import { secureApiService } from './secureApiService'
import { sanitizeInput } from '@/utils/security'
import { secureStorage } from '@/utils/secureStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class AuthService {
  private baseUrl = `${API_BASE_URL}/auth`

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Sanitize credentials before sending
    const sanitizedCredentials = {
      email: sanitizeInput(credentials.email),
      password: credentials.password, // Don't sanitize password as it might contain special chars
      rememberMe: Boolean(credentials.rememberMe)
    }

    const response = await secureApiService.post<{ user: User; tokens: AuthTokens }>(
      '/auth/login',
      sanitizedCredentials,
      { requireAuth: false, skipCSRF: true }
    )

    return response.data
  }

  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    // Sanitize registration data
    const sanitizedData = {
      firstName: sanitizeInput(data.firstName),
      lastName: sanitizeInput(data.lastName),
      email: sanitizeInput(data.email),
      password: data.password, // Don't sanitize password
      role: data.role,
      department: data.department ? sanitizeInput(data.department) : undefined
    }

    const response = await secureApiService.post<{ user: User; tokens: AuthTokens }>(
      '/auth/register',
      sanitizedData,
      { requireAuth: false, skipCSRF: true }
    )

    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const response = await secureApiService.get<User>('/users/profile')
    return response.data
  }

  async refreshToken(): Promise<AuthTokens> {
    const tokens = this.getStoredTokens()
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token found')
    }

    const response = await secureApiService.post<AuthTokens>(
      '/auth/refresh',
      { refreshToken: tokens.refreshToken },
      { requireAuth: false }
    )

    const newTokens = response.data
    this.storeTokens(newTokens)
    return newTokens
  }

  async logout(): Promise<void> {
    const tokens = this.getStoredTokens()
    if (tokens?.refreshToken) {
      try {
        await secureApiService.post('/auth/logout', { refreshToken: tokens.refreshToken })
      } catch (error) {
        // Ignore logout errors
        console.warn('Logout request failed:', error)
      }
    }
    this.clearStoredTokens()
  }

  async forgotPassword(email: string): Promise<void> {
    const sanitizedEmail = sanitizeInput(email)
    await secureApiService.post('/auth/forgot-password', { email: sanitizedEmail }, { requireAuth: false })
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const sanitizedToken = sanitizeInput(token)
    await secureApiService.post('/auth/reset-password', { 
      token: sanitizedToken, 
      password // Don't sanitize password
    }, { requireAuth: false })
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await secureApiService.post('/auth/change-password', { 
      currentPassword, // Don't sanitize passwords
      newPassword 
    })
  }

  storeTokens(tokens: AuthTokens): void {
    secureStorage.setAuthTokens(tokens)
  }

  getStoredTokens(): AuthTokens | null {
    return secureStorage.getAuthTokens()
  }

  clearStoredTokens(): void {
    secureStorage.removeItem('auth_tokens')
  }

  isTokenExpired(tokens: AuthTokens): boolean {
    if (!tokens.expiresIn) return true
    const now = Date.now()
    const expirationTime = tokens.expiresIn * 1000
    return now >= expirationTime
  }
}

export const authService = new AuthService()
