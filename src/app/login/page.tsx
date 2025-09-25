"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already "logged in" via localStorage token, redirect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("ht_auth_token");
      if (token) {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Mock credentials
    const MOCK_USERNAME = "demo";
    const MOCK_PASSWORD = "password123";

    const isValid = username.trim() === MOCK_USERNAME && password === MOCK_PASSWORD;

    setTimeout(() => {
      if (isValid) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("ht_auth_token", "mock-token");
        }
        router.replace("/dashboard");
      } else {
        setError("Invalid username or password.");
        setIsSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Login</h1>
        <p className="page-subtitle">Use mock credentials to sign in.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              placeholder="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="password123"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-xs" style={{ color: "#b91c1c" }}>{error}</p>}

          <button type="submit" className="btn-primary btn-lg btn-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>

      <div className="mt-6 text-xs text-muted">
        <p><strong>Mock credentials</strong>: username "demo" and password "password123".</p>
      </div>
    </div>
  );
}



