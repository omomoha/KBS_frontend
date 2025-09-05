import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'

interface ChartCardProps {
  title: string
  children: ReactNode
  className?: string
  subtitle?: string
  action?: ReactNode
}

export function ChartCard({
  title,
  children,
  className,
  subtitle,
  action
}: ChartCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-secondary-900">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-secondary-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}
