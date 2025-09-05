// Security utilities for file uploads, input validation, and security headers

export interface FileUploadConfig {
  maxSize: number // in bytes
  allowedTypes: string[]
  allowedExtensions: string[]
}

export const FILE_UPLOAD_CONFIG: FileUploadConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ],
  allowedExtensions: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.txt']
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates file upload based on security policies
 */
export function validateFileUpload(file: File, config: FileUploadConfig = FILE_UPLOAD_CONFIG): ValidationResult {
  // Check file size
  if (file.size > config.maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(config.maxSize / (1024 * 1024))}MB`
    }
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`
    }
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!config.allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File extension ${fileExtension} is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`
    }
  }

  // Check for potentially dangerous file names
  const dangerousPatterns = [
    /\.\./, // Directory traversal
    /[<>:"|?*]/, // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Reserved names
    /\.(exe|bat|cmd|com|scr|pif|vbs|js|jar|app)$/i // Executable files
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(file.name)) {
      return {
        isValid: false,
        error: 'File name contains potentially dangerous characters or patterns'
      }
    }
  }

  return { isValid: true }
}

/**
 * Sanitizes file name for safe storage
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase()
}

/**
 * Generates a secure file name with timestamp
 */
export function generateSecureFileName(originalName: string, userId: string): string {
  const timestamp = Date.now()
  const sanitized = sanitizeFileName(originalName)
  const extension = sanitized.split('.').pop()
  const nameWithoutExt = sanitized.replace(/\.[^/.]+$/, '')
  
  return `${userId}_${timestamp}_${nameWithoutExt}.${extension}`
}

/**
 * Validates and sanitizes user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    }
  }
  return { isValid: true }
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): ValidationResult {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`
    }
  }

  if (!hasUpperCase) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter'
    }
  }

  if (!hasLowerCase) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter'
    }
  }

  if (!hasNumbers) {
    return {
      isValid: false,
      error: 'Password must contain at least one number'
    }
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character'
    }
  }

  return { isValid: true }
}

/**
 * Content Security Policy headers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: unsafe-eval needed for Vite dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }

    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    
    return true
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    return Math.max(0, this.maxRequests - validRequests.length)
  }
}

/**
 * XSS protection - escapes HTML characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * CSRF token generation and validation
 */
export class CSRFProtection {
  private static tokens: Set<string> = new Set()

  static generateToken(): string {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)
    this.tokens.add(token)
    
    // Clean up old tokens (in a real app, use a more sophisticated cleanup)
    if (this.tokens.size > 1000) {
      const tokensArray = Array.from(this.tokens)
      this.tokens.clear()
      // Keep only the last 500 tokens
      tokensArray.slice(-500).forEach(t => this.tokens.add(t))
    }
    
    return token
  }

  static validateToken(token: string): boolean {
    const isValid = this.tokens.has(token)
    if (isValid) {
      this.tokens.delete(token) // Use token only once
    }
    return isValid
  }
}
