import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreateCourseModal } from '@/components/CreateCourseModal'
import { UploadCourseModal, CourseUploadData } from '@/components/UploadCourseModal'
import { FilterBar, FilterConfig } from '@/components/ui/FilterBar'
import { BookOpen, Clock, Users, Star, Upload, Building2 } from 'lucide-react'

// Mock data for courses
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Business Management',
    description: 'Learn the fundamentals of business management and leadership principles.',
    instructor: 'Dr. Sarah Johnson',
    department: 'Business Administration',
    duration: '8 weeks',
    students: 45,
    rating: 4.8,
    status: 'active',
    progress: 75,
    thumbnail: '/api/placeholder/300/200',
    coverImage: '/api/placeholder/300/200',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    tags: ['Management', 'Leadership', 'Business']
  },
  {
    id: '2',
    title: 'Digital Marketing Strategies',
    description: 'Master modern digital marketing techniques and tools.',
    instructor: 'Prof. Michael Chen',
    department: 'Marketing',
    duration: '6 weeks',
    students: 32,
    rating: 4.6,
    status: 'active',
    progress: 30,
    thumbnail: '/api/placeholder/300/200',
    coverImage: '/api/placeholder/300/200',
    startDate: '2024-01-20',
    endDate: '2024-03-05',
    tags: ['Marketing', 'Digital', 'Strategy']
  },
  {
    id: '3',
    title: 'Financial Analysis and Reporting',
    description: 'Advanced financial analysis techniques for business decision making.',
    instructor: 'Dr. Emily Rodriguez',
    department: 'Business Administration',
    duration: '10 weeks',
    students: 28,
    rating: 4.9,
    status: 'upcoming',
    progress: 0,
    thumbnail: '/api/placeholder/300/200',
    coverImage: '/api/placeholder/300/200',
    startDate: '2024-02-01',
    endDate: '2024-04-15',
    tags: ['Finance', 'Analysis', 'Accounting']
  },
  {
    id: '4',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
    instructor: 'Dr. Alex Thompson',
    department: 'Computer Science',
    duration: '12 weeks',
    students: 38,
    rating: 4.7,
    status: 'active',
    progress: 60,
    thumbnail: '/api/placeholder/300/200',
    coverImage: '/api/placeholder/300/200',
    startDate: '2024-01-10',
    endDate: '2024-04-10',
    tags: ['Programming', 'Web Development', 'JavaScript']
  },
  {
    id: '5',
    title: 'Data Science and Analytics',
    description: 'Introduction to data science, machine learning, and statistical analysis.',
    instructor: 'Prof. Lisa Wang',
    department: 'Computer Science',
    duration: '14 weeks',
    students: 25,
    rating: 4.8,
    status: 'upcoming',
    progress: 0,
    thumbnail: '/api/placeholder/300/200',
    coverImage: '/api/placeholder/300/200',
    startDate: '2024-02-15',
    endDate: '2024-05-30',
    tags: ['Data Science', 'Machine Learning', 'Analytics']
  }
]

