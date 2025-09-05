// Form security utilities for validation and sanitization
import { sanitizeInput, validateEmail, validatePassword } from './security'
import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .transform(email => sanitizeInput(email))

export const passwordSchema = z.string()
  .min(1, 'Password is required')
  .refine(password => {
    const validation = validatePassword(password)
    return validation.isValid
  }, {
    message: 'Password does not meet security requirements'
  })

export const nameSchema = z.string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .transform(name => sanitizeInput(name))

export const textSchema = z.string()
  .min(1, 'This field is required')
  .max(1000, 'Text must be less than 1000 characters')
  .transform(text => sanitizeInput(text))

export const urlSchema = z.string()
  .url('Please enter a valid URL')
  .transform(url => sanitizeInput(url))

// Form validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
})

export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['learner', 'instructor', 'admin']),
  department: z.string().optional().transform(dept => dept ? sanitizeInput(dept) : undefined)
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required').transform(token => sanitizeInput(token)),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  department: z.string().optional().transform(dept => dept ? sanitizeInput(dept) : undefined),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().transform(bio => bio ? sanitizeInput(bio) : undefined)
})

export const courseSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .transform(title => sanitizeInput(title)),
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters')
    .transform(desc => sanitizeInput(desc)),
  instructor: z.string()
    .min(1, 'Instructor is required')
    .max(50, 'Instructor name must be less than 50 characters')
    .transform(instructor => sanitizeInput(instructor)),
  department: z.string()
    .min(1, 'Department is required')
    .transform(dept => sanitizeInput(dept)),
  duration: z.number()
    .min(1, 'Duration must be at least 1 hour')
    .max(1000, 'Duration must be less than 1000 hours'),
  maxStudents: z.number()
    .min(1, 'Maximum students must be at least 1')
    .max(1000, 'Maximum students must be less than 1000'),
  tags: z.array(z.string().transform(tag => sanitizeInput(tag))).optional()
})

export const assignmentSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .transform(title => sanitizeInput(title)),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters')
    .transform(desc => sanitizeInput(desc)),
  instructions: z.string()
    .min(1, 'Instructions are required')
    .max(5000, 'Instructions must be less than 5000 characters')
    .transform(instructions => sanitizeInput(instructions)),
  courseId: z.string().min(1, 'Course is required'),
  department: z.string().min(1, 'Department is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  maxPoints: z.number()
    .min(1, 'Maximum points must be at least 1')
    .max(10000, 'Maximum points must be less than 10000'),
  assignmentType: z.enum(['essay', 'project', 'quiz', 'presentation', 'other'])
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .transform(desc => desc ? sanitizeInput(desc) : undefined)
})

// Sanitization helpers
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized: any = {}
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitized[sanitizeInput(key)] = sanitizeInput(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      )
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeFormData(value)
    } else {
      sanitized[key] = value
    }
  })
  
  return sanitized
}

// Validation helpers
export function validateFormField(field: string, value: any, schema: z.ZodSchema): {
  isValid: boolean
  error?: string
} {
  try {
    schema.parse(value)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Invalid input'
      }
    }
    return {
      isValid: false,
      error: 'Validation failed'
    }
  }
}

// Rate limiting for form submissions
class FormRateLimiter {
  private submissions: Map<string, number[]> = new Map()
  private maxSubmissions: number
  private timeWindow: number

  constructor(maxSubmissions: number = 5, timeWindow: number = 60000) {
    this.maxSubmissions = maxSubmissions
    this.timeWindow = timeWindow
  }

  canSubmit(formId: string): boolean {
    const now = Date.now()
    const submissions = this.submissions.get(formId) || []
    
    // Remove old submissions
    const validSubmissions = submissions.filter(time => now - time < this.timeWindow)
    
    if (validSubmissions.length >= this.maxSubmissions) {
      return false
    }
    
    validSubmissions.push(now)
    this.submissions.set(formId, validSubmissions)
    return true
  }

  getRemainingSubmissions(formId: string): number {
    const now = Date.now()
    const submissions = this.submissions.get(formId) || []
    const validSubmissions = submissions.filter(time => now - time < this.timeWindow)
    
    return Math.max(0, this.maxSubmissions - validSubmissions.length)
  }
}

export const formRateLimiter = new FormRateLimiter()

// CSRF protection for forms
export function generateFormCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function validateFormCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken && token.length >= 20
}

// Input length limits
export const INPUT_LIMITS = {
  NAME: { min: 2, max: 50 },
  EMAIL: { min: 5, max: 100 },
  PASSWORD: { min: 12, max: 128 },
  TITLE: { min: 1, max: 100 },
  DESCRIPTION: { min: 1, max: 1000 },
  BIO: { min: 0, max: 500 },
  COMMENT: { min: 1, max: 1000 },
  SEARCH: { min: 1, max: 100 }
} as const

// Common validation functions
export function validateInputLength(
  value: string, 
  field: keyof typeof INPUT_LIMITS
): { isValid: boolean; error?: string } {
  const limits = INPUT_LIMITS[field]
  
  if (value.length < limits.min) {
    return {
      isValid: false,
      error: `${field} must be at least ${limits.min} characters`
    }
  }
  
  if (value.length > limits.max) {
    return {
      isValid: false,
      error: `${field} must be less than ${limits.max} characters`
    }
  }
  
  return { isValid: true }
}

export function validateFileSize(file: File, maxSizeMB: number = 10): { isValid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    }
  }
  
  return { isValid: true }
}

export function validateFileType(file: File, allowedTypes: string[]): { isValid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
  }
  
  return { isValid: true }
}
