import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotificationProvider, useNotifications } from '../NotificationContext'
import { NotificationType, NotificationPriority } from '@/types/notifications'

// Test component that uses the notification context
function TestComponent() {
  const { 
    notifications, 
    unreadCount, 
    addNotification, 
    markAsRead, 
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    updateSettings,
    sendAssignmentReminder,
    sendCourseUpdate
  } = useNotifications()

  return (
    <div>
      <div data-testid="unread-count">{unreadCount}</div>
      <div data-testid="notifications-count">{notifications.length}</div>
      <button 
        data-testid="add-notification"
        onClick={() => addNotification({
          title: 'Test Notification',
          message: 'This is a test notification',
          type: 'general',
          priority: 'medium',
          isRead: false,
          isArchived: false
        })}
      >
        Add Notification
      </button>
      <button 
        data-testid="mark-as-read"
        onClick={() => markAsRead(notifications[0]?.id || '')}
      >
        Mark as Read
      </button>
      <button 
        data-testid="mark-all-read"
        onClick={markAllAsRead}
      >
        Mark All Read
      </button>
      <button 
        data-testid="archive-notification"
        onClick={() => archiveNotification(notifications[0]?.id || '')}
      >
        Archive
      </button>
      <button 
        data-testid="delete-notification"
        onClick={() => deleteNotification(notifications[0]?.id || '')}
      >
        Delete
      </button>
      <button 
        data-testid="update-settings"
        onClick={() => updateSettings({ 
          email: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false }
        })}
      >
        Update Settings
      </button>
      <button 
        data-testid="send-reminder"
        onClick={() => sendAssignmentReminder('assignment-1', 'user-1')}
      >
        Send Reminder
      </button>
      <button 
        data-testid="send-course-update"
        onClick={() => sendCourseUpdate('course-1', 'material_added', 'New Material', 'New material has been added')}
      >
        Send Course Update
      </button>
    </div>
  )
}

describe('NotificationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should provide initial state', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('3') // Mock data
  })

  it('should add notification', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    const addButton = screen.getByTestId('add-notification')
    act(() => {
      addButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('4')
    })
  })

  it('should mark notification as read', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // First add a notification
    const addButton = screen.getByTestId('add-notification')
    act(() => {
      addButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
    })

    // Then mark it as read
    const markReadButton = screen.getByTestId('mark-as-read')
    act(() => {
      markReadButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
    })
  })

  it('should mark all notifications as read', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // First add a notification
    const addButton = screen.getByTestId('add-notification')
    act(() => {
      addButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
    })

    // Then mark all as read
    const markAllReadButton = screen.getByTestId('mark-all-read')
    act(() => {
      markAllReadButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
    })
  })

  it('should archive notification', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    const archiveButton = screen.getByTestId('archive-notification')
    act(() => {
      archiveButton.click()
    })

    // Should not change unread count when archiving
    expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
  })

  it('should delete notification', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // First add a notification
    const addButton = screen.getByTestId('add-notification')
    act(() => {
      addButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('4')
    })

    // Then delete it
    const deleteButton = screen.getByTestId('delete-notification')
    act(() => {
      deleteButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('3')
    })
  })

  it('should update settings', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    const updateSettingsButton = screen.getByTestId('update-settings')
    act(() => {
      updateSettingsButton.click()
    })

    // Settings should be updated in localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'notificationSettings',
      expect.stringContaining('"enabled":false')
    )
  })

  it('should send assignment reminder', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    const sendReminderButton = screen.getByTestId('send-reminder')
    act(() => {
      sendReminderButton.click()
    })

    // Should add a notification
    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
    })
  })

  it('should send course update', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    const sendCourseUpdateButton = screen.getByTestId('send-course-update')
    act(() => {
      sendCourseUpdateButton.click()
    })

    // Should add a notification
    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
    })
  })

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useNotifications must be used within a NotificationProvider')
    
    consoleSpy.mockRestore()
  })
})
