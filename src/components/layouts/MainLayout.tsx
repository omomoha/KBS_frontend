import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { SkipLink } from '@/components/SkipLink'
import { useAuth } from '@/contexts/AuthContext'

export function MainLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Skip Links for Accessibility */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header user={user} />
          <main 
            id="main-content"
            className="flex-1 p-6"
            role="main"
            aria-label="Main content"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