export function CoursesPage() {
  const [courses, setCourses] = useState(mockCourses)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({})

  // Get unique departments from courses
  const departments = Array.from(new Set(courses.map(c => c.department))).sort()

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
      key: 'instructor',
      label: 'Instructor',
      type: 'select',
      options: [
        { value: 'Dr. Sarah Johnson', label: 'Dr. Sarah Johnson', count: courses.filter(c => c.instructor === 'Dr. Sarah Johnson').length },
        { value: 'Prof. Michael Chen', label: 'Prof. Michael Chen', count: courses.filter(c => c.instructor === 'Prof. Michael Chen').length },
        { value: 'Dr. Emily Rodriguez', label: 'Dr. Emily Rodriguez', count: courses.filter(c => c.instructor === 'Dr. Emily Rodriguez').length },
        { value: 'Dr. Alex Thompson', label: 'Dr. Alex Thompson', count: courses.filter(c => c.instructor === 'Dr. Alex Thompson').length },
        { value: 'Prof. Lisa Wang', label: 'Prof. Lisa Wang', count: courses.filter(c => c.instructor === 'Prof. Lisa Wang').length }
      ]
    },
    {
      key: 'duration',
      label: 'Duration',
      type: 'select',
      options: [
        { value: '6 weeks', label: '6 weeks', count: courses.filter(c => c.duration === '6 weeks').length },
        { value: '8 weeks', label: '8 weeks', count: courses.filter(c => c.duration === '8 weeks').length },
        { value: '10 weeks', label: '10 weeks', count: courses.filter(c => c.duration === '10 weeks').length },
        { value: '12 weeks', label: '12 weeks', count: courses.filter(c => c.duration === '12 weeks').length },
        { value: '14 weeks', label: '14 weeks', count: courses.filter(c => c.duration === '14 weeks').length }
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
    const matchesInstructor = !filters.instructor || course.instructor === filters.instructor
    const matchesDuration = !filters.duration || course.duration === filters.duration
    
    const matchesRating = !filters.rating || (
      filters.rating === '4.5+' && course.rating >= 4.5 ||
      filters.rating === '4.0+' && course.rating >= 4.0 ||
      filters.rating === '3.5+' && course.rating >= 3.5
    )

    return matchesSearch && matchesDepartment && matchesStatus && matchesInstructor && matchesDuration && matchesRating
  })

  const handleCreateCourse = (courseData: any) => {
    // In a real app, this would make an API call
    const newCourse = {
      id: (courses.length + 1).toString(),
      ...courseData,
      students: 0,
      rating: 0,
      status: 'upcoming',
      progress: 0,
      thumbnail: courseData.thumbnailUrl || '/api/placeholder/300/200'
    }
    
    setCourses(prev => [newCourse, ...prev])
    console.log('Course created:', newCourse)
    alert('Course created successfully!')
  }

  const handleUploadCourse = (courseData: CourseUploadData) => {
    // In a real app, this would make an API call to upload files and create course
    const newCourse = {
      id: (courses.length + 1).toString(),
      title: courseData.title,
      description: courseData.description,
      instructor: courseData.instructor,
      department: courseData.department,
      duration: courseData.duration,
      students: 0,
      rating: 0,
      status: 'upcoming',
      progress: 0,
      thumbnail: courseData.coverImage ? URL.createObjectURL(courseData.coverImage) : '/api/placeholder/300/200',
      coverImage: courseData.coverImage ? URL.createObjectURL(courseData.coverImage) : '/api/placeholder/300/200',
      startDate: courseData.startDate,
      endDate: courseData.endDate,
      tags: courseData.tags
    }
    
    setCourses(prev => [newCourse, ...prev])
    console.log('Course uploaded:', newCourse)
    alert('Course uploaded successfully!')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Courses</h1>
          <p className="text-secondary-600 mt-2">
            Browse and manage your courses
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Course
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <BookOpen className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfig}
        onFiltersChange={setFilters}
        searchPlaceholder="Search courses by title or instructor..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
              {course.coverImage || course.thumbnail ? (
                <img 
                  src={course.coverImage || course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-primary-600">
                  <BookOpen className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">No cover image</p>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge 
                  variant={course.status === 'active' ? 'default' : 'secondary'}
                >
                  {course.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Building2 className="h-4 w-4 text-secondary-500" />
                <span className="text-sm text-secondary-600">{course.department}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-secondary-600">
                <Users className="h-4 w-4 mr-2" />
                {course.students} students
              </div>
              <div className="flex items-center text-sm text-secondary-600">
                <Clock className="h-4 w-4 mr-2" />
                {course.duration}
              </div>
              <div className="flex items-center text-sm text-secondary-600">
                <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                {course.rating}
              </div>
              
              {course.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <Link to={`/courses/${course.id}`}>
                  <Button className="w-full">
                    {course.progress > 0 ? 'Continue Course' : 'Start Course'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCourse}
      />

      <UploadCourseModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadCourse}
      />
    </div>
  )
}
