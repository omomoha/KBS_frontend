import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen,
  FileText,
  Settings,
  Camera,
  Save
} from 'lucide-react'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      address: '',
      bio: '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      console.log('Updating profile:', data.firstName, data.lastName)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  // Mock data for user stats
  const userStats = {
    coursesCompleted: 5,
    certificatesEarned: 3,
    assignmentsSubmitted: 12,
    averageGrade: 87,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
          <p className="text-secondary-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary btn-md"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="btn btn-outline btn-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="btn btn-primary btn-md"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-content text-center">
              <div className="relative inline-block">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="h-24 w-24 rounded-full mx-auto"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                    <User className="h-12 w-12 text-primary-600" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-semibold text-secondary-900 mt-4">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-secondary-600">{user?.email}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mt-2">
                {user?.role}
              </span>
            </div>
          </div>

          {/* User Stats */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="card-title">Your Progress</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-sm text-secondary-600">Courses Completed</span>
                  </div>
                  <span className="font-semibold">{userStats.coursesCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-success-600 mr-2" />
                    <span className="text-sm text-secondary-600">Certificates</span>
                  </div>
                  <span className="font-semibold">{userStats.certificatesEarned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-warning-600 mr-2" />
                    <span className="text-sm text-secondary-600">Assignments</span>
                  </div>
                  <span className="font-semibold">{userStats.assignmentsSubmitted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-sm text-secondary-600">Average Grade</span>
                  </div>
                  <span className="font-semibold">{userStats.averageGrade}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Personal Information</h3>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      id="firstName"
                      disabled={!isEditing}
                      className={cn(
                        'input',
                        !isEditing && 'bg-secondary-50',
                        errors.firstName && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                      )}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-error-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-1">
                      Last Name
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      id="lastName"
                      disabled={!isEditing}
                      className={cn(
                        'input',
                        !isEditing && 'bg-secondary-50',
                        errors.lastName && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                      )}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-error-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    disabled={!isEditing}
                    className={cn(
                      'input',
                      !isEditing && 'bg-secondary-50',
                      errors.email && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      disabled={!isEditing}
                      className={cn(
                        'input',
                        !isEditing && 'bg-secondary-50',
                        errors.phone && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                      )}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-secondary-700 mb-1">
                      Address
                    </label>
                    <input
                      {...register('address')}
                      type="text"
                      id="address"
                      disabled={!isEditing}
                      className={cn(
                        'input',
                        !isEditing && 'bg-secondary-50',
                        errors.address && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                      )}
                      placeholder="123 Main St, City, State"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-error-600">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-secondary-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    id="bio"
                    rows={4}
                    disabled={!isEditing}
                    className={cn(
                      'input',
                      !isEditing && 'bg-secondary-50',
                      errors.bio && 'border-error-300 focus:ring-error-500 focus:border-error-500'
                    )}
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-error-600">{errors.bio.message}</p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Account Information */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="card-title">Account Information</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900">Email</p>
                      <p className="text-sm text-secondary-600">{user?.email}</p>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm">Change</button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900">Member Since</p>
                      <p className="text-sm text-secondary-600">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-secondary-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900">Role</p>
                      <p className="text-sm text-secondary-600 capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
