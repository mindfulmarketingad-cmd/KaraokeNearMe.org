// Front-end-only auth state shared between the header's AuthMenu and any
// other component that needs to know if someone's signed in (e.g. the
// "Claim This Business" button). There is no backend yet, so this is just a
// localStorage-backed session plus a couple of window events so components
// that aren't nested inside each other can still coordinate:
//   - AUTH_CHANGED_EVENT fires whenever the signed-in user changes.
//   - OPEN_SIGNIN_EVENT lets any component ask the header to open the
//     sign-in modal, without prop-drilling it everywhere.

export const AUTH_STORAGE_KEY = "knm_user";
export const AUTH_CHANGED_EVENT = "knm-auth-changed";
export const OPEN_SIGNIN_EVENT = "knm-open-signin";

export interface AuthUser {
  name: string;
  email: string;
  provider: "email" | "google";
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(u: AuthUser) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
  } catch {
    /* storage may be unavailable; UI still updates for the session */
  }
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function requestSignIn() {
  window.dispatchEvent(new Event(OPEN_SIGNIN_EVENT));
}

export function nameFromEmail(email: string): string {
  const handle = email.split("@")[0] || "Guest";
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}
