import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GradeAssignmentModal } from '../GradeAssignmentModal'
import { assignmentService } from '@/services/assignmentService'
import { AssignmentSubmission, Assignment } from '@/types/assignments'

// Mock the assignment service
vi.mock('@/services/assignmentService', () => ({
  assignmentService: {
    downloadFile: vi.fn(),
    gradeSubmission: vi.fn()
  }
}))

// Mock the Modal component
vi.mock('@/components/ui/Modal', () => ({
  Modal: ({ children, isOpen, onClose, title }: any) => 
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null
}))

describe('GradeAssignmentModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  const mockAssignment: Assignment = {
    id: '1',
    title: 'Test Assignment',
    description: 'Test Description',
    instructions: 'Test Instructions',
    courseId: '1',
    courseTitle: 'Test Course',
    department: 'Business',
    instructorId: 'instructor-1',
    instructorName: 'Dr. Smith',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    maxPoints: 100,
    assignmentType: 'essay',
    status: 'published',
    attachments: [],
    submissions: [],
    totalSubmissions: 0,
    gradedSubmissions: 0
  }

  const mockSubmission: AssignmentSubmission = {
    id: 'sub1',
    assignmentId: '1',
    studentId: 'student1',
    studentName: 'John Doe',
    studentEmail: 'john.doe@kbs.edu.ng',
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    grade: undefined,
    feedback: undefined,
    gradedAt: undefined,
    gradedBy: undefined,
    attachments: [
      {
        id: 'att1',
        fileName: 'submission.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        fileUrl: '/api/files/submission.pdf',
        uploadedAt: new Date().toISOString()
      }
    ],
    isLate: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render modal when open with submission and assignment', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Grade Assignment')
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@kbs.edu.ng')).toBeInTheDocument()
  })

  it('should not render modal when closed', () => {
    render(
      <GradeAssignmentModal
        isOpen={false}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should not render modal when submission is null', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={null}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should not render modal when assignment is null', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={null}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should display student information', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@kbs.edu.ng')).toBeInTheDocument()
    expect(screen.getByText('Submitted')).toBeInTheDocument()
  })

  it('should display assignment details', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText('Test Assignment')).toBeInTheDocument()
    expect(screen.getByText('Test Course')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument() // Max points
  })

  it('should display submitted files', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText('submission.pdf')).toBeInTheDocument()
    expect(screen.getByText('(1.0 MB)')).toBeInTheDocument()
  })

  it('should download submitted file', async () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    const downloadButton = screen.getByText('Download')
    fireEvent.click(downloadButton)

    expect(assignmentService.downloadFile).toHaveBeenCalledWith(
      '/api/files/submission.pdf',
      'submission.pdf'
    )
  })

  it('should show no files message when no attachments', () => {
    const submissionWithoutFiles = {
      ...mockSubmission,
      attachments: []
    }

    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={submissionWithoutFiles}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText('No files submitted')).toBeInTheDocument()
  })

  it('should allow entering grade', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    const gradeInput = screen.getByDisplayValue('0')
    fireEvent.change(gradeInput, { target: { value: '85' } })

    expect(gradeInput).toHaveValue(85)
  })

  it('should allow entering feedback', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    const feedbackInput = screen.getByPlaceholderText('Provide detailed feedback for the student...')
    fireEvent.change(feedbackInput, { target: { value: 'Great work!' } })

    expect(feedbackInput).toHaveValue('Great work!')
  })

  it('should show grade percentage when grade is entered', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    const gradeInput = screen.getByDisplayValue('0')
    fireEvent.change(gradeInput, { target: { value: '85' } })

    expect(screen.getByText('85.0%')).toBeInTheDocument()
  })

  it('should show existing grade and feedback for previously graded submission', () => {
    const gradedSubmission = {
      ...mockSubmission,
      grade: 85,
      feedback: 'Good work!',
      gradedAt: new Date().toISOString(),
      gradedBy: 'Dr. Smith'
    }

    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={gradedSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByDisplayValue('85')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Good work!')).toBeInTheDocument()
    expect(screen.getByText(/Previously graded on/)).toBeInTheDocument()
    expect(screen.getByText(/Graded by/)).toBeInTheDocument()
  })

  it('should grade submission successfully', async () => {
    ;(assignmentService.gradeSubmission as any).mockResolvedValue(true)

    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    // Enter grade and feedback
    const gradeInput = screen.getByDisplayValue('0')
    fireEvent.change(gradeInput, { target: { value: '85' } })

    const feedbackInput = screen.getByPlaceholderText('Provide detailed feedback for the student...')
    fireEvent.change(feedbackInput, { target: { value: 'Great work!' } })

    // Submit grade
    const submitButton = screen.getByText('Submit Grade')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(assignmentService.gradeSubmission).toHaveBeenCalledWith({
        submissionId: 'sub1',
        grade: 85,
        feedback: 'Great work!',
        gradedBy: 'current-user-id'
      })
      expect(mockOnSuccess).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('should update grade for previously graded submission', async () => {
    const gradedSubmission = {
      ...mockSubmission,
      grade: 80,
      feedback: 'Good work!',
      gradedAt: new Date().toISOString(),
      gradedBy: 'Dr. Smith'
    }

    ;(assignmentService.gradeSubmission as any).mockResolvedValue(true)

    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={gradedSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    // Update grade
    const gradeInput = screen.getByDisplayValue('80')
    fireEvent.change(gradeInput, { target: { value: '85' } })

    // Submit updated grade
    const submitButton = screen.getByText('Update Grade')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(assignmentService.gradeSubmission).toHaveBeenCalledWith({
        submissionId: 'sub1',
        grade: 85,
        feedback: 'Good work!',
        gradedBy: 'current-user-id'
      })
      expect(mockOnSuccess).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('should handle grading error', async () => {
    ;(assignmentService.gradeSubmission as any).mockResolvedValue(false)

    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    // Enter grade and feedback
    const gradeInput = screen.getByDisplayValue('0')
    fireEvent.change(gradeInput, { target: { value: '85' } })

    const feedbackInput = screen.getByPlaceholderText('Provide detailed feedback for the student...')
    fireEvent.change(feedbackInput, { target: { value: 'Great work!' } })

    // Submit grade
    const submitButton = screen.getByText('Submit Grade')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(assignmentService.gradeSubmission).toHaveBeenCalled()
      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  it('should show late submission badge', () => {
    const lateSubmission = {
      ...mockSubmission,
      isLate: true,
      lateDays: 2
    }

    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={lateSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText('Late (2 days)')).toBeInTheDocument()
  })

  it('should close modal when cancel is clicked', () => {
    render(
      <GradeAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        submission={mockSubmission}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
