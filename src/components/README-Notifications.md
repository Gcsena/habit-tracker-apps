# Notification System

A comprehensive notification system for the habit tracker app that supports in-app notifications and can be extended for push notifications.

## Components

- **NotificationProvider**: Context provider that manages notification state
- **Notification**: Individual notification component with animations
- **useNotification**: Hook for easy notification management

## Usage

### Basic Usage

```tsx
import { useNotification } from '@/components/NotificationProvider';

function MyComponent() {
  const { showNotification } = useNotification();

  const handleSuccess = () => {
    showNotification({
      type: 'success',
      title: 'Success!',
      message: 'Your habit has been tracked successfully.',
    });
  };

  return <button onClick={handleSuccess}>Show Notification</button>;
}
```

### Notification Types

- `success`: Green notification with checkmark icon
- `error`: Red notification with X icon  
- `warning`: Yellow notification with warning icon
- `info`: Blue notification with info icon

### notif with action

```tsx
showNotification({
  type: 'info',
  title: 'Update Available',
  message: 'A new version is available for download.',
  duration: 5000, // Auto-hide after 5 seconds (default: 5000ms, 0 = no auto-hide)
  action: {
    label: 'Update',
    onClick: () => {
      // Handle action
    },
  },
});
```

### Advanced Usage

```tsx
const { showNotification, hideNotification, clearAllNotifications } = useNotification();

// Hide specific notification
hideNotification('notification-id');

// Clear all notifications
clearAllNotifications();
```

## Future Push Notification Support

This system is designed to be easily extended for push notifications:

1. **Service Worker Integration**: Add push notification handling in your service worker
2. **Permission Management**: Request notification permissions
3. **Background Sync**: Use the same notification structure for push notifications
4. **User Preferences**: Allow users to configure notification types

### Example Push Notification Extension

```tsx
// In your service worker or push handler
const pushNotification = {
  type: 'info',
  title: 'Habit Reminder',
  message: 'Time to track your daily habits!',
  action: {
    label: 'Open App',
    onClick: () => {
      // Open the app
    },
  },
};

// Show in-app notification
showNotification(pushNotification);

// Also send push notification
self.registration.showNotification(pushNotification.title, {
  body: pushNotification.message,
  icon: '/icon-192.png',
  badge: '/icon-192.png',
  actions: pushNotification.action ? [{
    action: 'open',
    title: pushNotification.action.label,
  }] : undefined,
});
```

## Styling

The notification system uses CSS classes that can be customized:
- `.notification`: Base notification styles
- `.notification-success`: Success notification styles
- `.notification-error`: Error notification styles
- `.notification-warning`: Warning notification styles
- `.notification-info`: Info notification styles

## Accessibility

- Keyboard navigation support (Enter/Space to dismiss)
- ARIA labels for screen readers
- High contrast colors
- Focus management
