import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Users, Video, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  location?: string
  attendees: string[]
  type: 'meeting' | 'class' | 'assignment' | 'exam'
  meetingUrl?: string
  description?: string
}

interface CalendarProps {
  events?: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onAddEvent?: () => void
  className?: string
}

export function Calendar({ events = [], onEventClick, onAddEvent, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getEventsForToday = () => {
    return getEventsForDate(selectedDate)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800'
      case 'class':
        return 'bg-green-100 text-green-800'
      case 'assignment':
        return 'bg-orange-100 text-orange-800'
      case 'exam':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Video className="h-3 w-3" />
      case 'class':
        return <Users className="h-3 w-3" />
      case 'assignment':
        return <Clock className="h-3 w-3" />
      case 'exam':
        return <CalendarIcon className="h-3 w-3" />
      default:
        return <CalendarIcon className="h-3 w-3" />
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const days = getDaysInMonth(currentDate)
  const todayEvents = getEventsForToday()

  return (
    <div className={cn('space-y-4', className)}>
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Calendar</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setView('month')}>
                Month
              </Button>
              <Button variant="outline" size="sm" onClick={() => setView('week')}>
                Week
              </Button>
              <Button variant="outline" size="sm" onClick={() => setView('day')}>
                Day
              </Button>
              <Button onClick={onAddEvent}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-secondary-600">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2" />
              }
              
              const dayEvents = getEventsForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()
              const isSelected = day.toDateString() === selectedDate.toDateString()
              
              return (
                <div
                  key={day.getTime()}
                  className={cn(
                    'p-2 min-h-[80px] border border-secondary-200 cursor-pointer hover:bg-secondary-50',
                    isToday && 'bg-primary-50 border-primary-200',
                    isSelected && 'bg-primary-100 border-primary-300'
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-sm font-medium mb-1">{day.getDate()}</div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          'text-xs p-1 rounded truncate cursor-pointer',
                          getEventTypeColor(event.type)
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick?.(event)
                        }}
                      >
                        <div className="flex items-center space-x-1">
                          {getEventTypeIcon(event.type)}
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-secondary-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Today's Events ({selectedDate.toLocaleDateString()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-center space-x-3 p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className={cn('p-2 rounded-full', getEventTypeColor(event.type))}>
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{event.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-secondary-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      {event.attendees.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {event.meetingUrl && (
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
