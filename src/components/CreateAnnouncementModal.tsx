import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Megaphone, 
  Pin, 
  AlertCircle,
  X
} from 'lucide-react'

export interface AnnouncementData {
  title: string
  content: string
  courseId: string | null
  programmeId: string | null
  isPinned: boolean
  priority: 'low' | 'medium' | 'high'
  expiresAt: string | null
}

interface CreateAnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (announcementData: AnnouncementData) => void
}

export function CreateAnnouncementModal({ isOpen, onClose, onCreate }: CreateAnnouncementModalProps) {
  const [formData, setFormData] = useState<AnnouncementData>({
    title: '',
    content: '',
    courseId: null,
    programmeId: null,
    isPinned: false,
    priority: 'medium',
    expiresAt: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Mock data for courses and programmes
  const courses = [
    { id: '1', title: 'Introduction to Business Management' },
    { id: '2', title: 'Digital Marketing Strategies' },
    { id: '3', title: 'Financial Analysis and Reporting' },
    { id: '4', title: 'Web Development Fundamentals' },
    { id: '5', title: 'Data Science and Analytics' }
  ]

  const programmes = [
    { id: '1', title: 'Diploma in Business Management' },
    { id: '2', title: 'Diploma in Digital Marketing' },
    { id: '3', title: 'Diploma in Project Management' }
  ]

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        title: '',
        content: '',
        courseId: null,
        programmeId: null,
        isPinned: false,
        priority: 'medium',
        expiresAt: null
      })
      setErrors({})
      setHasUnsavedChanges(false)
    }
  }, [isOpen])

  // Track changes
  useEffect(() => {
    const hasChanges = Object.values(formData).some(value => 
      value !== '' && value !== null && value !== false && value !== 'medium'
    )
    setHasUnsavedChanges(hasChanges)
  }, [formData])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Announcement title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (formData.expiresAt && new Date(formData.expiresAt) <= new Date()) {
      newErrors.expiresAt = 'Expiration date must be in the future'
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

  const handleInputChange = (field: keyof AnnouncementData, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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
      title="Create New Announcement"
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
            <h3 className="text-lg font-medium text-secondary-900">Announcement Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter announcement title"
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
                placeholder="Enter announcement content"
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

          {/* Targeting */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Target Audience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Course (Optional)
                </label>
                <select
                  value={formData.courseId || ''}
                  onChange={(e) => handleInputChange('courseId', e.target.value || null)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a course (General announcement)</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Programme (Optional)
                </label>
                <select
                  value={formData.programmeId || ''}
                  onChange={(e) => handleInputChange('programmeId', e.target.value || null)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a programme</option>
                  {programmes.map((programme) => (
                    <option key={programme.id} value={programme.id}>
                      {programme.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Announcement Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Expiration Date (Optional)
                </label>
                <Input
                  type="datetime-local"
                  value={formData.expiresAt || ''}
                  onChange={(e) => handleInputChange('expiresAt', e.target.value || null)}
                  className={errors.expiresAt ? 'border-red-500' : ''}
                />
                {errors.expiresAt && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiresAt}</p>
                )}
              </div>
            </div>

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
                Pin this announcement
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
              Create Announcement
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
