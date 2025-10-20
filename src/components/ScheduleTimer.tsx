"use client";

import { useEffect, useRef, useState } from "react";

type RoutineSession = {
  id: string;
  title: string;
  time: string;
  duration: number; // in minutes
};

export default function ScheduleTimer() {
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const focusAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakAudioRef = useRef<HTMLAudioElement | null>(null);
  const completionHandledRef = useRef<boolean>(false);

  // Define your routine sessions with durations in minutes
  const routineSessions: RoutineSession[] = [
    { id: "focus1", title: "Focus Session 1", time: "05.00 - 07.00", duration: 0.1 }, // 2 hours
    { id: "break1", title: "Break 1", time: "07.00 - 07.30", duration: 0.1 }, // 30 minutes
    { id: "focus2", title: "Focus Session 2", time: "07.30 - 09.30", duration: 0.1 }, // 2 hours
    { id: "break2", title: "Break 2", time: "09.30 - 10.00", duration: 0.1 }, // 30 minutes
    { id: "focus3", title: "Focus Session 3", time: "10.00 - 12.00", duration: 0.1 }, // 2 hours
    { id: "lunch", title: "Lunch (Long Break)", time: "12.00 - 13.00", duration: 0.1 }, // 1 hour
    { id: "focus4", title: "Focus Session 4", time: "13.00 - 15.00", duration: 0.1 }, // 2 hours
    { id: "freetime", title: "Free Time", time: "15.00 - 18.00", duration: 0.1 }, // 3 hours
    { id: "prepare", title: "Prepare for Bed", time: "18.00 - 19.00", duration: 0.1 }, // 1 hour
    { id: "journal", title: "Cooling Down + Journaling", time: "19.00 - 20.00", duration: 0.1 }, // 1 hour
  ];

  // Initialize audio and load saved state
  useEffect(() => {
    // Initialize audio elements
    focusAudioRef.current = new Audio('/audio/ffx_victory.mp3');
    breakAudioRef.current = new Audio('/audio/niera_sound_3.mp3');
    
    // Set audio properties
    [focusAudioRef.current].forEach(audio => {
      if (audio) {
        audio.preload = 'auto';
        audio.volume = 0.2; // Set volume to 10%
      }
    });

    [breakAudioRef.current].forEach(audio => {
        if (audio) {
          audio.preload = 'auto';
          audio.volume = 0.5;
      
          let playCount = 0;
          const maxPlays = 3;
        
        //   loop nier ringtone
          audio.addEventListener("ended", () => {
            playCount++;
            if (playCount < maxPlays) {
              audio.currentTime = 0; // reset to start
              audio.play();
            }
          });
        }
      });
      

    // Load saved state from localStorage
    const savedSessionIndex = localStorage.getItem("currentSessionIndex");
    const savedTimeLeft = localStorage.getItem("timeLeft");
    const savedIsRunning = localStorage.getItem("isRunning");
    const savedIsPaused = localStorage.getItem("isPaused");
    const savedAudioEnabled = localStorage.getItem("audioEnabled");

    if (savedSessionIndex) setCurrentSessionIndex(Number(savedSessionIndex));
    if (savedTimeLeft) setTimeLeft(Number(savedTimeLeft));
    if (savedIsRunning) setIsRunning(savedIsRunning === "true");
    if (savedIsPaused) setIsPaused(savedIsPaused === "true");
    if (savedAudioEnabled) setAudioEnabled(savedAudioEnabled === "true");
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentSessionIndex", String(currentSessionIndex));
    localStorage.setItem("timeLeft", String(timeLeft));
    localStorage.setItem("isRunning", String(isRunning));
    localStorage.setItem("isPaused", String(isPaused));
    localStorage.setItem("audioEnabled", String(audioEnabled));
  }, [currentSessionIndex, timeLeft, isRunning, isPaused, audioEnabled]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Guard: ensure completion logic runs only once per session end
            if (completionHandledRef.current) {
              return 0;
            }
            completionHandledRef.current = true;

            // Session completed, pause and wait for user to start next session
            setIsRunning(false);
            // Play appropriate audio notification (uses currentSessionIndex from closure)
            playSessionCompleteSound();

            if (currentSessionIndex < routineSessions.length - 1) {
              // Advance to next session using functional updater to avoid stale state
              setCurrentSessionIndex((idx) => {
                const nextIdx = idx + 1;
                // update timeLeft for the next session so UI reflects it immediately
                setTimeLeft(routineSessions[nextIdx].duration * 60);
                return nextIdx;
              });
              // keep return 0 here; timeLeft was set for next session above
              return 0;
            } else {
              // All sessions completed
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, currentSessionIndex]);

  // Update timeLeft when session changes
  useEffect(() => {
    setTimeLeft(routineSessions[currentSessionIndex].duration * 60);
    setSessionStartTime(new Date());
  }, [currentSessionIndex]);

  // Function to determine if current session is a focus or break session
  const isFocusSession = (sessionId: string) => {
    return sessionId.includes('focus');
  };

  // Function to play appropriate sound when session completes
  const playSessionCompleteSound = () => {
    if (!audioEnabled) return;

    const currentSession = routineSessions[currentSessionIndex];
    const audioRef = isFocusSession(currentSession.id) ? focusAudioRef : breakAudioRef;
    
    // error handler if audio not work
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to beginning
      audioRef.current.play().catch((error) => {
        console.log("Audio playback failed:", error);
      });
    }
  };

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleStart = () => {
    completionHandledRef.current = false;
    setIsRunning(true);
    setIsPaused(false);
    setSessionStartTime(new Date());
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    completionHandledRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    setCurrentSessionIndex(0);
    setTimeLeft(routineSessions[0].duration * 60);
    setSessionStartTime(null);
  };

  const handleSkip = () => {
    if (currentSessionIndex < routineSessions.length - 1) {
      completionHandledRef.current = false;
      setCurrentSessionIndex(prev => prev + 1);
      setIsRunning(false);
    }
  };

  const currentSession = routineSessions[currentSessionIndex];
  const progressPercentage = ((currentSession.duration * 60 - timeLeft) / (currentSession.duration * 60)) * 100;
  const overallProgress = ((currentSessionIndex + 1) / routineSessions.length) * 100;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Progress Indicators */}
      <div className="w-full max-w-md space-y-4">
        {/* Overall Progress */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Daily Progress: {currentSessionIndex + 1} of {routineSessions.length} sessions
          </p>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-[#f6732b] h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Session Progress */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Current Session Progress
          </p>
          <div className="w-full bg-[#fff] rounded-full h-2">
            <div 
              className="bg-[#f6732b] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Current Session Info */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          {currentSession.title}
        </h2>
        <p className="text-sm text-gray-600">
          {currentSession.time} • {currentSession.duration} minutes
        </p>
        {sessionStartTime && (
          <p className="text-xs text-gray-500">
            Started: {sessionStartTime.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Timer Display */}
      <h1 className="text-5xl font-bold tracking-widest text-gray-800">
        {formatTime(timeLeft)}
      </h1>

      {/* Session Status */}
      <div className="text-center">
        {isRunning && !isPaused && (
          <p className="font-medium">⏱️ Session Active</p>
        )}
        {isPaused && (
          <p className="font-medium">⏸️ Paused</p>
        )}
        {!isRunning && currentSessionIndex === 0 && (
          <p className="font-medium">⏹️ Ready to Start</p>
        )}
        {!isRunning && currentSessionIndex > 0 && currentSessionIndex < routineSessions.length && (
          <p className="font-medium">✅ Session Completed - Ready for Next</p>
        )}
        {!isRunning && currentSessionIndex === routineSessions.length - 1 && timeLeft === 0 && (
          <p className="font-medium">🎉 All Sessions Complete!</p>
        )}
      </div>

      {/* Session Completion Notification */}
      {!isRunning && currentSessionIndex > 0 && currentSessionIndex < routineSessions.length && timeLeft === routineSessions[currentSessionIndex].duration * 60 && (
        <div className="card-yellow text-center p-4">
          <h3 className="text-lg font-semibold mb-2">🎉 Session Complete!</h3>
          <p>
            {routineSessions[currentSessionIndex - 1].title} has finished. 
            Click "Start Next Session" when you're ready to continue.
          </p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {!isRunning && currentSessionIndex === 0 ? (
          <button
            onClick={handleStart}
            className="btn-primary px-6 py-2"
          >
            Start Daily Routine
          </button>
        ) : !isRunning && currentSessionIndex < routineSessions.length - 1 ? (
          <button
            onClick={handleStart}
            className="btn-primary px-6 py-2 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Start Next Session
          </button>
        ) : !isRunning && currentSessionIndex === routineSessions.length - 1 ? (
          <button
            onClick={handleReset}
            className="btn-primary px-6 py-2 rounded-2xl bg-green-500 text-white hover:bg-green-600 transition"
          >
            Restart Daily Routine
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className={`px-4 py-2 rounded-2xl text-black transition ${
                isPaused 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            {currentSessionIndex < routineSessions.length - 1 && (
              <button
                onClick={handleSkip}
                className="btn-primary px-4 py-2"
              >
                Skip Session
              </button>
            )}
          </>
        )}
        <button
          onClick={handleReset}
          className="btn-secondary px-4 py-2"
        >
          Reset
        </button>
      </div>

      {/* Next Session Preview */}
      {currentSessionIndex < routineSessions.length - 1 && (
        <div className="card-yellow text-center p-4">
          <p className="text-sm text-gray-800 mb-1">Next Session:</p>
          <p className="font-medium text-black">
            {routineSessions[currentSessionIndex + 1].title}
          </p>
          <p className="text-xs text-gray-800">
            {routineSessions[currentSessionIndex + 1].time} • {routineSessions[currentSessionIndex + 1].duration} minutes
          </p>
        </div>
      )}

      {/* Completion Message */}
      {currentSessionIndex === routineSessions.length - 1 && timeLeft === 0 && isRunning === false && (
        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Daily Routine Complete!</h3>
          <p className="text-green-700">
            Great job completing your entire daily schedule!
          </p>
        </div>
      )}
    </div>
  );
}
