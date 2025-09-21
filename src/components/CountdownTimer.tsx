"use client";

import { useEffect, useRef, useState } from "react";

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Load saved state from localStorage on first render
  useEffect(() => {
    const savedTime = localStorage.getItem("timeLeft");
    const savedRunning = localStorage.getItem("isRunning");
    const savedHours = localStorage.getItem("hours");
    const savedMinutes = localStorage.getItem("minutes");
    const savedSeconds = localStorage.getItem("seconds");

    if (savedTime) setTimeLeft(Number(savedTime));
    if (savedRunning) setIsRunning(savedRunning === "true");
    if (savedHours) setHours(Number(savedHours));
    if (savedMinutes) setMinutes(Number(savedMinutes));
    if (savedSeconds) setSeconds(Number(savedSeconds));
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("timeLeft", String(timeLeft));
    localStorage.setItem("isRunning", String(isRunning));
    localStorage.setItem("hours", String(hours));
    localStorage.setItem("minutes", String(minutes));
    localStorage.setItem("seconds", String(seconds));
  }, [timeLeft, isRunning, hours, minutes, seconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
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
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Input fields only when not running */}
      {!isRunning && (
        <div className="flex space-x-4">
          <input
            type="number"
            min={0}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-16 text-center border rounded p-2"
            placeholder="HH"
          />
          <input
            type="number"
            min={0}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-16 text-center border rounded p-2"
            placeholder="MM"
          />
          <input
            type="number"
            min={0}
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            className="w-16 text-center border rounded p-2"
            placeholder="SS"
          />
        </div>
      )}

      {/* Timer display */}
      <h1 className="text-5xl font-bold tracking-widest">
        {formatTime(timeLeft)}
      </h1>

      {/* Buttons */}
      <div className="space-x-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="btn-primary px-4 py-2 rounded-2xl bg-green-500 text-white hover:bg-green-600 transition"
            disabled={hours + minutes + seconds === 0}
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="btn-primary px-4 py-2 rounded-2xl bg-yellow-500 text-white hover:bg-yellow-600 transition"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="btn-secondary"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
