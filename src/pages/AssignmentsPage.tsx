import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Clock, CheckCircle, AlertCircle, Eye, Edit, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// Mock data for assignments
const mockAssignments = [
  {
    id: '1',
    title: 'Business Plan Analysis',
    description: 'Analyze a real business plan and provide recommendations for improvement.',
    course: 'Introduction to Business Management',
    dueDate: '2024-01-15',
    status: 'submitted',
    grade: 85,
    maxPoints: 100,
    submittedAt: '2024-01-14T10:30:00Z',
    submissions: [
      {
        id: 'sub1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@kbs.edu.ng',
        submittedAt: '2024-01-14T10:30:00Z',
        grade: 85,
        status: 'graded',
        fileUrl: '/api/files/business-plan-analysis-john-doe.pdf'
      },
      {
        id: 'sub2',
        studentName: 'Sarah Johnson',
        studentEmail: 'sarah.johnson@kbs.edu.ng',
        submittedAt: '2024-01-14T15:45:00Z',
        grade: null,
        status: 'pending',
        fileUrl: '/api/files/business-plan-analysis-sarah-johnson.pdf'
      }
    ]
  },
  {
    id: '2',
    title: 'Digital Marketing Campaign',
    description: 'Create a comprehensive digital marketing campaign for a local business.',
    course: 'Digital Marketing Strategies',
    dueDate: '2024-01-20',
    status: 'pending',
    grade: null,
    maxPoints: 100,
    submittedAt: null,
    submissions: [
      {
        id: 'sub3',
        studentName: 'Michael Chen',
        studentEmail: 'michael.chen@kbs.edu.ng',
        submittedAt: '2024-01-18T09:15:00Z',
        grade: null,
        status: 'pending',
        fileUrl: '/api/files/digital-marketing-campaign-michael-chen.pdf'
      }
    ]
  },
  {
    id: '3',
    title: 'Financial Statement Analysis',
    description: 'Analyze financial statements and provide investment recommendations.',
    course: 'Financial Analysis and Reporting',
    dueDate: '2024-01-25',
    status: 'overdue',
    grade: null,
    maxPoints: 100,
    submittedAt: null,
    submissions: []
  }
]

export function AssignmentsPage() {
  const [assignments] = useState(mockAssignments)
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' || user?.role === 'instructor'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
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
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <Badge className={getStatusColor(assignment.status)}>
                  {getStatusIcon(assignment.status)}
                  <span className="ml-1 capitalize">{assignment.status}</span>
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {assignment.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-secondary-600">
                <strong>Course:</strong> {assignment.course}
              </div>
              
              <div className="flex items-center text-sm text-secondary-600">
                <Calendar className="h-4 w-4 mr-2" />
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </div>

              {isAdmin ? (
                // Admin view - show submissions
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-secondary-700">Submissions</span>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {assignment.submissions.length}
                    </Badge>
                  </div>
                  
                  {assignment.submissions.length > 0 ? (
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
                          </div>
                        </div>
                      ))}
                      {assignment.submissions.length > 2 && (
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
                <>
                  {assignment.grade !== null && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Grade</span>
                      <span className="text-lg font-bold text-green-900">
                        {assignment.grade}/{assignment.maxPoints}
                      </span>
                    </div>
                  )}

                  {assignment.submittedAt && (
                    <div className="text-sm text-secondary-600">
                      <strong>Submitted:</strong> {new Date(assignment.submittedAt).toLocaleString()}
                    </div>
                  )}
                </>
              )}

              <div className="pt-2">
                <Link to={`/assignments/${assignment.id}`}>
                  <Button className="w-full" variant={assignment.status === 'submitted' ? 'outline' : 'default'}>
                    {isAdmin 
                      ? 'Review Submissions' 
                      : assignment.status === 'submitted' 
                        ? 'View Submission' 
                        : 'Start Assignment'
                    }
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
