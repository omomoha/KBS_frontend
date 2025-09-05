import { useState, useEffect } from 'react'
import { X, Upload, FileText, Calendar, Users, Award, BookOpen, Building2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateAssignmentData, AssignmentType, Department, Course } from '@/types/assignments'
import { assignmentService } from '@/services/assignmentService'

interface CreateAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (assignment: any) => void
}

const assignmentTypes: { value: AssignmentType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'essay', label: 'Essay', icon: FileText },
  { value: 'project', label: 'Project', icon: BookOpen },
  { value: 'quiz', label: 'Quiz', icon: Award },
  { value: 'presentation', label: 'Presentation', icon: Users },
  { value: 'lab_report', label: 'Lab Report', icon: FileText },
  { value: 'case_study', label: 'Case Study', icon: BookOpen },
  { value: 'research_paper', label: 'Research Paper', icon: FileText },
  { value: 'other', label: 'Other', icon: FileText }
]

export function CreateAssignmentModal({ isOpen, onClose, onSuccess }: CreateAssignmentModalProps) {
  const [formData, setFormData] = useState<CreateAssignmentData>({
    title: '',
    description: '',
    instructions: '',
    courseId: '',
    department: '',
    dueDate: '',
    maxPoints: 100,
    assignmentType: 'essay',
    attachments: []
  })

  const [departments, setDepartments] = useState<Department[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      loadDepartments()
    }
  }, [isOpen])

  useEffect(() => {
    if (formData.department) {
      loadCourses(formData.department)
    }
  }, [formData.department])

  const loadDepartments = async () => {
    try {
      const depts = await assignmentService.getDepartments()
      setDepartments(depts)
    } catch (error) {
      console.error('Failed to load departments:', error)
    }
  }

  const loadCourses = async (departmentId: string) => {
    try {
      const courseList = await assignmentService.getCourses(departmentId)
      setCourses(courseList)
    } catch (error) {
      console.error('Failed to load courses:', error)
    }
  }

  const handleInputChange = (field: keyof CreateAssignmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required'
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Course is required'
    }

    if (!formData.department) {
      newErrors.department = 'Department is required'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    } else {
      const dueDate = new Date(formData.dueDate)
      const now = new Date()
      if (dueDate <= now) {
        newErrors.dueDate = 'Due date must be in the future'
      }
    }

    if (formData.maxPoints <= 0) {
      newErrors.maxPoints = 'Max points must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const assignment = await assignmentService.createAssignment(formData)
      if (assignment) {
        onSuccess(assignment)
        onClose()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to create assignment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructions: '',
      courseId: '',
      department: '',
      dueDate: '',
      maxPoints: 100,
      assignmentType: 'essay',
      attachments: []
    })
    setErrors({})
    setCourses([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Assignment">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Provide the basic details for the assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Assignment Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter assignment title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the assignment"
                rows={3}
                className={`w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Instructions *
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Detailed instructions for students"
                rows={4}
                className={`w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.instructions ? 'border-red-500' : ''}`}
              />
              {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Course and Department */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course & Department</CardTitle>
            <CardDescription>Select the course and department for this assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className={`w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.department ? 'border-red-500' : ''}`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Course *
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => handleInputChange('courseId', e.target.value)}
                disabled={!formData.department}
                className={`w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.courseId ? 'border-red-500' : ''} ${!formData.department ? 'bg-gray-100' : ''}`}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.code})
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assignment Details</CardTitle>
            <CardDescription>Configure the assignment type, due date, and grading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Assignment Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {assignmentTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('assignmentType', type.value)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        formData.assignmentType === type.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      <Icon className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Due Date *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={errors.dueDate ? 'border-red-500' : ''}
                />
                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Max Points
                </label>
                <Input
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) => handleInputChange('maxPoints', parseInt(e.target.value) || 0)}
                  min="1"
                  className={errors.maxPoints ? 'border-red-500' : ''}
                />
                {errors.maxPoints && <p className="text-red-500 text-sm mt-1">{errors.maxPoints}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">File Attachments</CardTitle>
            <CardDescription>Upload assignment files, templates, or resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Upload Files
              </label>
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-secondary-400" />
                <p className="text-sm text-secondary-600 mb-2">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-secondary-300 rounded-md text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 cursor-pointer"
                >
                  Choose Files
                </label>
              </div>
            </div>

            {formData.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-secondary-700 mb-2">Uploaded Files</h4>
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-secondary-500" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-secondary-500">({formatFileSize(file.size)})</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
