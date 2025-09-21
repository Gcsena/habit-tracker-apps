"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import "./page.css";

type RoutineItem = {
  id: string;
  title: string;
  time: string;
};

type DayRoutine = {
  [key: string]: string; // itemId: description
};

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [dayRoutines, setDayRoutines] = useState<{[key: number]: DayRoutine}>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");

  const daysOfWeek = [
    { name: "Sunday", short: "Sun" },
    { name: "Monday", short: "Mon" },
    { name: "Tuesday", short: "Tue" },
    { name: "Wednesday", short: "Wed" },
    { name: "Thursday", short: "Thu" },
    { name: "Friday", short: "Fri" },
    { name: "Saturday", short: "Sat" }
  ];

  const routineItems: RoutineItem[] = [
    { id: "morning", title: "Bangun + Morning Routine", time: "04.00" },
    { id: "focus1", title: "Focus Session 1", time: "05.00 - 07.00" },
    { id: "break1", title: "Break 1", time: "07.00 - 07.30" },
    { id: "focus2", title: "Focus Session 2", time: "07.30 - 09.30" },
    { id: "break2", title: "Break 2", time: "09.30 - 10.00" },
    { id: "focus3", title: "Focus Session 3", time: "10.00 - 12.00" },
    { id: "lunch", title: "Lunch(Long Break)", time: "12.00 - 13.00" },
    { id: "focus4", title: "Focus Session 4", time: "13.00 - 15.00" },
    { id: "freetime", title: "Free Time", time: "15.00 - 18.00" },
    { id: "prepare", title: "Prepare for Bed", time: "18.00 - 19.00" },
    { id: "journal", title: "Cooling Down + Journaling", time: "19.00 - 20.00" },
    { id: "sleep", title: "Sleep", time: "20.00" }
  ];

  // Load day routines from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("day-routines");
    if (saved) {
      setDayRoutines(JSON.parse(saved));
    }
  }, []);

  // Save day routines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("day-routines", JSON.stringify(dayRoutines));
  }, [dayRoutines]);

  function getDescription(dayIndex: number, itemId: string): string {
    return dayRoutines[dayIndex]?.[itemId] || "";
  }

  function updateDescription(dayIndex: number, itemId: string, description: string) {
    setDayRoutines(prev => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        [itemId]: description
      }
    }));
  }

  function startEditing(itemId: string) {
    setEditingItem(itemId);
    setEditDescription(getDescription(selectedDay, itemId));
  }

  function saveEdit(itemId: string) {
    updateDescription(selectedDay, itemId, editDescription);
    setEditingItem(null);
    setEditDescription("");
  }

  function cancelEdit() {
    setEditingItem(null);
    setEditDescription("");
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">Schedule</h1>
        <p className="page-subtitle">Plan your daily routine</p>
      </div>

      {/* Day Selector */}
      <div className="mb-6">
       <div className="day-wrapper">
        <h3 className="font-semibold text-black mb-3">Weekly Schedule</h3>
        <div className="day-selector">
          {daysOfWeek.map((day, index) => (
            <button
              key={day.name}
              onClick={() => setSelectedDay(index)}
              className={selectedDay === index ? "day-btn active" : "day-btn inactive"}
            >
              {day.short}
            </button>
          ))}
        </div>
      </div>

        {/* Selected Day Schedule */}
        <div className="card">
          <h4 className="font-medium text-black mb-4">{daysOfWeek[selectedDay].name}</h4>
          
          <div className="routine-container">
            {routineItems.map((item) => (
              <div key={item.id} className="routine-item">
                <div className="routine">
                <h5>{item.title}</h5>
                <h4>{item.time}</h4>
              </div>
                
                {editingItem === item.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description (optional)"
                      className="form-input"
                    />
                    <div className="edit-buttons">
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="routine-content">
                    <div className="routine-description">
                      {getDescription(selectedDay, item.id) ? (
                        <p className="routine-description-text">
                          {getDescription(selectedDay, item.id)}
                        </p>
                      ) : (
                        <p className="routine-description-empty">No description added</p>
                      )}
                    </div>
                    <button
                      onClick={() => startEditing(item.id)}
                      className="btn-primary edit-btn"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <Link 
          href="/dashboard"
          className="quick-link"
        >
          <div className="quick-link-icon">🏠</div>
          <div className="quick-link-text">Dashboard</div>
        </Link>
        <Link 
          href="/stats"
          className="quick-link"
        >
          <div className="quick-link-icon">📊</div>
          <div className="quick-link-text">Statistics</div>
        </Link>
      </div>
    </main>
  );
}