import { User } from '@/types'

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json' | 'pdf'
  includePersonalData: boolean
  includeAnalytics: boolean
  dateRange?: {
    start: string
    end: string
  }
  departments?: string[]
  roles?: string[]
}

export interface ExportData {
  users: User[]
  analytics: {
    totalUsers: number
    activeUsers: number
    usersByRole: Record<string, number>
    usersByDepartment: Record<string, number>
    registrationTrends: Array<{ date: string; count: number }>
    lastLoginTrends: Array<{ date: string; count: number }>
  }
  metadata: {
    exportDate: string
    exportedBy: string
    totalRecords: number
  }
}

class ExportService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  // Generate CSV content
  private generateCSV(data: ExportData): string {
    const { users, analytics, metadata } = data
    
    let csv = 'User Data Export\n'
    csv += `Export Date: ${metadata.exportDate}\n`
    csv += `Exported By: ${metadata.exportedBy}\n`
    csv += `Total Records: ${metadata.totalRecords}\n\n`
    
    // User data
    csv += 'Users\n'
    csv += 'ID,First Name,Last Name,Email,Role,Department,Status,Last Login,Created At\n'
    
    users.forEach(user => {
      csv += `${user.id},${user.firstName},${user.lastName},${user.email},${user.role},${user.department || 'N/A'},${user.isActive ? 'Active' : 'Inactive'},${user.lastLogin || 'Never'},${user.createdAt}\n`
    })
    
    // Analytics data
    if (analytics) {
      csv += '\nAnalytics\n'
      csv += 'Metric,Value\n'
      csv += `Total Users,${analytics.totalUsers}\n`
      csv += `Active Users,${analytics.activeUsers}\n`
      
      csv += '\nUsers by Role\n'
      Object.entries(analytics.usersByRole).forEach(([role, count]) => {
        csv += `${role},${count}\n`
      })
      
      csv += '\nUsers by Department\n'
      Object.entries(analytics.usersByDepartment).forEach(([dept, count]) => {
        csv += `${dept},${count}\n`
      })
    }
    
    return csv
  }

  // Generate JSON content
  private generateJSON(data: ExportData): string {
    return JSON.stringify(data, null, 2)
  }

  // Generate Excel content (simplified - in real app, use a library like xlsx)
  private generateXLSX(data: ExportData): string {
    // For now, return CSV format - in production, use xlsx library
    return this.generateCSV(data)
  }

  // Generate PDF content (simplified - in real app, use a library like jsPDF)
  private generatePDF(data: ExportData): string {
    // For now, return formatted text - in production, use jsPDF
    let content = 'KBS LMS - User Data Export\n'
    content += '=' .repeat(50) + '\n\n'
    content += `Export Date: ${data.metadata.exportDate}\n`
    content += `Exported By: ${data.metadata.exportedBy}\n`
    content += `Total Records: ${data.metadata.totalRecords}\n\n`
    
    content += 'USER DATA\n'
    content += '-'.repeat(30) + '\n'
    data.users.forEach(user => {
      content += `Name: ${user.firstName} ${user.lastName}\n`
      content += `Email: ${user.email}\n`
      content += `Role: ${user.role}\n`
      content += `Department: ${user.department || 'N/A'}\n`
      content += `Status: ${user.isActive ? 'Active' : 'Inactive'}\n`
      content += `Last Login: ${user.lastLogin || 'Never'}\n`
      content += `Created: ${user.createdAt}\n\n`
    })
    
    if (data.analytics) {
      content += 'ANALYTICS\n'
      content += '-'.repeat(30) + '\n'
      content += `Total Users: ${data.analytics.totalUsers}\n`
      content += `Active Users: ${data.analytics.activeUsers}\n\n`
      
      content += 'Users by Role:\n'
      Object.entries(data.analytics.usersByRole).forEach(([role, count]) => {
        content += `  ${role}: ${count}\n`
      })
      
      content += '\nUsers by Department:\n'
      Object.entries(data.analytics.usersByDepartment).forEach(([dept, count]) => {
        content += `  ${dept}: ${count}\n`
      })
    }
    
    return content
  }

  // Download file
  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Get MIME type for format
  private getMimeType(format: string): string {
    switch (format) {
      case 'csv': return 'text/csv'
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      case 'json': return 'application/json'
      case 'pdf': return 'application/pdf'
      default: return 'text/plain'
    }
  }

  // Get file extension
  private getFileExtension(format: string): string {
    switch (format) {
      case 'csv': return 'csv'
      case 'xlsx': return 'xlsx'
      case 'json': return 'json'
      case 'pdf': return 'pdf'
      default: return 'txt'
    }
  }

  // Fetch user data from API
  async fetchUserData(options: ExportOptions): Promise<ExportData> {
    try {
      // In a real app, this would make API calls
      // For now, we'll use mock data
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'john.doe@kbs.edu.ng',
          firstName: 'John',
          lastName: 'Doe',
          role: 'learner',
          department: 'Business Administration',
          isActive: true,
          lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          email: 'jane.smith@kbs.edu.ng',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'instructor',
          department: 'Computer Science',
          isActive: true,
          lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          email: 'admin@kbs.edu.ng',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          department: 'Administration',
          isActive: true,
          lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ]

      // Filter users based on options
      let filteredUsers = mockUsers
      
      if (options.departments && options.departments.length > 0) {
        filteredUsers = filteredUsers.filter(user => 
          user.department && options.departments!.includes(user.department)
        )
      }
      
      if (options.roles && options.roles.length > 0) {
        filteredUsers = filteredUsers.filter(user => 
          options.roles!.includes(user.role)
        )
      }

      // Generate analytics
      const analytics = {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.isActive).length,
        usersByRole: mockUsers.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        usersByDepartment: mockUsers.reduce((acc, user) => {
          const dept = user.department || 'Unknown'
          acc[dept] = (acc[dept] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        registrationTrends: [
          { date: '2024-01-01', count: 5 },
          { date: '2024-02-01', count: 8 },
          { date: '2024-03-01', count: 12 },
          { date: '2024-04-01', count: 15 },
          { date: '2024-05-01', count: 18 }
        ],
        lastLoginTrends: [
          { date: '2024-01-01', count: 3 },
          { date: '2024-02-01', count: 5 },
          { date: '2024-03-01', count: 7 },
          { date: '2024-04-01', count: 9 },
          { date: '2024-05-01', count: 11 }
        ]
      }

      return {
        users: filteredUsers,
        analytics: options.includeAnalytics ? analytics : {} as any,
        metadata: {
          exportDate: new Date().toISOString(),
          exportedBy: 'admin@kbs.edu.ng', // In real app, get from auth context
          totalRecords: filteredUsers.length
        }
      }
    } catch (error) {
      throw new Error('Failed to fetch user data for export')
    }
  }

  // Export data
  async exportData(options: ExportOptions): Promise<void> {
    try {
      const data = await this.fetchUserData(options)
      let content: string
      
      switch (options.format) {
        case 'csv':
          content = this.generateCSV(data)
          break
        case 'json':
          content = this.generateJSON(data)
          break
        case 'xlsx':
          content = this.generateXLSX(data)
          break
        case 'pdf':
          content = this.generatePDF(data)
          break
        default:
          throw new Error('Unsupported export format')
      }

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `kbs-users-export-${timestamp}.${this.getFileExtension(options.format)}`
      const mimeType = this.getMimeType(options.format)
      
      this.downloadFile(content, filename, mimeType)
    } catch (error) {
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Export individual user data
  async exportUserData(userId: string, options: Omit<ExportOptions, 'departments' | 'roles'>): Promise<void> {
    try {
      const allData = await this.fetchUserData({ ...options, departments: [], roles: [] })
      const userData = allData.users.find(u => u.id === userId)
      
      if (!userData) {
        throw new Error('User not found')
      }

      const singleUserData: ExportData = {
        users: [userData],
        analytics: options.includeAnalytics ? allData.analytics : {} as any,
        metadata: {
          ...allData.metadata,
          totalRecords: 1
        }
      }

      let content: string
      
      switch (options.format) {
        case 'csv':
          content = this.generateCSV(singleUserData)
          break
        case 'json':
          content = this.generateJSON(singleUserData)
          break
        case 'xlsx':
          content = this.generateXLSX(singleUserData)
          break
        case 'pdf':
          content = this.generatePDF(singleUserData)
          break
        default:
          throw new Error('Unsupported export format')
      }

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `kbs-user-${userData.firstName.toLowerCase()}-${userData.lastName.toLowerCase()}-${timestamp}.${this.getFileExtension(options.format)}`
      const mimeType = this.getMimeType(options.format)
      
      this.downloadFile(content, filename, mimeType)
    } catch (error) {
      throw new Error(`User export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get export statistics
  async getExportStats(): Promise<{
    totalExports: number
    lastExport: string | null
    popularFormats: Array<{ format: string; count: number }>
  }> {
    // Mock data - in real app, this would come from API
    return {
      totalExports: 15,
      lastExport: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      popularFormats: [
        { format: 'csv', count: 8 },
        { format: 'xlsx', count: 5 },
        { format: 'json', count: 2 }
      ]
    }
  }
}

export const exportService = new ExportService()
