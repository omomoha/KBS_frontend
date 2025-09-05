import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  Shield, 
  Users, 
  BookOpen,
  Award,
  Clock,
  Edit,
  ArrowLeft
} from 'lucide-react'

// Mock data - in a real app, this would come from an API
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@kbs.edu.ng',
    phone: '+1 (555) 123-4567',
    role: 'learner',
    status: 'active',
    joinDate: '2023-09-15T00:00:00Z',
    lastLogin: '2024-01-14T10:30:00Z',
    enrolledCourses: 3,
    department: 'Business Administration',
    title: 'Senior Manager',
    bio: 'Experienced business professional with a passion for continuous learning and professional development.',
    avatar: '/api/placeholder/150/150',
    courses: [
      {
        id: '1',
        title: 'Introduction to Business Management',
        progress: 75,
        status: 'in_progress',
        enrolledDate: '2023-10-01T00:00:00Z'
      },
      {
        id: '2',
        title: 'Digital Marketing Strategies',
        progress: 30,
        status: 'in_progress',
        enrolledDate: '2023-11-15T00:00:00Z'
      },
      {
        id: '3',
        title: 'Financial Analysis and Reporting',
        progress: 100,
        status: 'completed',
        enrolledDate: '2023-09-20T00:00:00Z',
        completedDate: '2023-12-15T00:00:00Z',
        grade: 92
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'First Course Completed',
        description: 'Successfully completed your first course',
        date: '2023-12-15T00:00:00Z',
        icon: 'Award'
      },
      {
        id: '2',
        title: 'Consistent Learner',
        description: 'Logged in for 30 consecutive days',
        date: '2024-01-10T00:00:00Z',
        icon: 'Clock'
      }
    ]
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@kbs.edu.ng',
    phone: '+1 (555) 234-5678',
    role: 'instructor',
    status: 'active',
    joinDate: '2023-08-20T00:00:00Z',
    lastLogin: '2024-01-14T08:15:00Z',
    enrolledCourses: 0,
    department: 'Business School',
    title: 'Professor of Management',
    bio: 'Dedicated educator with over 15 years of experience in business education and corporate training.',
    avatar: '/api/placeholder/150/150',
    courses: [],
    achievements: []
  }
]

export function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchUser = async () => {
      setLoading(true)
      // In a real app, this would be: const user = await api.getUser(userId)
      const foundUser = mockUsers.find(u => u.id === userId)
      setUser(foundUser || null)
      setLoading(false)
    }

    fetchUser()
  }, [userId])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'instructor':
        return 'bg-blue-100 text-blue-800'
      case 'learner':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCourseStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'not_started':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading user profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 mb-2">User not found</h3>
        <p className="text-secondary-600 mb-4">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/users">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-secondary-600 mt-1">
              {user.title} • {user.department}
            </p>
          </div>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-4">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-primary-600" />
                )}
              </div>
              <CardTitle className="text-xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription>{user.title}</CardDescription>
              <div className="flex justify-center gap-2 mt-2">
                <Badge className={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <Badge className={getStatusColor(user.status)}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-secondary-500" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-secondary-500" />
                  <span className="text-sm">
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm">
                      Last login {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {user.bio && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-secondary-700 mb-2">About</h4>
                  <p className="text-sm text-secondary-600">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress (for learners) */}
          {user.role === 'learner' && user.courses && user.courses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Progress
                </CardTitle>
                <CardDescription>
                  {user.courses.length} enrolled courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.courses.map((course: any) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{course.title}</h4>
                        <Badge className={getCourseStatusColor(course.status)}>
                          {course.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-secondary-600 mb-2">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      {course.grade && (
                        <div className="mt-2 text-sm">
                          <span className="text-secondary-600">Grade: </span>
                          <span className="font-medium text-green-600">{course.grade}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {user.achievements && user.achievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  {user.achievements.length} achievements earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.achievements.map((achievement: any) => (
                    <div key={achievement.id} className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                      <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-secondary-600">{achievement.description}</p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {user.enrolledCourses || 0}
                  </div>
                  <div className="text-sm text-secondary-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {user.courses?.filter((c: any) => c.status === 'completed').length || 0}
                  </div>
                  <div className="text-sm text-secondary-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.achievements?.length || 0}
                  </div>
                  <div className="text-sm text-secondary-600">Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-secondary-600">Days Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
