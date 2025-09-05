import { useState } from 'react'
import { X, Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Assignment, AssignmentAttachment } from '@/types/assignments'
import { assignmentService } from '@/services/assignmentService'

interface SubmitAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  assignment: Assignment | null
  onSuccess: () => void
}

export function SubmitAssignmentModal({ isOpen, onClose, assignment, onSuccess }: SubmitAssignmentModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || [])
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDownload = async (attachment: AssignmentAttachment) => {
    setIsDownloading(attachment.id)
    try {
      await assignmentService.downloadFile(attachment.fileUrl, attachment.fileName)
    } catch (error) {
      console.error('Failed to download file:', error)
    } finally {
      setIsDownloading(null)
    }
  }

  const handleSubmit = async () => {
    if (!assignment || files.length === 0) return

    setIsSubmitting(true)
    try {
      const success = await assignmentService.submitAssignment(assignment.id, files)
      if (success) {
        onSuccess()
        onClose()
        setFiles([])
      }
    } catch (error) {
      console.error('Failed to submit assignment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diff = due.getTime() - now.getTime()
    
    if (diff <= 0) return { text: 'Overdue', color: 'bg-red-100 text-red-800' }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return { text: `${days} days, ${hours} hours left`, color: 'bg-green-100 text-green-800' }
    if (hours > 0) return { text: `${hours} hours left`, color: 'bg-yellow-100 text-yellow-800' }
    return { text: 'Less than 1 hour left', color: 'bg-red-100 text-red-800' }
  }

  if (!assignment) return null

  const timeRemaining = getTimeRemaining(assignment.dueDate)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Assignment">
      <div className="space-y-6">
        {/* Assignment Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <CardDescription className="mt-1">
                  {assignment.courseTitle} • {assignment.department}
                </CardDescription>
              </div>
              <Badge className={timeRemaining.color}>
                {timeRemaining.text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Description</h4>
              <p className="text-sm text-secondary-600">{assignment.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Instructions</h4>
              <p className="text-sm text-secondary-600 whitespace-pre-wrap">{assignment.instructions}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-secondary-700">Due Date:</span>
                <p className="text-secondary-600">{new Date(assignment.dueDate).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-secondary-700">Max Points:</span>
                <p className="text-secondary-600">{assignment.maxPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Files */}
        {assignment.attachments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment Files</CardTitle>
              <CardDescription>Download the assignment files and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assignment.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-secondary-500" />
                      <div>
                        <p className="font-medium text-sm">{attachment.fileName}</p>
                        <p className="text-xs text-secondary-500">{formatFileSize(attachment.fileSize)}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(attachment)}
                      disabled={isDownloading === attachment.id}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isDownloading === attachment.id ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submit Your Work</CardTitle>
            <CardDescription>Upload your completed assignment files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Upload Files
              </label>
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-secondary-400" />
                <p className="text-sm text-secondary-600 mb-2">
                  Drag and drop your files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="submit-file-upload"
                />
                <label
                  htmlFor="submit-file-upload"
                  className="inline-flex items-center px-4 py-2 border border-secondary-300 rounded-md text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 cursor-pointer"
                >
                  Choose Files
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-secondary-700 mb-2">Selected Files</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-secondary-500" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-secondary-500">({formatFileSize(file.size)})</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {files.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">Please select at least one file to submit</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submission Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submission Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-secondary-600">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Make sure your files are properly named and organized</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Check that all required files are included</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Ensure your work is complete before submitting</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>You can only submit once, so double-check everything</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={files.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
