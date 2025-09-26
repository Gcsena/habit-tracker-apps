"use client";

import React, { useState, useEffect } from 'react';
import { NotificationData } from './NotificationProvider';
import './Notification.css';

interface NotificationProps {
  readonly notification: NotificationData;
  readonly onHide: (id: string) => void;
}

export default function Notification({ notification, onHide }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleHide = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onHide(notification.id);
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  const getTypeClass = () => {
    return `notification notification-${notification.type}`;
  };

  return (
    <div
      className={`${getTypeClass()} ${isVisible ? 'notification-enter' : ''} ${isLeaving ? 'notification-leave' : ''}`}
      onClick={handleHide}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleHide();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-text">
          <div className="notification-title">
            {notification.title}
          </div>
          {notification.message && (
            <div className="notification-message">
              {notification.message}
            </div>
          )}
        </div>
        {notification.action && (
          <div className="notification-action">
            <button
              className="notification-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                notification.action!.onClick();
                handleHide();
              }}
            >
              {notification.action.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
