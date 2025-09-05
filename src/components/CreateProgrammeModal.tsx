import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  DollarSign,
  AlertCircle,
  X
} from 'lucide-react'

export interface ProgrammeData {
  title: string
  description: string
  duration: number
  courses: number
  startDate: string
  endDate: string
  image: string
  price: number
  maxStudents: number
  requirements: string
  objectives: string
}

interface CreateProgrammeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (programmeData: ProgrammeData) => void
}

export function CreateProgrammeModal({ isOpen, onClose, onCreate }: CreateProgrammeModalProps) {
  const [formData, setFormData] = useState<ProgrammeData>({
    title: '',
    description: '',
    duration: 12,
    courses: 8,
    startDate: '',
    endDate: '',
    image: '/api/placeholder/400/200',
    price: 0,
    maxStudents: 100,
    requirements: '',
    objectives: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        title: '',
        description: '',
        duration: 12,
        courses: 8,
        startDate: '',
        endDate: '',
        image: '/api/placeholder/400/200',
        price: 0,
        maxStudents: 100,
        requirements: '',
        objectives: ''
      })
      setErrors({})
      setHasUnsavedChanges(false)
    }
  }, [isOpen])

  // Track changes
  useEffect(() => {
    const hasChanges = Object.values(formData).some(value => 
      value !== '' && value !== 0 && value !== '/api/placeholder/400/200'
    )
    setHasUnsavedChanges(hasChanges)
  }, [formData])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Programme title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0'
    }

    if (formData.courses <= 0) {
      newErrors.courses = 'Number of courses must be greater than 0'
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

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative'
    }

    if (formData.maxStudents <= 0) {
      newErrors.maxStudents = 'Max students must be greater than 0'
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

  const handleInputChange = (field: keyof ProgrammeData, value: string | number) => {
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
      title="Create New Programme"
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
            <h3 className="text-lg font-medium text-secondary-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Programme Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter programme title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter programme description"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-red-500' : 'border-secondary-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Programme Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Programme Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Duration (months) *
                </label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                  placeholder="12"
                  min="1"
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Number of Courses *
                </label>
                <Input
                  type="number"
                  value={formData.courses}
                  onChange={(e) => handleInputChange('courses', parseInt(e.target.value) || 0)}
                  placeholder="8"
                  min="1"
                  className={errors.courses ? 'border-red-500' : ''}
                />
                {errors.courses && (
                  <p className="text-red-500 text-sm mt-1">{errors.courses}</p>
                )}
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
          </div>

          {/* Pricing and Capacity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Pricing & Capacity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Price ($)
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Max Students *
                </label>
                <Input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 0)}
                  placeholder="100"
                  min="1"
                  className={errors.maxStudents ? 'border-red-500' : ''}
                />
                {errors.maxStudents && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="Enter programme requirements"
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Learning Objectives
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                placeholder="Enter learning objectives"
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
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
              Create Programme
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
