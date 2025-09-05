import { useState, useRef, useCallback } from 'react'
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { validateFileUpload, sanitizeFileName } from '@/utils/security'
import { useAuth } from '@/contexts/AuthContext'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: (file: File) => void
  files: File[]
  maxFiles?: number
  accept?: string
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  files,
  maxFiles = 5,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt',
  className,
  disabled = false
}: FileUploadProps) {
  const { user: _user } = useAuth()
  const [isDragOver, setIsDragOver] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const fileArray = Array.from(selectedFiles)
    const newErrors: Record<string, string> = {}

    fileArray.forEach((file) => {
      const validation = validateFileUpload(file)
      if (!validation.isValid) {
        newErrors[file.name] = validation.error || 'Invalid file'
        return
      }

      if (files.length >= maxFiles) {
        newErrors[file.name] = `Maximum ${maxFiles} files allowed`
        return
      }

      // Check for duplicate files
      const isDuplicate = files.some(existingFile => 
        existingFile.name === file.name && existingFile.size === file.size
      )
      
      if (isDuplicate) {
        newErrors[file.name] = 'File already selected'
        return
      }

      onFileSelect(file)
    })

    setErrors(newErrors)
  }, [files, maxFiles, onFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }, [disabled, handleFileSelect])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFileSelect])

  const handleRemoveFile = useCallback((file: File) => {
    onFileRemove(file)
    // Clear any error for this file
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[file.name]
      return newErrors
    })
  }, [onFileRemove])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    const type = file.type
    if (type.startsWith('image/')) return '🖼️'
    if (type === 'application/pdf') return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    return '📁'
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragOver && !disabled
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-300 hover:border-secondary-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Upload className={cn(
          'h-12 w-12 mx-auto mb-4',
          isDragOver && !disabled ? 'text-primary-600' : 'text-secondary-400'
        )} />
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          {isDragOver ? 'Drop files here' : 'Upload files'}
        </h3>
        <p className="text-secondary-600 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-sm text-secondary-500 mb-4">
          Accepted formats: {accept} (Max 10MB per file)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || files.length >= maxFiles}
          className={cn(
            'btn btn-primary btn-md',
            (disabled || files.length >= maxFiles) && 'opacity-50 cursor-not-allowed'
          )}
        >
          Choose Files
        </button>
        {files.length >= maxFiles && (
          <p className="text-sm text-warning-600 mt-2">
            Maximum {maxFiles} files allowed
          </p>
        )}
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-secondary-900">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => {
              const error = errors[file.name]
              const hasError = !!error
              
              return (
                <div
                  key={`${file.name}-${index}`}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border',
                    hasError
                      ? 'border-error-200 bg-error-50'
                      : 'border-secondary-200 bg-secondary-50'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {sanitizeFileName(file.name)}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {formatFileSize(file.size)}
                      </p>
                      {hasError && (
                        <p className="text-xs text-error-600 mt-1">{error}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!hasError && (
                      <CheckCircle className="h-5 w-5 text-success-600" />
                    )}
                    {hasError && (
                      <AlertCircle className="h-5 w-5 text-error-600" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file)}
                      disabled={disabled}
                      className="btn btn-ghost btn-sm text-error-600 hover:text-error-700 hover:bg-error-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-error-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-error-800 mb-2">
                File Upload Errors
              </h4>
              <ul className="text-sm text-error-700 space-y-1">
                {Object.entries(errors).map(([fileName, error]) => (
                  <li key={fileName}>
                    <strong>{fileName}:</strong> {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
