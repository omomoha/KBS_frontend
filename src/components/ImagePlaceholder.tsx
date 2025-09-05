import { useState, useRef } from 'react'
import { Image, Upload, X, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImagePlaceholderProps {
  src?: string | null
  alt?: string
  className?: string
  onImageChange?: (file: File | null) => void
  onRemove?: () => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  editable?: boolean
}

export function ImagePlaceholder({ 
  src, 
  alt = 'Image', 
  className = '', 
  onImageChange,
  onRemove,
  placeholder = 'Click to upload image',
  size = 'md',
  editable = true
}: ImagePlaceholderProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  }

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const handleImageClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onImageChange) {
      setIsLoading(true)
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        setIsLoading(false)
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        setIsLoading(false)
        return
      }

      try {
        onImageChange(file)
      } catch (error) {
        console.error('Error processing image:', error)
        alert('Error processing image')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className="relative">
      <div
        className={`
          ${sizeClasses[size]} 
          ${className}
          relative border-2 border-dashed border-secondary-300 
          rounded-lg cursor-pointer transition-all duration-200
          ${editable ? 'hover:border-primary-400 hover:bg-primary-50' : ''}
          ${isHovered ? 'border-primary-400 bg-primary-50' : ''}
          ${src ? 'border-solid border-secondary-200' : ''}
          flex items-center justify-center overflow-hidden
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleImageClick}
      >
        {src ? (
          <div className="relative w-full h-full group">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
            />
            {editable && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (fileInputRef.current) {
                        fileInputRef.current.click()
                      }
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleRemove}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            ) : (
              <>
                <Image className={`${iconSizes[size]} text-secondary-400 mx-auto mb-2`} />
                <p className="text-xs text-secondary-500 font-medium">
                  {placeholder}
                </p>
                {editable && (
                  <p className="text-xs text-secondary-400 mt-1">
                    JPG, PNG, GIF up to 5MB
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </div>
  )
}
