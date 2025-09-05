export const integrations = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  
  // Google Analytics
  GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  
  // Google Calendar
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || '',
  
  // Zoom Configuration
  ZOOM_SDK_KEY: import.meta.env.VITE_ZOOM_SDK_KEY || '',
  ZOOM_SDK_SECRET: import.meta.env.VITE_ZOOM_SDK_SECRET || '',
  
  // Microsoft Teams
  TEAMS_CLIENT_ID: import.meta.env.VITE_TEAMS_CLIENT_ID || '',
  TEAMS_TENANT_ID: import.meta.env.VITE_TEAMS_TENANT_ID || '',
  
  // SSO Configuration
  SAML_ENTRY_POINT: import.meta.env.VITE_SAML_ENTRY_POINT || '',
  OIDC_CLIENT_ID: import.meta.env.VITE_OIDC_CLIENT_ID || '',
  OIDC_ISSUER: import.meta.env.VITE_OIDC_ISSUER || '',
  
  // Email Configuration
  SENDGRID_API_KEY: import.meta.env.VITE_SENDGRID_API_KEY || '',
  FROM_EMAIL: import.meta.env.VITE_FROM_EMAIL || 'noreply@kbs.edu.ng',
  FROM_NAME: import.meta.env.VITE_FROM_NAME || 'KBS LMS',
  
  // Feature Flags
  ENABLE_VIDEO_CONFERENCING: import.meta.env.VITE_ENABLE_VIDEO_CONFERENCING === 'true',
  ENABLE_CALENDAR_INTEGRATION: import.meta.env.VITE_ENABLE_CALENDAR_INTEGRATION === 'true',
  ENABLE_SSO: import.meta.env.VITE_ENABLE_SSO === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_EMAIL_NOTIFICATIONS: import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS === 'true'
}
