// Accessibility utilities and helpers

/**
 * Generates a unique ID for accessibility attributes
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Creates ARIA attributes for form fields
 */
export interface AriaAttributes {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'aria-required'?: boolean
  'aria-labelledby'?: string
}

export function createAriaAttributes(
  fieldId: string,
  options: {
    hasError?: boolean
    isRequired?: boolean
    descriptionId?: string
    labelId?: string
  } = {}
): AriaAttributes {
  const attributes: AriaAttributes = {
    id: fieldId
  }

  if (options.hasError) {
    attributes['aria-invalid'] = true
  }

  if (options.isRequired) {
    attributes['aria-required'] = true
  }

  if (options.descriptionId) {
    attributes['aria-describedby'] = options.descriptionId
  }

  if (options.labelId) {
    attributes['aria-labelledby'] = options.labelId
  }

  return attributes
}

/**
 * Screen reader only text utility
 */
export function srOnly(text: string): string {
  return text
}

/**
 * Focus management utilities
 */
export class FocusManager {
  private static focusHistory: HTMLElement[] = []

  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement) {
      this.focusHistory.push(activeElement)
    }
  }

  static restoreFocus(): void {
    const lastFocused = this.focusHistory.pop()
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus()
    }
  }

  static focusElement(selector: string): boolean {
    const element = document.querySelector(selector) as HTMLElement
    if (element && typeof element.focus === 'function') {
      element.focus()
      return true
    }
    return false
  }
}

/**
 * Announce messages to screen readers
 */
export class ScreenReaderAnnouncer {
  private static announcer: HTMLElement | null = null

  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcer) {
      this.announcer = document.createElement('div')
      this.announcer.setAttribute('aria-live', 'polite')
      this.announcer.setAttribute('aria-atomic', 'true')
      this.announcer.className = 'sr-only'
      document.body.appendChild(this.announcer)
    }

    this.announcer.setAttribute('aria-live', priority)
    this.announcer.textContent = message

    // Clear the message after a short delay
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = ''
      }
    }, 1000)
  }
}

/**
 * Keyboard navigation utilities
 */
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End'
} as const

export function isActivationKey(key: string): boolean {
  return key === KeyboardKeys.ENTER || key === KeyboardKeys.SPACE
}

export function isNavigationKey(key: string): boolean {
  return [
    KeyboardKeys.ARROW_UP,
    KeyboardKeys.ARROW_DOWN,
    KeyboardKeys.ARROW_LEFT,
    KeyboardKeys.ARROW_RIGHT,
    KeyboardKeys.HOME,
    KeyboardKeys.END
  ].includes(key as any)
}

/**
 * Color contrast utilities
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color)
    if (!rgb) return 0

    const { r, g, b } = rgb
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function meetsWCAGAA(contrastRatio: number): boolean {
  return contrastRatio >= 4.5
}

export function meetsWCAGAAA(contrastRatio: number): boolean {
  return contrastRatio >= 7
}

/**
 * Skip link component props
 */
export interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

/**
 * Form validation accessibility helpers
 */
export interface ValidationMessage {
  id: string
  message: string
  type: 'error' | 'warning' | 'info'
}

export function createValidationMessage(
  message: string,
  type: ValidationMessage['type'] = 'error'
): ValidationMessage {
  return {
    id: generateId('validation'),
    message,
    type
  }
}

/**
 * ARIA live region for dynamic content updates
 */
export function createLiveRegion(level: 'polite' | 'assertive' = 'polite'): HTMLElement {
  const region = document.createElement('div')
  region.setAttribute('aria-live', level)
  region.setAttribute('aria-atomic', 'true')
  region.className = 'sr-only'
  document.body.appendChild(region)
  return region
}

/**
 * High contrast mode detection
 */
export function isHighContrastMode(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Reduced motion detection
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Screen reader detection (basic)
 */
export function isScreenReaderActive(): boolean {
  return window.navigator.userAgent.includes('NVDA') ||
         window.navigator.userAgent.includes('JAWS') ||
         window.navigator.userAgent.includes('VoiceOver')
}

/**
 * Focus visible polyfill for older browsers
 */
export function initFocusVisible(): void {
  if (typeof window !== 'undefined' && 'CSS' in window && 'supports' in window.CSS) {
    if (!window.CSS.supports('selector(:focus-visible)')) {
      // Add focus-visible class for browsers that don't support it
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation')
        }
      })

      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation')
      })
    }
  }
}
