"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Habit = {
  id: string;
  name: string;
  description?: string;
  done: boolean;
  createdAt: string;
  streak?: number;
  totalDays?: number;
};

export default function HabitDetailPage() {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  const router = useRouter();
  const params = useParams();
  const habitId = params.id as string;

  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) {
      const habits = JSON.parse(saved);
      const foundHabit = habits.find((h: Habit) => h.id === habitId);
      if (foundHabit) {
        setHabit(foundHabit);
        setEditName(foundHabit.name);
        setEditDescription(foundHabit.description || "");
      } else {
        router.push("/habits");
      }
    } else {
      router.push("/habits");
    }
  }, [habitId, router]);

  function handleToggle() {
    if (!habit) return;

    const saved = localStorage.getItem("habits");
    if (saved) {
      const habits = JSON.parse(saved);
      const updatedHabits = habits.map((h: Habit) => 
        h.id === habitId ? { ...h, done: !h.done } : h
      );
      localStorage.setItem("habits", JSON.stringify(updatedHabits));
      setHabit({ ...habit, done: !habit.done });
    }
  }

  function handleSave() {
    if (!habit || !editName.trim()) return;

    const saved = localStorage.getItem("habits");
    if (saved) {
      const habits = JSON.parse(saved);
      const updatedHabits = habits.map((h: Habit) => 
        h.id === habitId ? { 
          ...h, 
          name: editName.trim(), 
          description: editDescription.trim() 
        } : h
      );
      localStorage.setItem("habits", JSON.stringify(updatedHabits));
      setHabit({ 
        ...habit, 
        name: editName.trim(), 
        description: editDescription.trim() 
      });
      setIsEditing(false);
    }
  }

  function handleDelete() {
    if (!habit) return;
    
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      const saved = localStorage.getItem("habits");
      if (saved) {
        const habits = JSON.parse(saved);
        const updatedHabits = habits.filter((h: Habit) => h.id !== habitId);
        localStorage.setItem("habits", JSON.stringify(updatedHabits));
        router.push("/habits");
      }
    }
  }

  if (!habit) {
    return (
      <main className="p-4 max-w-md mx-auto">
        <div className="text-center py-8">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <div className="mb-6">
        <Link href="/habits" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
          ← Back to Habits
        </Link>
        
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full text-2xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-2">{habit.name}</h1>
            {habit.description && (
              <p>{habit.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Habit Status */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium text-black">Today's Status</span>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            habit.done 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {habit.done ? '✅ Completed' : '⏳ Pending'}
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            habit.done
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {habit.done ? 'Mark as Incomplete' : 'Mark as Complete'}
        </button>
      </div>

      {/* Habit Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{habit.streak || 0}</div>
          <div className="text-sm text-black">Current Streak</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{habit.totalDays || 0}</div>
          <div className="text-sm text-black">Total Days</div>
        </div>
      </div>

      {/* Habit Info */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h3 className="font-medium text-black mb-2">Habit Information</h3>
        <div className="space-y-2 text-sm text-black">
          <div>Created: {new Date(habit.createdAt).toLocaleDateString()}</div>
          <div>ID: {habit.id}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          {isEditing ? 'Cancel' : '✏️ Edit'}
        </button>
        
        {isEditing && (
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            💾 Save
          </button>
        )}
        
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          🗑️ Delete
        </button>
      </div>
    </main>
  );
}

