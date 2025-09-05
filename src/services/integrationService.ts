import { integrations } from '@/config/integrations'

// Google Analytics Service
export class GoogleAnalyticsService {
  private static instance: GoogleAnalyticsService
  private isInitialized = false

  static getInstance(): GoogleAnalyticsService {
    if (!GoogleAnalyticsService.instance) {
      GoogleAnalyticsService.instance = new GoogleAnalyticsService()
    }
    return GoogleAnalyticsService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || !integrations.GA_MEASUREMENT_ID) return

    try {
      // Load Google Analytics script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${integrations.GA_MEASUREMENT_ID}`
      document.head.appendChild(script)

      // Initialize gtag
      window.gtag = window.gtag || function() {
        (window.gtag.q = window.gtag.q || []).push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', integrations.GA_MEASUREMENT_ID)

      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error)
    }
  }

  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (!this.isInitialized) return

    window.gtag('event', eventName, parameters)
  }

  trackPageView(pagePath: string, pageTitle: string): void {
    if (!this.isInitialized) return

    window.gtag('config', integrations.GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle
    })
  }

  trackUser(userId: string, properties: Record<string, any> = {}): void {
    if (!this.isInitialized) return

    window.gtag('config', integrations.GA_MEASUREMENT_ID, {
      user_id: userId,
      custom_map: properties
    })
  }
}

// Zoom SDK Service
export class ZoomService {
  private static instance: ZoomService
  private sdk: any = null

  static getInstance(): ZoomService {
    if (!ZoomService.instance) {
      ZoomService.instance = new ZoomService()
    }
    return ZoomService.instance
  }

  async initialize(): Promise<void> {
    if (this.sdk || !integrations.ZOOM_SDK_KEY) return

    try {
      // Load Zoom SDK
      const script = document.createElement('script')
      script.src = 'https://source.zoom.us/zoom-meeting-1.9.8.min.js'
      script.onload = () => {
        this.sdk = (window as any).ZoomMtg
        this.sdk.init({
          leaveOnPageUnload: true,
          isSupportAV: true,
          success: () => {
            console.log('Zoom SDK initialized')
          },
          error: (error: any) => {
            console.error('Zoom SDK initialization failed:', error)
          }
        })
      }
      document.head.appendChild(script)
    } catch (error) {
      console.error('Failed to initialize Zoom SDK:', error)
    }
  }

  async joinMeeting(meetingNumber: string, signature: string, userName: string, userEmail: string): Promise<void> {
    if (!this.sdk) {
      throw new Error('Zoom SDK not initialized')
    }

    return new Promise((resolve, reject) => {
      this.sdk.join({
        signature,
        meetingNumber,
        userName,
        userEmail,
        sdkKey: integrations.ZOOM_SDK_KEY,
        success: (result: any) => {
          console.log('Joined meeting successfully:', result)
          resolve(result)
        },
        error: (error: any) => {
          console.error('Failed to join meeting:', error)
          reject(error)
        }
      })
    })
  }
}

// Google Calendar Service
export class GoogleCalendarService {
  private static instance: GoogleCalendarService
  private gapi: any = null
  private isInitialized = false

  static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService()
    }
    return GoogleCalendarService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || !integrations.GOOGLE_CLIENT_ID) return

    try {
      // Load Google API script
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = () => {
        this.gapi = (window as any).gapi
        this.gapi.load('client:auth2', () => {
          this.gapi.client.init({
            apiKey: integrations.GOOGLE_API_KEY,
            clientId: integrations.GOOGLE_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: 'https://www.googleapis.com/auth/calendar'
          })
          this.isInitialized = true
        })
      }
      document.head.appendChild(script)
    } catch (error) {
      console.error('Failed to initialize Google Calendar:', error)
    }
  }

  async signIn(): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return this.gapi.auth2.getAuthInstance().signIn()
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return

    return this.gapi.auth2.getAuthInstance().signOut()
  }

  async createEvent(event: any): Promise<any> {
    if (!this.isInitialized) return

    return this.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    })
  }

  async listEvents(timeMin?: string, timeMax?: string): Promise<any> {
    if (!this.isInitialized) return

    return this.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax,
      singleEvents: true,
      orderBy: 'startTime'
    })
  }
}

