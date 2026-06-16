"use client";

import { useEffect, useRef, useState } from "react";

// Front-end-only sign in. There is no backend yet (the site is a static
// export), so this stores a lightweight session in localStorage to drive the
// header UI. It is structured so the submit handlers can later be swapped for
// real calls to an auth provider (Supabase, Firebase, Clerk, etc.) without
// changing the surrounding markup.

const STORAGE_KEY = "knm_user";

interface User {
  name: string;
  email: string;
  provider: "email" | "google";
}

function readUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function nameFromEmail(email: string): string {
  const handle = email.split("@")[0] || "Guest";
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}

export default function AuthMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [menuOpen, setMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Hydrate the session from localStorage after mount to avoid SSR mismatch.
  useEffect(() => {
    setUser(readUser());
  }, []);

  // Close the account dropdown / modal on outside click or Escape.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setModalOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock body scroll and focus the first field while the modal is open.
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => emailRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [modalOpen]);

  function openModal(next: "signin" | "signup") {
    setMode(next);
    setError("");
    setModalOpen(true);
  }

  function persist(u: User) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      /* storage may be unavailable; UI still updates for the session */
    }
    setUser(u);
    setModalOpen(false);
    setName("");
    setEmail("");
    setPassword("");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (mode === "signup" && !name.trim())) {
      setError("Please complete all fields to continue.");
      return;
    }
    persist({
      name: mode === "signup" ? name.trim() : nameFromEmail(email),
      email: email.trim(),
      provider: "email",
    });
  }

  function continueWithGoogle() {
    // Placeholder for a real OAuth flow. For now it creates a local session so
    // the signed-in header state can be previewed.
    persist({ name: "Google User", email: "you@gmail.com", provider: "google" });
  }

  function signOut() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
    setMenuOpen(false);
  }

  return (
    <div className="auth" ref={menuRef}>
      {user ? (
        <>
          <button
            className="auth-avatar-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="Account menu"
          >
            <span className="auth-avatar" aria-hidden="true">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="auth-name">{user.name.split(" ")[0]}</span>
          </button>
          {menuOpen && (
            <div className="auth-dropdown" role="menu">
              <div className="auth-dropdown-head">
                <strong>{user.name}</strong>
                <span className="muted">{user.email}</span>
              </div>
              <button className="auth-dropdown-item" onClick={signOut} role="menuitem">
                Sign out
              </button>
            </div>
          )}
        </>
      ) : (
        <button className="btn btn-primary auth-signin-btn" onClick={() => openModal("signin")}>
          Sign In
        </button>
      )}

      {modalOpen && (
        <div
          className="auth-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="auth-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close sign in"
            >
              &times;
            </button>

            <h2 id="auth-title" className="auth-modal-title">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="auth-modal-sub">
              {mode === "signin"
                ? "Sign in to save your favorite karaoke spots."
                : "Join to save venues and get karaoke picks near you."}
            </p>

            <button type="button" className="auth-google" onClick={continueWithGoogle}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C41.5 35.6 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <form onSubmit={onSubmit} noValidate>
              {mode === "signup" && (
                <div className="field">
                  <label htmlFor="auth-name">Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              )}
              <div className="field">
                <label htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="field">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="btn btn-primary auth-submit">
                {mode === "signin" ? "Sign In" : "Create account"}
              </button>
            </form>

            <p className="auth-toggle">
              {mode === "signin" ? (
                <>
                  New here?{" "}
                  <button type="button" onClick={() => setMode("signup")}>
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => setMode("signin")}>
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
