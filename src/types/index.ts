// User and Authentication Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'learner' | 'instructor' | 'admin'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

// Programme and Course Types
export interface Programme {
  id: string
  title: string
  description: string
  duration: number // in months
  isActive: boolean
  courses: Course[]
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  programmeId: string
  title: string
  description: string
  code: string
  credits: number
  instructorId: string
  instructor?: User
  modules: Module[]
  assignments: Assignment[]
  resources: Resource[]
  isActive: boolean
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export interface Module {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  resources: Resource[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Resource {
  id: string
  moduleId?: string
  courseId?: string
  title: string
  description?: string
  type: ResourceType
  url: string
  fileSize?: number
  mimeType?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ResourceType = 'pdf' | 'video' | 'document' | 'image' | 'link' | 'assignment'

// Assignment and Grading Types
export interface Assignment {
  id: string
  courseId: string
  title: string
  description: string
  instructions: string
  dueDate: string
  maxPoints: number
  rubric?: Rubric
  submissions: AssignmentSubmission[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  learnerId: string
  learner?: User
  files: SubmissionFile[]
  submittedAt: string
  grade?: Grade
  feedback?: string
  status: SubmissionStatus
  createdAt: string
  updatedAt: string
}

export interface SubmissionFile {
  id: string
  submissionId: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  uploadedAt: string
}

export type SubmissionStatus = 'draft' | 'submitted' | 'graded' | 'returned'

export interface Grade {
  id: string
  submissionId: string
  points: number
  maxPoints: number
  feedback?: string
  gradedBy: string
  gradedAt: string
  rubricScores?: RubricScore[]
}

export interface Rubric {
  id: string
  assignmentId: string
  criteria: RubricCriterion[]
  createdAt: string
  updatedAt: string
}

export interface RubricCriterion {
  id: string
  title: string
  description: string
  maxPoints: number
  order: number
}

export interface RubricScore {
  criterionId: string
  points: number
  feedback?: string
}

// Certificate and Transcript Types
export interface Certificate {
  id: string
  userId: string
  type: CertificateType
  courseId?: string
  programmeId?: string
  title: string
  issuedAt: string
  certificateNumber: string
  downloadUrl: string
  isValid: boolean
}

export type CertificateType = 'course' | 'diploma'

export interface Transcript {
  id: string
  userId: string
  programmeId: string
  courses: TranscriptCourse[]
  gpa: number
  totalCredits: number
  completedCredits: number
  generatedAt: string
  downloadUrl: string
}

export interface TranscriptCourse {
  courseId: string
  courseTitle: string
  courseCode: string
  credits: number
  grade: string
  points: number
  completedAt: string
}

// Progress and Analytics Types
export interface Progress {
  userId: string
  courseId: string
  completedModules: number
  totalModules: number
  completedAssignments: number
  totalAssignments: number
  averageGrade: number
  lastAccessedAt: string
}

export interface Analytics {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalSubmissions: number
  averageGrade: number
  completionRate: number
}

// Announcement and Discussion Types
export interface Announcement {
  id: string
  courseId?: string
  programmeId?: string
  title: string
  content: string
  authorId: string
  author?: User
  isPinned: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Discussion {
  id: string
  courseId: string
  title: string
  content: string
  authorId: string
  author?: User
  replies: DiscussionReply[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DiscussionReply {
  id: string
  discussionId: string
  content: string
  authorId: string
  author?: User
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface FormError {
  field: string
  message: string
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// File Upload Types
export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

// Navigation Types
export interface NavItem {
  label: string
  href: string
  icon?: string
  children?: NavItem[]
  roles?: UserRole[]
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
  actionUrl?: string
}
