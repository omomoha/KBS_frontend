import { useEffect, useCallback } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'
import { notificationService } from '@/services/notificationService'

interface Assignment {
  id: string
  title: string
  dueDate: string
  courseId: string
  courseTitle: string
}

export function useAssignmentReminders() {
  const { addNotification, settings } = useNotifications()

  const checkAssignmentReminders = useCallback(async () => {
    try {
      // Get current user's assignments
      const assignments = await getUpcomingAssignments()
      
      for (const assignment of assignments) {
        const dueDate = new Date(assignment.dueDate)
        const now = new Date()
        const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)

        // Check if reminder should be sent
        if (hoursUntilDue <= settings.reminderTiming.assignmentReminder && hoursUntilDue > 0) {
          await sendAssignmentReminder(assignment)
        }

        // Check if urgent due alert should be sent
        if (hoursUntilDue <= settings.reminderTiming.assignmentDue && hoursUntilDue > 0) {
          await sendAssignmentDueAlert(assignment)
        }
      }
    } catch (error) {
      console.error('Failed to check assignment reminders:', error)
    }
  }, [settings, addNotification])

  const getUpcomingAssignments = async (): Promise<Assignment[]> => {
    // Mock data - replace with actual API call
    return [
      {
        id: '1',
        title: 'Business Ethics Essay',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        courseId: '1',
        courseTitle: 'Business Ethics'
      },
      {
        id: '2',
        title: 'Digital Marketing Project',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        courseId: '2',
        courseTitle: 'Digital Marketing'
      },
      {
        id: '3',
        title: 'Project Management Case Study',
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
        courseId: '3',
        courseTitle: 'Project Management'
      }
    ]
  }

  const sendAssignmentReminder = async (assignment: Assignment) => {
    const reminderKey = `assignment_reminder_${assignment.id}`
    const lastReminder = localStorage.getItem(reminderKey)
    const now = new Date().toISOString()

    // Only send reminder once per assignment
    if (lastReminder) {
      const lastReminderDate = new Date(lastReminder)
      const hoursSinceLastReminder = (new Date().getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceLastReminder < 12) { // Don't send more than once every 12 hours
        return
      }
    }

    // Send notification
    addNotification({
      title: 'Assignment Reminder',
      message: `"${assignment.title}" in ${assignment.courseTitle} is due soon. Don't forget to submit it!`,
      type: 'assignment_reminder',
      priority: 'medium',
      isRead: false,
      isArchived: false,
      actionUrl: `/assignments/${assignment.id}`
    })

    // Send email and push notifications
    await notificationService.sendEmailNotification('current-user-id', {
      id: '',
      title: 'Assignment Reminder',
      message: `"${assignment.title}" in ${assignment.courseTitle} is due soon.`,
      type: 'assignment_reminder',
      priority: 'medium',
      isRead: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
      actionUrl: `/assignments/${assignment.id}`
    }, settings)

    await notificationService.sendPushNotification('current-user-id', {
      id: '',
      title: 'Assignment Reminder',
      message: `"${assignment.title}" is due soon!`,
      type: 'assignment_reminder',
      priority: 'medium',
      isRead: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
      actionUrl: `/assignments/${assignment.id}`
    }, settings)

    // Mark reminder as sent
    localStorage.setItem(reminderKey, now)
  }

  const sendAssignmentDueAlert = async (assignment: Assignment) => {
    const alertKey = `assignment_due_${assignment.id}`
    const lastAlert = localStorage.getItem(alertKey)
    const now = new Date().toISOString()

    // Only send alert once per assignment
    if (lastAlert) {
      return
    }

    // Send urgent notification
    addNotification({
      title: 'Assignment Due Soon!',
      message: `"${assignment.title}" in ${assignment.courseTitle} is due very soon. Submit it now!`,
      type: 'assignment_due',
      priority: 'urgent',
      isRead: false,
      isArchived: false,
      actionUrl: `/assignments/${assignment.id}`
    })

    // Send email and push notifications
    await notificationService.sendEmailNotification('current-user-id', {
      id: '',
      title: 'URGENT: Assignment Due Soon!',
      message: `"${assignment.title}" in ${assignment.courseTitle} is due very soon.`,
      type: 'assignment_due',
      priority: 'urgent',
      isRead: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
      actionUrl: `/assignments/${assignment.id}`
    }, settings)

    await notificationService.sendPushNotification('current-user-id', {
      id: '',
      title: 'URGENT: Assignment Due Soon!',
      message: `"${assignment.title}" is due very soon!`,
      type: 'assignment_due',
      priority: 'urgent',
      isRead: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
      actionUrl: `/assignments/${assignment.id}`
    }, settings)

    // Mark alert as sent
    localStorage.setItem(alertKey, now)
  }

  // Check reminders every 30 minutes
  useEffect(() => {
    const interval = setInterval(checkAssignmentReminders, 30 * 60 * 1000)
    
    // Check immediately on mount
    checkAssignmentReminders()

    return () => clearInterval(interval)
  }, [checkAssignmentReminders])

  return {
    checkAssignmentReminders,
    sendAssignmentReminder,
    sendAssignmentDueAlert
  }
}
