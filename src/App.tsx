import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProgrammesPage } from '@/pages/ProgrammesPage'
import { CoursesPage } from '@/pages/CoursesPage'
import { CoursePage } from '@/pages/CoursePage'
import { CourseContentPage } from '@/pages/CourseContentPage'
import { AssignmentsPage } from '@/pages/AssignmentsPage'
import { AssignmentPage } from '@/pages/AssignmentPage'
import { CertificatesPage } from '@/pages/CertificatesPage'
import { TranscriptPage } from '@/pages/TranscriptPage'
import { AnnouncementsPage } from '@/pages/AnnouncementsPage'
import { DiscussionsPage } from '@/pages/DiscussionsPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { UsersPage } from '@/pages/UsersPage'
import { UserProfilePage } from '@/pages/UserProfilePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { UploadResourcesPage } from '@/pages/UploadResourcesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Layouts
import { MainLayout } from '@/components/layouts/MainLayout'
import { AuthLayout } from '@/components/layouts/AuthLayout'

function AppRoutes() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="programmes" element={<ProgrammesPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CoursePage />} />
        <Route path="courses/:courseId/content" element={<CourseContentPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="assignments/:assignmentId" element={<AssignmentPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="transcript" element={<TranscriptPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="discussions" element={<DiscussionsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:userId" element={<UserProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="upload-resources" element={<UploadResourcesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  )
}
