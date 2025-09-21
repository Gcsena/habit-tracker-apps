"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./page.css";

type Habit = {
  id: string;
  name: string;
  done: boolean;
  createdAt: string;
};

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load saved habits on first render
  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) {
      const parsedHabits = JSON.parse(saved);
      // Ensure all habits have IDs
      const habitsWithIds = parsedHabits.map((habit: any, index: number) => ({
        ...habit,
        id: habit.id || `habit-${index}-${Date.now()}`,
        createdAt: habit.createdAt || new Date().toISOString()
      }));
      setHabits(habitsWithIds);
    }
  }, []);

  // Save habits whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);

  function toggleHabit(id: string) {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, done: !habit.done } : habit
    ));
  }

  function resetHabits() {
    setHabits(habits.map(h => ({ ...h, done: false })));
  }

  const completedToday = habits.filter(h => h.done).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Track your daily habits</p>
      </div>

      {/* Stats Overview */}
      <div className="card-gradient mb-6">
        <div className="stats-overview">
          <div className="stats-number">{completedToday}/{totalHabits}</div>
          <div className="stats-label">Completed Today</div>
          <div className="mt-2">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <div className="progress-text">{completionRate}% Complete</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link 
          href="/habits/new"
          className="btn-primary quick-action-btn"
        >
          ➕ Add Habit
        </Link>
        <button
          onClick={resetHabits}
          className="btn-secondary quick-action-btn"
        >
          🔄 Reset
        </button>
      </div>

      {/* Today's Habits */}
      <div className="mb-4">
        <div className="section-header">
          <h2 className="section-title">Today's Habits</h2>
          <Link href="/habits" className="view-all-link">
            View All →
          </Link>
        </div>
        
        {habits.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No habits yet</p>
            <Link 
              href="/habits/new"
              className="create-first-btn"
            >
              Create Your First Habit
            </Link>
          </div>
        ) : (
          <div className="habits-list">
            {habits.slice(0, 5).map((habit) => (
              <div
                key={habit.id}
                className="habit-item"
              >
                <span className={habit.done ? "line-through" : ""}>
                  {habit.name}
                </span>
                <input
                  type="checkbox"
                  checked={habit.done}
                  onChange={() => toggleHabit(habit.id)}
                  className="habit-checkbox"
                />
              </div>
            ))}
            {habits.length > 5 && (
              <Link 
                href="/habits"
                className="more-habits-link"
              >
                View {habits.length - 5} more habits →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="quick-actions">
        <Link 
          href="/startDay"
          className="btn-primary quick-action-btn"
        > 📊 Start Your Day
        </Link>
      </div>
    </main>
  );
}

