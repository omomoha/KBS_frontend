import { useState, useEffect } from 'react'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  Save, 
  TestTube,
  CheckCircle,
  AlertCircle,
  Info,
  Settings as SettingsIcon
} from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import { NotificationSettings, NotificationType } from '@/types/notifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { notificationService } from '@/services/notificationService'

export function NotificationSettingsPage() {
  const { settings, updateSettings, sendTestNotification } = useNotifications()
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSettingChange = (path: string, value: boolean | number) => {
    const newSettings = { ...localSettings }
    const keys = path.split('.')
    let current = newSettings as any
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setLocalSettings(newSettings)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      updateSettings(localSettings)
      // In a real app, you would also save to the server
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestNotification = async (type: NotificationType) => {
    setIsTesting(true)
    try {
      const success = await notificationService.sendTestNotification(type, 'current-user-id')
      setTestResults(prev => ({ ...prev, [type]: success }))
    } catch (error) {
      console.error('Failed to send test notification:', error)
      setTestResults(prev => ({ ...prev, [type]: false }))
    } finally {
      setIsTesting(false)
    }
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'assignmentReminders':
        return 'Assignment Reminders'
      case 'assignmentDue':
        return 'Assignment Due'
      case 'assignmentGraded':
        return 'Assignment Graded'
      case 'courseUpdates':
        return 'Course Updates'
      case 'courseAnnouncements':
        return 'Course Announcements'
      case 'discussionReplies':
        return 'Discussion Replies'
      case 'systemUpdates':
        return 'System Updates'
      default:
        return type
    }
  }

  const getNotificationTypeDescription = (type: string) => {
    switch (type) {
      case 'assignmentReminders':
        return 'Get reminded about upcoming assignments'
      case 'assignmentDue':
        return 'Notifications when assignments are due soon'
      case 'assignmentGraded':
        return 'Alerts when your assignments are graded'
      case 'courseUpdates':
        return 'Updates about course content and materials'
      case 'courseAnnouncements':
        return 'Important announcements from instructors'
      case 'discussionReplies':
        return 'Replies to your discussion posts'
      case 'systemUpdates':
        return 'System maintenance and updates'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Notification Settings</h1>
          <p className="text-secondary-600 mt-1">
            Manage how you receive notifications across different channels
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Receive notifications via email. You can customize which types of notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Email Notifications</h3>
              <p className="text-sm text-secondary-600">Turn email notifications on or off completely</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.email.enabled}
                onChange={(e) => handleSettingChange('email.enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {localSettings.email.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-primary-200">
              {Object.entries(localSettings.email)
                .filter(([key]) => key !== 'enabled')
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{getNotificationTypeLabel(key)}</h4>
                      <p className="text-xs text-secondary-600">{getNotificationTypeDescription(key)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestNotification(key as NotificationType)}
                        disabled={isTesting}
                      >
                        <TestTube className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      {testResults[key] !== undefined && (
                        <div className="flex items-center">
                          {testResults[key] ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => handleSettingChange(`email.${key}`, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Receive push notifications on your device. Make sure to allow notifications in your browser settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Push Notifications</h3>
              <p className="text-sm text-secondary-600">Turn push notifications on or off completely</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.push.enabled}
                onChange={(e) => handleSettingChange('push.enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {localSettings.push.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-primary-200">
              {Object.entries(localSettings.push)
                .filter(([key]) => key !== 'enabled')
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{getNotificationTypeLabel(key)}</h4>
                      <p className="text-xs text-secondary-600">{getNotificationTypeDescription(key)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestNotification(key as NotificationType)}
                        disabled={isTesting}
                      >
                        <TestTube className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      {testResults[key] !== undefined && (
                        <div className="flex items-center">
                          {testResults[key] ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => handleSettingChange(`push.${key}`, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
          <CardDescription>
            Show notifications within the application interface.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable In-App Notifications</h3>
              <p className="text-sm text-secondary-600">Show notifications in the app interface</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.inApp.enabled}
                onChange={(e) => handleSettingChange('inApp.enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {localSettings.inApp.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-primary-200">
              {Object.entries(localSettings.inApp)
                .filter(([key]) => key !== 'enabled')
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{getNotificationTypeLabel(key)}</h4>
                      <p className="text-xs text-secondary-600">{getNotificationTypeDescription(key)}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => handleSettingChange(`inApp.${key}`, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Timing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Reminder Timing
          </CardTitle>
          <CardDescription>
            Configure when you want to receive reminders for assignments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Assignment Reminder (hours before due)
              </label>
              <Input
                type="number"
                value={localSettings.reminderTiming.assignmentReminder}
                onChange={(e) => handleSettingChange('reminderTiming.assignmentReminder', parseInt(e.target.value) || 0)}
                min="1"
                max="168"
                className="w-full"
              />
              <p className="text-xs text-secondary-500 mt-1">
                How many hours before an assignment is due to send a reminder
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Assignment Due Alert (hours before due)
              </label>
              <Input
                type="number"
                value={localSettings.reminderTiming.assignmentDue}
                onChange={(e) => handleSettingChange('reminderTiming.assignmentDue', parseInt(e.target.value) || 0)}
                min="1"
                max="24"
                className="w-full"
              />
              <p className="text-xs text-secondary-500 mt-1">
                How many hours before an assignment is due to send an urgent alert
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Notification Summary
          </CardTitle>
          <CardDescription>
            Overview of your current notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-secondary-600">
                {localSettings.email.enabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                {Object.values(localSettings.email).filter(Boolean).length - 1} types enabled
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <h3 className="font-medium">Push</h3>
              <p className="text-sm text-secondary-600">
                {localSettings.push.enabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                {Object.values(localSettings.push).filter(Boolean).length - 1} types enabled
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Bell className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <h3 className="font-medium">In-App</h3>
              <p className="text-sm text-secondary-600">
                {localSettings.inApp.enabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                {Object.values(localSettings.inApp).filter(Boolean).length - 1} types enabled
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
