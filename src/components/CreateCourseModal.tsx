import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImagePlaceholder } from '@/components/ImagePlaceholder'
import { X, BookOpen, Calendar, Users, Clock } from 'lucide-react'

interface CreateCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (courseData: CourseFormData) => void
}

interface CourseFormData {
  title: string
  description: string
  duration: string
  maxStudents: number
  instructor: string
  startDate: string
  endDate: string
  thumbnail?: File | null
  thumbnailUrl?: string
}

export function CreateCourseModal({ isOpen, onClose, onSubmit }: CreateCourseModalProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    duration: '',
    maxStudents: 50,
    instructor: '',
    startDate: '',
    endDate: '',
    thumbnail: null,
    thumbnailUrl: ''
  })

  const [errors, setErrors] = useState<Partial<CourseFormData>>({})

  const handleInputChange = (field: keyof CourseFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleImageChange = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        thumbnail: file,
        thumbnailUrl: url
      }))
    }
  }

  const handleImageRemove = () => {
    if (formData.thumbnailUrl) {
      URL.revokeObjectURL(formData.thumbnailUrl)
    }
    setFormData(prev => ({
      ...prev,
      thumbnail: null,
      thumbnailUrl: ''
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CourseFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required'
    }
    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor is required'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      // Reset form
      if (formData.thumbnailUrl) {
        URL.revokeObjectURL(formData.thumbnailUrl)
      }
      setFormData({
        title: '',
        description: '',
        duration: '',
        maxStudents: 50,
        instructor: '',
        startDate: '',
        endDate: '',
        thumbnail: null,
        thumbnailUrl: ''
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Create New Course
              </CardTitle>
              <CardDescription>
                Fill in the details to create a new course
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Course Thumbnail
              </label>
              <div className="flex justify-center">
                <ImagePlaceholder
                  src={formData.thumbnailUrl}
                  alt="Course thumbnail"
                  onImageChange={handleImageChange}
                  onRemove={handleImageRemove}
                  placeholder="Upload course thumbnail"
                  size="lg"
                  editable={true}
                />
              </div>
              <p className="text-xs text-secondary-500 mt-2 text-center">
                Recommended size: 400x300px. Max file size: 5MB
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Course Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Introduction to Business Management"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Duration *
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 8 weeks, 3 months"
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what students will learn in this course..."
                rows={4}
                className={`w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-red-500' : ''
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Instructor *
                </label>
                <Input
                  value={formData.instructor}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  placeholder="Instructor name"
                  className={errors.instructor ? 'border-red-500' : ''}
                />
                {errors.instructor && (
                  <p className="text-red-500 text-sm mt-1">{errors.instructor}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Maximum Students
                </label>
                <Input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 0)}
                  min="1"
                  max="1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  End Date *
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
