/**
 * API client — uses Vite proxy /api in dev. Set VITE_API_BASE for production (e.g. https://api.example.com).
 */
const BASE = import.meta.env.VITE_API_BASE ?? '';

/** Login/signup must not send a stale Bearer token (would confuse 401 handling). */
function isAuthLoginOrSignup(path) {
  return /\/api\/auth\/(login|signup)\/?$/.test(path);
}

function getToken() {
  return localStorage.getItem('token');
}

let onUnauthorized = null;
let last401Notify = 0;

/** Called from AuthProvider — clears session + redirects when a protected call returns 401. */
export function setAuthUnauthorizedHandler(fn) {
  onUnauthorized = typeof fn === 'function' ? fn : null;
}

function notifySessionExpired() {
  const now = Date.now();
  if (now - last401Notify < 1500) return;
  last401Notify = now;
  onUnauthorized?.();
}

/**
 * JSON `fetch` helper for `/api/...`. Sends `Authorization: Bearer` except on login/signup paths.
 * @param {string} path - Absolute path beginning with `/api`
 * @param {RequestInit & { body?: object }} [options] - `body` is JSON-serialised when present
 */
export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  const sendBearer = !!(token && !isAuthLoginOrSignup(path));
  if (sendBearer) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && sendBearer && data?.code !== 'INVALID_CREDENTIALS') {
      notifySessionExpired();
    }
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const ROLES = {
  ADMIN: 'ADMIN',
  ACCOUNTANT: 'ACCOUNTANT',
  USER: 'USER',
};
