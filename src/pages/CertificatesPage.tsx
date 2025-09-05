import { 
  Award, 
  Download, 
  Eye, 
  Calendar, 
  FileText, 
  CheckCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react'

import { useState } from 'react'
import { cn } from '@/utils/cn'

// Mock data - in a real app, this would come from an API
const certificates = [
  {
    id: '1',
    title: 'Diploma in Business Management',
    type: 'diploma' as const,
    issuedAt: '2024-01-15',
    certificateNumber: 'KBS-DBM-2024-001',
    status: 'issued' as const,
    downloadUrl: '/api/certificates/1/download',
    previewUrl: '/api/certificates/1/preview',
    programme: {
      id: '1',
      title: 'Diploma in Business Management',
      duration: '12 months',
      completedAt: '2024-01-15'
    }
  },
  {
    id: '2',
    title: 'Project Management Fundamentals',
    type: 'course' as const,
    issuedAt: '2023-12-20',
    certificateNumber: 'KBS-PMF-2023-045',
    status: 'issued' as const,
    downloadUrl: '/api/certificates/2/download',
    previewUrl: '/api/certificates/2/preview',
    course: {
      id: '1',
      title: 'Project Management Fundamentals',
      credits: 3,
      completedAt: '2023-12-20'
    }
  },
  {
    id: '3',
    title: 'Digital Marketing Essentials',
    type: 'course' as const,
    issuedAt: '2023-11-10',
    certificateNumber: 'KBS-DME-2023-032',
    status: 'issued' as const,
    downloadUrl: '/api/certificates/3/download',
    previewUrl: '/api/certificates/3/preview',
    course: {
      id: '2',
      title: 'Digital Marketing Essentials',
      credits: 2,
      completedAt: '2023-11-10'
    }
  },
  {
    id: '4',
    title: 'Business Ethics',
    type: 'course' as const,
    issuedAt: '2023-10-05',
    certificateNumber: 'KBS-BE-2023-028',
    status: 'pending' as const,
    downloadUrl: null,
    previewUrl: null,
    course: {
      id: '3',
      title: 'Business Ethics',
      credits: 2,
      completedAt: '2023-10-05'
    }
  }
]

export function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'diploma' | 'course'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'issued' | 'pending'>('all')

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || cert.type === filterType
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleDownload = async (certificateId: string) => {
    // Simulate download
    console.log(`Downloading certificate ${certificateId}`)
    // In a real app, this would trigger the actual download
  }

  const handlePreview = async (certificateId: string) => {
    // Simulate preview
    console.log(`Previewing certificate ${certificateId}`)
    // In a real app, this would open a preview modal or new tab
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Certificates</h1>
          <p className="text-secondary-600 mt-1">
            View and download your earned certificates
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary btn-md">
            <Award className="h-4 w-4 mr-2" />
            Request Certificate
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
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="input"
          >
            <option value="all">All Types</option>
            <option value="diploma">Diploma</option>
            <option value="course">Course</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="issued">Issued</option>
            <option value="pending">Pending</option>
          </select>
          <button className="btn btn-outline btn-md">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <CertificateCard 
            key={certificate.id} 
            certificate={certificate}
            onDownload={handleDownload}
            onPreview={handlePreview}
          />
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No certificates found</h3>
          <p className="text-secondary-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Complete courses to earn certificates'}
          </p>
        </div>
      )}
    </div>
  )
}

interface CertificateCardProps {
  certificate: {
    id: string
    title: string
    type: 'diploma' | 'course'
    issuedAt: string
    certificateNumber: string
    status: 'issued' | 'pending'
    downloadUrl: string | null
    previewUrl: string | null
    programme?: {
      id: string
      title: string
      duration: string
      completedAt: string
    }
    course?: {
      id: string
      title: string
      credits: number
      completedAt: string
    }
  }
  onDownload: (id: string) => void
  onPreview: (id: string) => void
}

function CertificateCard({ certificate, onDownload, onPreview }: CertificateCardProps) {
  const isIssued = certificate.status === 'issued'
  const isDiploma = certificate.type === 'diploma'

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="card-content">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={cn(
              'p-2 rounded-lg',
              isDiploma ? 'bg-primary-100' : 'bg-success-100'
            )}>
              <Award className={cn(
                'h-6 w-6',
                isDiploma ? 'text-primary-600' : 'text-success-600'
              )} />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-secondary-900">{certificate.title}</h3>
              <p className="text-sm text-secondary-500">
                {isDiploma ? 'Diploma Certificate' : 'Course Certificate'}
              </p>
            </div>
          </div>
          <span className={cn(
            'badge',
            isIssued ? 'badge-success' : 'badge-warning'
          )}>
            {isIssued ? 'Issued' : 'Pending'}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-secondary-600">
            <FileText className="h-4 w-4 mr-2" />
            {certificate.certificateNumber}
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <Calendar className="h-4 w-4 mr-2" />
            {isIssued ? 'Issued' : 'Completed'} {new Date(certificate.issuedAt).toLocaleDateString()}
          </div>
          {certificate.programme && (
            <div className="flex items-center text-sm text-secondary-600">
              <Clock className="h-4 w-4 mr-2" />
              {certificate.programme.duration}
            </div>
          )}
          {certificate.course && (
            <div className="flex items-center text-sm text-secondary-600">
              <Award className="h-4 w-4 mr-2" />
              {certificate.course.credits} credits
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {isIssued ? (
            <>
              <button
                onClick={() => onDownload(certificate.id)}
                className="btn btn-primary btn-sm flex-1"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
              <button
                onClick={() => onPreview(certificate.id)}
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center text-sm text-warning-600 w-full">
              <Clock className="h-4 w-4 mr-2" />
              Certificate will be available soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
