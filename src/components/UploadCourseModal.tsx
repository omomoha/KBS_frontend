import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Upload, 
  X, 
  FileText, 
  Video, 
  Image, 
  Calendar,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react'

export interface CourseUploadData {
  title: string
  description: string
  department: string
  instructor: string
  duration: string
  maxStudents: number
  startDate: string
  endDate: string
  thumbnail?: File
  files: File[]
  tags: string[]
}

interface UploadCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (courseData: CourseUploadData) => void
}

const departments = [
  'Business Administration',
  'Computer Science',
  'Engineering',
  'Health Sciences',
  'Education',
  'Arts & Humanities',
  'Social Sciences',
  'Natural Sciences',
  'Mathematics',
  'Languages'
]

const contentTypes = [
  { id: 'video', label: 'Video', icon: Video, extensions: 'MP4, AVI, MOV, WMV', maxSize: '500MB' },
  { id: 'document', label: 'Document', icon: FileText, extensions: 'PDF, DOC, DOCX, PPT, PPTX', maxSize: '100MB' },
  { id: 'image', label: 'Image', icon: Image, extensions: 'JPG, PNG, GIF, SVG', maxSize: '50MB' }
]

export function UploadCourseModal({ isOpen, onClose, onUpload }: UploadCourseModalProps) {
  const [formData, setFormData] = useState<CourseUploadData>({
    title: '',
    description: '',
    department: '',
    instructor: '',
    duration: '',
    maxStudents: 50,
    startDate: '',
    endDate: '',
    files: [],
    tags: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedContentType, setSelectedContentType] = useState('video')
  const [tagInput, setTagInput] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        title: '',
        description: '',
        department: '',
        instructor: '',
        duration: '',
        maxStudents: 50,
        startDate: '',
        endDate: '',
        files: [],
        tags: []
      })
      setErrors({})
      setSelectedContentType('video')
      setTagInput('')
      setHasUnsavedChanges(false)
    }
  }, [isOpen])

  useEffect(() => {
    const hasChanges = 
      formData.title !== '' ||
      formData.description !== '' ||
      formData.department !== '' ||
      formData.instructor !== '' ||
      formData.duration !== '' ||
      formData.maxStudents !== 50 ||
      formData.startDate !== '' ||
      formData.endDate !== '' ||
      formData.files.length > 0 ||
      formData.tags.length > 0

    setHasUnsavedChanges(hasChanges)
  }, [formData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required'
    }

    if (!formData.department) {
      newErrors.department = 'Department is required'
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required'
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }

    if (formData.files.length === 0) {
      newErrors.files = 'At least one file is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onUpload(formData)
      onClose()
    }
  }

  const handleInputChange = (field: keyof CourseUploadData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, files: [...prev.files, ...files] }))
    if (errors.files) {
      setErrors(prev => ({ ...prev, files: '' }))
    }
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getContentTypeInfo = () => {
    return contentTypes.find(type => type.id === selectedContentType) || contentTypes[0]
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      title="Upload New Course"
    >
      <div className="max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">You have unsaved changes</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-secondary-900">Course Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Course Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Introduction to Business Management"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.department ? 'border-red-500' : 'border-secondary-300'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.description ? 'border-red-500' : 'border-secondary-300'
                  }`}
                  placeholder="Describe the course content and learning objectives..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Instructor *
                  </label>
                  <Input
                    value={formData.instructor}
                    onChange={(e) => handleInputChange('instructor', e.target.value)}
                    placeholder="e.g., Dr. Sarah Johnson"
                    className={errors.instructor ? 'border-red-500' : ''}
                  />
                  {errors.instructor && (
                    <p className="text-red-500 text-xs mt-1">{errors.instructor}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Duration *
                  </label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 8 weeks, 40 hours"
                    className={errors.duration ? 'border-red-500' : ''}
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-secondary-900">Course Schedule</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Maximum Students
                </label>
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 50)}
                  className="w-32"
                />
              </div>
            </div>

            {/* Content Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-secondary-900">Content Type</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contentTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedContentType(type.id)}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        selectedContentType === type.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      <Icon className="h-8 w-8 mx-auto mb-2" />
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-secondary-600 mt-1">
                        {type.extensions}
                      </div>
                      <div className="text-xs text-secondary-500">
                        Max {type.maxSize}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-secondary-900">Upload Files</h3>
              
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-secondary-900">
                    Choose Files
                  </p>
                  <p className="text-sm text-secondary-600">
                    Supported: {getContentTypeInfo().extensions} (Max {getContentTypeInfo().maxSize})
                  </p>
                  <input
                    type="file"
                    multiple
                    accept={selectedContentType === 'video' ? '.mp4,.avi,.mov,.wmv' : 
                           selectedContentType === 'document' ? '.pdf,.doc,.docx,.ppt,.pptx' : 
                           '.jpg,.jpeg,.png,.gif,.svg'}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 cursor-pointer"
                  >
                    Select Files
                  </label>
                </div>
                {errors.files && (
                  <p className="text-red-500 text-xs mt-2">{errors.files}</p>
                )}
              </div>

              {/* Selected Files */}
              {formData.files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-secondary-900">Selected Files:</h4>
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-secondary-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-secondary-500">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-secondary-900">Course Tags</h3>
              
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
                  Add Tag
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!hasUnsavedChanges}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Course
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}
