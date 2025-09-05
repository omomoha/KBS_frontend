import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-secondary-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="btn btn-primary btn-lg w-full inline-flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline btn-lg w-full inline-flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm text-secondary-500 mb-4">
            Still can't find what you're looking for?
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button className="btn btn-ghost btn-sm inline-flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
            <Link
              to="/support"
              className="btn btn-ghost btn-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
