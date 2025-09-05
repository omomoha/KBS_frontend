export interface Assignment {
  id: string
  title: string
  description: string
  instructions: string
  courseId: string
  courseTitle: string
  department: string
  instructorId: string
  instructorName: string
  dueDate: string
  createdAt: string
  updatedAt: string
  maxPoints: number
  assignmentType: AssignmentType
  status: AssignmentStatus
  attachments: AssignmentAttachment[]
  submissions: AssignmentSubmission[]
  totalSubmissions: number
  gradedSubmissions: number
  averageGrade?: number
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  studentEmail: string
  submittedAt: string
  status: SubmissionStatus
  grade?: number
  feedback?: string
  gradedAt?: string
  gradedBy?: string
  attachments: SubmissionAttachment[]
  isLate: boolean
  lateDays?: number
}

export interface AssignmentAttachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
  uploadedAt: string
}

export interface SubmissionAttachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
  uploadedAt: string
}

export type AssignmentType = 
  | 'essay'
  | 'project'
  | 'quiz'
  | 'presentation'
  | 'lab_report'
  | 'case_study'
  | 'research_paper'
  | 'other'

export type AssignmentStatus = 
  | 'draft'
  | 'published'
  | 'closed'
  | 'graded'

export type SubmissionStatus = 
  | 'draft'
  | 'submitted'
  | 'graded'
  | 'returned'
  | 'late'

export interface CreateAssignmentData {
  title: string
  description: string
  instructions: string
  courseId: string
  department: string
  dueDate: string
  maxPoints: number
  assignmentType: AssignmentType
  attachments: File[]
}

export interface GradeAssignmentData {
  submissionId: string
  grade: number
  feedback: string
  gradedBy: string
}

export interface AssignmentFilter {
  status?: AssignmentStatus
  courseId?: string
  department?: string
  assignmentType?: AssignmentType
  dueDateFrom?: string
  dueDateTo?: string
  search?: string
}

export interface SubmissionFilter {
  status?: SubmissionStatus
  isLate?: boolean
  graded?: boolean
  search?: string
}

export interface AssignmentStats {
  totalAssignments: number
  publishedAssignments: number
  totalSubmissions: number
  gradedSubmissions: number
  pendingSubmissions: number
  averageGrade: number
  lateSubmissions: number
}

export interface Department {
  id: string
  name: string
  code: string
  description?: string
}

export interface Course {
  id: string
  title: string
  code: string
  department: string
  instructorId: string
  instructorName: string
}
