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

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

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

  function deleteHabit(id: string) {
    if (confirm("Are you sure you want to delete this habit?")) {
      setHabits(habits.filter(habit => habit.id !== id));
    }
  }

  const completedToday = habits.filter(h => h.done).length;

  return (
    <main className="page-container">
      <div className="habits-header">
        <div>
          <h1 className="habits-title">All Habits</h1>
          <p className="habits-subtitle">{completedToday}/{habits.length} completed today</p>
        </div>
        <Link 
          href="/habits/new"
          className="new-habit-btn"
        >
          ➕ New
        </Link>
      </div>

      {habits.length === 0 ? (
        <div className="empty-habits">
          <div className="empty-icon">🎯</div>
          <h2 className="empty-title">No habits yet</h2>
          <p className="empty-text">Start building good habits today!</p>
          <Link 
            href="/habits/new"
            className="create-first-btn"
          >
            Create Your First Habit
          </Link>
        </div>
      ) : (
        <div className="habits-list">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="habit-item"
            >
              <div className="habit-content">
                <input
                  type="checkbox"
                  checked={habit.done}
                  onChange={() => toggleHabit(habit.id)}
                  className="habit-checkbox"
                />
                <div className="habit-info">
                  <span className={habit.done ? "habit-name completed" : "habit-name"}>
                    {habit.name}
                  </span>
                  <div className="habit-date">
                    Created {new Date(habit.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="habit-actions">
                <Link 
                  href={`/habits/${habit.id}`}
                  className="habit-action"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="habit-action delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

