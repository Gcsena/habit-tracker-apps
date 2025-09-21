"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navigation.css";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/startDay", label: "Start Day", icon: "⏰" },
    { href: "/habits", label: "Habits", icon: "🎯" },
    { href: "/schedule", label: "Schedule", icon: "📅" },
    { href: "/stats", label: "Stats", icon: "📊" }
  ];

  return (
    <nav className="navigation">
      <div className="navigation-container">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === "/dashboard" && pathname === "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${
                isActive ? "nav-link-active" : "nav-link-inactive"
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
