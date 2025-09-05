import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FilterBar, FilterConfig } from '@/components/ui/FilterBar'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Building2, 
  Calendar,
  Play,
  Download,
  Eye,
  Heart,
  Share2,
  Filter
} from 'lucide-react'

// Mock data for course feed
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Business Management',
    description: 'Learn the fundamentals of business management and leadership principles. This comprehensive course covers strategic planning, team management, and organizational behavior.',
    instructor: 'Dr. Sarah Johnson',
    department: 'Business Administration',
    duration: '8 weeks',
    students: 1247,
    rating: 4.8,
    status: 'active',
    progress: 0,
    thumbnail: '/api/placeholder/400/225',
    coverImage: '/api/placeholder/400/225',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    tags: ['Management', 'Leadership', 'Business'],
    isEnrolled: false,
    isFavorite: false,
    price: 0,
    level: 'Beginner',
    language: 'English'
  },
  {
    id: '2',
    title: 'Digital Marketing Strategies',
    description: 'Master modern digital marketing techniques and tools. Learn about SEO, social media marketing, content strategy, and analytics.',
    instructor: 'Prof. Michael Chen',
    department: 'Marketing',
    duration: '6 weeks',
    students: 892,
    rating: 4.6,
    status: 'active',
    progress: 0,
    thumbnail: '/api/placeholder/400/225',
    coverImage: '/api/placeholder/400/225',
    startDate: '2024-01-20',
    endDate: '2024-03-05',
    tags: ['Marketing', 'Digital', 'Strategy'],
    isEnrolled: true,
    isFavorite: true,
    price: 0,
    level: 'Intermediate',
    language: 'English'
  },
  {
    id: '3',
    title: 'Financial Analysis and Reporting',
    description: 'Advanced financial analysis techniques for business decision making. Learn to read financial statements and make informed decisions.',
    instructor: 'Dr. Emily Rodriguez',
    department: 'Business Administration',
    duration: '10 weeks',
    students: 654,
    rating: 4.9,
    status: 'upcoming',
    progress: 0,
    thumbnail: '/api/placeholder/400/225',
    coverImage: '/api/placeholder/400/225',
    startDate: '2024-02-01',
    endDate: '2024-04-15',
    tags: ['Finance', 'Analysis', 'Accounting'],
    isEnrolled: false,
    isFavorite: false,
    price: 0,
    level: 'Advanced',
    language: 'English'
  },
  {
    id: '4',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript. Build responsive websites and interactive applications.',
    instructor: 'Dr. Alex Thompson',
    department: 'Computer Science',
    duration: '12 weeks',
    students: 1834,
    rating: 4.7,
    status: 'active',
    progress: 0,
    thumbnail: '/api/placeholder/400/225',
    coverImage: '/api/placeholder/400/225',
    startDate: '2024-01-10',
    endDate: '2024-04-10',
    tags: ['Programming', 'Web Development', 'JavaScript'],
    isEnrolled: false,
    isFavorite: true,
    price: 0,
    level: 'Beginner',
    language: 'English'
  },
  {
    id: '5',
    title: 'Data Science and Analytics',
    description: 'Introduction to data science, machine learning, and statistical analysis. Learn to extract insights from data.',
    instructor: 'Prof. Lisa Wang',
    department: 'Computer Science',
    duration: '14 weeks',
    students: 567,
    rating: 4.8,
    status: 'upcoming',
    progress: 0,
    thumbnail: '/api/placeholder/400/225',
    coverImage: '/api/placeholder/400/225',
    startDate: '2024-02-15',
    endDate: '2024-05-30',
    tags: ['Data Science', 'Machine Learning', 'Analytics'],
    isEnrolled: false,
    isFavorite: false,
    price: 0,
    level: 'Intermediate',
    language: 'English'
  },
  {
    id: '6',
    title: 'Creative Writing Workshop',
    description: 'Develop your creative writing skills through guided exercises and peer feedback. Explore different genres and styles.',
    instructor: 'Prof. James Wilson',
    department: 'Arts & Humanities',
    duration: '8 weeks',
    students: 423,
    rating: 4.5,
    status: 'active',
    progress: 0,
    thumbnail: '/api/placeholder/400/225',
    coverImage: '/api/placeholder/400/225',
    startDate: '2024-01-25',
    endDate: '2024-03-25',
    tags: ['Writing', 'Creative', 'Literature'],
    isEnrolled: false,
    isFavorite: false,
    price: 0,
    level: 'Beginner',
    language: 'English'
  }
]

