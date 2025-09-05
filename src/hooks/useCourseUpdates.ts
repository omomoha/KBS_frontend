import { useCallback } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'
import { notificationService } from '@/services/notificationService'

interface CourseUpdate {
  courseId: string
  courseTitle: string
  updateType: 'material_added' | 'announcement' | 'assignment_created' | 'grade_released'
  title: string
  description: string
}

export function useCourseUpdates() {
  const { addNotification, settings } = useNotifications()

  const sendCourseUpdate = useCallback(async (update: CourseUpdate) => {
    const now = new Date().toISOString()
    
    // Determine notification type and priority based on update type
    let notificationType: string
    let priority: 'low' | 'medium' | 'high' | 'urgent'
    let notificationTitle: string

    switch (update.updateType) {
      case 'material_added':
        notificationType = 'course_material_added'
        priority = 'medium'
        notificationTitle = 'New Course Material'
        break
      case 'announcement':
        notificationType = 'course_announcement'
        priority = 'high'
        notificationTitle = 'Course Announcement'
        break
      case 'assignment_created':
        notificationType = 'assignment_reminder'
        priority = 'high'
        notificationTitle = 'New Assignment'
        break
      case 'grade_released':
        notificationType = 'assignment_graded'
        priority = 'medium'
        notificationTitle = 'Grade Released'
        break
      default:
        notificationType = 'course_update'
        priority = 'medium'
        notificationTitle = 'Course Update'
    }

    // Send in-app notification
    addNotification({
      title: `${notificationTitle}: ${update.title}`,
      message: `${update.courseTitle}: ${update.description}`,
      type: notificationType as any,
      priority,
      isRead: false,
      isArchived: false,
      actionUrl: `/courses/${update.courseId}`
    })

    // Send email notification if enabled
    if (settings.email.enabled && settings.email.courseUpdates) {
      await notificationService.sendEmailNotification('current-user-id', {
        id: '',
        title: `${notificationTitle}: ${update.title}`,
        message: `${update.courseTitle}: ${update.description}`,
        type: notificationType as any,
        priority,
        isRead: false,
        isArchived: false,
        createdAt: now,
        updatedAt: now,
        actionUrl: `/courses/${update.courseId}`
      }, settings)
    }

    // Send push notification if enabled
    if (settings.push.enabled && settings.push.courseUpdates) {
      await notificationService.sendPushNotification('current-user-id', {
        id: '',
        title: `${notificationTitle}: ${update.title}`,
        message: `${update.courseTitle}: ${update.description}`,
        type: notificationType as any,
        priority,
        isRead: false,
        isArchived: false,
        createdAt: now,
        updatedAt: now,
        actionUrl: `/courses/${update.courseId}`
      }, settings)
    }

    // Log the course update
    console.log('Course update sent:', update)
  }, [addNotification, settings])

  const sendMaterialAdded = useCallback((courseId: string, courseTitle: string, materialTitle: string) => {
    sendCourseUpdate({
      courseId,
      courseTitle,
      updateType: 'material_added',
      title: materialTitle,
      description: `New material "${materialTitle}" has been added to the course.`
    })
  }, [sendCourseUpdate])

  const sendAnnouncement = useCallback((courseId: string, courseTitle: string, announcementTitle: string, content: string) => {
    sendCourseUpdate({
      courseId,
      courseTitle,
      updateType: 'announcement',
      title: announcementTitle,
      description: content
    })
  }, [sendCourseUpdate])

  const sendNewAssignment = useCallback((courseId: string, courseTitle: string, assignmentTitle: string, dueDate: string) => {
    sendCourseUpdate({
      courseId,
      courseTitle,
      updateType: 'assignment_created',
      title: assignmentTitle,
      description: `New assignment "${assignmentTitle}" has been created. Due: ${new Date(dueDate).toLocaleDateString()}`
    })
  }, [sendCourseUpdate])

  const sendGradeReleased = useCallback((courseId: string, courseTitle: string, assignmentTitle: string) => {
    sendCourseUpdate({
      courseId,
      courseTitle,
      updateType: 'grade_released',
      title: assignmentTitle,
      description: `Your grade for "${assignmentTitle}" has been released. Check your grades.`
    })
  }, [sendCourseUpdate])

  return {
    sendCourseUpdate,
    sendMaterialAdded,
    sendAnnouncement,
    sendNewAssignment,
    sendGradeReleased
  }
}
