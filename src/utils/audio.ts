// Audio utility for notification sounds

export type NotificationAudioType = 'success' | 'error' | 'warning' | 'info';

// Audio file mapping for different notification types
const audioFiles: Record<NotificationAudioType, string> = {
  success: '/audio/plain-8bit.mp3',
  error: '/audio/plain-8bit.mp3',
  warning: '/audio/plain-8bit.mp3',
  info: '/audio/plain-8bit.mp3',
};

// Cache for audio elements to avoid recreating them
const audioCache = new Map<string, HTMLAudioElement>();

/**
 * Play notification sound
 * @param type - The notification type
 * @param volume - Volume level (0-1), defaults to 0.5
 */
export function playNotificationSound(
  type: NotificationAudioType, 
  volume: number = 0.5
): void {
  try {
    // Check if audio is supported
    if (typeof window === 'undefined' || !window.Audio) {
      return;
    }

    const audioFile = audioFiles[type];
    if (!audioFile) {
      console.warn(`No audio file found for notification type: ${type}`);
      return;
    }

    // Get or create audio element from cache
    let audio = audioCache.get(audioFile);
    if (!audio) {
      audio = new Audio(audioFile);
      audio.preload = 'auto';
      audioCache.set(audioFile, audio);
    }

    // Set volume and play
    audio.volume = Math.max(0, Math.min(1, volume));
    
    // Reset audio to beginning and play
    audio.currentTime = 0;
    
    // Play the audio
    audio.play().catch((error) => {
      console.warn('Failed to play notification sound:', error);
      // This is expected in some browsers that require user interaction first
    });

  } catch (error) {
    console.warn('Error playing notification sound:', error);
  }
}

/**
 * Preload all notification audio files
 * This should be called when the app starts to ensure audio is ready
 */
export function preloadNotificationAudio(): void {
  if (typeof window === 'undefined') {
    return;
  }

  Object.values(audioFiles).forEach((audioFile) => {
    if (!audioCache.has(audioFile)) {
      const audio = new Audio(audioFile);
      audio.preload = 'auto';
      audioCache.set(audioFile, audio);
    }
  });
}

/**
 * Update audio file for a specific notification type
 * @param type - The notification type
 * @param audioFile - The new audio file path
 */
export function setNotificationAudio(type: NotificationAudioType, audioFile: string): void {
  audioFiles[type] = audioFile;
  
  // Remove from cache so it gets recreated with new file
  audioCache.delete(audioFiles[type]);
}
