import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  Video, 
  FileText, 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  Clock,
  File
} from 'lucide-react'
import { ImagePlaceholder } from '@/components/ImagePlaceholder'

type ContentItem = {
  id: string
  title: string
  type: 'video' | 'text' | 'image'
  duration: string | null
  size: string
  uploadDate: string
  status: string
  url: string | null
  thumbnail: string | null
}

// Mock course data
const mockCourse = {
  id: '1',
  title: 'Introduction to Business Management',
  description: 'Learn the fundamentals of business management and leadership principles.',
  instructor: 'Dr. Sarah Johnson'
}

// Mock content data
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Welcome to Business Management',
    type: 'video',
    duration: '15:30',
    size: '45.2 MB',
    uploadDate: '2024-01-10T10:00:00Z',
    status: 'published',
    url: '/api/files/welcome-video.mp4',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Chapter 1: Management Principles',
    type: 'text',
    duration: null,
    size: '2.1 MB',
    uploadDate: '2024-01-10T11:00:00Z',
    status: 'published',
    url: '/api/files/chapter1.pdf',
    thumbnail: null
  },
  {
    id: '3',
    title: 'Organizational Structure Diagram',
    type: 'image',
    duration: null,
    size: '1.8 MB',
    uploadDate: '2024-01-10T12:00:00Z',
    status: 'published',
    url: '/api/files/org-structure.png',
    thumbnail: '/api/files/org-structure-thumb.png'
  },
  {
    id: '4',
    title: 'Case Study: Apple Inc.',
    type: 'video',
    duration: '22:15',
    size: '67.3 MB',
    uploadDate: '2024-01-11T09:00:00Z',
    status: 'draft',
    url: '/api/files/apple-case-study.mp4',
    thumbnail: '/api/placeholder/300/200'
  }
]

export function CourseContentPage() {
  const { courseId } = useParams()
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadType, setUploadType] = useState<'video' | 'text' | 'image'>('video')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />
      case 'text':
        return <FileText className="h-5 w-5" />
      case 'image':
        return <Image className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800'
      case 'text':
        return 'bg-blue-100 text-blue-800'
      case 'image':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files)
  }

  const handleUpload = () => {
    if (selectedFiles && selectedFiles.length > 0) {
      // In a real app, this would upload to the server
      const newContent = Array.from(selectedFiles).map((file, index) => ({
        id: (content.length + index + 1).toString(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: uploadType,
        duration: uploadType === 'video' ? '00:00' : null,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString(),
        status: 'draft',
        url: URL.createObjectURL(file),
        thumbnail: uploadType === 'video' ? '/api/placeholder/300/200' : null
      }))
      
      setContent(prev => [...prev, ...newContent])
      setSelectedFiles(null)
      setIsUploadModalOpen(false)
      alert('Files uploaded successfully!')
    }
  }

  const handleDelete = (contentId: string) => {
    setContent(prev => prev.filter(item => item.id !== contentId))
  }

  const handleStatusChange = (contentId: string, newStatus: string) => {
    setContent(prev => prev.map(item => 
      item.id === contentId ? { ...item, status: newStatus } : item
    ))
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{mockCourse.title}</span>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Content
            </Button>
          </CardTitle>
          <CardDescription>
            {mockCourse.description} • Instructor: {mockCourse.instructor}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upload Course Content</CardTitle>
              <CardDescription>
                Select files to upload to this course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Content Type
                </label>
                <div className="flex space-x-2">
                  {(['video', 'text', 'image'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={uploadType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadType(type)}
                      className="capitalize"
                    >
                      {getTypeIcon(type)}
                      <span className="ml-2">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Select Files
                </label>
                <Input
                  type="file"
                  multiple
                  accept={
                    uploadType === 'video' 
                      ? 'video/*' 
                      : uploadType === 'image' 
                        ? 'image/*' 
                        : '.pdf,.doc,.docx,.txt'
                  }
                  onChange={handleFileSelect}
                />
                <p className="text-xs text-secondary-500 mt-1">
                  {uploadType === 'video' 
                    ? 'Supported: MP4, AVI, MOV, WMV' 
                    : uploadType === 'image' 
                      ? 'Supported: JPG, PNG, GIF, SVG' 
                      : 'Supported: PDF, DOC, DOCX, TXT'
                  }
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!selectedFiles}>
                  Upload Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail/Preview */}
            <div className="aspect-video">
              <ImagePlaceholder
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full"
                size="lg"
                editable={false}
                placeholder={item.type === 'video' ? 'Video content' : item.type === 'image' ? 'Image content' : 'Document content'}
              />
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge className={getTypeColor(item.type)}>
                  {getTypeIcon(item.type)}
                  <span className="ml-1 capitalize">{item.type}</span>
                </Badge>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-sm text-secondary-600 space-y-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {item.duration || 'N/A'}
                </div>
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  {item.size}
                </div>
                <div className="text-xs">
                  Uploaded: {new Date(item.uploadDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              {item.status === 'draft' && (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleStatusChange(item.id, 'published')}
                >
                  Publish
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {content.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No content uploaded</h3>
            <p className="text-secondary-600 mb-4">
              Start by uploading videos, documents, or images for this course
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Content
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
