import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, User, Bell, Shield, Palette, Upload, Save } from 'lucide-react'

export function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile settings
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@kbs.edu.ng',
    phone: '+234 123 456 7890',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    assignmentReminders: true,
    courseUpdates: true,
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // Appearance settings
    theme: 'light',
    language: 'en',
    
    // Upload settings
    maxFileSize: 10,
    allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'png', 'mp4']
  })

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings)
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                First Name
              </label>
              <Input
                value={settings.firstName}
                onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Last Name
              </label>
              <Input
                value={settings.lastName}
                onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Phone
              </label>
              <Input
                value={settings.phone}
                onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm font-medium text-secondary-700">
                Email Notifications
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm font-medium text-secondary-700">
                Push Notifications
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.assignmentReminders}
                onChange={(e) => handleSettingChange('notifications', 'assignmentReminders', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm font-medium text-secondary-700">
                Assignment Reminders
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.courseUpdates}
                onChange={(e) => handleSettingChange('notifications', 'courseUpdates', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm font-medium text-secondary-700">
                Course Updates
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm font-medium text-secondary-700">
                Two-Factor Authentication
              </span>
            </label>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Session Timeout (minutes)
              </label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance Settings
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Settings
          </CardTitle>
          <CardDescription>
            Configure file upload preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Maximum File Size (MB)
            </label>
            <Input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => handleSettingChange('upload', 'maxFileSize', parseInt(e.target.value))}
              className="w-32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Allowed File Formats
            </label>
            <div className="flex flex-wrap gap-2">
              {settings.allowedFormats.map((format) => (
                <span
                  key={format}
                  className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-md"
                >
                  .{format}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
