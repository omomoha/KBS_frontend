import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, BookOpen, Award, TrendingUp, Clock } from 'lucide-react'

// Mock analytics data
const mockAnalytics = {
  totalStudents: 1250,
  totalCourses: 45,
  completionRate: 78,
  averageGrade: 85,
  monthlyGrowth: 12,
  activeUsers: 890
}

const mockChartData = [
  { month: 'Jan', students: 120, courses: 8 },
  { month: 'Feb', students: 135, courses: 10 },
  { month: 'Mar', students: 150, courses: 12 },
  { month: 'Apr', students: 165, courses: 15 },
  { month: 'May', students: 180, courses: 18 },
  { month: 'Jun', students: 195, courses: 20 }
]

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Analytics</h1>
        <p className="text-secondary-600 mt-2">
          Track performance and engagement metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +{mockAnalytics.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Active courses available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Course completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.averageGrade}%</div>
            <p className="text-xs text-muted-foreground">
              Across all assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Online in the last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment Trends</CardTitle>
            <CardDescription>
              Monthly student enrollment over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-secondary-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-secondary-400 mx-auto mb-2" />
                <p className="text-secondary-600">Chart visualization would go here</p>
                <p className="text-sm text-secondary-500">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>
              Top performing courses by completion rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Introduction to Business Management', completion: 92, students: 45 },
                { name: 'Digital Marketing Strategies', completion: 88, students: 32 },
                { name: 'Financial Analysis', completion: 85, students: 28 },
                { name: 'Project Management', completion: 82, students: 38 }
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{course.name}</p>
                    <p className="text-xs text-secondary-600">{course.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{course.completion}%</p>
                    <div className="w-20 bg-secondary-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
