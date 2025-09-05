import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'

interface ActivityItem {
  id: string
  title: string
  description?: string
  time: string
  icon: ReactNode
  status?: 'success' | 'warning' | 'error' | 'info'
  user?: string
}

interface ActivityCardProps {
  title: string
  activities: ActivityItem[]
  className?: string
  showViewAll?: boolean
  onViewAll?: () => void
}

export function ActivityCard({
  title,
  activities,
  className,
  showViewAll = true,
  onViewAll
}: ActivityCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'info':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-secondary-100 text-secondary-800'
    }
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-secondary-900">
            {title}
          </CardTitle>
          {showViewAll && onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center">
                  <div className="h-4 w-4 text-secondary-600">
                    {activity.icon}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    {activity.title}
                  </p>
                  {activity.status && (
                    <Badge className={cn('ml-2 text-xs', getStatusColor(activity.status))}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
                {activity.description && (
                  <p className="text-sm text-secondary-600 mt-1">
                    {activity.description}
                  </p>
                )}
                {activity.user && (
                  <p className="text-xs text-secondary-500 mt-1">
                    by {activity.user}
                  </p>
                )}
                <p className="text-xs text-secondary-500 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
