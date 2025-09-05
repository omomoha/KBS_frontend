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
          // Verify token is still valid
          const user = await authService.getCurrentUser()
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, tokens: storedTokens },
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
