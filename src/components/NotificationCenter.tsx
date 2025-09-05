import { useState, useEffect } from 'react'
import { 
  Bell, 
  X, 
  Check, 
  Archive, 
  Trash2, 
  Settings, 
  Filter,
  Search,
  MoreVertical,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle
} from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import { Notification, NotificationType, NotificationPriority } from '@/types/notifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    isLoading
  } = useNotifications()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<NotificationPriority | 'all'>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority
    const matchesArchived = showArchived ? notification.isArchived : !notification.isArchived
    
    return matchesSearch && matchesType && matchesPriority && matchesArchived
  })

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'assignment_reminder':
      case 'assignment_due':
      case 'assignment_graded':
        return <Clock className="h-4 w-4" />
      case 'course_update':
      case 'course_announcement':
      case 'course_material_added':
        return <Info className="h-4 w-4" />
      case 'discussion_reply':
      case 'discussion_mention':
        return <AlertCircle className="h-4 w-4" />
      case 'system_maintenance':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'assignment_reminder':
        return 'Assignment Reminder'
      case 'assignment_due':
        return 'Assignment Due'
      case 'assignment_graded':
        return 'Assignment Graded'
      case 'course_update':
        return 'Course Update'
      case 'course_announcement':
        return 'Course Announcement'
      case 'course_material_added':
        return 'New Material'
      case 'discussion_reply':
        return 'Discussion Reply'
      case 'discussion_mention':
        return 'Mentioned'
      case 'system_maintenance':
        return 'System Maintenance'
      default:
        return 'General'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedNotifications)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedNotifications(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set())
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)))
    }
  }

  const handleBulkAction = (action: 'read' | 'archive' | 'delete') => {
    selectedNotifications.forEach(id => {
      switch (action) {
        case 'read':
          markAsRead(id)
          break
        case 'archive':
          archiveNotification(id)
          break
        case 'delete':
          deleteNotification(id)
          break
      }
    })
    setSelectedNotifications(new Set())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="border-b p-4 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as NotificationType | 'all')}
                className="flex-1 px-3 py-2 border border-secondary-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="assignment_reminder">Assignment Reminders</option>
                <option value="assignment_due">Assignment Due</option>
                <option value="assignment_graded">Assignment Graded</option>
                <option value="course_update">Course Updates</option>
                <option value="course_announcement">Course Announcements</option>
                <option value="discussion_reply">Discussion Replies</option>
                <option value="system_maintenance">System Maintenance</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as NotificationPriority | 'all')}
                className="flex-1 px-3 py-2 border border-secondary-300 rounded-md text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="h-4 w-4"
                />
                Show archived
              </label>

              {filteredNotifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedNotifications.size === filteredNotifications.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  {selectedNotifications.size > 0 && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBulkAction('read')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBulkAction('archive')}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBulkAction('delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-b p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-secondary-500">
                <Bell className="h-8 w-8 mb-2" />
                <p>No notifications found</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      !notification.isRead && 'border-l-4 border-l-primary-500 bg-primary-50',
                      selectedNotifications.has(notification.id) && 'ring-2 ring-primary-500'
                    )}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id)
                      }
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.has(notification.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleSelectNotification(notification.id)
                          }}
                          className="mt-1 h-4 w-4"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getNotificationIcon(notification.type)}
                            <h3 className="font-medium text-secondary-900 truncate">
                              {notification.title}
                            </h3>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-secondary-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(notification.type)}
                              </Badge>
                              <span className="text-xs text-secondary-500">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  archiveNotification(notification.id)
                                }}
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
