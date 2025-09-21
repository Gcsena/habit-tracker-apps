"use client";

import ScheduleTimer from "@/components/ScheduleTimer";

export default function StartDayPage() {
  return (
    <div className="page-container">
      <div className="">
        {/* Page Header */}
        <div className="page-header bg-[#f8dc3c]">
          <h1 className="page-title">Start Your Day</h1>
          <p className="page-subtitle">
            Follow your daily routine with automatic session timers
          </p>
        </div>

        {/* Timer Card */}
        <div className="card">
            <ScheduleTimer />
        </div>

        {/* task List per session */}
        {/* TODO: integrate input todo list dari schedule trus tampilin disini */}
        <div className="page-container">
          <div className="card">
            <h2 className="page-title">
              Your Task For This Session
            </h2>
            <ul className="page-subtitle">
              <li>- example todo 1</li>
              <li>- nanti integrate secara dynamic</li>
              <li>- list task yang udah di input di page schedule</li>
              <li>- kedalam sini, nanti parse json localStorage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
