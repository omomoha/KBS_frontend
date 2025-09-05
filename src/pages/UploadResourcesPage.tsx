import { useState } from 'react'
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
  Trash2, 
  Download,
  Eye,
  Clock,
  File,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { ImagePlaceholder } from '@/components/ImagePlaceholder'

type ResourceItem = {
  id: string
  title: string
  type: 'video' | 'text' | 'image'
  course: string
  duration: string | null
  size: string
  uploadDate: string
  status: string
  url: string | null
  thumbnail: string | null
}

// Mock data for uploaded resources
const mockResources: ResourceItem[] = [
  {
    id: '1',
    title: 'Introduction to Business Management Video',
    type: 'video',
    course: 'Introduction to Business Management',
    duration: '15:30',
    size: '45.2 MB',
    uploadDate: '2024-01-10T10:00:00Z',
    status: 'published',
    url: '/api/files/intro-video.mp4',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Management Principles PDF',
    type: 'text',
    course: 'Introduction to Business Management',
    duration: null,
    size: '2.1 MB',
    uploadDate: '2024-01-10T11:00:00Z',
    status: 'published',
    url: '/api/files/management-principles.pdf',
    thumbnail: null
  },
  {
    id: '3',
    title: 'Organizational Chart',
    type: 'image',
    course: 'Introduction to Business Management',
    duration: null,
    size: '1.8 MB',
    uploadDate: '2024-01-10T12:00:00Z',
    status: 'published',
    url: '/api/files/org-chart.png',
    thumbnail: '/api/files/org-chart-thumb.png'
  },
  {
    id: '4',
    title: 'Digital Marketing Strategies Video',
    type: 'video',
    course: 'Digital Marketing Strategies',
    duration: '22:15',
    size: '67.3 MB',
    uploadDate: '2024-01-11T09:00:00Z',
    status: 'processing',
    url: null,
    thumbnail: '/api/placeholder/300/200'
  }
]

export function UploadResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>(mockResources)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadType, setUploadType] = useState<'video' | 'text' | 'image'>('video')
  const [selectedCourse, setSelectedCourse] = useState('')

  const mockCourses = [
    { id: '1', title: 'Introduction to Business Management' },
    { id: '2', title: 'Digital Marketing Strategies' },
    { id: '3', title: 'Financial Analysis and Reporting' }
  ]

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
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Clock className="h-4 w-4" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files)
  }

  const handleUpload = () => {
    if (selectedFiles && selectedFiles.length > 0 && selectedCourse) {
      // In a real app, this would upload to the server
      const course = mockCourses.find(c => c.id === selectedCourse)
      const newResources = Array.from(selectedFiles).map((file, index) => ({
        id: (resources.length + index + 1).toString(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: uploadType,
        course: course?.title || 'Unknown Course',
        duration: uploadType === 'video' ? '00:00' : null,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString(),
        status: 'processing',
        url: null,
        thumbnail: uploadType === 'video' ? '/api/placeholder/300/200' : null
      }))
      
      setResources(prev => [...prev, ...newResources])
      setSelectedFiles(null)
      setSelectedCourse('')
      setIsUploadModalOpen(false)
      alert('Files uploaded successfully! Processing will begin shortly.')
    }
  }

  const handleDelete = (resourceId: string) => {
    setResources(prev => prev.filter(item => item.id !== resourceId))
  }

  const handleStatusChange = (resourceId: string, newStatus: string) => {
    setResources(prev => prev.map(item => 
      item.id === resourceId ? { ...item, status: newStatus } : item
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Upload Learning Resources</h1>
          <p className="text-secondary-600 mt-2">
            Upload and manage videos, documents, and images for your courses
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Resources
        </Button>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upload Learning Resources</CardTitle>
              <CardDescription>
                Select files and course to upload content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Select Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a course...</option>
                  {mockCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

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
                    ? 'Supported: MP4, AVI, MOV, WMV (Max 500MB)' 
                    : uploadType === 'image' 
                      ? 'Supported: JPG, PNG, GIF, SVG (Max 50MB)' 
                      : 'Supported: PDF, DOC, DOCX, TXT (Max 100MB)'
                  }
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFiles || !selectedCourse}
                >
                  Upload Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail/Preview */}
            <div className="aspect-video">
              <ImagePlaceholder
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-full"
                size="lg"
                editable={false}
                placeholder={resource.type === 'video' ? 'Video content' : resource.type === 'image' ? 'Image content' : 'Document content'}
              />
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(resource.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge className={getTypeColor(resource.type)}>
                  {getTypeIcon(resource.type)}
                  <span className="ml-1 capitalize">{resource.type}</span>
                </Badge>
                <Badge className={getStatusColor(resource.status)}>
                  {getStatusIcon(resource.status)}
                  <span className="ml-1 capitalize">{resource.status}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-sm text-secondary-600">
                <strong>Course:</strong> {resource.course}
              </div>
              
              <div className="text-sm text-secondary-600 space-y-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {resource.duration || 'N/A'}
                </div>
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  {resource.size}
                </div>
                <div className="text-xs">
                  Uploaded: {new Date(resource.uploadDate).toLocaleDateString()}
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

              {resource.status === 'processing' && (
                <div className="text-center">
                  <div className="text-sm text-yellow-600 mb-2">Processing...</div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {resources.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No resources uploaded</h3>
            <p className="text-secondary-600 mb-4">
              Start by uploading videos, documents, or images for your courses
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Resources
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
