import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { 
  Notification, 
  NotificationSettings, 
  NotificationType, 
  NotificationPriority,
  AssignmentReminder,
  CourseUpdate
} from '@/types/notifications'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  settings: NotificationSettings
  isConnected: boolean
  isLoading: boolean
}

type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'ARCHIVE_NOTIFICATION'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<NotificationSettings> }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }

interface NotificationContextType extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  archiveNotification: (id: string) => void
  deleteNotification: (id: string) => void
  updateSettings: (settings: Partial<NotificationSettings>) => void
  sendAssignmentReminder: (assignmentId: string, userId: string) => void
  sendCourseUpdate: (courseId: string, updateType: string, title: string, description: string) => void
  sendTestNotification: (type: NotificationType) => Promise<boolean>
  requestNotificationPermission: () => Promise<boolean>
  subscribeToNotifications: () => void
  unsubscribeFromNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const defaultSettings: NotificationSettings = {
  email: {
    enabled: true,
    assignmentReminders: true,
    assignmentDue: true,
    assignmentGraded: true,
    courseUpdates: true,
    courseAnnouncements: true,
    discussionReplies: true,
    systemUpdates: true
  },
  push: {
    enabled: true,
    assignmentReminders: true,
    assignmentDue: true,
    assignmentGraded: true,
    courseUpdates: true,
    courseAnnouncements: true,
    discussionReplies: true,
    systemUpdates: true
  },
  inApp: {
    enabled: true,
    assignmentReminders: true,
    assignmentDue: true,
    assignmentGraded: true,
    courseUpdates: true,
    courseAnnouncements: true,
    discussionReplies: true,
    systemUpdates: true
  },
  reminderTiming: {
    assignmentReminder: 24, // 24 hours before due
    assignmentDue: 2 // 2 hours before due
  }
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  settings: defaultSettings,
  isConnected: false,
  isLoading: false
}

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length
      }
    
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }
    
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true, updatedAt: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }
    
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true, updatedAt: new Date().toISOString() })),
        unreadCount: 0
      }
    
    case 'ARCHIVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isArchived: true, updatedAt: new Date().toISOString() } : n
        )
      }
    
    case 'DELETE_NOTIFICATION':
      const notificationToDelete = state.notifications.find(n => n.id === action.payload)
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: notificationToDelete?.isRead ? state.unreadCount : Math.max(0, state.unreadCount - 1)
      }
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        isConnected: action.payload
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    default:
      return state
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  // Load notifications and settings on mount
  useEffect(() => {
    loadNotifications()
    loadSettings()
    requestNotificationPermission()
  }, [])

  // Set up real-time connection
  useEffect(() => {
    if (state.isConnected) {
      subscribeToNotifications()
    }
    return () => unsubscribeFromNotifications()
  }, [state.isConnected])

  const loadNotifications = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // Mock API call - replace with actual API
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Assignment Due Soon',
          message: 'Your Business Ethics assignment is due in 2 hours',
          type: 'assignment_due',
          priority: 'high',
          isRead: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          actionUrl: '/assignments/1'
        },
        {
          id: '2',
          title: 'New Course Material',
          message: 'New lecture slides have been added to Project Management Fundamentals',
          type: 'course_material_added',
          priority: 'medium',
          isRead: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          actionUrl: '/courses/1'
        },
        {
          id: '3',
          title: 'Assignment Graded',
          message: 'Your Digital Marketing assignment has been graded',
          type: 'assignment_graded',
          priority: 'medium',
          isRead: true,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          actionUrl: '/assignments/2'
        }
      ]
      dispatch({ type: 'SET_NOTIFICATIONS', payload: mockNotifications })
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loadSettings = async () => {
    try {
      // Load settings from localStorage or API
      const savedSettings = localStorage.getItem('notificationSettings')
      if (savedSettings) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: JSON.parse(savedSettings) })
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error)
    }
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
    
    // Send push notification if enabled
    if (state.settings.push.enabled && 'Notification' in window) {
      const fullNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      sendPushNotification(fullNotification)
    }
  }

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id })
  }

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' })
  }

  const archiveNotification = (id: string) => {
    dispatch({ type: 'ARCHIVE_NOTIFICATION', payload: id })
  }

  const deleteNotification = (id: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id })
  }

  const updateSettings = (settings: Partial<NotificationSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
    localStorage.setItem('notificationSettings', JSON.stringify({ ...state.settings, ...settings }))
  }

  const sendAssignmentReminder = async (assignmentId: string, userId: string) => {
    try {
      // Mock API call - replace with actual API
      console.log('Sending assignment reminder for:', assignmentId, userId)
      
      // Add notification
      addNotification({
        title: 'Assignment Reminder',
        message: 'You have an assignment due soon. Check your assignments page for details.',
        type: 'assignment_reminder',
        priority: 'medium',
        isRead: false,
        isArchived: false,
        actionUrl: `/assignments/${assignmentId}`
      })
    } catch (error) {
      console.error('Failed to send assignment reminder:', error)
    }
  }

  const sendCourseUpdate = async (courseId: string, updateType: string, title: string, description: string) => {
    try {
      // Mock API call - replace with actual API
      console.log('Sending course update for:', courseId, updateType)
      
      // Add notification
      addNotification({
        title: `Course Update: ${title}`,
        message: description,
        type: 'course_update',
        priority: 'medium',
        isRead: false,
        isArchived: false,
        actionUrl: `/courses/${courseId}`
      })
    } catch (error) {
      console.error('Failed to send course update:', error)
    }
  }

  const sendTestNotification = async (type: NotificationType): Promise<boolean> => {
    try {
      const testNotification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Test Notification',
        message: `This is a test ${type} notification`,
        type,
        priority: 'medium',
        isRead: false,
        isArchived: false
      }

      addNotification(testNotification)
      
      return true
    } catch (error) {
      console.error('Failed to send test notification:', error)
      return false
    }
  }

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: true })
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: true })
        return true
      }
    }

    return false
  }

  const sendPushNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      })
    }
  }

  const subscribeToNotifications = () => {
    // Set up WebSocket or Server-Sent Events connection
    console.log('Subscribing to real-time notifications')
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: true })
  }

  const unsubscribeFromNotifications = () => {
    // Close WebSocket or Server-Sent Events connection
    console.log('Unsubscribing from real-time notifications')
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: false })
  }

  const value: NotificationContextType = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    updateSettings,
    sendAssignmentReminder,
    sendCourseUpdate,
    sendTestNotification,
    requestNotificationPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
