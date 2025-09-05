import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilterBar, FilterConfig } from '@/components/ui/FilterBar'
import { EditUserModal, User } from '@/components/EditUserModal'
import { Users, Search, Filter, MoreVertical, Mail, Phone, Calendar, Edit, Eye } from 'lucide-react'

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@kbs.edu.ng',
    phone: '+1 (555) 123-4567',
    role: 'learner',
    status: 'active',
    lastLogin: '2024-01-14T10:30:00Z',
    enrolledCourses: 3,
    joinDate: '2023-09-15T00:00:00Z',
    department: 'Business Administration',
    title: 'Senior Manager',
    bio: 'Experienced business professional with a passion for continuous learning.'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@kbs.edu.ng',
    phone: '+1 (555) 234-5678',
    role: 'instructor',
    status: 'active',
    lastLogin: '2024-01-14T08:15:00Z',
    enrolledCourses: 0,
    joinDate: '2023-08-20T00:00:00Z',
    department: 'Business School',
    title: 'Professor of Management',
    bio: 'Dedicated educator with over 15 years of experience in business education.'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@kbs.edu.ng',
    phone: '+1 (555) 345-6789',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-14T09:45:00Z',
    enrolledCourses: 0,
    joinDate: '2023-07-10T00:00:00Z',
    department: 'IT Administration',
    title: 'System Administrator',
    bio: 'Technical expert responsible for platform maintenance and user management.'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@kbs.edu.ng',
    phone: '+1 (555) 456-7890',
    role: 'learner',
    status: 'inactive',
    lastLogin: '2024-01-05T14:20:00Z',
    enrolledCourses: 2,
    joinDate: '2023-10-01T00:00:00Z',
    department: 'Marketing',
    title: 'Marketing Coordinator',
    bio: 'Creative marketing professional focused on digital strategies and brand development.'
  }
]

export function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search users by name or email...'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'learner', label: 'Learners', count: users.filter(u => u.role === 'learner').length },
        { value: 'instructor', label: 'Instructors', count: users.filter(u => u.role === 'instructor').length },
        { value: 'admin', label: 'Admins', count: users.filter(u => u.role === 'admin').length }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active', count: users.filter(u => u.status === 'active').length },
        { value: 'inactive', label: 'Inactive', count: users.filter(u => u.status === 'inactive').length }
      ]
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { value: 'Business Administration', label: 'Business Administration', count: users.filter(u => u.department === 'Business Administration').length },
        { value: 'Business School', label: 'Business School', count: users.filter(u => u.department === 'Business School').length },
        { value: 'IT Administration', label: 'IT Administration', count: users.filter(u => u.department === 'IT Administration').length },
        { value: 'Marketing', label: 'Marketing', count: users.filter(u => u.department === 'Marketing').length }
      ]
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      type: 'dateRange'
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.search || 
      user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesRole = !filters.role || user.role === filters.role
    const matchesStatus = !filters.status || user.status === filters.status
    const matchesDepartment = !filters.department || user.department === filters.department
    
    const matchesJoinDate = !filters.joinDate || (
      (!filters.joinDate.from || new Date(user.joinDate) >= new Date(filters.joinDate.from)) &&
      (!filters.joinDate.to || new Date(user.joinDate) <= new Date(filters.joinDate.to))
    )

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment && matchesJoinDate
  })

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData }
          : user
      ))
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'instructor':
        return 'bg-blue-100 text-blue-800'
      case 'learner':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Users</h1>
          <p className="text-secondary-600 mt-2">
            Manage users and their access to the platform
          </p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfig}
        onFiltersChange={setFilters}
        searchPlaceholder="Search users by name or email..."
      />

      {/* Users List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <Badge className={getStatusColor(user.status)}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-secondary-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined: {new Date(user.joinDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {user.enrolledCourses} enrolled courses
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Link to={`/users/${user.id}`}>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No users found</h3>
            <p className="text-secondary-600">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingUser(null)
        }}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  )
}
