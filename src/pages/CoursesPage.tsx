import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreateCourseModal } from '@/components/CreateCourseModal'
import { BookOpen, Clock, Users, Star } from 'lucide-react'

// Mock data for courses
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Business Management',
    description: 'Learn the fundamentals of business management and leadership principles.',
    instructor: 'Dr. Sarah Johnson',
    duration: '8 weeks',
    students: 45,
    rating: 4.8,
    status: 'active',
    progress: 75,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Digital Marketing Strategies',
    description: 'Master modern digital marketing techniques and tools.',
    instructor: 'Prof. Michael Chen',
    duration: '6 weeks',
    students: 32,
    rating: 4.6,
    status: 'active',
    progress: 30,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Financial Analysis and Reporting',
    description: 'Advanced financial analysis techniques for business decision making.',
    instructor: 'Dr. Emily Rodriguez',
    duration: '10 weeks',
    students: 28,
    rating: 4.9,
    status: 'upcoming',
    progress: 0,
    thumbnail: '/api/placeholder/300/200'
  }
]

export function CoursesPage() {
  const [courses, setCourses] = useState(mockCourses)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Courses</h1>
          <p className="text-secondary-600 mt-2">
            Browse and manage your courses
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <BookOpen className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-primary-600">
                  <BookOpen className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">No thumbnail</p>
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
    </div>
  )
}
