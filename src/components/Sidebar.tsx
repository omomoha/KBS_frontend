import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  Award,
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  Megaphone,
  FileText as TranscriptIcon,
  Upload,
} from 'lucide-react'

import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: UserRole[]
}

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Programmes',
    href: '/programmes',
    icon: GraduationCap,
  },
  {
    label: 'Courses',
    href: '/courses',
    icon: BookOpen,
  },
  {
    label: 'Assignments',
    href: '/assignments',
    icon: FileText,
  },
  {
    label: 'Certificates',
    href: '/certificates',
    icon: Award,
  },
  {
    label: 'Transcript',
    href: '/transcript',
    icon: TranscriptIcon,
  },
  {
    label: 'Announcements',
    href: '/announcements',
    icon: Megaphone,
  },
  {
    label: 'Discussions',
    href: '/discussions',
    icon: MessageSquare,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['instructor', 'admin'],
  },
  {
    label: 'Users',
    href: '/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    label: 'Upload Learning Resources',
    href: '/upload-resources',
    icon: Upload,
    roles: ['instructor', 'admin'],
  },
]

export function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  )

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <nav 
        id="navigation"
        className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-secondary-200"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-semibold text-secondary-900">
              KBS LMS
            </span>
          </div>
        </div>
        
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
              
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-500' : 'text-secondary-400 group-hover:text-secondary-500'
                    )}
                  />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </nav>
    </div>
  )
}
