"use client";

import ScheduleTimer from "@/components/ScheduleTimer";
import { useNotification } from "@/components/NotificationProvider";

export default function StartDayPage() {
  {/* Test Notifications Buttons (remove later) */}
  const { showNotification } = useNotification();

  const testSuccess = () => {
    showNotification({
      type: 'success',
      title: 'Session Started!',
      message: 'Your morning routine has begun.',
    });
  };

  const testError = () => {
    showNotification({
      type: 'error',
      title: 'Timer Failed!',
      message: 'Unable to start timer. Please try again.',
    });
  };

  const testWarning = () => {
    showNotification({
      type: 'warning',
      title: 'Break Time!',
      message: 'Take a 5-minute break.',
    });
  };

  const testInfo = () => {
    showNotification({
      type: 'info',
      title: 'Timer Running',
      message: 'Focus on your current task.',
    });
  };

  const testWithAction = () => {
    showNotification({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of the app is available.',
      action: {
        label: 'Update',
        onClick: () => {
          console.log('Update clicked!');
          showNotification({
            type: 'success',
            title: 'Updated!',
            message: 'App has been updated successfully.',
          });
        },
      },
      duration: 0, // Don't auto-hide when there's an action
    });
  };

  return (
    <div className="page-container">
      <div className="">
        {/* Page Header */}
        <div className="page-header bg-[#f8dc3c]">
          <h1 className="page-title">Start Your Day</h1>
          <p className="page-subtitle">
            Follow your daily routine with automatic session timers
          </p>
        </div>

        {/* Timer Card */}
        <div className="card">
            <ScheduleTimer />
        </div>

        {/* Test Notifications Buttons (remove later) */}
        <div className="card">
          <h2 className="page-title mb-4">Test Notifications</h2>
          <p className="text-xs text-muted mb-4">
            🔊 Each notification will play a sound (using niera_sound_3.mp3 for now)
          </p>
          <div className="flex flex-col gap-3">
            <button 
              className="btn-primary btn-lg" 
              onClick={testSuccess}
            >
              ✅ Test Success Notification
            </button>
            <button 
              className="btn-secondary btn-lg" 
              onClick={testError}
            >
              ❌ Test Error Notification
            </button>
            <button 
              className="btn-outline btn-lg" 
              onClick={testWarning}
            >
              ⚠️ Test Warning Notification
            </button>
            <button 
              className="btn-primary btn-lg" 
              onClick={testInfo}
            >
              ℹ️ Test Info Notification
            </button>
            <button 
              className="btn-primary btn-lg" 
              onClick={testWithAction}
            >
              🔄 Test Notification with Action
            </button>
          </div>
        </div>

        {/* task List per session */}
        {/* TODO: integrate input todo list dari schedule trus tampilin disini */}
        <div className="page-container">
          <div className="card">
            <h2 className="page-title">
              Your Task For This Session
            </h2>
            <ul className="page-subtitle">
              <li>- example todo 1</li>
              <li>- nanti integrate secara dynamic</li>
              <li>- list task yang udah di input di page schedule</li>
              <li>- kedalam sini, nanti parse json localStorage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
