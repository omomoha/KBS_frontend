import { 
  BookOpen, 
  Play, 
  Download, 
  Upload, 
  FileText, 
  Clock, 
  Users,
  ChevronRight,
  CheckCircle,
  Lock,
  Video,
  Image,
  Settings
} from 'lucide-react'

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Mock data - in a real app, this would come from an API
const courseData = {
  id: '1',
  title: 'Project Management Fundamentals',
  description: 'Learn the essential principles and practices of project management in modern organizations.',
  instructor: 'Dr. Sarah Johnson',
  duration: '8 weeks',
  students: 45,
  progress: 65,
  modules: [
    {
      id: '1',
      title: 'Introduction to Project Management',
      description: 'Overview of project management concepts and methodologies',
      duration: '2 hours',
      isCompleted: true,
      resources: [
        { id: '1', title: 'Introduction Video', type: 'video', duration: '15 min' },
        { id: '2', title: 'Project Management Basics PDF', type: 'pdf', size: '2.3 MB' },
        { id: '3', title: 'Quiz: Module 1', type: 'quiz', questions: 10 },
      ]
    },
    {
      id: '2',
      title: 'Project Planning and Scheduling',
      description: 'Learn how to create effective project plans and schedules',
      duration: '3 hours',
      isCompleted: true,
      resources: [
        { id: '4', title: 'Planning Techniques Video', type: 'video', duration: '25 min' },
        { id: '5', title: 'Gantt Charts Guide', type: 'pdf', size: '1.8 MB' },
        { id: '6', title: 'Assignment: Create Project Plan', type: 'assignment', dueDate: '2024-01-15' },
      ]
    },
    {
      id: '3',
      title: 'Risk Management',
      description: 'Identify, assess, and manage project risks effectively',
      duration: '2.5 hours',
      isCompleted: false,
      isLocked: false,
      resources: [
        { id: '7', title: 'Risk Assessment Video', type: 'video', duration: '20 min' },
        { id: '8', title: 'Risk Management Template', type: 'pdf', size: '1.2 MB' },
      ]
    },
    {
      id: '4',
      title: 'Team Management',
      description: 'Building and leading effective project teams',
      duration: '2 hours',
      isCompleted: false,
      isLocked: true,
      resources: []
    }
  ],
  assignments: [
    {
      id: '1',
      title: 'Project Charter Assignment',
      description: 'Create a comprehensive project charter for a sample project',
      dueDate: '2024-01-15',
      status: 'submitted',
      grade: 85,
      maxPoints: 100
    },
    {
      id: '2',
      title: 'Risk Assessment Report',
      description: 'Identify and analyze risks for a given project scenario',
      dueDate: '2024-01-22',
      status: 'pending',
      grade: null,
      maxPoints: 100
    }
  ]
}

export function CoursePage() {
  const { courseId: _courseId } = useParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'assignments'>('overview')

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                {courseData.title}
              </h1>
              <p className="text-secondary-600 mb-4">
                {courseData.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {courseData.students} students
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {courseData.duration}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Instructor: {courseData.instructor}
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 lg:ml-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  {courseData.progress}%
                </div>
                <div className="text-sm text-secondary-600">Complete</div>
              </div>
              <div className="w-32 bg-secondary-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${courseData.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Course Content
            </span>
            <Link to={`/courses/${courseData.id}/content`}>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Manage Content
              </Button>
            </Link>
          </CardTitle>
          <CardDescription>
            Upload and manage videos, documents, and images for this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
              <div className="flex-shrink-0">
                <Video className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-secondary-900">Videos</h3>
                <p className="text-sm text-secondary-600">12 uploaded</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-secondary-900">Documents</h3>
                <p className="text-sm text-secondary-600">8 uploaded</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
              <div className="flex-shrink-0">
                <Image className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-secondary-900">Images</h3>
                <p className="text-sm text-secondary-600">15 uploaded</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center">
              <Video className="h-3 w-3 mr-1" />
              MP4, AVI, MOV
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              PDF, DOC, DOCX
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Image className="h-3 w-3 mr-1" />
              JPG, PNG, GIF
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Course Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'modules', label: 'Modules' },
            { id: 'assignments', label: 'Assignments' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <CourseOverview course={courseData} />}
      {activeTab === 'modules' && <CourseModules modules={courseData.modules} />}
      {activeTab === 'assignments' && <CourseAssignments assignments={courseData.assignments} />}
    </div>
  )
}

function CourseOverview({ course }: { course: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Course Progress</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-success-600">3</div>
                  <div className="text-sm text-secondary-600">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning-600">1</div>
                  <div className="text-sm text-secondary-600">In Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success-600" />
                <div>
                  <p className="text-sm text-secondary-900">Completed Module 2</p>
                  <p className="text-xs text-secondary-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-secondary-900">Submitted Assignment 1</p>
                  <p className="text-xs text-secondary-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseModules({ modules }: { modules: any[] }) {
  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <div key={module.id} className="card">
          <div className="card-content">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {module.isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-success-600" />
                  ) : module.isLocked ? (
                    <Lock className="h-6 w-6 text-secondary-400" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-secondary-300"></div>
                  )}
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Module {index + 1}: {module.title}
                  </h3>
                </div>
                <p className="text-secondary-600 mb-3">{module.description}</p>
                <div className="flex items-center text-sm text-secondary-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {module.duration}
                </div>
              </div>
              <div className="ml-4">
                {module.isCompleted ? (
                  <span className="badge badge-success">Completed</span>
                ) : module.isLocked ? (
                  <span className="badge badge-secondary">Locked</span>
                ) : (
                  <button className="btn btn-primary btn-sm">
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </button>
                )}
              </div>
            </div>

            {module.resources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-secondary-200">
                <h4 className="text-sm font-medium text-secondary-900 mb-3">Resources</h4>
                <div className="space-y-2">
                  {module.resources.map((resource: any) => (
                    <div key={resource.id} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-secondary-500" />
                        <span className="text-sm text-secondary-900">{resource.title}</span>
                        {resource.duration && (
                          <span className="text-xs text-secondary-500">{resource.duration}</span>
                        )}
                        {resource.size && (
                          <span className="text-xs text-secondary-500">{resource.size}</span>
                        )}
                      </div>
                      <button className="btn btn-ghost btn-sm">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function CourseAssignments({ assignments }: { assignments: any[] }) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="card">
          <div className="card-content">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {assignment.title}
                </h3>
                <p className="text-secondary-600 mb-3">{assignment.description}</p>
                <div className="flex items-center space-x-4 text-sm text-secondary-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {assignment.maxPoints} points
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end space-y-2">
                <span className={cn(
                  'badge',
                  assignment.status === 'submitted' ? 'badge-success' : 'badge-warning'
                )}>
                  {assignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                </span>
                {assignment.grade && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">
                      {assignment.grade}/{assignment.maxPoints}
                    </div>
                    <div className="text-xs text-secondary-500">Grade</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="flex space-x-2">
                {assignment.status === 'submitted' ? (
                  <button className="btn btn-outline btn-sm">
                    View Submission
                  </button>
                ) : (
                  <button className="btn btn-primary btn-sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Submit Assignment
                  </button>
                )}
                <button className="btn btn-ghost btn-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
