import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  Pin, 
  AlertCircle,
  X
} from 'lucide-react'

export interface DiscussionData {
  title: string
  content: string
  courseId: string
  courseTitle: string
  isPinned: boolean
  tags: string[]
}

interface CreateDiscussionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (discussionData: DiscussionData) => void
}

export function CreateDiscussionModal({ isOpen, onClose, onCreate }: CreateDiscussionModalProps) {
  const [formData, setFormData] = useState<DiscussionData>({
    title: '',
    content: '',
    courseId: '',
    courseTitle: '',
    isPinned: false,
    tags: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [tagInput, setTagInput] = useState('')

  // Mock data for courses
  const courses = [
    { id: '1', title: 'Introduction to Business Management' },
    { id: '2', title: 'Digital Marketing Strategies' },
    { id: '3', title: 'Financial Analysis and Reporting' },
    { id: '4', title: 'Web Development Fundamentals' },
    { id: '5', title: 'Data Science and Analytics' },
    { id: '6', title: 'Project Management Fundamentals' },
    { id: '7', title: 'Business Ethics' },
    { id: '8', title: 'Creative Writing Workshop' }
  ]

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        title: '',
        content: '',
        courseId: '',
        courseTitle: '',
        isPinned: false,
        tags: []
      })
      setErrors({})
      setHasUnsavedChanges(false)
      setTagInput('')
    }
  }, [isOpen])

  // Track changes
  useEffect(() => {
    const hasChanges = Object.values(formData).some(value => 
      value !== '' && value !== false && (Array.isArray(value) ? value.length > 0 : true)
    )
    setHasUnsavedChanges(hasChanges)
  }, [formData])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Discussion title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Please select a course'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onCreate(formData)
      onClose()
    }
  }

  const handleInputChange = (field: keyof DiscussionData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCourseChange = (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    setFormData(prev => ({ 
      ...prev, 
      courseId, 
      courseTitle: course?.title || '' 
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title="Start New Discussion"
    >
      <div className="max-h-[90vh] overflow-y-auto">
        {hasUnsavedChanges && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">You have unsaved changes</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Discussion Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter discussion title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Share your thoughts, questions, or ideas..."
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.content ? 'border-red-500' : 'border-secondary-300'
                }`}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>
          </div>

          {/* Course Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Course Selection</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Course *
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.courseId ? 'border-red-500' : 'border-secondary-300'
                }`}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Tags (Optional)</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Add Tags
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a tag and press Enter"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                Press Enter or click Add to add tags
              </p>
            </div>

            {formData.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Current Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-md"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-primary-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Discussion Settings</h3>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={formData.isPinned}
                onChange={(e) => handleInputChange('isPinned', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="isPinned" className="text-sm font-medium text-secondary-700 flex items-center">
                <Pin className="h-4 w-4 mr-1" />
                Pin this discussion
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!hasUnsavedChanges}
            >
              Start Discussion
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
