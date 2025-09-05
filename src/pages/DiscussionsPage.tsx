import { 
  MessageSquare, 
  Plus, 
  Search, 
  Pin, 
  User, 
  Calendar,
  Reply,
  ThumbsUp,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'

import { useState } from 'react'
import { cn } from '@/utils/cn'

// Mock data - in a real app, this would come from an API
const discussions = [
  {
    id: '1',
    title: 'Project Management Best Practices',
    content: 'What are some effective project management methodologies that you have used in your professional experience? I would love to hear about different approaches and their pros and cons.',
    author: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: null,
      role: 'learner'
    },
    courseId: '1',
    courseTitle: 'Project Management Fundamentals',
    isPinned: true,
    isActive: true,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    replies: [
      {
        id: '1',
        content: 'I have found Agile methodology to be very effective for software development projects. It allows for flexibility and continuous improvement.',
        author: {
          id: '2',
          name: 'Michael Chen',
          avatar: null,
          role: 'instructor'
        },
        createdAt: '2024-01-20T15:45:00Z',
        likes: 5
      },
      {
        id: '2',
        content: 'Waterfall has its place too, especially for projects with well-defined requirements. It provides more structure and predictability.',
        author: {
          id: '3',
          name: 'Emily Rodriguez',
          avatar: null,
          role: 'learner'
        },
        createdAt: '2024-01-20T16:20:00Z',
        likes: 3
      }
    ],
    totalReplies: 2,
    totalLikes: 8
  },
  {
    id: '2',
    title: 'Digital Marketing Trends 2024',
    content: 'What are the emerging trends in digital marketing that we should be aware of this year? I am particularly interested in AI and automation tools.',
    author: {
      id: '4',
      name: 'David Wilson',
      avatar: null,
      role: 'learner'
    },
    courseId: '2',
    courseTitle: 'Digital Marketing Essentials',
    isPinned: false,
    isActive: true,
    createdAt: '2024-01-19T10:15:00Z',
    updatedAt: '2024-01-19T10:15:00Z',
    replies: [
      {
        id: '3',
        content: 'AI-powered personalization is definitely a game-changer. Tools like ChatGPT and other AI assistants are revolutionizing content creation.',
        author: {
          id: '5',
          name: 'Lisa Park',
          avatar: null,
          role: 'instructor'
        },
        createdAt: '2024-01-19T11:30:00Z',
        likes: 7
      }
    ],
    totalReplies: 1,
    totalLikes: 7
  },
  {
    id: '3',
    title: 'Assignment Submission Issues',
    content: 'I am having trouble uploading my assignment file. The system keeps showing an error message. Has anyone else experienced this issue?',
    author: {
      id: '6',
      name: 'Alex Thompson',
      avatar: null,
      role: 'learner'
    },
    courseId: '3',
    courseTitle: 'Business Ethics',
    isPinned: false,
    isActive: true,
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    replies: [],
    totalReplies: 0,
    totalLikes: 2
  }
]