// Email Service
export class EmailService {
  private static instance: EmailService

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(emailData: {
    to: string | string[]
    subject: string
    html?: string
    text?: string
  }): Promise<boolean> {
    try {
      const response = await fetch(`${integrations.API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(emailData)
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string, loginUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${integrations.API_BASE_URL}/email/welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ userEmail, userName, loginUrl })
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      return false
    }
  }

  async sendCourseEnrollmentEmail(userEmail: string, userName: string, courseName: string, courseUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${integrations.API_BASE_URL}/email/course-enrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ userEmail, userName, courseName, courseUrl })
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Failed to send course enrollment email:', error)
      return false
    }
  }
}

// Analytics Service
export class AnalyticsService {
  private static instance: AnalyticsService
  private gaService: GoogleAnalyticsService

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  constructor() {
    this.gaService = GoogleAnalyticsService.getInstance()
  }

  async initialize(): Promise<void> {
    if (integrations.ENABLE_ANALYTICS) {
      await this.gaService.initialize()
    }
  }

  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (integrations.ENABLE_ANALYTICS) {
      this.gaService.trackEvent(eventName, parameters)
    }
  }

  trackPageView(pagePath: string, pageTitle: string): void {
    if (integrations.ENABLE_ANALYTICS) {
      this.gaService.trackPageView(pagePath, pageTitle)
    }
  }

  trackUser(userId: string, properties: Record<string, any> = {}): void {
    if (integrations.ENABLE_ANALYTICS) {
      this.gaService.trackUser(userId, properties)
    }
  }

  // LMS-specific tracking methods
  trackCourseEnrollment(userId: string, courseId: string, courseName: string): void {
    this.trackEvent('course_enrollment', {
      course_id: courseId,
      course_name: courseName,
      user_id: userId
    })
  }

  trackCourseCompletion(userId: string, courseId: string, courseName: string, completionTime: number): void {
    this.trackEvent('course_completion', {
      course_id: courseId,
      course_name: courseName,
      completion_time: completionTime,
      user_id: userId
    })
  }

  trackAssignmentSubmission(userId: string, assignmentId: string, assignmentName: string, score?: number): void {
    this.trackEvent('assignment_submission', {
      assignment_id: assignmentId,
      assignment_name: assignmentName,
      score: score,
      user_id: userId
    })
  }

  trackVideoWatched(userId: string, videoId: string, videoName: string, watchTime: number, totalDuration: number): void {
    this.trackEvent('video_watched', {
      video_id: videoId,
      video_name: videoName,
      watch_time: watchTime,
      total_duration: totalDuration,
      completion_percentage: (watchTime / totalDuration) * 100,
      user_id: userId
    })
  }

  trackLogin(userId: string, loginMethod: string = 'email'): void {
    this.trackEvent('user_login', {
      login_method: loginMethod,
      user_id: userId
    })
  }

  trackPageView(userId: string, page: string, courseId?: string): void {
    this.trackEvent('page_view', {
      page: page,
      course_id: courseId,
      user_id: userId
    })
  }
}

// Export singleton instances
export const googleAnalyticsService = GoogleAnalyticsService.getInstance()
export const zoomService = ZoomService.getInstance()
export const googleCalendarService = GoogleCalendarService.getInstance()
export const emailService = EmailService.getInstance()
export const analyticsService = AnalyticsService.getInstance()

// Initialize services on app start
export const initializeIntegrations = async (): Promise<void> => {
  try {
    if (integrations.ENABLE_ANALYTICS) {
      await analyticsService.initialize()
    }
    
    if (integrations.ENABLE_VIDEO_CONFERENCING) {
      await zoomService.initialize()
    }
    
    if (integrations.ENABLE_CALENDAR_INTEGRATION) {
      await googleCalendarService.initialize()
    }
  } catch (error) {
    console.error('Failed to initialize integrations:', error)
  }
}
