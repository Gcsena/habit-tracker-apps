"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./page.css";

type Habit = {
  id: string;
  name: string;
  done: boolean;
  createdAt: string;
  streak?: number;
  totalDays?: number;
};

export default function StatsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) {
      const parsedHabits = JSON.parse(saved);
      const habitsWithIds = parsedHabits.map((habit: any, index: number) => ({
        ...habit,
        id: habit.id || `habit-${index}-${Date.now()}`,
        createdAt: habit.createdAt || new Date().toISOString(),
        streak: habit.streak || 0,
        totalDays: habit.totalDays || 0
      }));
      setHabits(habitsWithIds);
    }
  }, []);

  const completedToday = habits.filter(h => h.done).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  const totalStreak = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0);
  const totalDays = habits.reduce((sum, habit) => sum + (habit.totalDays || 0), 0);
  const averageStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;

  // Calculate weekly completion (mock data for now)
  const weeklyData = [
    { day: 'Mon', completed: Math.floor(Math.random() * totalHabits) },
    { day: 'Tue', completed: Math.floor(Math.random() * totalHabits) },
    { day: 'Wed', completed: Math.floor(Math.random() * totalHabits) },
    { day: 'Thu', completed: Math.floor(Math.random() * totalHabits) },
    { day: 'Fri', completed: Math.floor(Math.random() * totalHabits) },
    { day: 'Sat', completed: Math.floor(Math.random() * totalHabits) },
    { day: 'Sun', completed: completedToday }
  ];

  const topHabits = habits
    .sort((a, b) => (b.streak || 0) - (a.streak || 0))
    .slice(0, 3);

  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">Statistics</h1>
        <p className="page-subtitle">Track your habit progress</p>
      </div>

      {/* Today's Overview */}
      <div className="card-gradient mb-6">
        <h2 className="font-semibold mb-3">Today's Progress</h2>
        <div className="text-center">
          <div className="stats-number">{completedToday}/{totalHabits}</div>
          <div className="stats-label mb-2">Habits Completed</div>
          <div className="progress-bar" style={{ height: '0.75rem' }}>
            <div 
              className="progress-fill" 
              style={{ width: `${completionRate}%`, height: '0.75rem' }}
            ></div>
          </div>
          <div className="progress-text">{completionRate}% Complete</div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number green">{totalStreak}</div>
          <div className="stat-label">Total Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-number purple">{averageStreak}</div>
          <div className="stat-label">Avg Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-number orange">{totalDays}</div>
          <div className="stat-label">Total Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-number blue">{totalHabits}</div>
          <div className="stat-label">Total Habits</div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="card mb-6">
        <h3 className="font-semibold text-black mb-3">This Week</h3>
        <div className="weekly-progress">
          {weeklyData.map((day, index) => (
            <div key={index} className="weekly-item">
              <span className="weekly-day">{day.day}</span>
              <div className="weekly-bar-container">
                <div className="weekly-bar">
                  <div 
                    className="weekly-bar-fill" 
                    style={{ 
                      width: totalHabits > 0 ? `${(day.completed / totalHabits) * 100}%` : '0%' 
                    }}
                  ></div>
                </div>
                <span className="weekly-count">{day.completed}/{totalHabits}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Habits */}
      {topHabits.length > 0 && (
        <div className="card top-habits">
          <h3 className="font-semibold mb-3 text-black">🏆 Top Habits</h3>
          <div className="space-y-2">
            {topHabits.map((habit, index) => (
              <div key={habit.id} className="top-habit">
                <div className="top-habit-info">
                  <span className="top-habit-medal">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  <span className="top-habit-name">{habit.name}</span>
                </div>
                <span className="top-habit-streak">{habit.streak || 0} days</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link 
          href="/stats/daily"
          className="quick-action"
        >
          <div className="quick-action-icon">📅</div>
          <div className="quick-action-text">Daily Stats</div>
        </Link>
        <Link 
          href="/stats/weekly"
          className="quick-action"
        >
          <div className="quick-action-icon">📊</div>
          <div className="quick-action-text">Weekly Stats</div>
        </Link>
      </div>

      <div className="back-link">
        <Link 
          href="/dashboard"
          className="link-primary"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}

