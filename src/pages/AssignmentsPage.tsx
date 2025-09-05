import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FilterBar, FilterConfig } from '@/components/ui/FilterBar'
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Edit, 
  Users, 
  Plus,
  Download,
  Award,
  Building2,
  BookOpen,
  Upload
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Assignment, AssignmentSubmission, AssignmentFilter, AssignmentStats } from '@/types/assignments'
import { CreateAssignmentModal } from '@/components/CreateAssignmentModal'
import { SubmitAssignmentModal } from '@/components/SubmitAssignmentModal'
import { GradeAssignmentModal } from '@/components/GradeAssignmentModal'
import { assignmentService } from '@/services/assignmentService'
import { useNotifications } from '@/contexts/NotificationContext'

// Mock data for assignments
const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Business Plan Analysis',
    description: 'Analyze a real business plan and provide recommendations for improvement.',
    instructions: '1. Select a real business plan from the provided list\n2. Analyze the business model, market analysis, and financial projections\n3. Provide specific recommendations for improvement\n4. Submit a 5-page written analysis with supporting data',
    courseId: '1',
    courseTitle: 'Introduction to Business Management',
    department: 'Business Administration',
    instructorId: 'instructor1',
    instructorName: 'Dr. Sarah Johnson',
    dueDate: '2024-01-15T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    maxPoints: 100,
    assignmentType: 'essay',
    status: 'published',
    attachments: [
      {
        id: 'att1',
        fileName: 'Business Plan Template.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        fileUrl: '/api/files/business-plan-template.pdf',
        uploadedAt: '2024-01-01T00:00:00Z'
      }
    ],
    submissions: [
      {
        id: 'sub1',
        assignmentId: '1',
        studentId: 'student1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@kbs.edu.ng',
        submittedAt: '2024-01-14T10:30:00Z',
        status: 'graded',
        grade: 85,
        feedback: 'Excellent analysis with strong recommendations. Well-structured and supported with data.',
        gradedAt: '2024-01-15T14:30:00Z',
        gradedBy: 'Dr. Sarah Johnson',
        attachments: [
          {
            id: 'subatt1',
            fileName: 'business-plan-analysis-john-doe.pdf',
            fileSize: 2048000,
            fileType: 'application/pdf',
            fileUrl: '/api/files/business-plan-analysis-john-doe.pdf',
            uploadedAt: '2024-01-14T10:30:00Z'
          }
        ],
        isLate: false
      },
      {
        id: 'sub2',
        assignmentId: '1',
        studentId: 'student2',
        studentName: 'Sarah Johnson',
        studentEmail: 'sarah.johnson@kbs.edu.ng',
        submittedAt: '2024-01-14T15:45:00Z',
        status: 'submitted',
        grade: undefined,
        feedback: undefined,
        gradedAt: undefined,
        gradedBy: undefined,
        attachments: [
          {
            id: 'subatt2',
            fileName: 'business-plan-analysis-sarah-johnson.pdf',
            fileSize: 1800000,
            fileType: 'application/pdf',
            fileUrl: '/api/files/business-plan-analysis-sarah-johnson.pdf',
            uploadedAt: '2024-01-14T15:45:00Z'
          }
        ],
        isLate: false
      }
    ],
    totalSubmissions: 2,
    gradedSubmissions: 1,
    averageGrade: 85
  },
  {
    id: '2',
    title: 'Digital Marketing Campaign',
    description: 'Create a comprehensive digital marketing campaign for a local business.',
    instructions: '1. Choose a local business from the provided list\n2. Research their target audience and competitors\n3. Develop a complete digital marketing strategy\n4. Create sample content and campaign materials\n5. Present your campaign in a 10-minute presentation',
    courseId: '2',
    courseTitle: 'Digital Marketing Strategies',
    department: 'Marketing',
    instructorId: 'instructor2',
    instructorName: 'Prof. Michael Chen',
    dueDate: '2024-01-20T23:59:59Z',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    maxPoints: 100,
    assignmentType: 'project',
    status: 'published',
    attachments: [
      {
        id: 'att2',
        fileName: 'Marketing Campaign Guidelines.pdf',
        fileSize: 512000,
        fileType: 'application/pdf',
        fileUrl: '/api/files/marketing-campaign-guidelines.pdf',
        uploadedAt: '2024-01-05T00:00:00Z'
      }
    ],
    submissions: [
      {
        id: 'sub3',
        assignmentId: '2',
        studentId: 'student3',
        studentName: 'Michael Chen',
        studentEmail: 'michael.chen@kbs.edu.ng',
        submittedAt: '2024-01-18T09:15:00Z',
        status: 'submitted',
        grade: undefined,
        feedback: undefined,
        gradedAt: undefined,
        gradedBy: undefined,
        attachments: [
          {
            id: 'subatt3',
            fileName: 'digital-marketing-campaign-michael-chen.pdf',
            fileSize: 3072000,
            fileType: 'application/pdf',
            fileUrl: '/api/files/digital-marketing-campaign-michael-chen.pdf',
            uploadedAt: '2024-01-18T09:15:00Z'
          }
        ],
        isLate: false
      }
    ],
    totalSubmissions: 1,
    gradedSubmissions: 0,
    averageGrade: undefined
  },
  {
    id: '3',
    title: 'Financial Statement Analysis',
    description: 'Analyze financial statements and provide investment recommendations.',
    instructions: '1. Select a publicly traded company\n2. Analyze their financial statements for the past 3 years\n3. Calculate key financial ratios\n4. Provide investment recommendations with supporting analysis\n5. Submit a comprehensive report with Excel calculations',
    courseId: '3',
    courseTitle: 'Financial Analysis and Reporting',
    department: 'Finance',
    instructorId: 'instructor3',
    instructorName: 'Dr. Emily Rodriguez',
    dueDate: '2024-01-25T23:59:59Z',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    maxPoints: 100,
    assignmentType: 'case_study',
    status: 'published',
    attachments: [
      {
        id: 'att3',
        fileName: 'Financial Analysis Template.xlsx',
        fileSize: 256000,
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileUrl: '/api/files/financial-analysis-template.xlsx',
        uploadedAt: '2024-01-10T00:00:00Z'
      }
    ],
    submissions: [],
    totalSubmissions: 0,
    gradedSubmissions: 0,
    averageGrade: undefined
  }
]