export function CourseFeedPage() {
  const [courses, setCourses] = useState(mockCourses)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get unique departments and other filter options
  const departments = Array.from(new Set(courses.map(c => c.department))).sort()
  const levels = Array.from(new Set(courses.map(c => c.level))).sort()
  const languages = Array.from(new Set(courses.map(c => c.language))).sort()

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search courses by title, instructor, or department...'
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: departments.map(dept => ({
        value: dept,
        label: dept,
        count: courses.filter(c => c.department === dept).length
      }))
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active', count: courses.filter(c => c.status === 'active').length },
        { value: 'upcoming', label: 'Upcoming', count: courses.filter(c => c.status === 'upcoming').length },
        { value: 'completed', label: 'Completed', count: courses.filter(c => c.status === 'completed').length }
      ]
    },
    {
      key: 'level',
      label: 'Level',
      type: 'select',
      options: levels.map(level => ({
        value: level,
        label: level,
        count: courses.filter(c => c.level === level).length
      }))
    },
    {
      key: 'enrollment',
      label: 'Enrollment',
      type: 'select',
      options: [
        { value: 'enrolled', label: 'Enrolled', count: courses.filter(c => c.isEnrolled).length },
        { value: 'not_enrolled', label: 'Not Enrolled', count: courses.filter(c => !c.isEnrolled).length },
        { value: 'favorites', label: 'Favorites', count: courses.filter(c => c.isFavorite).length }
      ]
    },
    {
      key: 'rating',
      label: 'Rating',
      type: 'select',
      options: [
        { value: '4.5+', label: '4.5+ stars', count: courses.filter(c => c.rating >= 4.5).length },
        { value: '4.0+', label: '4.0+ stars', count: courses.filter(c => c.rating >= 4.0).length },
        { value: '3.5+', label: '3.5+ stars', count: courses.filter(c => c.rating >= 3.5).length }
      ]
    }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !filters.search || 
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.department.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesDepartment = !filters.department || course.department === filters.department
    const matchesStatus = !filters.status || course.status === filters.status
    const matchesLevel = !filters.level || course.level === filters.level
    
    const matchesEnrollment = !filters.enrollment || (
      filters.enrollment === 'enrolled' && course.isEnrolled ||
      filters.enrollment === 'not_enrolled' && !course.isEnrolled ||
      filters.enrollment === 'favorites' && course.isFavorite
    )
    
    const matchesRating = !filters.rating || (
      filters.rating === '4.5+' && course.rating >= 4.5 ||
      filters.rating === '4.0+' && course.rating >= 4.0 ||
      filters.rating === '3.5+' && course.rating >= 3.5
    )

    return matchesSearch && matchesDepartment && matchesStatus && matchesLevel && matchesEnrollment && matchesRating
  })

  const handleEnroll = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: true }
        : course
    ))
  }

  const handleFavorite = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isFavorite: !course.isFavorite }
        : course
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Course Feed</h1>
          <p className="text-secondary-600 mt-2">
            Discover and enroll in courses from various departments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-secondary-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfig}
        onFiltersChange={setFilters}
        searchPlaceholder="Search courses by title, instructor, or department..."
      />

      {/* Course Feed */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Cover Image */}
            <div className="relative aspect-video overflow-hidden">
              {course.coverImage ? (
                <img 
                  src={course.coverImage} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary-600" />
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Status and Level Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={getStatusColor(course.status)}>
                  {course.status}
                </Badge>
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
              </div>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                onClick={() => handleFavorite(course.id)}
              >
                <Heart className={`h-4 w-4 ${course.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm">{course.department}</span>
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-secondary-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{course.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-secondary-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{course.duration}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-secondary-600 line-clamp-2 mb-4">
                {course.description}
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-700">
                    {course.instructor.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{course.instructor}</p>
                  <p className="text-xs text-secondary-500">Instructor</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {course.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {course.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{course.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {course.isEnrolled ? (
                  <Button className="flex-1" disabled>
                    <Play className="h-4 w-4 mr-2" />
                    Continue Course
                  </Button>
                ) : (
                  <Button 
                    className="flex-1" 
                    onClick={() => handleEnroll(course.id)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Enroll Now
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No courses found</h3>
            <p className="text-secondary-600">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
