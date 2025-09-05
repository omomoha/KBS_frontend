import React, { useState, useEffect } from 'react'
import { Download, FileText, FileSpreadsheet, FileJson, File, Users, BarChart3, Clock, TrendingUp, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExportModal } from './ExportModal'
import { exportService } from '@/services/exportService'

interface ExportStats {
  totalExports: number
  lastExport: string | null
  popularFormats: Array<{ format: string; count: number }>
}

export function ExportDashboard() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportStats, setExportStats] = useState<ExportStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadExportStats()
  }, [])

  const loadExportStats = async () => {
    try {
      const stats = await exportService.getExportStats()
      setExportStats(stats)
    } catch (error) {
      console.error('Failed to load export stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatIcons = {
    csv: FileText,
    xlsx: FileSpreadsheet,
    json: FileJson,
    pdf: File
  }

  const quickExportOptions = [
    {
      title: 'All Users',
      description: 'Export complete user database',
      icon: Users,
      action: () => setIsExportModalOpen(true),
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users Only',
      description: 'Export users who logged in recently',
      icon: TrendingUp,
      action: () => {
        // Pre-configure for active users
        setIsExportModalOpen(true)
      },
      color: 'bg-green-500'
    },
    {
      title: 'Analytics Report',
      description: 'Export user statistics and trends',
      icon: BarChart3,
      action: () => {
        // Pre-configure for analytics only
        setIsExportModalOpen(true)
      },
      color: 'bg-purple-500'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading export dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Data Export Center</h2>
          <p className="text-secondary-600">Export user data and analytics in various formats</p>
        </div>
        <Button 
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>New Export</span>
        </Button>
      </div>

      {/* Quick Export Options */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Export</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickExportOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={option.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${option.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary-900">{option.title}</h4>
                      <p className="text-sm text-secondary-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Export Statistics */}
      {exportStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-secondary-600">Total Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exportStats.totalExports}</div>
              <p className="text-xs text-secondary-600 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-secondary-600">Last Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exportStats.lastExport 
                  ? new Date(exportStats.lastExport).toLocaleDateString()
                  : 'Never'
                }
              </div>
              <p className="text-xs text-secondary-600 mt-1">
                {exportStats.lastExport 
                  ? new Date(exportStats.lastExport).toLocaleTimeString()
                  : 'No exports yet'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-secondary-600">Most Popular Format</CardTitle>
            </CardHeader>
            <CardContent>
              {exportStats.popularFormats.length > 0 ? (
                <div>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const mostPopular = exportStats.popularFormats[0]
                      const Icon = formatIcons[mostPopular.format as keyof typeof formatIcons] || FileText
                      return (
                        <>
                          <Icon className="h-4 w-4 text-primary-600" />
                          <span className="text-lg font-bold uppercase">{mostPopular.format}</span>
                        </>
                      )
                    })()}
                  </div>
                  <p className="text-xs text-secondary-600 mt-1">
                    {exportStats.popularFormats[0].count} exports
                  </p>
                </div>
              ) : (
                <div className="text-lg font-bold text-secondary-400">No data</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Format Popularity */}
      {exportStats && exportStats.popularFormats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export Format Usage</CardTitle>
            <CardDescription>Most commonly used export formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportStats.popularFormats.map((format, index) => {
                const Icon = formatIcons[format.format as keyof typeof formatIcons] || FileText
                const percentage = (format.count / exportStats.totalExports) * 100
                
                return (
                  <div key={format.format} className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 text-primary-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium uppercase">{format.format}</span>
                        <span className="text-secondary-600">{format.count} exports</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Export Guidelines</CardTitle>
          <CardDescription>Important information about data exports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-secondary-600">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Exports may take a few minutes to process depending on data size</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Personal data exports are subject to privacy regulations and should be handled securely</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Large exports are automatically compressed to reduce download time</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Export history is logged for audit purposes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  )
}
