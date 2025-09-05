import { 
  Notification, 
  NotificationSettings, 
  NotificationType, 
  AssignmentReminder,
  CourseUpdate 
} from '@/types/notifications'

class NotificationService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  // Email Notifications
  async sendEmailNotification(
    userId: string, 
    notification: Notification, 
    settings: NotificationSettings
  ): Promise<boolean> {
    if (!settings.email.enabled) return false

    try {
      const response = await fetch(`${this.baseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          notification,
          settings: settings.email
        })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to send email notification:', error)
      return false
    }
  }

  // Push Notifications
  async sendPushNotification(
    userId: string, 
    notification: Notification, 
    settings: NotificationSettings
  ): Promise<boolean> {
    if (!settings.push.enabled) return false

    try {
      const response = await fetch(`${this.baseUrl}/notifications/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          notification,
          settings: settings.push
        })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to send push notification:', error)
      return false
    }
  }

  // In-App Notifications
  async createInAppNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification | null> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(notification)
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Failed to create in-app notification:', error)
      return null
    }
  }

  // Assignment Reminders
  async scheduleAssignmentReminder(reminder: Omit<AssignmentReminder, 'id' | 'createdAt'>): Promise<AssignmentReminder | null> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/assignment-reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reminder)
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Failed to schedule assignment reminder:', error)
      return null
    }
  }

  async getAssignmentReminders(userId: string): Promise<AssignmentReminder[]> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/assignment-reminders/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error('Failed to get assignment reminders:', error)
      return []
    }
  }

  // Course Updates
  async sendCourseUpdateNotification(update: Omit<CourseUpdate, 'id' | 'createdAt' | 'notifiedUsers'>): Promise<CourseUpdate | null> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/course-updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(update)
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Failed to send course update notification:', error)
      return null
    }
  }

  // Get Notifications
  async getNotifications(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${userId}?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error('Failed to get notifications:', error)
      return []
    }
  }

  // Mark as Read
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      return response.ok
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      return false
    }
  }

  // Mark All as Read
  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${userId}/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      return response.ok
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      return false
    }
  }

  // Archive Notification
  async archiveNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/archive`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      return response.ok
    } catch (error) {
      console.error('Failed to archive notification:', error)
      return false
    }
  }

  // Delete Notification
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      return response.ok
    } catch (error) {
      console.error('Failed to delete notification:', error)
      return false
    }
  }

  // Get Notification Settings
  async getNotificationSettings(userId: string): Promise<NotificationSettings | null> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/settings/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Failed to get notification settings:', error)
      return null
    }
  }

  // Update Notification Settings
  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/settings/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      })

      return response.ok
    } catch (error) {
      console.error('Failed to update notification settings:', error)
      return false
    }
  }

  // Bulk Operations
  async bulkMarkAsRead(notificationIds: string[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/bulk/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notificationIds })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to bulk mark notifications as read:', error)
      return false
    }
  }

  async bulkArchive(notificationIds: string[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/bulk/archive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notificationIds })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to bulk archive notifications:', error)
      return false
    }
  }

  async bulkDelete(notificationIds: string[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/bulk/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notificationIds })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to bulk delete notifications:', error)
      return false
    }
  }

  // Notification Templates
  async getNotificationTemplates(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/templates`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error('Failed to get notification templates:', error)
      return []
    }
  }

  // Test Notifications
  async sendTestNotification(type: NotificationType, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type, userId })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to send test notification:', error)
      return false
    }
  }
}

export const notificationService = new NotificationService()
