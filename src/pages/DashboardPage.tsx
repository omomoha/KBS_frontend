import { useAuth } from '@/contexts/AuthContext'
import { 
  BookOpen, 
  FileText, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  GraduationCap,
  BarChart3,
  Activity,
  PlayCircle,
  Star,
  Target,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/StatCard'
import { ActivityCard } from '@/components/ui/ActivityCard'
import { ChartCard } from '@/components/ui/ChartCard'

export function DashboardPage() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'learner':
        return <LearnerDashboard />
      case 'instructor':
        return <InstructorDashboard />
      case 'admin':
        return <AdminDashboard />
      default:
        return <div>Loading...</div>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-secondary-600 mt-1">
          Welcome back to your learning dashboard
        </p>
      </div>

      {getDashboardContent()}
    </div>
  )
}

function LearnerDashboard() {
  const recentActivities = [
    {
      id: '1',
      title: 'Submitted assignment: Project Management Basics',
      description: 'Business Plan Analysis',
      time: '2 hours ago',
      icon: <CheckCircle className="h-4 w-4" />,
      status: 'success' as const,
      user: 'You'
    },
    {
      id: '2',
      title: 'New course material uploaded',
      description: 'Digital Marketing - Chapter 3',
      time: '1 day ago',
      icon: <BookOpen className="h-4 w-4" />,
      status: 'info' as const,
      user: 'Dr. Sarah Johnson'
    },
    {
      id: '3',
      title: 'Assignment due tomorrow',
      description: 'Business Ethics - Case Study',
      time: '1 day ago',
      icon: <AlertCircle className="h-4 w-4" />,
      status: 'warning' as const,
      user: 'System'
    },
    {
      id: '4',
      title: 'Certificate earned',
      description: 'Introduction to Business Management',
      time: '3 days ago',
      icon: <Award className="h-4 w-4" />,
      status: 'success' as const,
      user: 'System'
    }
  ]

  const upcomingDeadlines = [
    {
      id: '1',
      title: 'Business Ethics Assignment',
      dueDate: 'Tomorrow at 11:59 PM',
      course: 'Business Ethics',
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'Digital Marketing Quiz',
      dueDate: 'In 3 days',
      course: 'Digital Marketing',
      priority: 'medium' as const
    },
    {
      id: '3',
      title: 'Project Management Report',
      dueDate: 'Next week',
      course: 'Project Management',
      priority: 'low' as const
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Courses"
          value="3"
          icon={<BookOpen className="h-6 w-6" />}
          trend={{ value: "1", isPositive: true }}
          description="+1 new this week"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Assignments Due"
          value="2"
          icon={<FileText className="h-6 w-6" />}
          description="Next 7 days"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Certificates Earned"
          value="1"
          icon={<Award className="h-6 w-6" />}
          trend={{ value: "1", isPositive: true }}
          description="This month"
          iconColor="text-green-600"
        />
        <StatCard
          title="Overall Progress"
          value="75%"
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: "5%", isPositive: true }}
          description="+5% this week"
          iconColor="text-purple-600"
        />
      </div>

      {/* Continue Learning Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Digital Marketing</h3>
                <p className="text-sm text-blue-700">100 hrs</p>
              </div>
              <PlayCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-blue-600">65% Complete</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-green-900">UI/UX Design</h3>
                <p className="text-sm text-green-700">120 hrs</p>
              </div>
              <PlayCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-xs text-green-600">80% Complete</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-900">Sales & BD</h3>
                <p className="text-sm text-purple-700">104 hrs</p>
              </div>
              <PlayCircle className="h-8 w-8 text-purple-600" />
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-purple-600">45% Complete</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard
          title="Recent Activity"
          activities={recentActivities}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-secondary-900">
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className={`p-3 rounded-lg ${
                deadline.priority === 'high' ? 'bg-red-50 border border-red-200' :
                deadline.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">{deadline.title}</p>
                    <p className="text-xs text-secondary-600">{deadline.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-secondary-500">{deadline.dueDate}</p>
                    <Badge className={`text-xs ${
                      deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                      deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {deadline.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InstructorDashboard() {
  const recentSubmissions = [
    {
      id: '1',
      title: 'John Doe submitted assignment',
      description: 'Project Management Assignment',
      time: '2 hours ago',
      icon: <FileText className="h-4 w-4" />,
      status: 'warning' as const,
      user: 'John Doe'
    },
    {
      id: '2',
      title: 'Jane Smith submitted essay',
      description: 'Business Ethics Essay',
      time: '4 hours ago',
      icon: <FileText className="h-4 w-4" />,
      status: 'success' as const,
      user: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Michael Chen submitted quiz',
      description: 'Digital Marketing Quiz',
      time: '6 hours ago',
      icon: <FileText className="h-4 w-4" />,
      status: 'warning' as const,
      user: 'Michael Chen'
    },
    {
      id: '4',
      title: 'Sarah Johnson submitted report',
      description: 'Data Analytics Report',
      time: '1 day ago',
      icon: <FileText className="h-4 w-4" />,
      status: 'success' as const,
      user: 'Sarah Johnson'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Courses"
          value="5"
          icon={<BookOpen className="h-6 w-6" />}
          trend={{ value: "2", isPositive: true }}
          description="+2 new this month"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Pending Grading"
          value="12"
          icon={<FileText className="h-6 w-6" />}
          description="Needs attention"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Total Students"
          value="150"
          icon={<Users className="h-6 w-6" />}
          trend={{ value: "15", isPositive: true }}
          description="+15 this month"
          iconColor="text-green-600"
        />
        <StatCard
          title="Course Rating"
          value="4.8/5"
          icon={<Star className="h-6 w-6" />}
          trend={{ value: "0.2", isPositive: true }}
          description="+0.2 this month"
          iconColor="text-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard
          title="Recent Submissions"
          activities={recentSubmissions}
        />

        <ChartCard
          title="Course Performance"
          subtitle="Student completion rates"
        >
          <div className="space-y-4">
            {[
              { name: 'Project Management', progress: 85, students: 45 },
              { name: 'Digital Marketing', progress: 92, students: 38 },
              { name: 'Business Ethics', progress: 78, students: 32 },
              { name: 'Data Analytics', progress: 88, students: 28 }
            ].map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-secondary-900">{course.name}</span>
                  <span className="text-secondary-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-secondary-500">{course.students} students enrolled</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Create New Course</h3>
                <p className="text-sm text-blue-700">Start building your next course</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Grade Assignments</h3>
                <p className="text-sm text-green-700">12 pending submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">View Analytics</h3>
                <p className="text-sm text-purple-700">Track course performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const recentActivities = [
    {
      id: '1',
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '5 minutes ago',
      icon: <Users className="h-4 w-4" />,
      status: 'success' as const,
      user: 'System'
    },
    {
      id: '2',
      title: 'Course created',
      description: 'Introduction to Business Management',
      time: '1 hour ago',
      icon: <BookOpen className="h-4 w-4" />,
      status: 'info' as const,
      user: 'Dr. Sarah Johnson'
    },
    {
      id: '3',
      title: 'Assignment submitted',
      description: 'Business Plan Analysis',
      time: '2 hours ago',
      icon: <FileText className="h-4 w-4" />,
      status: 'success' as const,
      user: 'Michael Chen'
    },
    {
      id: '4',
      title: 'System maintenance',
      description: 'Database optimization completed',
      time: '3 hours ago',
      icon: <Zap className="h-4 w-4" />,
      status: 'info' as const,
      user: 'System'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="1,250"
          icon={<Users className="h-6 w-6" />}
          trend={{ value: "20.1%", isPositive: true }}
          description="+180 from last month"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Courses"
          value="45"
          icon={<BookOpen className="h-6 w-6" />}
          trend={{ value: "12.5%", isPositive: true }}
          description="+5 new this week"
          iconColor="text-green-600"
        />
        <StatCard
          title="Programmes"
          value="8"
          icon={<GraduationCap className="h-6 w-6" />}
          trend={{ value: "2", isPositive: true }}
          description="+1 new this month"
          iconColor="text-purple-600"
        />
        <StatCard
          title="System Health"
          value="99.9%"
          icon={<CheckCircle className="h-6 w-6" />}
          description="All systems operational"
          iconColor="text-emerald-600"
        />
      </div>

      {/* System Overview and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-secondary-900">
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-secondary-900">Server Status</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-secondary-900">Database Status</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-secondary-900">Last Backup</span>
              </div>
              <span className="text-sm text-secondary-600">2 hours ago</span>
            </div>
          </CardContent>
        </Card>

        <ActivityCard
          title="Recent Activity"
          activities={recentActivities}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="User Growth"
          subtitle="Monthly user registrations"
          action={
            <Button variant="outline" size="sm">
              View Details
            </Button>
          }
        >
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-secondary-600">Chart visualization would go here</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Course Performance"
          subtitle="Top performing courses this month"
          action={
            <Button variant="outline" size="sm">
              View All
            </Button>
          }
        >
          <div className="space-y-3">
            {[
              { name: 'Digital Marketing', progress: 95, students: 245 },
              { name: 'Business Management', progress: 87, students: 189 },
              { name: 'UI/UX Design', progress: 82, students: 156 },
              { name: 'Data Analytics', progress: 78, students: 134 }
            ].map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">{course.name}</p>
                  <p className="text-xs text-secondary-600">{course.students} students</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-secondary-900">{course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
