"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import Notification from './Notification';
import { playNotificationSound, preloadNotificationAudio } from '@/utils/audio';
import './Notification.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationData, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  readonly children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Preload audio files when component mounts
  useEffect(() => {
    preloadNotificationAudio();
  }, []);

  const showNotification = useCallback((notificationData: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 11);
    const notification: NotificationData = {
      ...notificationData,
      id,
      duration: notificationData.duration ?? 5000, // Default 5 seconds
    };

    setNotifications(prev => [...prev, notification]);

    // Play notification sound
    playNotificationSound(notification.type);

    // Auto-hide notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, notification.duration);
    }
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const contextValue = useMemo(() => ({
    showNotification,
    hideNotification,
    clearAllNotifications,
  }), [showNotification, hideNotification, clearAllNotifications]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onHide={hideNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
