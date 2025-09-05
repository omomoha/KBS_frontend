import { User, AuthTokens, LoginCredentials, RegisterData } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class AuthService {
  private baseUrl = `${API_BASE_URL}/auth`

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    const data = await response.json()
    return data.data
  }

  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const result = await response.json()
    return result.data
  }

  async getCurrentUser(): Promise<User> {
    const tokens = this.getStoredTokens()
    if (!tokens) {
      throw new Error('No authentication tokens found')
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshToken()
        return this.getCurrentUser()
      }
      throw new Error('Failed to get current user')
    }

    const result = await response.json()
    return result.data
  }

  async refreshToken(): Promise<AuthTokens> {
    const tokens = this.getStoredTokens()
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token found')
    }

    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    })

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    const result = await response.json()
    const newTokens = result.data
    this.storeTokens(newTokens)
    return newTokens
  }

  async logout(): Promise<void> {
    const tokens = this.getStoredTokens()
    if (tokens?.refreshToken) {
      try {
        await fetch(`${this.baseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        })
      } catch (error) {
        // Ignore logout errors
        console.warn('Logout request failed:', error)
      }
    }
    this.clearStoredTokens()
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send password reset email')
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to reset password')
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const tokens = this.getStoredTokens()
    if (!tokens) {
      throw new Error('No authentication tokens found')
    }

    const response = await fetch(`${this.baseUrl}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to change password')
    }
  }

  storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens))
  }

  getStoredTokens(): AuthTokens | null {
    try {
      const stored = localStorage.getItem('auth_tokens')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  clearStoredTokens(): void {
    localStorage.removeItem('auth_tokens')
  }

  isTokenExpired(tokens: AuthTokens): boolean {
    if (!tokens.expiresIn) return true
    const now = Date.now()
    const expirationTime = tokens.expiresIn * 1000
    return now >= expirationTime
  }
}

export const authService = new AuthService()
