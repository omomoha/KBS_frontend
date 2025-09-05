import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User, AuthTokens, LoginCredentials } from '@/types'
import { authService } from '@/services/authService'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for stored tokens on app load
    const initializeAuth = async () => {
      try {
        const storedTokens = authService.getStoredTokens()
        if (storedTokens) {
          try {
            // Try to get current user from API
            const user = await authService.getCurrentUser()
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, tokens: storedTokens },
            })
          } catch (apiError) {
            // If API fails, create a mock user for development
            const mockUser: User = {
              id: '1',
              email: 'admin@kbs.edu.ng',
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              isActive: true,
              lastLoginAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: mockUser, tokens: storedTokens },
            })
          }
        } else {
          // No stored tokens, create a mock user for development
          const mockUser: User = {
            id: '1',
            email: 'admin@kbs.edu.ng',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          const mockTokens: AuthTokens = {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: 3600
          }
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: mockUser, tokens: mockTokens },
          })
        }
      } catch (error) {
        // Token is invalid, clear it
        authService.clearStoredTokens()
        dispatch({ type: 'LOGOUT' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      
      // Check for test credentials first
      const testUsers = [
        {
          email: 'admin@kbs.edu.ng',
          password: 'admin123',
          user: {
            id: '1',
            email: 'admin@kbs.edu.ng',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin' as const,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          email: 'admin2@kbs.edu.ng',
          password: 'admin123',
          user: {
            id: '2',
            email: 'admin2@kbs.edu.ng',
            firstName: 'Admin',
            lastName: 'User 2',
            role: 'admin' as const,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          email: 'instructor@kbs.edu.ng',
          password: 'instructor123',
          user: {
            id: '3',
            email: 'instructor@kbs.edu.ng',
            firstName: 'Instructor',
            lastName: 'User',
            role: 'instructor' as const,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          email: 'instructor2@kbs.edu.ng',
          password: 'instructor123',
          user: {
            id: '4',
            email: 'instructor2@kbs.edu.ng',
            firstName: 'Instructor',
            lastName: 'User 2',
            role: 'instructor' as const,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          email: 'instructor3@kbs.edu.ng',
          password: 'instructor123',
          user: {
            id: '5',
            email: 'instructor3@kbs.edu.ng',
            firstName: 'Instructor',
            lastName: 'User 3',
            role: 'instructor' as const,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          email: 'learner@kbs.edu.ng',
          password: 'learner123',
          user: {
            id: '6',
            email: 'learner@kbs.edu.ng',
            firstName: 'Learner',
            lastName: 'User',
            role: 'learner' as const,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          email: 'learner2@kbs.edu.ng',
          password: 'learner123',
          user: {
            id: '7',
            email: 'learner2@kbs.edu.ng',
            firstName: 'Learner',
            lastName: 'User 2',
            role: 'learner' as const,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          email: 'learner3@kbs.edu.ng',
          password: 'learner123',
          user: {
            id: '8',
            email: 'learner3@kbs.edu.ng',
            firstName: 'Learner',
            lastName: 'User 3',
            role: 'learner' as const,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          email: 'learner4@kbs.edu.ng',
          password: 'learner123',
          user: {
            id: '9',
            email: 'learner4@kbs.edu.ng',
            firstName: 'Learner',
            lastName: 'User 4',
            role: 'learner' as const,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      ]

      // Check if credentials match any test user
      const testUser = testUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      )

      if (testUser) {
        // Use test user credentials
        const tokens = {
          accessToken: `mock-access-token-${testUser.user.id}`,
          refreshToken: `mock-refresh-token-${testUser.user.id}`,
          expiresIn: 3600
        }
        
        authService.storeTokens(tokens)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: testUser.user, tokens },
        })
        return
      }

      // If not a test user, try API login
      const { user, tokens } = await authService.login(credentials)
      authService.storeTokens(tokens)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, tokens },
      })
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Login failed',
      })
      throw error
    }
  }

  const logout = () => {
    authService.clearStoredTokens()
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const refreshToken = async () => {
    try {
      const tokens = await authService.refreshToken()
      authService.storeTokens(tokens)
      const user = await authService.getCurrentUser()
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, tokens },
      })
    } catch (error) {
      dispatch({ type: 'LOGOUT' })
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
