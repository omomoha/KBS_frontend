import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Users, 
  Calendar, 
  Award, 
  Building2, 
  BookOpen, 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Assignment, AssignmentSubmission } from '@/types/assignments'
import { assignmentService } from '@/services/assignmentService'
import { useAuth } from '@/contexts/AuthContext'
import { GradeAssignmentModal } from '@/components/GradeAssignmentModal'
import { SubmitAssignmentModal } from '@/components/SubmitAssignmentModal'

export function AssignmentDetailsPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' || user?.role === 'instructor'

  useEffect(() => {
    if (assignmentId) {
      loadAssignment()
      loadSubmissions()
    }
  }, [assignmentId])

  const loadAssignment = async () => {
    if (!assignmentId) return

    setIsLoading(true)
    try {
      const data = await assignmentService.getAssignment(assignmentId)
      setAssignment(data)
    } catch (error) {
      console.error('Failed to load assignment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSubmissions = async () => {
    if (!assignmentId) return

    try {
      const data = await assignmentService.getSubmissions(assignmentId)
      setSubmissions(data)
    } catch (error) {
      console.error('Failed to load submissions:', error)
    }
  }

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      await assignmentService.downloadFile(fileUrl, fileName)
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  const handleGradeSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission)
    setIsGradeModalOpen(true)
  }

  const handleSubmitAssignment = () => {
    setIsSubmitModalOpen(true)
  }

  const handleGradeSuccess = () => {
    loadSubmissions()
    setIsGradeModalOpen(false)
  }

  const handleSubmitSuccess = () => {
    loadSubmissions()
    setIsSubmitModalOpen(false)
  }

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = !searchTerm || 
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800'
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'late':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded':
        return <CheckCircle className="h-4 w-4" />
      case 'submitted':
        return <Clock className="h-4 w-4" />
      case 'late':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Assignment Not Found</h2>
        <p className="text-secondary-600 mb-4">The assignment you're looking for doesn't exist.</p>
        <Link to="/assignments">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/assignments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">{assignment.title}</h1>
            <p className="text-secondary-600 mt-1">
              {assignment.courseTitle} • {assignment.department}
            </p>
          </div>
        </div>
        {!isAdmin && (
          <Button onClick={handleSubmitAssignment}>
            <Upload className="h-4 w-4 mr-2" />
            Submit Assignment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-700 whitespace-pre-wrap">{assignment.description}</p>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-secondary-700 whitespace-pre-wrap">{assignment.instructions}</p>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Files */}
          {assignment.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Assignment Files</CardTitle>
                <CardDescription>Download the assignment files and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assignment.attachments.map((attachment) => (
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
                        onClick={() => handleDownloadFile(attachment.fileUrl, attachment.fileName)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submissions (Admin only) */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Submissions ({submissions.length})</CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-48"
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="submitted">Submitted</option>
                      <option value="graded">Graded</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredSubmissions.length > 0 ? (
                  <div className="space-y-3">
                    {filteredSubmissions.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary-50">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{submission.studentName}</h4>
                              <Badge className={getStatusColor(submission.status)}>
                                {getStatusIcon(submission.status)}
                                <span className="ml-1 capitalize">{submission.status}</span>
                              </Badge>
                              {submission.isLate && (
                                <Badge className="bg-red-100 text-red-800">
                                  Late ({submission.lateDays} days)
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-secondary-600">{submission.studentEmail}</p>
                            <p className="text-xs text-secondary-500">
                              Submitted: {new Date(submission.submittedAt).toLocaleString()}
                            </p>
                            {submission.grade !== undefined && (
                              <p className="text-sm font-medium text-green-600">
                                Grade: {submission.grade}/{assignment.maxPoints}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGradeSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {submission.grade !== undefined ? 'View Grade' : 'Grade'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">No Submissions Yet</h3>
                    <p className="text-secondary-600">Students haven't submitted this assignment yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm font-medium">Course</p>
                  <p className="text-sm text-secondary-600">{assignment.courseTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-secondary-600">{assignment.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm text-secondary-600">
                    {new Date(assignment.dueDate).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm font-medium">Max Points</p>
                  <p className="text-sm text-secondary-600">{assignment.maxPoints}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-secondary-600 capitalize">{assignment.assignmentType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics (Admin only) */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-secondary-600">Total Submissions</span>
                  <span className="font-medium">{assignment.totalSubmissions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-secondary-600">Graded</span>
                  <span className="font-medium">{assignment.gradedSubmissions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-secondary-600">Pending</span>
                  <span className="font-medium">
                    {assignment.totalSubmissions - assignment.gradedSubmissions}
                  </span>
                </div>
                {assignment.averageGrade && (
                  <div className="flex justify-between">
                    <span className="text-sm text-secondary-600">Average Grade</span>
                    <span className="font-medium">{assignment.averageGrade.toFixed(1)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <GradeAssignmentModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        submission={selectedSubmission}
        assignment={assignment}
        onSuccess={handleGradeSuccess}
      />

      <SubmitAssignmentModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        assignment={assignment}
        onSuccess={handleSubmitSuccess}
      />
    </div>
  )
}
