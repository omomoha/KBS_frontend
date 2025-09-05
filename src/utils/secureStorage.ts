// Secure storage utilities for sensitive data
import { escapeHtml } from './security'

interface SecureStorageOptions {
  encrypt?: boolean
  ttl?: number // Time to live in milliseconds
}

class SecureStorage {
  private static instance: SecureStorage
  private encryptionKey: string | null = null

  private constructor() {
    this.initializeEncryptionKey()
  }

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage()
    }
    return SecureStorage.instance
  }

  private initializeEncryptionKey(): void {
    // In a real application, this should be generated server-side
    // and securely transmitted to the client
    const storedKey = localStorage.getItem('encryption_key')
    if (storedKey) {
      this.encryptionKey = storedKey
    } else {
      // Generate a simple key for demo purposes
      // In production, use proper key generation
      this.encryptionKey = this.generateKey()
      localStorage.setItem('encryption_key', this.encryptionKey)
    }
  }

  private generateKey(): string {
    // Simple key generation for demo - use proper crypto in production
    return btoa(Math.random().toString(36) + Date.now().toString(36))
  }

  private encrypt(data: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available')
    }
    
    // Simple XOR encryption for demo - use proper encryption in production
    let encrypted = ''
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
      encrypted += String.fromCharCode(charCode)
    }
    return btoa(encrypted)
  }

  private decrypt(encryptedData: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available')
    }
    
    try {
      const data = atob(encryptedData)
      let decrypted = ''
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ this.encryptionKey!.charCodeAt(i % this.encryptionKey!.length)
        decrypted += String.fromCharCode(charCode)
      }
      return decrypted
    } catch (error) {
      throw new Error('Failed to decrypt data')
    }
  }

  private isExpired(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp > ttl
  }

  setItem(key: string, value: any, options: SecureStorageOptions = {}): void {
    try {
      const { encrypt = true, ttl } = options
      
      const data = {
        value,
        timestamp: Date.now(),
        ttl: ttl || null
      }

      const serialized = JSON.stringify(data)
      const processed = encrypt ? this.encrypt(serialized) : serialized
      
      localStorage.setItem(`secure_${key}`, processed)
    } catch (error) {
      console.error('Failed to store secure data:', error)
      throw new Error('Failed to store data securely')
    }
  }

  getItem<T = any>(key: string, options: SecureStorageOptions = {}): T | null {
    try {
      const { encrypt = true } = options
      const stored = localStorage.getItem(`secure_${key}`)
      
      if (!stored) {
        return null
      }

      const processed = encrypt ? this.decrypt(stored) : stored
      const data = JSON.parse(processed)

      // Check if data has expired
      if (data.ttl && this.isExpired(data.timestamp, data.ttl)) {
        this.removeItem(key)
        return null
      }

      return data.value
    } catch (error) {
      console.error('Failed to retrieve secure data:', error)
      // Remove corrupted data
      this.removeItem(key)
      return null
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(`secure_${key}`)
  }

  clear(): void {
    // Clear only secure items
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        localStorage.removeItem(key)
      }
    })
  }

  // Specialized methods for common use cases
  setAuthTokens(tokens: any, ttl: number = 24 * 60 * 60 * 1000): void {
    this.setItem('auth_tokens', tokens, { encrypt: true, ttl })
  }

  getAuthTokens(): any | null {
    return this.getItem('auth_tokens', { encrypt: true })
  }

  setUserData(user: any, ttl: number = 24 * 60 * 60 * 1000): void {
    this.setItem('user_data', user, { encrypt: true, ttl })
  }

  getUserData(): any | null {
    return this.getItem('user_data', { encrypt: true })
  }

  setSecurePreference(key: string, value: any): void {
    this.setItem(`pref_${key}`, value, { encrypt: false })
  }

  getSecurePreference<T = any>(key: string): T | null {
    return this.getItem<T>(`pref_${key}`, { encrypt: false })
  }

  // Sanitize and store sensitive form data
  setFormData(formId: string, data: Record<string, any>, ttl: number = 30 * 60 * 1000): void {
    const sanitizedData: Record<string, any> = {}
    
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sanitizedData[escapeHtml(key)] = escapeHtml(value)
      } else {
        sanitizedData[key] = value
      }
    })

    this.setItem(`form_${formId}`, sanitizedData, { encrypt: true, ttl })
  }

  getFormData(formId: string): Record<string, any> | null {
    return this.getItem(`form_${formId}`, { encrypt: true })
  }

  clearFormData(formId: string): void {
    this.removeItem(`form_${formId}`)
  }

  // Clear all expired data
  cleanup(): void {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        try {
          const stored = localStorage.getItem(key)
          if (stored) {
            const data = JSON.parse(stored)
            if (data.ttl && this.isExpired(data.timestamp, data.ttl)) {
              localStorage.removeItem(key)
            }
          }
        } catch {
          // Remove corrupted data
          localStorage.removeItem(key)
        }
      }
    })
  }
}

export const secureStorage = SecureStorage.getInstance()
export default secureStorage
