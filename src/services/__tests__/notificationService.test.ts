import { describe, it, expect, vi, beforeEach } from 'vitest'
import { notificationService } from '../notificationService'
import { Notification, NotificationSettings } from '@/types/notifications'

// Mock fetch
global.fetch = vi.fn()

describe('NotificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'mock-token')
  })

  describe('sendEmailNotification', () => {
    it('should send email notification successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const notification: Notification = {
        id: '1',
        title: 'Test Notification',
        message: 'Test message',
        type: 'assignment_due',
        priority: 'high',
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const settings: NotificationSettings = {
        email: {
          enabled: true,
          assignmentReminders: true,
          assignmentDue: true,
          assignmentGraded: false,
          courseUpdates: false,
          courseAnnouncements: false,
          discussionReplies: false,
          systemUpdates: false
        },
        push: {
          enabled: false,
          assignmentReminders: false,
          assignmentDue: false,
          assignmentGraded: false,
          courseUpdates: false,
          courseAnnouncements: false,
          discussionReplies: false,
          systemUpdates: false
        },
        inApp: {
          enabled: true,
          assignmentReminders: true,
          assignmentDue: true,
          assignmentGraded: false,
          courseUpdates: false,
          courseAnnouncements: false,
          discussionReplies: false,
          systemUpdates: false
        },
        reminderTiming: {
          assignmentReminder: 24,
          assignmentDue: 2
        }
      }

      const result = await notificationService.sendEmailNotification('user-1', notification, settings)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/email',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }),
          body: expect.stringContaining('user-1')
        })
      )
      expect(result).toBe(true)
    })

    it('should return false when email is disabled', async () => {
      const settings: NotificationSettings = {
        email: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        push: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        inApp: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        reminderTiming: { assignmentReminder: 24, assignmentDue: 2 }
      }

      const notification: Notification = {
        id: '1',
        title: 'Test',
        message: 'Test',
        type: 'assignment_due',
        priority: 'high',
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const result = await notificationService.sendEmailNotification('user-1', notification, settings)

      expect(result).toBe(false)
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should return false on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to send email' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const notification: Notification = {
        id: '1',
        title: 'Test',
        message: 'Test',
        type: 'assignment_due',
        priority: 'high',
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const settings: NotificationSettings = {
        email: { enabled: true, assignmentReminders: true, assignmentDue: true, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        push: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        inApp: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        reminderTiming: { assignmentReminder: 24, assignmentDue: 2 }
      }

      const result = await notificationService.sendEmailNotification('user-1', notification, settings)

      expect(result).toBe(false)
    })
  })

  describe('sendPushNotification', () => {
    it('should send push notification successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const notification: Notification = {
        id: '1',
        title: 'Test Notification',
        message: 'Test message',
        type: 'assignment_due',
        priority: 'high',
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const settings: NotificationSettings = {
        email: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        push: { enabled: true, assignmentReminders: true, assignmentDue: true, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        inApp: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        reminderTiming: { assignmentReminder: 24, assignmentDue: 2 }
      }

      const result = await notificationService.sendPushNotification('user-1', notification, settings)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/push',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }),
          body: expect.stringContaining('user-1')
        })
      )
      expect(result).toBe(true)
    })

    it('should return false when push is disabled', async () => {
      const settings: NotificationSettings = {
        email: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        push: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        inApp: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        reminderTiming: { assignmentReminder: 24, assignmentDue: 2 }
      }

      const notification: Notification = {
        id: '1',
        title: 'Test',
        message: 'Test',
        type: 'assignment_due',
        priority: 'high',
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const result = await notificationService.sendPushNotification('user-1', notification, settings)

      expect(result).toBe(false)
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('createInAppNotification', () => {
    it('should create in-app notification successfully', async () => {
      const mockNotification = {
        id: '1',
        title: 'Test Notification',
        message: 'Test message',
        type: 'assignment_due',
        priority: 'high',
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockNotification)
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const notificationData = {
        title: 'Test Notification',
        message: 'Test message',
        type: 'assignment_due' as const,
        priority: 'high' as const,
        isRead: false,
        isArchived: false
      }

      const result = await notificationService.createInAppNotification(notificationData)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }),
          body: expect.stringContaining('Test Notification')
        })
      )
      expect(result).toEqual(mockNotification)
    })

    it('should return null on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to create notification' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const notificationData = {
        title: 'Test Notification',
        message: 'Test message',
        type: 'assignment_due' as const,
        priority: 'high' as const,
        isRead: false,
        isArchived: false
      }

      const result = await notificationService.createInAppNotification(notificationData)

      expect(result).toBeNull()
    })
  })

  describe('getNotifications', () => {
    it('should fetch notifications successfully', async () => {
      const mockNotifications = [
        {
          id: '1',
          title: 'Notification 1',
          message: 'Message 1',
          type: 'assignment_due',
          priority: 'high',
          isRead: false,
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockNotifications)
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.getNotifications('user-1', 10, 0)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/user-1?limit=10&offset=0',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      )
      expect(result).toEqual(mockNotifications)
    })

    it('should return empty array on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to fetch notifications' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.getNotifications('user-1')

      expect(result).toEqual([])
    })
  })

  describe('markNotificationAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.markNotificationAsRead('notification-1')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/notification-1/read',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      )
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to mark as read' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.markNotificationAsRead('notification-1')

      expect(result).toBe(false)
    })
  })

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.markAllNotificationsAsRead('user-1')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/user-1/read-all',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      )
      expect(result).toBe(true)
    })
  })

  describe('archiveNotification', () => {
    it('should archive notification successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.archiveNotification('notification-1')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/notification-1/archive',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      )
      expect(result).toBe(true)
    })
  })

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.deleteNotification('notification-1')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/notification-1',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      )
      expect(result).toBe(true)
    })
  })

  describe('getNotificationSettings', () => {
    it('should fetch notification settings successfully', async () => {
      const mockSettings: NotificationSettings = {
        email: { enabled: true, assignmentReminders: true, assignmentDue: true, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        push: { enabled: true, assignmentReminders: true, assignmentDue: true, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        inApp: { enabled: true, assignmentReminders: true, assignmentDue: true, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false },
        reminderTiming: { assignmentReminder: 24, assignmentDue: 2 }
      }

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockSettings)
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.getNotificationSettings('user-1')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/settings/user-1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      )
      expect(result).toEqual(mockSettings)
    })

    it('should return null on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to fetch settings' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.getNotificationSettings('user-1')

      expect(result).toBeNull()
    })
  })

  describe('updateNotificationSettings', () => {
    it('should update notification settings successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const settingsUpdate = {
        email: { enabled: false, assignmentReminders: false, assignmentDue: false, assignmentGraded: false, courseUpdates: false, courseAnnouncements: false, discussionReplies: false, systemUpdates: false }
      }

      const result = await notificationService.updateNotificationSettings('user-1', settingsUpdate)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/settings/user-1',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }),
          body: expect.stringContaining('enabled')
        })
      )
      expect(result).toBe(true)
    })
  })

  describe('bulkOperations', () => {
    it('should perform bulk mark as read', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.bulkMarkAsRead(['notification-1', 'notification-2'])

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/bulk/read',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }),
          body: expect.stringContaining('notification-1')
        })
      )
      expect(result).toBe(true)
    })

    it('should perform bulk archive', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.bulkArchive(['notification-1', 'notification-2'])

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/bulk/archive',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }),
          body: expect.stringContaining('notification-1')
        })
      )
      expect(result).toBe(true)
    })

    it('should perform bulk delete', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.bulkDelete(['notification-1', 'notification-2'])

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/bulk/delete',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }),
          body: expect.stringContaining('notification-1')
        })
      )
      expect(result).toBe(true)
    })
  })

  describe('testNotifications', () => {
    it('should send test notification successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await notificationService.sendTestNotification('assignment_due', 'user-1')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notifications/test',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }),
          body: expect.stringContaining('assignment_due')
        })
      )
      expect(result).toBe(true)
    })
  })
})
