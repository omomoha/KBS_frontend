import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Award, 
  BookOpen,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react'

import { useState } from 'react'
import { cn } from '@/utils/cn'

// Mock data - in a real app, this would come from an API
const transcriptData = {
  id: '1',
  studentId: 'STU-2024-001',
  studentName: 'John Doe',
  programme: {
    id: '1',
    title: 'Diploma in Business Management',
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    totalCredits: 24
  },
  gpa: 3.75,
  totalCredits: 24,
  completedCredits: 24,
  generatedAt: '2024-01-20',
  downloadUrl: '/api/transcripts/1/download',
  courses: [
    {
      id: '1',
      courseCode: 'BM101',
      courseTitle: 'Business Fundamentals',
      credits: 3,
      grade: 'A',
      points: 4.0,
      completedAt: '2023-03-15',
      semester: 'Spring 2023'
    },
    {
      id: '2',
      courseCode: 'PM201',
      courseTitle: 'Project Management',
      credits: 3,
      grade: 'A-',
      points: 3.7,
      completedAt: '2023-06-20',
      semester: 'Spring 2023'
    },
    {
      id: '3',
      courseCode: 'DM301',
      courseTitle: 'Digital Marketing',
      credits: 3,
      grade: 'B+',
      points: 3.3,
      completedAt: '2023-09-10',
      semester: 'Fall 2023'
    },
    {
      id: '4',
      courseCode: 'BE401',
      courseTitle: 'Business Ethics',
      credits: 2,
      grade: 'A',
      points: 4.0,
      completedAt: '2023-12-15',
      semester: 'Fall 2023'
    },
    {
      id: '5',
      courseCode: 'FM501',
      courseTitle: 'Financial Management',
      credits: 3,
      grade: 'A-',
      points: 3.7,
      completedAt: '2024-01-10',
      semester: 'Winter 2024'
    },
    {
      id: '6',
      courseCode: 'SM601',
      courseTitle: 'Strategic Management',
      credits: 3,
      grade: 'A',
      points: 4.0,
      completedAt: '2024-01-15',
      semester: 'Winter 2024'
    },
    {
      id: '7',
      courseCode: 'OM701',
      courseTitle: 'Operations Management',
      credits: 3,
      grade: 'B+',
      points: 3.3,
      completedAt: '2024-01-15',
      semester: 'Winter 2024'
    },
    {
      id: '8',
      courseCode: 'CM801',
      courseTitle: 'Capstone Project',
      credits: 4,
      grade: 'A',
      points: 4.0,
      completedAt: '2024-01-15',
      semester: 'Winter 2024'
    }
  ]
}

export function TranscriptPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Downloading transcript...')
    setIsGenerating(false)
  }

  const handlePreview = () => {
    console.log('Previewing transcript...')
    // In a real app, this would open a preview modal
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-success-600'
    if (grade.startsWith('B')) return 'text-warning-600'
    if (grade.startsWith('C')) return 'text-error-600'
    return 'text-secondary-600'
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-success-600'
    if (gpa >= 3.0) return 'text-warning-600'
    return 'text-error-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Academic Transcript</h1>
          <p className="text-secondary-600 mt-1">
            Official academic record and transcript
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={handlePreview}
            className="btn btn-outline btn-md"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="btn btn-primary btn-md"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transcript Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {transcriptData.gpa}
            </div>
            <div className="text-sm text-secondary-600">GPA</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {transcriptData.completedCredits}
            </div>
            <div className="text-sm text-secondary-600">Credits Completed</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {transcriptData.courses.length}
            </div>
            <div className="text-sm text-secondary-600">Courses</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">
              {transcriptData.programme.totalCredits}
            </div>
            <div className="text-sm text-secondary-600">Total Credits</div>
          </div>
        </div>
      </div>

      {/* Student Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Student Information</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">Personal Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Student ID:</span>
                  <span className="font-medium">{transcriptData.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Name:</span>
                  <span className="font-medium">{transcriptData.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Programme:</span>
                  <span className="font-medium">{transcriptData.programme.title}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">Programme Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Start Date:</span>
                  <span className="font-medium">
                    {new Date(transcriptData.programme.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">End Date:</span>
                  <span className="font-medium">
                    {new Date(transcriptData.programme.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Generated:</span>
                  <span className="font-medium">
                    {new Date(transcriptData.generatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grades */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Course Grades</h3>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 font-medium text-secondary-900">Course Code</th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-900">Course Title</th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-900">Credits</th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-900">Grade</th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-900">Points</th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-900">Semester</th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-900">Completed</th>
                </tr>
              </thead>
              <tbody>
                {transcriptData.courses.map((course) => (
                  <tr key={course.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-3 px-4 font-mono text-sm">{course.courseCode}</td>
                    <td className="py-3 px-4">{course.courseTitle}</td>
                    <td className="py-3 px-4 text-center">{course.credits}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn('font-semibold', getGradeColor(course.grade))}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{course.points}</td>
                    <td className="py-3 px-4 text-center text-sm text-secondary-600">
                      {course.semester}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-secondary-600">
                      {new Date(course.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grade Legend */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Grade Scale</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 mb-1">A</div>
              <div className="text-sm text-secondary-600">4.0 - 3.7</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600 mb-1">B</div>
              <div className="text-sm text-secondary-600">3.6 - 3.0</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error-600 mb-1">C</div>
              <div className="text-sm text-secondary-600">2.9 - 2.0</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600 mb-1">D</div>
              <div className="text-sm text-secondary-600">1.9 - 1.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
