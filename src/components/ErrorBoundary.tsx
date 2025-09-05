import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50">
          <div className="max-w-md w-full mx-4">
            <div className="card">
              <div className="card-content text-center">
                <AlertTriangle className="h-12 w-12 text-error-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                  Something went wrong
                </h2>
                <p className="text-secondary-600 mb-6">
                  We're sorry, but something unexpected happened. Please try again.
                </p>
                {import.meta.env.DEV && this.state.error && (
                  <details className="mb-6 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-secondary-700 mb-2">
                      Error Details
                    </summary>
                    <pre className="text-xs text-secondary-600 bg-secondary-100 p-3 rounded overflow-auto">
                      {this.state.error.message}
                      {'\n'}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
                <button
                  onClick={this.handleRetry}
                  className="btn btn-primary btn-md inline-flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
