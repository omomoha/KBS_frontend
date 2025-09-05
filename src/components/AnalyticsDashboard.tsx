import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  Clock, 
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: {
      daily: number
      weekly: number
      monthly: number
    }
    totalCourses: number
    completedCourses: number
    averageScore: number
  }
  courses: Array<{
    id: string
    name: string
    enrollments: number
    completionRate: number
    averageScore: number
    views: number
  }>
  users: {
    total: number
    new: {
      today: number
      thisWeek: number
      thisMonth: number
    }
    engagement: {
      averageSessionDuration: number
      pagesPerSession: number
      bounceRate: number
    }
  }
  activity: Array<{
    date: string
    users: number
    pageViews: number
    courses: number
  }>
}

interface AnalyticsDashboardProps {
  className?: string
  onRefresh?: () => void
}

export function AnalyticsDashboard({ className, onRefresh }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockData: AnalyticsData = {
        overview: {
          totalUsers: 1250,
          activeUsers: {
            daily: 450,
            weekly: 800,
            monthly: 1200
          },
          totalCourses: 45,
          completedCourses: 1200,
          averageScore: 78.5
        },
        courses: [
          { id: '1', name: 'Digital Marketing', enrollments: 150, completionRate: 85, averageScore: 78.5, views: 1250 },
          { id: '2', name: 'Business Management', enrollments: 120, completionRate: 90, averageScore: 82.3, views: 980 },
          { id: '3', name: 'UI/UX Design', enrollments: 95, completionRate: 75, averageScore: 76.8, views: 750 },
          { id: '4', name: 'Data Analytics', enrollments: 80, completionRate: 88, averageScore: 81.2, views: 650 }
        ],
        users: {
          total: 1250,
          new: {
            today: 15,
            thisWeek: 45,
            thisMonth: 180
          },
          engagement: {
            averageSessionDuration: 25,
            pagesPerSession: 4.2,
            bounceRate: 15.5
          }
        },
        activity: [
          { date: '2024-01-01', users: 420, pageViews: 1250, courses: 45 },
          { date: '2024-01-02', users: 450, pageViews: 1350, courses: 48 },
          { date: '2024-01-03', users: 380, pageViews: 1100, courses: 42 },
          { date: '2024-01-04', users: 520, pageViews: 1500, courses: 52 },
          { date: '2024-01-05', users: 480, pageViews: 1400, courses: 50 },
          { date: '2024-01-06', users: 350, pageViews: 1000, courses: 38 },
          { date: '2024-01-07', users: 400, pageViews: 1150, courses: 45 }
        ]
      }
      
      setData(mockData)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchAnalytics()
    onRefresh?.()
  }

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <Button variant="outline" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-secondary-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No Analytics Data</h3>
          <p className="text-secondary-600 mb-4">Unable to load analytics data at this time.</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-secondary-600">Track your learning platform performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Users</p>
                <p className="text-3xl font-bold">{data.overview.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{data.users.new.thisMonth} this month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Active Users</p>
                <p className="text-3xl font-bold">{data.overview.activeUsers.daily}</p>
                <p className="text-sm text-secondary-600">daily active</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Courses</p>
                <p className="text-3xl font-bold">{data.overview.totalCourses}</p>
                <p className="text-sm text-secondary-600">{data.overview.completedCourses} completed</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Average Score</p>
                <p className="text-3xl font-bold">{data.overview.averageScore}%</p>
                <p className="text-sm text-green-600">+2.5% from last month</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>User Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-secondary-600">Activity chart would be rendered here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Engagement Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Avg. Session Duration</p>
                  <p className="text-sm text-secondary-600">Time spent per session</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{data.users.engagement.averageSessionDuration}m</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Pages per Session</p>
                  <p className="text-sm text-secondary-600">Average pages viewed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{data.users.engagement.pagesPerSession}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Bounce Rate</p>
                  <p className="text-sm text-secondary-600">Single-page sessions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{data.users.engagement.bounceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.courses.map((course, index) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-secondary-600">{course.enrollments} enrollments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-secondary-600">Completion Rate</p>
                    <p className="font-bold">{course.completionRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary-600">Avg. Score</p>
                    <p className="font-bold">{course.averageScore}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary-600">Views</p>
                    <p className="font-bold">{course.views.toLocaleString()}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>Popular</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