export function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [filters, setFilters] = useState<AssignmentFilter>({})
  const [stats, setStats] = useState<AssignmentStats | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const isAdmin = user?.role === 'admin' || user?.role === 'instructor'

  useEffect(() => {
    loadAssignments()
    loadStats()
  }, [])

  const loadAssignments = async () => {
    setIsLoading(true)
    try {
      const data = await assignmentService.getAssignments(filters)
      setAssignments(data.length > 0 ? data : mockAssignments)
    } catch (error) {
      console.error('Failed to load assignments:', error)
      setAssignments(mockAssignments)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await assignmentService.getAssignmentStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleCreateAssignment = (assignment: Assignment) => {
    setAssignments(prev => [assignment, ...prev])
    addNotification({
      title: 'Assignment Created',
      message: `"${assignment.title}" has been created and published to students.`,
      type: 'course_update',
      priority: 'medium',
      isRead: false,
      isArchived: false,
      actionUrl: `/assignments/${assignment.id}`
    })
  }

  const handleSubmitAssignment = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId)
    if (assignment) {
      setSelectedAssignment(assignment)
      setIsSubmitModalOpen(true)
    }
  }

  const handleGradeSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission)
    setSelectedAssignment(assignments.find(a => a.id === submission.assignmentId) || null)
    setIsGradeModalOpen(true)
  }

  const handleGradeSuccess = () => {
    loadAssignments()
    addNotification({
      title: 'Assignment Graded',
      message: 'The assignment has been graded and feedback has been shared with the student.',
      type: 'assignment_graded',
      priority: 'medium',
      isRead: false,
      isArchived: false
    })
  }

  const handleSubmitSuccess = () => {
    loadAssignments()
    addNotification({
      title: 'Assignment Submitted',
      message: 'Your assignment has been submitted successfully.',
      type: 'assignment_reminder',
      priority: 'medium',
      isRead: false,
      isArchived: false
    })
  }

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search assignments by title or course...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'published', label: 'Published', count: assignments.filter(a => a.status === 'published').length },
        { value: 'draft', label: 'Draft', count: assignments.filter(a => a.status === 'draft').length },
        { value: 'closed', label: 'Closed', count: assignments.filter(a => a.status === 'closed').length }
      ]
    },
    {
      key: 'assignmentType',
      label: 'Type',
      type: 'select',
      options: [
        { value: 'essay', label: 'Essay', count: assignments.filter(a => a.assignmentType === 'essay').length },
        { value: 'project', label: 'Project', count: assignments.filter(a => a.assignmentType === 'project').length },
        { value: 'quiz', label: 'Quiz', count: assignments.filter(a => a.assignmentType === 'quiz').length },
        { value: 'case_study', label: 'Case Study', count: assignments.filter(a => a.assignmentType === 'case_study').length }
      ]
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { value: 'Business Administration', label: 'Business Administration', count: assignments.filter(a => a.department === 'Business Administration').length },
        { value: 'Marketing', label: 'Marketing', count: assignments.filter(a => a.department === 'Marketing').length },
        { value: 'Finance', label: 'Finance', count: assignments.filter(a => a.department === 'Finance').length }
      ]
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      type: 'dateRange',
      fromKey: 'dueDateFrom',
      toKey: 'dueDateTo'
    }
  ]

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = !filters.search || 
      assignment.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      assignment.courseTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
      assignment.description.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = !filters.status || assignment.status === filters.status
    const matchesType = !filters.assignmentType || assignment.assignmentType === filters.assignmentType
    const matchesDepartment = !filters.department || assignment.department === filters.department
    
    const matchesDueDate = !filters.dueDateFrom || !filters.dueDateTo || (
      (!filters.dueDateFrom || new Date(assignment.dueDate) >= new Date(filters.dueDateFrom)) &&
      (!filters.dueDateTo || new Date(assignment.dueDate) <= new Date(filters.dueDateTo))
    )

    return matchesSearch && matchesStatus && matchesType && matchesDepartment && matchesDueDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4" />
      case 'draft':
        return <Clock className="h-4 w-4" />
      case 'closed':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'essay':
        return <FileText className="h-4 w-4" />
      case 'project':
        return <BookOpen className="h-4 w-4" />
      case 'quiz':
        return <Award className="h-4 w-4" />
      case 'case_study':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            {isAdmin ? 'Assignment Submissions' : 'Assignments'}
          </h1>
          <p className="text-secondary-600 mt-2">
            {isAdmin 
              ? 'Review and grade student assignment submissions'
              : 'Manage your assignments and track your progress'
            }
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {isAdmin && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Total Assignments</p>
                  <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                </div>
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Total Submissions</p>
                  <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                </div>
                <Upload className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Graded</p>
                  <p className="text-2xl font-bold">{stats.gradedSubmissions}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Average Grade</p>
                  <p className="text-2xl font-bold">{stats.averageGrade?.toFixed(1) || 'N/A'}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <FilterBar
        filters={filterConfig}
        onFiltersChange={setFilters}
        searchPlaceholder="Search assignments by title or course..."
      />

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getAssignmentTypeIcon(assignment.assignmentType)}
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStatusColor(assignment.status)}>
                    {getStatusIcon(assignment.status)}
                    <span className="ml-1 capitalize">{assignment.status}</span>
                  </Badge>
                  {isOverdue(assignment.dueDate) && assignment.status === 'published' && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {assignment.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-secondary-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{assignment.courseTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{assignment.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>{assignment.maxPoints} points</span>
                </div>
              </div>

              {isAdmin ? (
                // Admin view - show submissions
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-secondary-700">Submissions</span>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {assignment.totalSubmissions}
                    </Badge>
                  </div>
                  
                  {assignment.submissions && assignment.submissions.length > 0 ? (
                    <div className="space-y-2">
                      {assignment.submissions.slice(0, 2).map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{submission.studentName}</p>
                            <p className="text-xs text-secondary-600">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {submission.status === 'graded' ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Graded
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleGradeSubmission(submission)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {assignment.submissions && assignment.submissions.length > 2 && (
                        <p className="text-xs text-secondary-500 text-center">
                          +{assignment.submissions.length - 2} more submissions
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-secondary-500 text-center py-2">
                      No submissions yet
                    </p>
                  )}
                </div>
              ) : (
                // Learner view - show personal progress
                <div className="space-y-3">
                  {assignment.attachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-2">Assignment Files</p>
                      <div className="space-y-1">
                        {assignment.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                            <span className="text-sm">{attachment.fileName}</span>
                            <Button size="sm" variant="ghost">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubmitAssignment(assignment.id)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Link to={`/assignments/${assignment.id}`}>
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    {isAdmin ? 'View Details' : 'View Assignment'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateAssignment}
      />

      <SubmitAssignmentModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        assignment={selectedAssignment}
        onSuccess={handleSubmitSuccess}
      />

      <GradeAssignmentModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        submission={selectedSubmission}
        assignment={selectedAssignment}
        onSuccess={handleGradeSuccess}
      />
    </div>
  )
}