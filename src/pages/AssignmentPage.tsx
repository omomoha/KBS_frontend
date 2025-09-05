import { 
  FileText, 
  Upload, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Calendar,
  File
} from 'lucide-react'

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from '@/utils/cn'

// Mock data - in a real app, this would come from an API
const assignmentData = {
  id: '1',
  title: 'Project Charter Assignment',
  description: 'Create a comprehensive project charter for a sample project. Include all essential elements such as project objectives, scope, stakeholders, timeline, and success criteria.',
  instructions: `
    <h3>Assignment Instructions</h3>
    <p>For this assignment, you will create a project charter for one of the following scenarios:</p>
    <ul>
      <li>Implementing a new customer relationship management (CRM) system</li>
      <li>Launching a new product line</li>
      <li>Organizing a company-wide training program</li>
    </ul>
    
    <h4>Requirements:</h4>
    <ul>
      <li>Use the project charter template provided</li>
      <li>Include all required sections</li>
      <li>Ensure clarity and professionalism</li>
      <li>Submit as a PDF document</li>
    </ul>
    
    <h4>Grading Criteria:</h4>
    <ul>
      <li>Completeness (40%)</li>
      <li>Clarity and organization (30%)</li>
      <li>Professional presentation (20%)</li>
      <li>Timeliness (10%)</li>
    </ul>
  `,
  dueDate: '2024-01-15T23:59:00Z',
  maxPoints: 100,
  courseTitle: 'Project Management Fundamentals',
  instructor: 'Dr. Sarah Johnson',
  rubric: [
    { criterion: 'Completeness', maxPoints: 40, description: 'All required sections included' },
    { criterion: 'Clarity and Organization', maxPoints: 30, description: 'Clear, well-structured content' },
    { criterion: 'Professional Presentation', maxPoints: 20, description: 'Professional formatting and style' },
    { criterion: 'Timeliness', maxPoints: 10, description: 'Submitted on time' },
  ],
  submission: {
    id: '1',
    status: 'submitted',
    submittedAt: '2024-01-14T10:30:00Z',
    files: [
      {
        id: '1',
        fileName: 'project_charter_john_doe.pdf',
        fileSize: 2457600,
        uploadedAt: '2024-01-14T10:30:00Z',
      }
    ],
    grade: 85,
    feedback: 'Good work overall. The project charter is well-structured and includes most required elements. Consider adding more detail in the risk assessment section.',
    gradedAt: '2024-01-16T14:20:00Z',
  }
}

export function AssignmentPage() {
  const { assignmentId: _assignmentId } = useParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'submission' | 'rubric'>('overview')

  const isOverdue = new Date(assignmentData.dueDate) < new Date()
  const timeRemaining = new Date(assignmentData.dueDate).getTime() - new Date().getTime()
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      {/* Assignment Header */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                {assignmentData.title}
              </h1>
              <p className="text-secondary-600 mb-4">
                {assignmentData.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: {new Date(assignmentData.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {assignmentData.maxPoints} points
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {assignmentData.instructor}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {isOverdue ? 'Overdue' : `${daysRemaining} days remaining`}
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 lg:ml-6">
              <div className="text-right">
                <div className={cn(
                  'text-2xl font-bold',
                  isOverdue ? 'text-error-600' : 'text-warning-600'
                )}>
                  {isOverdue ? 'Overdue' : `${daysRemaining}d`}
                </div>
                <div className="text-sm text-secondary-600">Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'submission', label: 'My Submission' },
            { id: 'rubric', label: 'Rubric' },
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
      {activeTab === 'overview' && <AssignmentOverview assignment={assignmentData} />}
      {activeTab === 'submission' && <AssignmentSubmission submission={assignmentData.submission} />}
      {activeTab === 'rubric' && <AssignmentRubric rubric={assignmentData.rubric} />}
    </div>
  )
}

function AssignmentOverview({ assignment }: { assignment: any }) {
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Instructions</h3>
        </div>
        <div className="card-content">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: assignment.instructions }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Assignment Details</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-secondary-600">Course</span>
                <span className="font-medium">{assignment.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Instructor</span>
                <span className="font-medium">{assignment.instructor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Points</span>
                <span className="font-medium">{assignment.maxPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Due Date</span>
                <span className="font-medium">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Submission Guidelines</h3>
          </div>
          <div className="card-content">
            <ul className="space-y-2 text-sm text-secondary-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                Submit as PDF format only
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                Maximum file size: 10MB
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                Use the provided template
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                Include your name and student ID
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function AssignmentSubmission({ submission }: { submission: any }) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsUploading(false)
  }

  return (
    <div className="space-y-6">
      {submission ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Your Submission</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Status</span>
                <span className={cn(
                  'badge',
                  submission.status === 'submitted' ? 'badge-success' : 'badge-warning'
                )}>
                  {submission.status === 'submitted' ? 'Submitted' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Submitted</span>
                <span className="font-medium">
                  {new Date(submission.submittedAt).toLocaleString()}
                </span>
              </div>
              
              {submission.grade && (
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Grade</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {submission.grade}/100
                    </div>
                    <div className="text-sm text-secondary-500">
                      Graded on {new Date(submission.gradedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {submission.feedback && (
                <div>
                  <h4 className="font-medium text-secondary-900 mb-2">Instructor Feedback</h4>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <p className="text-secondary-700">{submission.feedback}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-secondary-900 mb-2">Submitted Files</h4>
                <div className="space-y-2">
                  {submission.files.map((file: any) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-secondary-500" />
                        <div>
                          <p className="text-sm font-medium text-secondary-900">{file.fileName}</p>
                          <p className="text-xs text-secondary-500">
                            {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button className="btn btn-ghost btn-sm">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Submit Assignment</h3>
          </div>
          <div className="card-content">
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Upload your assignment
              </h3>
              <p className="text-secondary-600 mb-4">
                Drag and drop your files here, or click to browse
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className={cn(
                  'btn btn-primary btn-md cursor-pointer',
                  isUploading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Choose Files'
                )}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AssignmentRubric({ rubric }: { rubric: any[] }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Grading Rubric</h3>
        <p className="card-description">
          This rubric will be used to evaluate your assignment
        </p>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {rubric.map((item, index) => (
            <div key={index} className="border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-secondary-900">{item.criterion}</h4>
                <span className="text-sm font-medium text-primary-600">
                  {item.maxPoints} points
                </span>
              </div>
              <p className="text-sm text-secondary-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
