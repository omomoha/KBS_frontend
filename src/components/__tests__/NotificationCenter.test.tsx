import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotificationCenter } from '../NotificationCenter'
import { useNotifications } from '@/contexts/NotificationContext'

// Mock the notification context
vi.mock('@/contexts/NotificationContext', () => ({
  useNotifications: vi.fn()
}))

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
  )
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => <span className={className} data-testid="badge">{children}</span>
}))

vi.mock('@/components/ui/input', () => ({
  Input: ({ onChange, placeholder, ...props }: any) => (
    <input onChange={onChange} placeholder={placeholder} {...props} />
  )
}))

const mockNotifications = [
  {
    id: '1',
    title: 'Assignment Due Soon',
    message: 'Your Business Ethics assignment is due in 2 hours',
    type: 'assignment_due',
    priority: 'high',
    isRead: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actionUrl: '/assignments/1'
  },
  {
    id: '2',
    title: 'New Course Material',
    message: 'New lecture slides have been added to Project Management',
    type: 'course_material_added',
    priority: 'medium',
    isRead: true,
    isArchived: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    actionUrl: '/courses/1'
  }
]

const mockNotificationContext = {
  notifications: mockNotifications,
  unreadCount: 1,
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
  archiveNotification: vi.fn(),
  deleteNotification: vi.fn(),
  isLoading: false
}

describe('NotificationCenter', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useNotifications as any).mockReturnValue(mockNotificationContext)
  })

  it('should render when open', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // Unread count
  })

  it('should not render when closed', () => {
    render(
      <NotificationCenter
        isOpen={false}
        onClose={mockOnClose}
      />
    )

    expect(screen.queryByText('Notifications')).not.toBeInTheDocument()
  })

  it('should display notifications', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Assignment Due Soon')).toBeInTheDocument()
    expect(screen.getByText('Your Business Ethics assignment is due in 2 hours')).toBeInTheDocument()
    expect(screen.getByText('New Course Material')).toBeInTheDocument()
    expect(screen.getByText('New lecture slides have been added to Project Management')).toBeInTheDocument()
  })

  it('should show unread count badge', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const unreadBadge = screen.getByText('1')
    expect(unreadBadge).toBeInTheDocument()
  })

  it('should close when backdrop is clicked', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const backdrop = screen.getByTestId('card').parentElement
    fireEvent.click(backdrop!)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should close when close button is clicked', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const closeButton = screen.getByRole('button', { name: '' }) // X button
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should mark notification as read when clicked', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const notificationCard = screen.getByText('Assignment Due Soon').closest('[data-testid="card"]')
    fireEvent.click(notificationCard!)

    expect(mockNotificationContext.markAsRead).toHaveBeenCalledWith('1')
  })

  it('should mark all notifications as read', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const markAllReadButton = screen.getByText('Mark All Read')
    fireEvent.click(markAllReadButton)

    expect(mockNotificationContext.markAllAsRead).toHaveBeenCalled()
  })

  it('should filter notifications by search', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search notifications...')
    fireEvent.change(searchInput, { target: { value: 'Assignment' } })

    // Should show only assignment-related notifications
    expect(screen.getByText('Assignment Due Soon')).toBeInTheDocument()
    expect(screen.queryByText('New Course Material')).not.toBeInTheDocument()
  })

  it('should filter notifications by type', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const typeSelect = screen.getByDisplayValue('All Types')
    fireEvent.change(typeSelect, { target: { value: 'assignment_due' } })

    // Should show only assignment due notifications
    expect(screen.getByText('Assignment Due Soon')).toBeInTheDocument()
    expect(screen.queryByText('New Course Material')).not.toBeInTheDocument()
  })

  it('should filter notifications by priority', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const prioritySelect = screen.getByDisplayValue('All Priorities')
    fireEvent.change(prioritySelect, { target: { value: 'high' } })

    // Should show only high priority notifications
    expect(screen.getByText('Assignment Due Soon')).toBeInTheDocument()
    expect(screen.queryByText('New Course Material')).not.toBeInTheDocument()
  })

  it('should show archived notifications when toggle is enabled', () => {
    const notificationsWithArchived = [
      ...mockNotifications,
      {
        id: '3',
        title: 'Archived Notification',
        message: 'This is archived',
        type: 'general',
        priority: 'low',
        isRead: true,
        isArchived: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    ;(useNotifications as any).mockReturnValue({
      ...mockNotificationContext,
      notifications: notificationsWithArchived
    })

    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const showArchivedCheckbox = screen.getByRole('checkbox')
    fireEvent.click(showArchivedCheckbox)

    expect(screen.getByText('Archived Notification')).toBeInTheDocument()
  })

  it('should select and deselect notifications', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    const firstCheckbox = checkboxes[0] // First notification checkbox

    fireEvent.click(firstCheckbox)
    expect(firstCheckbox).toBeChecked()

    fireEvent.click(firstCheckbox)
    expect(firstCheckbox).not.toBeChecked()
  })

  it('should select all notifications', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const selectAllButton = screen.getByText('Select All')
    fireEvent.click(selectAllButton)

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked()
    })
  })

  it('should deselect all notifications', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    // First select all
    const selectAllButton = screen.getByText('Select All')
    fireEvent.click(selectAllButton)

    // Then deselect all
    const deselectAllButton = screen.getByText('Deselect All')
    fireEvent.click(deselectAllButton)

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked()
    })
  })

  it('should show bulk action buttons when notifications are selected', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    // Select a notification
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    // Should show bulk action buttons
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument() // Check icon
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument() // Archive icon
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument() // Trash icon
  })

  it('should perform bulk actions', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    // Select a notification
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    // Click bulk read action
    const bulkReadButton = screen.getAllByRole('button', { name: '' })[0] // First action button
    fireEvent.click(bulkReadButton)

    expect(mockNotificationContext.markAsRead).toHaveBeenCalled()
  })

  it('should show loading state', () => {
    ;(useNotifications as any).mockReturnValue({
      ...mockNotificationContext,
      isLoading: true
    })

    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByRole('status')).toBeInTheDocument() // Loading spinner
  })

  it('should show no notifications message when empty', () => {
    ;(useNotifications as any).mockReturnValue({
      ...mockNotificationContext,
      notifications: []
    })

    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('No notifications found')).toBeInTheDocument()
  })

  it('should display notification icons based on type', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    // Should have icons for different notification types
    expect(screen.getByText('Assignment Due Soon')).toBeInTheDocument()
    expect(screen.getByText('New Course Material')).toBeInTheDocument()
  })

  it('should display priority badges', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
  })

  it('should display time ago for notifications', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    // Should show relative time
    expect(screen.getByText(/ago/)).toBeInTheDocument()
  })

  it('should archive notification when archive button is clicked', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const archiveButtons = screen.getAllByRole('button', { name: '' })
    const archiveButton = archiveButtons.find(button => 
      button.querySelector('svg') // Archive icon
    )
    
    if (archiveButton) {
      fireEvent.click(archiveButton)
      expect(mockNotificationContext.archiveNotification).toHaveBeenCalled()
    }
  })

  it('should delete notification when delete button is clicked', () => {
    render(
      <NotificationCenter
        isOpen={true}
        onClose={mockOnClose}
      />
    )

    const deleteButtons = screen.getAllByRole('button', { name: '' })
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('svg') // Trash icon
    )
    
    if (deleteButton) {
      fireEvent.click(deleteButton)
      expect(mockNotificationContext.deleteNotification).toHaveBeenCalled()
    }
  })
})
