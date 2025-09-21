"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Habit = {
  id: string;
  name: string;
  done: boolean;
  createdAt: string;
};

export default function DailyStatsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) {
      const parsedHabits = JSON.parse(saved);
      const habitsWithIds = parsedHabits.map((habit: any, index: number) => ({
        ...habit,
        id: habit.id || `habit-${index}-${Date.now()}`,
        createdAt: habit.createdAt || new Date().toISOString()
      }));
      setHabits(habitsWithIds);
    }
  }, []);

  const completedToday = habits.filter(h => h.done).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Mock data for different days
  const getDayStats = (date: string) => {
    // In a real app, you'd fetch this from your data store
    const dayOfWeek = new Date(date).getDay();
    const baseCompletion = Math.floor(Math.random() * totalHabits);
    return {
      completed: baseCompletion,
      total: totalHabits,
      rate: totalHabits > 0 ? Math.round((baseCompletion / totalHabits) * 100) : 0
    };
  };

  const dayStats = getDayStats(selectedDate);

  return (
    <main className="p-4 max-w-md mx-auto">
      <div className="mb-6">
        <Link href="/stats" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
          ← Back to Stats
        </Link>
        <h1 className="text-2xl font-bold">Daily Statistics</h1>
        <p className="text-black">Track your daily habit completion</p>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Today's Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{dayStats.completed}/{dayStats.total}</div>
          <div className="text-sm text-black mb-2">Habits Completed</div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${dayStats.rate}%` }}
            ></div>
          </div>
          <div className="text-xs text-black mt-1">{dayStats.rate}% Complete</div>
        </div>
      </div>

      {/* Habit Breakdown */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3 text-black">Habit Breakdown</h3>
        {habits.length === 0 ? (
          <p className="text-black text-center py-4">No habits to track yet</p>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between text-black">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    habit.done ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={habit.done ? "line-through text-black" : ""}>
                    {habit.name}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  habit.done ? 'text-green-600' : 'text-black'
                }`}>
                  {habit.done ? '✅' : '⏳'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Insights */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3 text-black">Daily Insights</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-black">
            <span>Best performing habit:</span>
            <span className="font-medium">
              {habits.find(h => h.done)?.name || 'None completed'}
            </span>
          </div>
          <div className="flex justify-between text-black">
            <span>Completion streak:</span>
            <span className="font-medium">
              {dayStats.completed === totalHabits ? 'Perfect day! 🎉' : `${dayStats.completed} days`}
            </span>
          </div>
          <div className="flex justify-between text-black">
            <span>Time to complete:</span>
            <span className="font-medium">~{totalHabits * 5} minutes</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link 
          href="/dashboard"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-600"
        >
          📝 Update Habits
        </Link>
        <Link 
          href="/stats"
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg text-center hover:bg-gray-600"
        >
          📊 All Stats
        </Link>
      </div>
    </main>
  );
}

