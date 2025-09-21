"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Habit = {
  id: string;
  name: string;
  done: boolean;
  createdAt: string;
};

type WeeklyData = {
  day: string;
  completed: number;
  total: number;
  rate: number;
};

export default function WeeklyStatsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);

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
  }, [habits]);

  useEffect(() => {
    // Generate mock weekly data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const data = days.map((day, index) => {
      const completed = Math.floor(Math.random() * habits.length);
      return {
        day,
        completed,
        total: habits.length,
        rate: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0
      };
    });
    
    // Make today's data match current habits
    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    if (data[todayIndex]) {
      data[todayIndex].completed = habits.filter(h => h.done).length;
      data[todayIndex].rate = habits.length > 0 ? Math.round((data[todayIndex].completed / habits.length) * 100) : 0;
    }
    
    setWeeklyData(data);
  }, [habits]);

  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completed, 0);
  const totalPossible = weeklyData.reduce((sum, day) => sum + day.total, 0);
  const weeklyRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  
  const bestDay = weeklyData.reduce((best, current) => 
    current.rate > best.rate ? current : best, weeklyData[0] || { day: '', rate: 0 });

  return (
    <main className="p-4 max-w-md mx-auto">
      <div className="mb-6">
        <Link href="/stats" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
          ← Back to Stats
        </Link>
        <h1 className="text-2xl font-bold">Weekly Statistics</h1>
        <p className="text-black">Your weekly habit performance</p>
      </div>

      {/* Weekly Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{totalCompleted}/{totalPossible}</div>
          <div className="text-sm text-black mb-2">Total Completions</div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${weeklyRate}%` }}
            ></div>
          </div>
          <div className="text-xs text-black mt-1">{weeklyRate}% Weekly Completion</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-4">Daily Progress</h3>
        <div className="space-y-3">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 text-sm font-medium">{day.day.slice(0, 3)}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${day.rate}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right">
                <div className="text-sm font-medium">{day.completed}</div>
                <div className="text-xs text-black">{day.rate}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Insights */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">Weekly Insights</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span>Best day:</span>
            <span className="font-medium">{bestDay.day} ({bestDay.rate}%)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Average daily completion:</span>
            <span className="font-medium">
              {weeklyData.length > 0 ? Math.round(weeklyData.reduce((sum, day) => sum + day.rate, 0) / weeklyData.length) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Consistency score:</span>
            <span className="font-medium">
              {weeklyRate > 80 ? '🟢 Excellent' : weeklyRate > 60 ? '🟡 Good' : '🔴 Needs improvement'}
            </span>
          </div>
        </div>
      </div>

      {/* Habit Performance */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">Habit Performance</h3>
        {habits.length === 0 ? (
          <p className="text-black text-center py-4">No habits to track yet</p>
        ) : (
          <div className="space-y-2">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between">
                <span className="text-sm">{habit.name}</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7].map((day) => (
                      <div 
                        key={day}
                        className={`w-3 h-3 rounded-full ${
                          Math.random() > 0.5 ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs text-black w-8">
                    {Math.floor(Math.random() * 7)}/7
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link 
          href="/stats/daily"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-600"
        >
          📅 Daily View
        </Link>
        <Link 
          href="/dashboard"
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg text-center hover:bg-gray-600"
        >
          🏠 Dashboard
        </Link>
      </div>
    </main>
  );
}

