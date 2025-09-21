"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import "./page.css";

export default function NewHabitPage() {
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!habitName.trim()) {
      alert("Please enter a habit name");
      return;
    }

    // Get existing habits
    const saved = localStorage.getItem("habits");
    const existingHabits = saved ? JSON.parse(saved) : [];
    
    // Create new habit
    const newHabit = {
      id: `habit-${Date.now()}`,
      name: habitName.trim(),
      description: habitDescription.trim(),
      done: false,
      createdAt: new Date().toISOString(),
      streak: 0,
      totalDays: 0
    };

    // Add to existing habits
    const updatedHabits = [...existingHabits, newHabit];
    localStorage.setItem("habits", JSON.stringify(updatedHabits));

    // Redirect to habits list
    router.push("/habits");
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <Link href="/habits" className="back-link">
          ← Back to Habits
        </Link>
        <h1 className="page-title">Create New Habit</h1>
        <p className="page-subtitle">Build a positive habit to improve your daily routine</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="habitName" className="form-label">
            Habit Name *
          </label>
          <input
            type="text"
            id="habitName"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="e.g., Drink 8 glasses of water"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="habitDescription" className="form-label">
            Description (Optional)
          </label>
          <textarea
            id="habitDescription"
            value={habitDescription}
            onChange={(e) => setHabitDescription(e.target.value)}
            placeholder="Add more details about this habit..."
            rows={3}
            className="form-textarea"
          />
        </div>

        <div className="form-buttons">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline btn-full"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-full"
          >
            Create Habit
          </button>
        </div>
      </form>


    </main>
  );
}

