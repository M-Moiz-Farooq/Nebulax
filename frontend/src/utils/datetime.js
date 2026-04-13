/**
 * <input type="datetime-local" /> uses local wall time (no TZ suffix).
 * Never use toISOString().slice(0, 16) for its value — that mixes UTC into a local field.
 */

/** Format Date or parseable ISO for datetime-local (local hours/minutes). */
export function toDatetimeLocalValue(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

/** Local picker string → UTC ISO for the API. */
export function datetimeLocalToApiIso(localString) {
  if (!localString || !String(localString).trim()) return undefined;
  const d = new Date(localString);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

/** Table / list display in the user’s locale. */
export function formatDateTimeDisplay(isoOrDate) {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
