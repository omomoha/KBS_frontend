import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubmitAssignmentModal } from '../SubmitAssignmentModal'
import { assignmentService } from '@/services/assignmentService'
import { Assignment } from '@/types/assignments'

// Mock the assignment service
vi.mock('@/services/assignmentService', () => ({
  assignmentService: {
    downloadFile: vi.fn(),
    submitAssignment: vi.fn()
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

describe('SubmitAssignmentModal', () => {
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
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    maxPoints: 100,
    assignmentType: 'essay',
    status: 'published',
    attachments: [
      {
        id: 'att1',
        fileName: 'assignment-template.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        fileUrl: '/api/files/template.pdf',
        uploadedAt: new Date().toISOString()
      }
    ],
    submissions: [],
    totalSubmissions: 0,
    gradedSubmissions: 0
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render modal when open with assignment', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Submit Assignment')
    expect(screen.getByText('Test Assignment')).toBeInTheDocument()
    expect(screen.getByText('Test Course • Business')).toBeInTheDocument()
  })

  it('should not render modal when closed', () => {
    render(
      <SubmitAssignmentModal
        isOpen={false}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should not render modal when assignment is null', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={null}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should display assignment details', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Test Instructions')).toBeInTheDocument()
    expect(screen.getByText('100 points')).toBeInTheDocument()
  })

  it('should display assignment files', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText('assignment-template.pdf')).toBeInTheDocument()
    expect(screen.getByText('(1.0 MB)')).toBeInTheDocument()
  })

  it('should download assignment file', async () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    const downloadButton = screen.getByText('Download')
    fireEvent.click(downloadButton)

    expect(assignmentService.downloadFile).toHaveBeenCalledWith(
      '/api/files/template.pdf',
      'assignment-template.pdf'
    )
  })

  it('should handle file upload', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    const fileInput = screen.getByLabelText('Choose Files')
    const file = new File(['content'], 'submission.pdf', { type: 'application/pdf' })

    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(screen.getByText('submission.pdf')).toBeInTheDocument()
  })

  it('should remove uploaded file', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    // Upload a file first
    const fileInput = screen.getByLabelText('Choose Files')
    const file = new File(['content'], 'submission.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(screen.getByText('submission.pdf')).toBeInTheDocument()

    // Remove the file
    const removeButton = screen.getByRole('button', { name: '' }) // X button
    fireEvent.click(removeButton)

    expect(screen.queryByText('submission.pdf')).not.toBeInTheDocument()
  })

  it('should show warning when no files selected', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText('Please select at least one file to submit')).toBeInTheDocument()
  })

  it('should disable submit button when no files selected', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    const submitButton = screen.getByText('Submit Assignment')
    expect(submitButton).toBeDisabled()
  })

  it('should enable submit button when files are selected', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    // Upload a file
    const fileInput = screen.getByLabelText('Choose Files')
    const file = new File(['content'], 'submission.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    const submitButton = screen.getByText('Submit Assignment')
    expect(submitButton).not.toBeDisabled()
  })

  it('should submit assignment successfully', async () => {
    ;(assignmentService.submitAssignment as any).mockResolvedValue(true)

    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    // Upload a file
    const fileInput = screen.getByLabelText('Choose Files')
    const file = new File(['content'], 'submission.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Submit
    const submitButton = screen.getByText('Submit Assignment')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(assignmentService.submitAssignment).toHaveBeenCalledWith('1', [file])
      expect(mockOnSuccess).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('should handle submission error', async () => {
    ;(assignmentService.submitAssignment as any).mockResolvedValue(false)

    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    // Upload a file
    const fileInput = screen.getByLabelText('Choose Files')
    const file = new File(['content'], 'submission.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Submit
    const submitButton = screen.getByText('Submit Assignment')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(assignmentService.submitAssignment).toHaveBeenCalledWith('1', [file])
      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  it('should show time remaining correctly', () => {
    const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
    const assignmentWithFutureDue = {
      ...mockAssignment,
      dueDate: futureDate
    }

    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={assignmentWithFutureDue}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText(/hours left/)).toBeInTheDocument()
  })

  it('should show overdue warning', () => {
    const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    const overdueAssignment = {
      ...mockAssignment,
      dueDate: pastDate
    }

    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={overdueAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('should close modal when cancel is clicked', () => {
    render(
      <SubmitAssignmentModal
        isOpen={true}
        onClose={mockOnClose}
        assignment={mockAssignment}
        onSuccess={mockOnSuccess}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
