import { Search, Filter, Plus, BookOpen, Users, Clock, Award } from 'lucide-react'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CreateProgrammeModal } from '@/components/CreateProgrammeModal'

// Mock data - in a real app, this would come from an API
const programmes = [
  {
    id: '1',
    title: 'Diploma in Business Management',
    description: 'Comprehensive business management program covering all essential aspects of modern business operations.',
    duration: 12,
    courses: 8,
    students: 150,
    isActive: true,
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    image: '/api/placeholder/400/200',
  },
  {
    id: '2',
    title: 'Diploma in Digital Marketing',
    description: 'Master digital marketing strategies, social media management, and online advertising.',
    duration: 6,
    courses: 5,
    students: 89,
    isActive: true,
    startDate: '2024-02-01',
    endDate: '2024-07-01',
    image: '/api/placeholder/400/200',
  },
  {
    id: '3',
    title: 'Diploma in Project Management',
    description: 'Learn project management methodologies and tools used in modern organizations.',
    duration: 9,
    courses: 6,
    students: 67,
    isActive: true,
    startDate: '2024-03-01',
    endDate: '2024-11-01',
    image: '/api/placeholder/400/200',
  },
]

export function ProgrammesPage() {
  const [programmesList, setProgrammesList] = useState(programmes)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredProgrammes = programmesList.filter(programme => {
    const matchesSearch = programme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && programme.isActive) ||
                         (filterStatus === 'inactive' && !programme.isActive)
    return matchesSearch && matchesFilter
  })

  const handleCreateProgramme = (programmeData: any) => {
    const newProgramme = {
      id: (programmesList.length + 1).toString(),
      ...programmeData,
      students: 0,
      isActive: true
    }
    setProgrammesList(prev => [newProgramme, ...prev])
    console.log('Programme created:', newProgramme)
    alert('Programme created successfully!')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Programmes</h1>
          <p className="text-secondary-600 mt-1">
            Explore our comprehensive diploma programmes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Programme
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
              placeholder="Search programmes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Programmes</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Programmes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProgrammes.map((programme) => (
          <ProgrammeCard key={programme.id} programme={programme} />
        ))}
      </div>

      {filteredProgrammes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No programmes found</h3>
            <p className="text-secondary-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No programmes available at the moment'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Programme Modal */}
      <CreateProgrammeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProgramme}
      />
    </div>
  )
}

interface ProgrammeCardProps {
  programme: {
    id: string
    title: string
    description: string
    duration: number
    courses: number
    students: number
    isActive: boolean
    startDate: string
    endDate: string
    image: string
  }
}

function ProgrammeCard({ programme }: ProgrammeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={programme.image}
          alt={programme.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className={cn(
            programme.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          )}>
            {programme.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg">{programme.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {programme.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-secondary-600">
            <BookOpen className="h-4 w-4 mr-2" />
            {programme.courses} courses
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <Users className="h-4 w-4 mr-2" />
            {programme.students} students
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <Clock className="h-4 w-4 mr-2" />
            {programme.duration} months
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-secondary-500">
            Starts {new Date(programme.startDate).toLocaleDateString()}
          </div>
          <Link to={`/programmes/${programme.id}`}>
            <Button size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
