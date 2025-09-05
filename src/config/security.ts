// Security configuration and constants
export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 12,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    MIN_VARIETY: 3, // At least 3 of the above requirements
    MAX_CONSECUTIVE: 2, // Max consecutive identical characters
    COMMON_PATTERNS: [
      'password', '123456', 'qwerty', 'abc123', 'admin',
      'letmein', 'welcome', 'login', 'user', 'test'
    ]
  },

  // Rate limiting
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
    API_REQUESTS: 100,
    API_WINDOW: 60 * 1000, // 1 minute
    FORM_SUBMISSIONS: 10,
    FORM_WINDOW: 60 * 1000, // 1 minute
    FILE_UPLOADS: 20,
    FILE_WINDOW: 60 * 1000 // 1 minute
  },

  // File upload security
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    ALLOWED_EXTENSIONS: [
      '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.txt',
      '.xls', '.xlsx', '.ppt', '.pptx'
    ],
    DANGEROUS_PATTERNS: [
      /\.\./, // Directory traversal
      /[<>:"|?*]/, // Invalid characters
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Reserved names
      /\.(exe|bat|cmd|com|scr|pif|vbs|js|jar|app)$/i // Executable files
    ]
  },

  // Input validation
  INPUT_LIMITS: {
    NAME: { min: 2, max: 50 },
    EMAIL: { min: 5, max: 100 },
    PASSWORD: { min: 12, max: 128 },
    TITLE: { min: 1, max: 100 },
    DESCRIPTION: { min: 1, max: 1000 },
    BIO: { min: 0, max: 500 },
    COMMENT: { min: 1, max: 1000 },
    SEARCH: { min: 1, max: 100 },
    URL: { min: 1, max: 2048 }
  },

  // Session security
  SESSION: {
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
    MAX_IDLE_TIME: 30 * 60 * 1000, // 30 minutes
    CLEANUP_INTERVAL: 60 * 1000 // 1 minute
  },

  // CSRF protection
  CSRF: {
    TOKEN_LENGTH: 32,
    MAX_TOKENS: 1000,
    CLEANUP_THRESHOLD: 500
  },

  // Content Security Policy
  CSP: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Vite dev
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'font-src': "'self' https://fonts.gstatic.com",
    'img-src': "'self' data: https:",
    'connect-src': "'self' https:",
    'frame-ancestors': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'"
  },

  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  },

  // Error handling
  ERROR_HANDLING: {
    EXPOSE_STACK_TRACES: false, // Never expose stack traces in production
    LOG_ERRORS: true,
    SANITIZE_ERROR_MESSAGES: true
  },

  // Encryption
  ENCRYPTION: {
    ALGORITHM: 'AES-GCM',
    KEY_LENGTH: 256,
    IV_LENGTH: 12
  }
} as const

// Security utility functions
export function isSecureContext(): boolean {
  return window.isSecureContext || location.protocol === 'https:'
}

export function getSecurityLevel(): 'high' | 'medium' | 'low' {
  if (isSecureContext() && location.hostname === 'localhost') {
    return 'high'
  } else if (isSecureContext()) {
    return 'medium'
  } else {
    return 'low'
  }
}

export function shouldEnforceStrictSecurity(): boolean {
  return getSecurityLevel() === 'high' || import.meta.env.PROD
}

// Security warnings and recommendations
export const SECURITY_WARNINGS = {
  INSECURE_CONTEXT: 'Application is running in an insecure context. Some security features may be disabled.',
  WEAK_PASSWORD: 'Password does not meet security requirements.',
  SUSPICIOUS_ACTIVITY: 'Suspicious activity detected. Please verify your identity.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  FILE_UPLOAD_BLOCKED: 'File upload blocked due to security policy.',
  CSRF_TOKEN_INVALID: 'Security token invalid. Please refresh the page.'
} as const

// Security event types for logging
export const SECURITY_EVENTS = {
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  FILE_UPLOAD: 'file_upload',
  FILE_DOWNLOAD: 'file_download',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  CSRF_VIOLATION: 'csrf_violation',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity'
} as const

// Security monitoring
export class SecurityMonitor {
  private static events: Array<{ type: string; timestamp: number; data: any }> = []
  private static maxEvents = 1000

  static logEvent(type: string, data: any = {}): void {
    const event = {
      type,
      timestamp: Date.now(),
      data: this.sanitizeEventData(data)
    }

    this.events.push(event)

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Security Event] ${type}:`, data)
    }
  }

  private static sanitizeEventData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data
    }

    const sanitized: any = {}
    Object.entries(data).forEach(([key, value]) => {
      // Remove sensitive data
      if (['password', 'token', 'secret', 'key'].some(sensitive => 
        key.toLowerCase().includes(sensitive)
      )) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeEventData(value)
      } else {
        sanitized[key] = value
      }
    })

    return sanitized
  }

  static getEvents(type?: string): Array<{ type: string; timestamp: number; data: any }> {
    if (type) {
      return this.events.filter(event => event.type === type)
    }
    return [...this.events]
  }

  static clearEvents(): void {
    this.events = []
  }
}

export default SECURITY_CONFIG
