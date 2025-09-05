import { describe, it, expect, vi, beforeEach } from 'vitest'
import { assignmentService } from '../assignmentService'
import { CreateAssignmentData, AssignmentFilter, GradeAssignmentData } from '@/types/assignments'

// Mock fetch
global.fetch = vi.fn()

describe('AssignmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'mock-token')
  })

  describe('createAssignment', () => {
    it('should create assignment successfully', async () => {
      const mockAssignment = {
        id: '1',
        title: 'Test Assignment',
        description: 'Test Description',
        instructions: 'Test Instructions',
        courseId: 'course-1',
        department: 'Business',
        dueDate: '2024-12-31T23:59:59Z',
        maxPoints: 100,
        assignmentType: 'essay' as const,
        attachments: []
      }

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockAssignment)
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const assignmentData: CreateAssignmentData = {
        title: 'Test Assignment',
        description: 'Test Description',
        instructions: 'Test Instructions',
        courseId: 'course-1',
        department: 'Business',
        dueDate: '2024-12-31T23:59:59Z',
        maxPoints: 100,
        assignmentType: 'essay',
        attachments: []
      }

      const result = await assignmentService.createAssignment(assignmentData)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/assignments',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock-token'
          },
          body: expect.any(FormData)
        })
      )
      expect(result).toEqual(mockAssignment)
    })

    it('should return null on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to create assignment' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const assignmentData: CreateAssignmentData = {
        title: 'Test Assignment',
        description: 'Test Description',
        instructions: 'Test Instructions',
        courseId: 'course-1',
        department: 'Business',
        dueDate: '2024-12-31T23:59:59Z',
        maxPoints: 100,
        assignmentType: 'essay',
        attachments: []
      }

      const result = await assignmentService.createAssignment(assignmentData)

      expect(result).toBeNull()
    })
  })

  describe('getAssignments', () => {
    it('should fetch assignments with filters', async () => {
      const mockAssignments = [
        {
          id: '1',
          title: 'Assignment 1',
          status: 'published'
        },
        {
          id: '2',
          title: 'Assignment 2',
          status: 'draft'
        }
      ]

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockAssignments)
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const filters: AssignmentFilter = {
        status: 'published',
        search: 'test'
      }

      const result = await assignmentService.getAssignments(filters)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/assignments?status=published&search=test',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        })
      )
      expect(result).toEqual(mockAssignments)
    })

    it('should return empty array on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to fetch assignments' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await assignmentService.getAssignments()

      expect(result).toEqual([])
    })
  })

  describe('submitAssignment', () => {
    it('should submit assignment successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const files = [
        new File(['content'], 'test.pdf', { type: 'application/pdf' })
      ]

      const result = await assignmentService.submitAssignment('assignment-1', files)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/assignments/assignment-1/submit',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': 'Bearer mock-token'
          },
          body: expect.any(FormData)
        })
      )
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to submit assignment' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const files = [
        new File(['content'], 'test.pdf', { type: 'application/pdf' })
      ]

      const result = await assignmentService.submitAssignment('assignment-1', files)

      expect(result).toBe(false)
    })
  })

  describe('gradeSubmission', () => {
    it('should grade submission successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const gradeData: GradeAssignmentData = {
        submissionId: 'submission-1',
        grade: 85,
        feedback: 'Good work!',
        gradedBy: 'instructor-1'
      }

      const result = await assignmentService.gradeSubmission(gradeData)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/submissions/submission-1/grade',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          },
          body: JSON.stringify(gradeData)
        })
      )
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to grade submission' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const gradeData: GradeAssignmentData = {
        submissionId: 'submission-1',
        grade: 85,
        feedback: 'Good work!',
        gradedBy: 'instructor-1'
      }

      const result = await assignmentService.gradeSubmission(gradeData)

      expect(result).toBe(false)
    })
  })

  describe('downloadFile', () => {
    it('should download file successfully', async () => {
      const mockBlob = new Blob(['file content'], { type: 'application/pdf' })
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob)
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      // Mock DOM methods
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      }
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)

      await assignmentService.downloadFile('http://example.com/file.pdf', 'test.pdf')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://example.com/file.pdf',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        })
      )
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockLink.download).toBe('test.pdf')
      expect(mockLink.click).toHaveBeenCalled()

      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })
  })

  describe('getAssignmentStats', () => {
    it('should fetch assignment stats successfully', async () => {
      const mockStats = {
        totalAssignments: 10,
        publishedAssignments: 8,
        totalSubmissions: 25,
        gradedSubmissions: 20,
        pendingSubmissions: 5,
        averageGrade: 85.5,
        lateSubmissions: 2
      }

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockStats)
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await assignmentService.getAssignmentStats()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/assignments/stats',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        })
      )
      expect(result).toEqual(mockStats)
    })

    it('should return null on error', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to fetch stats' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await assignmentService.getAssignmentStats()

      expect(result).toBeNull()
    })
  })

  describe('getDepartments', () => {
    it('should fetch departments successfully', async () => {
      const mockDepartments = [
        { id: '1', name: 'Business Administration', code: 'BUS' },
        { id: '2', name: 'Marketing', code: 'MKT' }
      ]

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockDepartments)
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await assignmentService.getDepartments()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/departments',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        })
      )
      expect(result).toEqual(mockDepartments)
    })
  })

  describe('getCourses', () => {
    it('should fetch courses with department filter', async () => {
      const mockCourses = [
        { id: '1', title: 'Business 101', code: 'BUS101', department: 'Business Administration' },
        { id: '2', title: 'Marketing 101', code: 'MKT101', department: 'Marketing' }
      ]

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockCourses)
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const result = await assignmentService.getCourses('dept-1')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/courses?department=dept-1',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        })
      )
      expect(result).toEqual(mockCourses)
    })
  })
})