export function DiscussionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCourse, setFilterCourse] = useState<'all' | string>('all')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [expandedDiscussions, setExpandedDiscussions] = useState<Set<string>>(new Set())

  const courses = Array.from(new Set(discussions.map(d => d.courseTitle)))

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = filterCourse === 'all' || discussion.courseTitle === filterCourse
    const matchesPinned = !showPinnedOnly || discussion.isPinned
    return matchesSearch && matchesCourse && matchesPinned
  })

  const pinnedDiscussions = filteredDiscussions.filter(d => d.isPinned)
  const regularDiscussions = filteredDiscussions.filter(d => !d.isPinned)

  const toggleExpanded = (discussionId: string) => {
    const newExpanded = new Set(expandedDiscussions)
    if (newExpanded.has(discussionId)) {
      newExpanded.delete(discussionId)
    } else {
      newExpanded.add(discussionId)
    }
    setExpandedDiscussions(newExpanded)
  }

  const handleLike = (discussionId: string) => {
    console.log(`Liked discussion ${discussionId}`)
  }

  const handleReply = (discussionId: string) => {
    console.log(`Replying to discussion ${discussionId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Discussions</h1>
          <p className="text-secondary-600 mt-1">
            Engage with your peers and instructors
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary btn-md">
            <Plus className="h-4 w-4 mr-2" />
            Start Discussion
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="input"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <button
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            className={cn(
              'btn btn-md',
              showPinnedOnly ? 'btn-primary' : 'btn-outline'
            )}
          >
            <Pin className="h-4 w-4 mr-2" />
            Pinned Only
          </button>
        </div>
      </div>

      {/* Pinned Discussions */}
      {pinnedDiscussions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <Pin className="h-5 w-5 mr-2 text-warning-600" />
            Pinned Discussions
          </h2>
          <div className="space-y-4">
            {pinnedDiscussions.map((discussion) => (
              <DiscussionCard 
                key={discussion.id} 
                discussion={discussion}
                isExpanded={expandedDiscussions.has(discussion.id)}
                onToggleExpanded={() => toggleExpanded(discussion.id)}
                onLike={() => handleLike(discussion.id)}
                onReply={() => handleReply(discussion.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Discussions */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">
          All Discussions
        </h2>
        <div className="space-y-4">
          {regularDiscussions.map((discussion) => (
            <DiscussionCard 
              key={discussion.id} 
              discussion={discussion}
              isExpanded={expandedDiscussions.has(discussion.id)}
              onToggleExpanded={() => toggleExpanded(discussion.id)}
              onLike={() => handleLike(discussion.id)}
              onReply={() => handleReply(discussion.id)}
            />
          ))}
        </div>
      </div>

      {filteredDiscussions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No discussions found</h3>
          <p className="text-secondary-600">
            {searchTerm ? 'Try adjusting your search terms' : 'No discussions available at the moment'}
          </p>
        </div>
      )}
    </div>
  )
}

interface DiscussionCardProps {
  discussion: {
    id: string
    title: string
    content: string
    author: {
      id: string
      name: string
      avatar: string | null
      role: string
    }
    courseId: string
    courseTitle: string
    isPinned: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
    replies: Array<{
      id: string
      content: string
      author: {
        id: string
        name: string
        avatar: string | null
        role: string
      }
      createdAt: string
      likes: number
    }>
    totalReplies: number
    totalLikes: number
  }
  isExpanded: boolean
  onToggleExpanded: () => void
  onLike: () => void
  onReply: () => void
}

function DiscussionCard({ 
  discussion, 
  isExpanded, 
  onToggleExpanded, 
  onLike, 
  onReply 
}: DiscussionCardProps) {
  const [showActions, setShowActions] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
    <div className={cn(
      'card transition-all duration-200',
      discussion.isPinned && 'border-warning-200 bg-warning-50'
    )}>
      <div className="card-content">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {discussion.isPinned && (
                <Pin className="h-4 w-4 text-warning-600" />
              )}
              <h3 className="text-lg font-semibold text-secondary-900">
                {discussion.title}
              </h3>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {discussion.author.name}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {getTimeAgo(discussion.createdAt)}
              </div>
              <span className="badge badge-primary">{discussion.courseTitle}</span>
            </div>

            <div className="text-secondary-700 mb-4">
              {isExpanded ? (
                <div className="whitespace-pre-wrap">{discussion.content}</div>
              ) : (
                <div className="line-clamp-3">{discussion.content}</div>
              )}
            </div>

            {/* Replies Preview */}
            {isExpanded && discussion.replies.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="font-medium text-secondary-900">Replies ({discussion.totalReplies})</h4>
                {discussion.replies.map((reply) => (
                  <div key={reply.id} className="bg-secondary-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm font-medium text-secondary-900">{reply.author.name}</span>
                      <span className="text-xs text-secondary-500">{getTimeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-sm text-secondary-700">{reply.content}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <button className="flex items-center text-xs text-secondary-600 hover:text-primary-600">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {reply.likes} likes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onLike}
                  className="flex items-center text-sm text-secondary-600 hover:text-primary-600"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {discussion.totalLikes} likes
                </button>
                <button
                  onClick={onReply}
                  className="flex items-center text-sm text-secondary-600 hover:text-primary-600"
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </button>
                <span className="text-sm text-secondary-500">
                  {discussion.totalReplies} replies
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={onToggleExpanded}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="btn btn-ghost btn-sm"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {showActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-secondary-200">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                        <Edit className="h-4 w-4 mr-3" />
                        Edit
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-error-700 hover:bg-error-50">
                        <Trash2 className="h-4 w-4 mr-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
