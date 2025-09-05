import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock the auth service
vi.mock('@/services/authService', () => ({
  authService: {
    getStoredTokens: vi.fn(() => null),
    clearStoredTokens: vi.fn(),
  },
}))

function TestComponent() {
  const { isAuthenticated, isLoading } = useAuth()
  return (
    <div>
      <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
    </div>
  )
}

describe('AuthContext', () => {
  it('provides initial state', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    )

    // Wait for the initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
  })

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })
})
