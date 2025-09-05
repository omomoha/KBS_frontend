import React, { useState } from 'react'
import { Download, FileText, FileSpreadsheet, FileJson, File, Calendar, Users, Building2, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/Modal'
import { exportService, ExportOptions } from '@/services/exportService'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string // For individual user export
  userName?: string // For individual user export
}

export function ExportModal({ isOpen, onClose, userId, userName }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includePersonalData: true,
    includeAnalytics: true,
    departments: [],
    roles: []
  })

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const departments = [
    'Business Administration',
    'Computer Science',
    'Engineering',
    'Medicine',
    'Law',
    'Education',
    'Administration'
  ]

  const roles = ['learner', 'instructor', 'admin']

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values' },
    { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
    { value: 'json', label: 'JSON', icon: FileJson, description: 'JavaScript Object Notation' },
    { value: 'pdf', label: 'PDF', icon: File, description: 'Portable Document Format' }
  ]

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const options = {
        ...exportOptions,
        departments: selectedDepartments,
        roles: selectedRoles
      }

      if (userId) {
        await exportService.exportUserData(userId, options)
      } else {
        await exportService.exportData(options)
      }
      
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      // In a real app, show a toast notification
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev => 
      prev.includes(dept) 
        ? prev.filter(d => d !== dept)
        : [...prev, dept]
    )
  }

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={userId ? `Export User Data - ${userName}` : 'Export User Data'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Export Format</h3>
          <div className="grid grid-cols-2 gap-3">
            {formatOptions.map((option) => {
              const Icon = option.icon
              return (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-colors ${
                    exportOptions.format === option.value
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'hover:bg-secondary-50'
                  }`}
                  onClick={() => setExportOptions(prev => ({ ...prev, format: option.value as any }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-primary-600" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-secondary-600">{option.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Data Options */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Data to Include</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includePersonalData}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includePersonalData: e.target.checked }))}
                className="rounded border-secondary-300"
              />
              <span>Personal data (names, emails, contact info)</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includeAnalytics}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeAnalytics: e.target.checked }))}
                className="rounded border-secondary-300"
              />
              <span>Analytics data (statistics, trends, reports)</span>
            </label>
          </div>
        </div>

        {/* Filters - Only show for bulk export */}
        {!userId && (
          <>
            {/* Department Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Filter by Department</h3>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Badge
                    key={dept}
                    variant={selectedDepartments.includes(dept) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleDepartment(dept)}
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Filter by Role</h3>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <Badge
                    key={role}
                    variant={selectedRoles.includes(role) ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleRole(role)}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Export Summary */}
        <Card className="bg-secondary-50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">Export Summary</h4>
            <div className="text-sm text-secondary-600 space-y-1">
              <div>Format: {formatOptions.find(f => f.value === exportOptions.format)?.label}</div>
              <div>Personal Data: {exportOptions.includePersonalData ? 'Yes' : 'No'}</div>
              <div>Analytics: {exportOptions.includeAnalytics ? 'Yes' : 'No'}</div>
              {!userId && (
                <>
                  <div>Departments: {selectedDepartments.length === 0 ? 'All' : selectedDepartments.join(', ')}</div>
                  <div>Roles: {selectedRoles.length === 0 ? 'All' : selectedRoles.join(', ')}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
