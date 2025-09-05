import { useState } from 'react'
import { X, Download, FileText, User, Calendar, Award, MessageSquare } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AssignmentSubmission, GradeAssignmentData } from '@/types/assignments'
import { assignmentService } from '@/services/assignmentService'

interface GradeAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  submission: AssignmentSubmission | null
  assignment: any
  onSuccess: () => void
}

export function GradeAssignmentModal({ isOpen, onClose, submission, assignment, onSuccess }: GradeAssignmentModalProps) {
  const [grade, setGrade] = useState(submission?.grade || 0)
  const [feedback, setFeedback] = useState(submission?.feedback || '')
  const [isGrading, setIsGrading] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  const handleDownload = async (attachment: any) => {
    setIsDownloading(attachment.id)
    try {
      await assignmentService.downloadFile(attachment.fileUrl, attachment.fileName)
    } catch (error) {
      console.error('Failed to download file:', error)
    } finally {
      setIsDownloading(null)
    }
  }

  const handleSubmit = async () => {
    if (!submission) return

    setIsGrading(true)
    try {
      const gradeData: GradeAssignmentData = {
        submissionId: submission.id,
        grade,
        feedback,
        gradedBy: 'current-user-id' // In real app, get from auth context
      }

      const success = await assignmentService.gradeSubmission(gradeData)
      if (success) {
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Failed to grade submission:', error)
    } finally {
      setIsGrading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getGradeColor = (grade: number, maxPoints: number) => {
    const percentage = (grade / maxPoints) * 100
    if (percentage >= 90) return 'bg-green-100 text-green-800'
    if (percentage >= 80) return 'bg-blue-100 text-blue-800'
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800'
    if (percentage >= 60) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'graded':
        return 'bg-green-100 text-green-800'
      case 'late':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!submission || !assignment) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Grade Assignment">
      <div className="space-y-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="font-medium">{submission.studentName}</p>
                  <p className="text-sm text-secondary-600">{submission.studentEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="font-medium">Submitted</p>
                  <p className="text-sm text-secondary-600">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge className={getStatusColor(submission.status)}>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </Badge>
              {submission.isLate && (
                <Badge className="bg-red-100 text-red-800">
                  Late ({submission.lateDays} days)
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assignment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Assignment:</span>
                <span>{assignment.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Course:</span>
                <span>{assignment.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Max Points:</span>
                <span>{assignment.maxPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Due Date:</span>
                <span>{new Date(assignment.dueDate).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submitted Files */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submitted Files</CardTitle>
            <CardDescription>Download and review the student's submitted files</CardDescription>
          </CardHeader>
          <CardContent>
            {submission.attachments.length > 0 ? (
              <div className="space-y-2">
                {submission.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-secondary-500" />
                      <div>
                        <p className="font-medium text-sm">{attachment.fileName}</p>
                        <p className="text-xs text-secondary-500">{formatFileSize(attachment.fileSize)}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(attachment)}
                      disabled={isDownloading === attachment.id}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isDownloading === attachment.id ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-500 text-center py-4">No files submitted</p>
            )}
          </CardContent>
        </Card>

        {/* Grading */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grading</CardTitle>
            <CardDescription>Provide a grade and feedback for this submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Grade (out of {assignment.maxPoints})
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(parseFloat(e.target.value) || 0)}
                  min="0"
                  max={assignment.maxPoints}
                  step="0.1"
                  className="w-32"
                />
                <span className="text-sm text-secondary-600">/ {assignment.maxPoints}</span>
                {grade > 0 && (
                  <Badge className={getGradeColor(grade, assignment.maxPoints)}>
                    {((grade / assignment.maxPoints) * 100).toFixed(1)}%
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback for the student..."
                rows={6}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {submission.gradedAt && (
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-sm text-secondary-600">
                  <strong>Previously graded on:</strong> {new Date(submission.gradedAt).toLocaleString()}
                </p>
                {submission.gradedBy && (
                  <p className="text-sm text-secondary-600">
                    <strong>Graded by:</strong> {submission.gradedBy}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isGrading}>
            {isGrading ? 'Grading...' : submission.grade ? 'Update Grade' : 'Submit Grade'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
