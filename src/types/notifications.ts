export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  isRead: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
  expiresAt?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export type NotificationType = 
  | 'assignment_reminder'
  | 'assignment_due'
  | 'assignment_graded'
  | 'course_update'
  | 'course_announcement'
  | 'course_material_added'
  | 'discussion_reply'
  | 'discussion_mention'
  | 'system_maintenance'
  | 'general'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface NotificationSettings {
  email: {
    enabled: boolean
    assignmentReminders: boolean
    assignmentDue: boolean
    assignmentGraded: boolean
    courseUpdates: boolean
    courseAnnouncements: boolean
    discussionReplies: boolean
    systemUpdates: boolean
  }
  push: {
    enabled: boolean
    assignmentReminders: boolean
    assignmentDue: boolean
    assignmentGraded: boolean
    courseUpdates: boolean
    courseAnnouncements: boolean
    discussionReplies: boolean
    systemUpdates: boolean
  }
  inApp: {
    enabled: boolean
    assignmentReminders: boolean
    assignmentDue: boolean
    assignmentGraded: boolean
    courseUpdates: boolean
    courseAnnouncements: boolean
    discussionReplies: boolean
    systemUpdates: boolean
  }
  reminderTiming: {
    assignmentReminder: number // hours before due
    assignmentDue: number // hours before due
  }
}

export interface NotificationTemplate {
  id: string
  type: NotificationType
  title: string
  message: string
  emailSubject?: string
  emailBody?: string
  pushTitle?: string
  pushBody?: string
  variables: string[]
}

export interface NotificationChannel {
  id: string
  name: string
  type: 'email' | 'push' | 'sms' | 'in_app'
  enabled: boolean
  config: Record<string, any>
}

export interface AssignmentReminder {
  id: string
  assignmentId: string
  assignmentTitle: string
  dueDate: string
  reminderTime: string
  userId: string
  isSent: boolean
  createdAt: string
}

export interface CourseUpdate {
  id: string
  courseId: string
  courseTitle: string
  updateType: 'material_added' | 'announcement' | 'assignment_created' | 'grade_released'
  title: string
  description: string
  createdAt: string
  notifiedUsers: string[]
}
