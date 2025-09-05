import { 
  Megaphone, 
  Plus, 
  Search, 
  Pin, 
  Calendar, 
  User,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter
} from 'lucide-react'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CreateAnnouncementModal } from '@/components/CreateAnnouncementModal'

// Mock data - in a real app, this would come from an API
const announcements = [
  {
    id: '1',
    title: 'Important: System Maintenance Scheduled',
    content: 'We will be performing scheduled maintenance on our systems this weekend. The platform will be unavailable from Saturday 2 AM to Sunday 6 AM. Please plan your studies accordingly.',
    author: {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'System Administrator'
    },
    isPinned: true,
    isActive: true,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    courseId: null,
    programmeId: null
  },
  {
    id: '2',
    title: 'New Course Materials Available',
    content: 'New course materials for Project Management Fundamentals have been uploaded. Please check the course page to access the latest resources and assignments.',
    author: {
      id: '2',
      name: 'Prof. Michael Chen',
      role: 'Course Instructor'
    },
    isPinned: false,
    isActive: true,
    createdAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-19T14:30:00Z',
    courseId: '1',
    programmeId: '1'
  },
  {
    id: '3',
    title: 'Assignment Submission Deadline Extended',
    content: 'Due to technical issues, the deadline for the Business Ethics assignment has been extended by 48 hours. The new deadline is January 25th at 11:59 PM.',
    author: {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      role: 'Course Instructor'
    },
    isPinned: false,
    isActive: true,
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    courseId: '2',
    programmeId: '1'
  },
  {
    id: '4',
    title: 'Welcome to the New Semester',
    content: 'Welcome to the Spring 2024 semester! We are excited to have you join us for another term of learning and growth. Please review the updated course schedules and requirements.',
    author: {
      id: '4',
      name: 'Dr. James Wilson',
      role: 'Programme Coordinator'
    },
    isPinned: false,
    isActive: true,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    courseId: null,
    programmeId: '1'
  }
]

export function AnnouncementsPage() {
  const [announcementsList, setAnnouncementsList] = useState(announcements)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCourse, setFilterCourse] = useState<'all' | 'general' | 'course'>('all')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredAnnouncements = announcementsList.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = filterCourse === 'all' || 
                         (filterCourse === 'general' && !announcement.courseId) ||
                         (filterCourse === 'course' && announcement.courseId)
    const matchesPinned = !showPinnedOnly || announcement.isPinned
    return matchesSearch && matchesCourse && matchesPinned
  })

  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned)
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned)

  const handleCreateAnnouncement = (announcementData: any) => {
    const newAnnouncement = {
      id: (announcementsList.length + 1).toString(),
      ...announcementData,
      isPinned: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setAnnouncementsList(prev => [newAnnouncement, ...prev])
    console.log('Announcement created:', newAnnouncement)
    alert('Announcement created successfully!')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Announcements</h1>
          <p className="text-secondary-600 mt-1">
            Stay updated with the latest news and updates
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <Input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value as any)}
            className="px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Announcements</option>
            <option value="general">General</option>
            <option value="course">Course-Specific</option>
          </select>
          <Button
            variant={showPinnedOnly ? 'default' : 'outline'}
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
          >
            <Pin className="h-4 w-4 mr-2" />
            Pinned Only
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <Pin className="h-5 w-5 mr-2 text-warning-600" />
            Pinned Announcements
          </h2>
          <div className="space-y-4">
            {pinnedAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">
          All Announcements
        </h2>
        <div className="space-y-4">
          {regularAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </div>

      {filteredAnnouncements.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Megaphone className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No announcements found</h3>
            <p className="text-secondary-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No announcements available at the moment'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Announcement Modal */}
      <CreateAnnouncementModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateAnnouncement}
      />
    </div>
  )
}

interface AnnouncementCardProps {
  announcement: {
    id: string
    title: string
    content: string
    author: {
      id: string
      name: string
      role: string
    }
    isPinned: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
    courseId: string | null
    programmeId: string | null
  }
}

function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showActions, setShowActions] = useState(false)

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

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-lg',
      announcement.isPinned && 'border-warning-200 bg-warning-50'
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {announcement.isPinned && (
                <Pin className="h-4 w-4 text-warning-600" />
              )}
              <CardTitle className="text-lg">
                {announcement.title}
              </CardTitle>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {announcement.author.name}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {getTimeAgo(announcement.createdAt)}
              </div>
              {announcement.courseId && (
                <Badge variant="default">Course-Specific</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-secondary-700 mb-4">
          {isExpanded ? (
            <div className="whitespace-pre-wrap">{announcement.content}</div>
          ) : (
            <div className="line-clamp-3">{announcement.content}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 hover:text-primary-700"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Link to={`/announcements/${announcement.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-secondary-200">
                  <Button variant="ghost" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-3" />
                    Edit
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-3" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
