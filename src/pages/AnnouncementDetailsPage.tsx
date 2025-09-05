import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Pin, 
  Calendar, 
  User,
  Edit,
  Trash2,
  Share2,
  Clock,
  AlertCircle,
  Megaphone
} from 'lucide-react'

// Mock data for announcement details
const mockAnnouncements = [
  {
    id: '1',
    title: 'Important: System Maintenance Scheduled',
    content: `We will be performing scheduled maintenance on our systems this weekend. The platform will be unavailable from Saturday 2 AM to Sunday 6 AM. Please plan your studies accordingly.

During this maintenance window, the following services will be affected:
- Course access and content streaming
- Assignment submissions
- Discussion forums
- Grade viewing and reporting

We apologize for any inconvenience this may cause. We recommend:
1. Downloading any course materials you need before Saturday
2. Completing and submitting assignments before the maintenance window
3. Planning your study schedule around this downtime

If you have any urgent questions or concerns, please contact our support team at support@kbs.edu before the maintenance begins.

Thank you for your understanding and continued commitment to your education.`,
    author: {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'System Administrator',
      avatar: '/api/placeholder/50/50',
      email: 'sarah.johnson@kbs.edu'
    },
    isPinned: true,
    isActive: true,
    priority: 'high',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    expiresAt: '2024-01-28T23:59:59Z',
    courseId: null,
    programmeId: null,
    views: 1247,
    attachments: [
      {
        id: '1',
        name: 'Maintenance Schedule.pdf',
        size: '2.3 MB',
        type: 'pdf',
        url: '/api/files/maintenance-schedule.pdf'
      }
    ],
    relatedAnnouncements: [
      {
        id: '2',
        title: 'New Course Materials Available',
        createdAt: '2024-01-19T14:30:00Z'
      },
      {
        id: '3',
        title: 'Assignment Submission Deadline Extended',
        createdAt: '2024-01-18T16:45:00Z'
      }
    ]
  }
]

export function AnnouncementDetailsPage() {
  const { announcementId } = useParams<{ announcementId: string }>()
  const [isLiked, setIsLiked] = useState(false)

  const announcement = mockAnnouncements.find(a => a.id === announcementId)

  if (!announcement) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">Announcement Not Found</h1>
        <p className="text-secondary-600 mb-6">The announcement you're looking for doesn't exist.</p>
        <Link to="/announcements">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Button>
        </Link>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isExpired = announcement.expiresAt && new Date(announcement.expiresAt) < new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/announcements">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {announcement.isPinned && (
              <Pin className="h-5 w-5 text-warning-600" />
            )}
            <h1 className="text-3xl font-bold text-secondary-900">{announcement.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-secondary-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {announcement.author.name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {getTimeAgo(announcement.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {announcement.views} views
            </div>
          </div>
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

      {/* Priority and Status */}
      <div className="flex items-center gap-4">
        <Badge className={getPriorityColor(announcement.priority)}>
          {announcement.priority.toUpperCase()} PRIORITY
        </Badge>
        {announcement.isPinned && (
          <Badge className="bg-warning-100 text-warning-800">
            <Pin className="h-3 w-3 mr-1" />
            PINNED
          </Badge>
        )}
        {isExpired && (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            EXPIRED
          </Badge>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcement Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed">
                  {announcement.content}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {announcement.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center">
                          <Megaphone className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">{attachment.name}</p>
                          <p className="text-sm text-secondary-500">{attachment.size}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Announcements */}
          {announcement.relatedAnnouncements && announcement.relatedAnnouncements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcement.relatedAnnouncements.map((related) => (
                    <Link
                      key={related.id}
                      to={`/announcements/${related.id}`}
                      className="block p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      <h4 className="font-medium text-secondary-900 mb-1">{related.title}</h4>
                      <p className="text-sm text-secondary-500">{getTimeAgo(related.createdAt)}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Author Information */}
          <Card>
            <CardHeader>
              <CardTitle>Author Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <img
                  src={announcement.author.avatar}
                  alt={announcement.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-secondary-900">{announcement.author.name}</h3>
                  <p className="text-sm text-secondary-600">{announcement.author.role}</p>
                  <p className="text-sm text-secondary-500">{announcement.author.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcement Details */}
          <Card>
            <CardHeader>
              <CardTitle>Announcement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary-700">Created</label>
                <p className="text-sm text-secondary-600">{formatDate(announcement.createdAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-secondary-700">Last Updated</label>
                <p className="text-sm text-secondary-600">{formatDate(announcement.updatedAt)}</p>
              </div>

              {announcement.expiresAt && (
                <div>
                  <label className="text-sm font-medium text-secondary-700">Expires</label>
                  <p className="text-sm text-secondary-600">{formatDate(announcement.expiresAt)}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-secondary-700">Views</label>
                <p className="text-sm text-secondary-600">{announcement.views.toLocaleString()}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-700">Status</label>
                <p className="text-sm text-secondary-600">
                  {announcement.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">
                <Megaphone className="h-4 w-4 mr-2" />
                Mark as Read
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Announcement
              </Button>
              <Button variant="outline" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit Announcement
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Announcement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
