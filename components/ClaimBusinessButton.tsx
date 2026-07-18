"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import {
  AUTH_CHANGED_EVENT,
  AuthUser,
  getStoredUser,
  requestSignIn,
} from "@/lib/auth";

// Lets a signed-in venue owner/manager submit a claim for review. There's no
// backend yet, so "submitting" opens a pre-filled email to the site admin,
// who approves claims manually. If the visitor isn't signed in, clicking the
// button opens the header's sign-in modal first (via requestSignIn()), then
// automatically re-opens this claim form once they're signed in.
export default function ClaimBusinessButton({
  listingSlug,
  listingName,
}: {
  listingSlug: string;
  listingName: string;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const pendingRef = useRef(false);

  useEffect(() => {
    setUser(getStoredUser());
    function onAuthChanged() {
      const current = getStoredUser();
      setUser(current);
      if (current && pendingRef.current) {
        pendingRef.current = false;
        setModalOpen(true);
      }
    }
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
  }, []);

  function handleClick() {
    const current = getStoredUser();
    if (!current) {
      pendingRef.current = true;
      requestSignIn();
      return;
    }
    setSent(false);
    setModalOpen(true);
  }

  function submitClaim(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !role.trim()) return;

    const listingUrl = `${site.url}/partners/${listingSlug}/`;
    const subject = `Business claim: ${listingName}`;
    const body = [
      `Listing: ${listingName}`,
      `Listing URL: ${listingUrl}`,
      "",
      `Claimant name: ${user.name}`,
      `Claimant email: ${user.email}`,
      `Role at business: ${role.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : null,
      "",
      "Message:",
      message.trim() || "(none)",
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <>
      <button type="button" className="btn btn-secondary claim-business-btn" onClick={handleClick}>
        Claim This Business
      </button>

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
            aria-labelledby="claim-title"
          >
            <button
              className="auth-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close claim form"
            >
              &times;
            </button>

            <h2 id="claim-title" className="auth-modal-title">
              Claim {listingName}
            </h2>

            {sent ? (
              <>
                <p className="auth-modal-sub">
                  Your email app should have opened with the claim request
                  ready to send. Once we receive it, our team will review and
                  approve your claim.
                </p>
                <p className="muted" style={{ fontSize: "0.9rem" }}>
                  Nothing happen? Email us directly at{" "}
                  <a href={`mailto:${site.email}`}>{site.email}</a>.
                </p>
                <button
                  type="button"
                  className="btn btn-primary auth-submit"
                  onClick={() => setModalOpen(false)}
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <p className="auth-modal-sub">
                  Tell us how you&apos;re connected to this business. We
                  review every claim before it&apos;s approved.
                </p>
                <form onSubmit={submitClaim} noValidate>
                  <div className="field">
                    <label htmlFor="claim-role">Your role at this business</label>
                    <input
                      id="claim-role"
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Owner, manager, etc."
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="claim-phone">Phone (optional)</label>
                    <input
                      id="claim-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="For verification"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="claim-message">Anything else? (optional)</label>
                    <textarea
                      id="claim-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Let us know anything that helps verify your claim"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary auth-submit">
                    Send Claim Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
