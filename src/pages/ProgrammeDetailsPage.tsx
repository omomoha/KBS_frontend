import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign,
  Award,
  CheckCircle,
  Star,
  Play,
  Download,
  Share2,
  Edit,
  Trash2
} from 'lucide-react'

// Mock data for programme details
const mockProgrammes = [
  {
    id: '1',
    title: 'Diploma in Business Management',
    description: 'Comprehensive business management program covering all essential aspects of modern business operations. This programme provides students with practical skills and theoretical knowledge needed to excel in today\'s competitive business environment.',
    longDescription: 'The Diploma in Business Management is a comprehensive 12-month programme designed to equip students with essential business skills and knowledge. The programme covers key areas including strategic management, financial analysis, marketing, human resources, and operations management. Students will learn through a combination of theoretical coursework, practical projects, and real-world case studies.',
    duration: 12,
    courses: 8,
    students: 150,
    maxStudents: 200,
    isActive: true,
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    image: '/api/placeholder/800/400',
    price: 2500,
    rating: 4.8,
    reviews: 45,
    requirements: 'High school diploma or equivalent, Basic computer skills, English proficiency',
    objectives: [
      'Develop strategic thinking and decision-making skills',
      'Master financial analysis and reporting techniques',
      'Learn effective marketing and sales strategies',
      'Understand human resource management principles',
      'Gain project management and leadership skills'
    ],
    curriculum: [
      {
        id: '1',
        title: 'Introduction to Business Management',
        description: 'Fundamental concepts and principles of business management',
        duration: '4 weeks',
        instructor: 'Dr. Sarah Johnson',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Financial Management',
        description: 'Financial analysis, budgeting, and investment strategies',
        duration: '6 weeks',
        instructor: 'Prof. Michael Chen',
        status: 'in-progress'
      },
      {
        id: '3',
        title: 'Marketing Strategy',
        description: 'Digital marketing, brand management, and customer relations',
        duration: '5 weeks',
        instructor: 'Dr. Emily Rodriguez',
        status: 'upcoming'
      },
      {
        id: '4',
        title: 'Human Resource Management',
        description: 'Recruitment, training, and employee development',
        duration: '4 weeks',
        instructor: 'Prof. Lisa Wang',
        status: 'upcoming'
      },
      {
        id: '5',
        title: 'Operations Management',
        description: 'Supply chain, quality control, and process optimization',
        duration: '5 weeks',
        instructor: 'Dr. Alex Thompson',
        status: 'upcoming'
      },
      {
        id: '6',
        title: 'Strategic Planning',
        description: 'Long-term planning and organizational development',
        duration: '6 weeks',
        instructor: 'Prof. James Wilson',
        status: 'upcoming'
      },
      {
        id: '7',
        title: 'Project Management',
        description: 'Project planning, execution, and monitoring',
        duration: '4 weeks',
        instructor: 'Dr. Maria Garcia',
        status: 'upcoming'
      },
      {
        id: '8',
        title: 'Business Ethics and Leadership',
        description: 'Ethical decision-making and leadership development',
        duration: '4 weeks',
        instructor: 'Prof. David Brown',
        status: 'upcoming'
      }
    ],
    instructors: [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        title: 'Programme Director',
        specialization: 'Strategic Management',
        experience: '15 years',
        image: '/api/placeholder/100/100',
        bio: 'Dr. Johnson has over 15 years of experience in business management and strategic planning.'
      },
      {
        id: '2',
        name: 'Prof. Michael Chen',
        title: 'Senior Lecturer',
        specialization: 'Financial Management',
        experience: '12 years',
        image: '/api/placeholder/100/100',
        bio: 'Prof. Chen is a certified financial analyst with extensive experience in corporate finance.'
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        title: 'Associate Professor',
        specialization: 'Marketing',
        experience: '10 years',
        image: '/api/placeholder/100/100',
        bio: 'Dr. Rodriguez specializes in digital marketing and brand management strategies.'
      }
    ],
    testimonials: [
      {
        id: '1',
        name: 'John Smith',
        role: 'Business Analyst',
        company: 'Tech Corp',
        rating: 5,
        comment: 'This programme transformed my understanding of business management. The practical approach and real-world case studies were invaluable.',
        image: '/api/placeholder/50/50'
      },
      {
        id: '2',
        name: 'Sarah Davis',
        role: 'Marketing Manager',
        company: 'Global Inc',
        rating: 5,
        comment: 'Excellent curriculum and outstanding instructors. I gained skills that I use daily in my current role.',
        image: '/api/placeholder/50/50'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'Operations Director',
        company: 'Manufacturing Co',
        rating: 4,
        comment: 'Great programme with practical insights. The project management module was particularly helpful.',
        image: '/api/placeholder/50/50'
      }
    ]
  }
]

export function ProgrammeDetailsPage() {
  const { programmeId } = useParams<{ programmeId: string }>()
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructors' | 'reviews'>('overview')

  const programme = mockProgrammes.find(p => p.id === programmeId)

  if (!programme) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">Programme Not Found</h1>
        <p className="text-secondary-600 mb-6">The programme you're looking for doesn't exist.</p>
        <Link to="/programmes">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programmes
          </Button>
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'upcoming':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/programmes">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-secondary-900">{programme.title}</h1>
          <p className="text-secondary-600 mt-1">{programme.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Programme Image and Status */}
      <Card>
        <div className="relative">
          <img
            src={programme.image}
            alt={programme.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className={programme.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {programme.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Programme Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-2xl font-bold text-secondary-900">{programme.courses}</p>
                <p className="text-sm text-secondary-600">Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-2xl font-bold text-secondary-900">{programme.students}</p>
                <p className="text-sm text-secondary-600">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-2xl font-bold text-secondary-900">{programme.duration}</p>
                <p className="text-sm text-secondary-600">Months</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-2xl font-bold text-secondary-900">${programme.price}</p>
                <p className="text-sm text-secondary-600">Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'curriculum', label: 'Curriculum' },
            { id: 'instructors', label: 'Instructors' },
            { id: 'reviews', label: 'Reviews' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Programme</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600 leading-relaxed">{programme.longDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {programme.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-secondary-600">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600">{programme.requirements}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Programme Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600">
                      Starts: {new Date(programme.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600">
                      Ends: {new Date(programme.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600">
                      Max Students: {programme.maxStudents}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600">
                      Price: ${programme.price}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rating & Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(programme.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{programme.rating}</span>
                    <span className="text-sm text-secondary-500">({programme.reviews} reviews)</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Enroll Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            {programme.curriculum.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900">{course.title}</h3>
                      <p className="text-sm text-secondary-600 mt-1">{course.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-secondary-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                        <span>Instructor: {course.instructor}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status.replace('-', ' ')}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'instructors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programme.instructors.map((instructor) => (
              <Card key={instructor.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900">{instructor.name}</h3>
                      <p className="text-sm text-primary-600">{instructor.title}</p>
                      <p className="text-sm text-secondary-600 mt-1">{instructor.specialization}</p>
                      <p className="text-xs text-secondary-500 mt-1">{instructor.experience} experience</p>
                      <p className="text-sm text-secondary-600 mt-2">{instructor.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {programme.testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-secondary-900">{testimonial.name}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-secondary-600 mb-2">
                        {testimonial.role} at {testimonial.company}
                      </p>
                      <p className="text-secondary-600">{testimonial.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
