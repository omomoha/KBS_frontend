import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  description?: string
  className?: string
  iconColor?: string
  valueColor?: string
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  description,
  className,
  iconColor = 'text-primary-600',
  valueColor = 'text-secondary-900'
}: StatCardProps) {
  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-200 hover:shadow-lg',
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-600 mb-1">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <p className={cn('text-3xl font-bold', valueColor)}>
                {value}
              </p>
              {trend && (
                <span className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-secondary-500 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            'flex-shrink-0 p-3 rounded-lg bg-opacity-10',
            iconColor.replace('text-', 'bg-')
          )}>
            <div className={cn('h-6 w-6', iconColor)}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
