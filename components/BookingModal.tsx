"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { submitBookingLead } from "@/lib/supabase";
import { site } from "@/lib/site";

export interface BookingVenue {
  slug: string;
  name: string;
  city: string;
  state: string;
}

// A one-page booking/inquiry form for a specific venue. Collects contact
// details plus the booking specifics a karaoke venue needs (party size, room
// type, arrival time, duration) and writes a lead to Supabase. Rendered via a
// portal so it's never clipped by a parent's stacking/overflow context.
export default function BookingModal({
  venue,
  onClose,
}: {
  venue: BookingVenue | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [roomType, setRoomType] = useState("regular");
  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // Lock body scroll and reset the form each time a venue is opened.
  useEffect(() => {
    if (!venue) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setStatus("idle");
    setError("");
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [venue, onClose]);

  if (!venue) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!venue) return;
    if (!name.trim() || !email.trim() || !guests.trim()) {
      setError("Please add your name, email, and party size.");
      return;
    }
    setStatus("sending");
    setError("");

    const roomLabel =
      roomType === "private"
        ? "Private room"
        : roomType === "regular"
        ? "Regular / shared floor"
        : "Either room type is fine";

    const messageLines = [
      `Venue: ${venue.name} (${venue.city}, ${venue.state})`,
      `Room preference: ${roomLabel}`,
      arrivalTime ? `Arrival time: ${arrivalTime}` : null,
      duration ? `Duration: ${duration} hour${duration === "1" ? "" : "s"}` : null,
      notes.trim() ? `Notes: ${notes.trim()}` : null,
    ].filter((line): line is string => Boolean(line));

    try {
      await submitBookingLead({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        city: venue.city,
        event_type: "Karaoke Booking",
        event_date: arrivalDate || null,
        guest_count: guests.trim() || null,
        services: ["Karaoke"],
        message: messageLines.join("\n"),
        source: site.domain,
        page_url: typeof window !== "undefined" ? window.location.href : "",
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong sending your request."
      );
    }
  }

  return createPortal(
    <div
      className="auth-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="auth-modal booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
      >
        <button className="auth-close" onClick={onClose} aria-label="Close booking form">
          &times;
        </button>

        {status === "sent" ? (
          <>
            <h2 id="booking-title" className="auth-modal-title">
              Request sent
            </h2>
            <p className="auth-modal-sub">
              Thanks! Your booking request for <strong>{venue.name}</strong> has
              been sent. We&rsquo;ll be in touch by email to confirm availability.
            </p>
            <button type="button" className="btn btn-primary auth-submit" onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <h2 id="booking-title" className="auth-modal-title">
              Book {venue.name}
            </h2>
            <p className="auth-modal-sub">
              Tell us about your night and we&rsquo;ll help you set up a booking at
              this {venue.city}, {venue.state} venue.
            </p>

            <form onSubmit={onSubmit} noValidate>
              <div className="booking-grid">
                <div className="field">
                  <label htmlFor="bk-name">Your name</label>
                  <input
                    id="bk-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="bk-email">Email</label>
                  <input
                    id="bk-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="field">
                  <label htmlFor="bk-phone">Phone (optional)</label>
                  <input
                    id="bk-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="For a faster confirmation"
                  />
                </div>
                <div className="field">
                  <label htmlFor="bk-guests">How many guests?</label>
                  <input
                    id="bk-guests"
                    type="number"
                    min={1}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="e.g. 8"
                  />
                </div>
                <div className="field">
                  <label htmlFor="bk-room">Room type</label>
                  <select
                    id="bk-room"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option value="regular">Regular / shared floor</option>
                    <option value="private">Private room</option>
                    <option value="either">Either is fine</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="bk-duration">How long? (hours)</label>
                  <select
                    id="bk-duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="">Not sure yet</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5+ hours</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="bk-date">Date of arrival</label>
                  <input
                    id="bk-date"
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="bk-time">Time of arrival</label>
                  <input
                    id="bk-time"
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="bk-notes">Anything else? (optional)</label>
                <textarea
                  id="bk-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Occasion, song requests, accessibility needs…"
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send Booking Request"}
              </button>
              <p className="muted" style={{ fontSize: "0.82rem", marginTop: "0.7rem" }}>
                Karaoke Near Me passes your request to the venue and our booking
                team. Confirm final details directly with the venue.
              </p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
