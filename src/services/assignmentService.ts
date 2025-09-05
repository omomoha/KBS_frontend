import { 
  Assignment, 
  AssignmentSubmission, 
  CreateAssignmentData, 
  GradeAssignmentData,
  AssignmentFilter,
  SubmissionFilter,
  AssignmentStats,
  Department,
  Course
} from '@/types/assignments'

class AssignmentService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  // Assignment Management
  async createAssignment(assignmentData: CreateAssignmentData): Promise<Assignment | null> {
    try {
      const formData = new FormData()
      formData.append('title', assignmentData.title)
      formData.append('description', assignmentData.description)
      formData.append('instructions', assignmentData.instructions)
      formData.append('courseId', assignmentData.courseId)
      formData.append('department', assignmentData.department)
      formData.append('dueDate', assignmentData.dueDate)
      formData.append('maxPoints', assignmentData.maxPoints.toString())
      formData.append('assignmentType', assignmentData.assignmentType)
      
      // Append attachments
      assignmentData.attachments.forEach((file, index) => {
        formData.append(`attachments`, file)
      })

      const response = await fetch(`${this.baseUrl}/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Failed to create assignment:', error)
      return null
    }
  }

  async getAssignments(filters?: AssignmentFilter): Promise<Assignment[]> {
    try {
      const queryParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(`${this.baseUrl}/assignments?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error('Failed to get assignments:', error)
      return []
    }
  }

  async getAssignment(assignmentId: string): Promise<Assignment | null> {
    try {
      const response = await fetch(`${this.baseUrl}/assignments/${assignmentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Failed to get assignment:', error)
      return null
    }
  }

  async updateAssignment(assignmentId: string, updates: Partial<Assignment>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      })

      return response.ok
    } catch (error) {
      console.error('Failed to update assignment:', error)
      return false
    }
  }

  async deleteAssignment(assignmentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      return response.ok
    } catch (error) {
      console.error('Failed to delete assignment:', error)
      return false
    }
  }

  // Assignment Submissions
  async submitAssignment(assignmentId: string, files: File[]): Promise<boolean> {
    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`files`, file)
      })

      const response = await fetch(`${this.baseUrl}/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      return response.ok
    } catch (error) {
      console.error('Failed to submit assignment:', error)
      return false
    }
  }

  async getSubmissions(assignmentId: string, filters?: SubmissionFilter): Promise<AssignmentSubmission[]> {
    try {
      const queryParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(`${this.baseUrl}/assignments/${assignmentId}/submissions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error('Failed to get submissions:', error)
      return []
    }
  }

  async getSubmission(submissionId: string): Promise<AssignmentSubmission | null> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions/${submissionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Failed to get submission:', error)
      return null
    }
  }

  // Grading
  async gradeSubmission(gradeData: GradeAssignmentData): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions/${gradeData.submissionId}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(gradeData)
      })

      return response.ok
    } catch (error) {
      console.error('Failed to grade submission:', error)
      return false
    }
  }

  async updateGrade(submissionId: string, grade: number, feedback: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions/${submissionId}/grade`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ grade, feedback })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to update grade:', error)
      return false
    }
  }

  // File Management
  async downloadFile(fileUrl: string, fileName: string): Promise<void> {
    try {
      const response = await fetch(fileUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  async uploadFile(file: File): Promise<string | null> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${this.baseUrl}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        return result.fileUrl
      }
      return null
    } catch (error) {
      console.error('Failed to upload file:', error)
      return null
    }
  }

  // Statistics
  async getAssignmentStats(): Promise<AssignmentStats | null> {
    try {
      const response = await fetch(`${this.baseUrl}/assignments/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Failed to get assignment stats:', error)
      return null
    }
  }

  // Departments and Courses
  async getDepartments(): Promise<Department[]> {
    try {
      const response = await fetch(`${this.baseUrl}/departments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error('Failed to get departments:', error)
      return []
    }
  }

  async getCourses(departmentId?: string): Promise<Course[]> {
    try {
      const queryParams = departmentId ? `?department=${departmentId}` : ''
      const response = await fetch(`${this.baseUrl}/courses${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error('Failed to get courses:', error)
      return []
    }
  }

  // Bulk Operations
  async bulkGradeSubmissions(submissionIds: string[], grade: number, feedback: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions/bulk-grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ submissionIds, grade, feedback })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to bulk grade submissions:', error)
      return false
    }
  }

  async exportGrades(assignmentId: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/assignments/${assignmentId}/export-grades`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        return await response.blob()
      }
      return null
    } catch (error) {
      console.error('Failed to export grades:', error)
      return null
    }
  }
}

export const assignmentService = new AssignmentService()
