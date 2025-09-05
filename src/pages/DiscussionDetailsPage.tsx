import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Pin, 
  Calendar, 
  User, 
  Reply,
  ThumbsUp,
  Edit,
  Trash2,
  Share2,
  MessageSquare,
  Send,
  MoreVertical
} from 'lucide-react'

// Mock data for discussion details
const mockDiscussions = [
  {
    id: '1',
    title: 'Project Management Best Practices',
    content: `What are some effective project management methodologies that you have used in your professional experience? I would love to hear about different approaches and their pros and cons.

I'm particularly interested in:
- Agile vs Waterfall approaches
- Tools and software you've found helpful
- How to handle scope creep
- Managing remote teams
- Risk management strategies

Please share your experiences and any resources you'd recommend!`,
    author: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/50/50',
      role: 'learner',
      email: 'sarah.johnson@email.com',
      joinDate: '2024-01-01'
    },
    courseId: '1',
    courseTitle: 'Project Management Fundamentals',
    isPinned: true,
    isActive: true,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    tags: ['project-management', 'methodologies', 'tools', 'best-practices'],
    views: 245,
    likes: 12,
    replies: [
      {
        id: '1',
        content: 'I have found Agile methodology to be very effective for software development projects. It allows for flexibility and continuous improvement. We use Scrum with 2-week sprints and daily standups. The key is having a good Product Owner who can prioritize the backlog effectively.',
        author: {
          id: '2',
          name: 'Michael Chen',
          avatar: '/api/placeholder/50/50',
          role: 'instructor'
        },
        createdAt: '2024-01-20T15:45:00Z',
        likes: 8,
        isInstructor: true
      },
      {
        id: '2',
        content: 'Waterfall has its place too, especially for projects with well-defined requirements. It provides more structure and predictability. I\'ve used it successfully for construction and manufacturing projects where changes are costly.',
        author: {
          id: '3',
          name: 'Emily Rodriguez',
          avatar: '/api/placeholder/50/50',
          role: 'learner'
        },
        createdAt: '2024-01-20T16:20:00Z',
        likes: 5,
        isInstructor: false
      },
      {
        id: '3',
        content: 'For tools, I highly recommend Jira for issue tracking and Confluence for documentation. Also, Trello is great for smaller teams. The key is finding what works for your team size and complexity.',
        author: {
          id: '4',
          name: 'David Wilson',
          avatar: '/api/placeholder/50/50',
          role: 'learner'
        },
        createdAt: '2024-01-20T17:10:00Z',
        likes: 3,
        isInstructor: false
      }
    ],
    totalReplies: 3,
    totalLikes: 12
  }
]

export function DiscussionDetailsPage() {
  const { discussionId } = useParams<{ discussionId: string }>()
  const [newReply, setNewReply] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)

  const discussion = mockDiscussions.find(d => d.id === discussionId)

  if (!discussion) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">Discussion Not Found</h1>
        <p className="text-secondary-600 mb-6">The discussion you're looking for doesn't exist.</p>
        <Link to="/discussions">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Discussions
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

  const handleLike = () => {
    setIsLiked(!isLiked)
    console.log('Toggled like')
  }

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (newReply.trim()) {
      console.log('New reply:', newReply)
      setNewReply('')
      setShowReplyForm(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/discussions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {discussion.isPinned && (
              <Pin className="h-5 w-5 text-warning-600" />
            )}
            <h1 className="text-3xl font-bold text-secondary-900">{discussion.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-secondary-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {discussion.author.name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {getTimeAgo(discussion.createdAt)}
            </div>
            <Badge variant="default">{discussion.courseTitle}</Badge>
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

      {/* Tags */}
      {discussion.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {discussion.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Main Discussion */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <img
              src={discussion.author.avatar}
              alt={discussion.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-secondary-900">{discussion.author.name}</h3>
                {discussion.author.role === 'instructor' && (
                  <Badge variant="default">Instructor</Badge>
                )}
                <span className="text-sm text-secondary-500">{getTimeAgo(discussion.createdAt)}</span>
              </div>
              <p className="text-sm text-secondary-600">{discussion.author.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mb-6">
            <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed">
              {discussion.content}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? 'text-primary-600' : 'text-secondary-600'}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {discussion.totalLikes} likes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-secondary-600"
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
              <span className="text-sm text-secondary-500">
                {discussion.totalReplies} replies
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-500">
                {discussion.views} views
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {showReplyForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add a Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReply} className="space-y-4">
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!newReply.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Reply
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary-900">
          Replies ({discussion.totalReplies})
        </h2>
        
        {discussion.replies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <img
                  src={reply.author.avatar}
                  alt={reply.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-secondary-900">{reply.author.name}</h4>
                    {reply.isInstructor && (
                      <Badge variant="default">Instructor</Badge>
                    )}
                    <span className="text-sm text-secondary-500">{getTimeAgo(reply.createdAt)}</span>
                  </div>
                </div>
                <div className="relative">
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-4">
                <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed">
                  {reply.content}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary-600"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {reply.likes} likes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary-600"
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No replies message */}
      {discussion.replies.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No replies yet</h3>
            <p className="text-secondary-600 mb-4">Be the first to share your thoughts!</p>
            <Button onClick={() => setShowReplyForm(true)}>
              <Reply className="h-4 w-4 mr-2" />
              Add Reply
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
