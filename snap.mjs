// Snapchat Conversions API (server-side events). Complements the browser pixel:
// the two are de-duplicated by sharing one id (pixel `client_dedup_id` ===
// CAPI `event_id`), and the server side adds hashed email/phone, IP and
// user-agent — the signals Snap's Event Quality Score is scored on.
// The access token is a secret: it only ever lives in server env vars.
import { createHash } from 'node:crypto';

const PIXEL_ID = process.env.SNAP_PIXEL_ID || '363a9fd8-7c50-49fc-87fd-741a6f75fe5c';
const TOKEN = process.env.SNAP_CAPI_TOKEN || '';
const TEST_CODE = process.env.SNAP_TEST_EVENT_CODE || '';
// Staging switch: validate payloads against Snap without recording any event.
const VALIDATE_ONLY = process.env.SNAP_VALIDATE_ONLY === 'true';
const BASE = 'https://tr.snapchat.com/v3';

export const snapEnabled = Boolean(TOKEN);

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const hashEmail = (email) => {
  const clean = String(email || '').trim().toLowerCase();
  return clean.includes('@') ? sha256(clean) : null;
};

// Snap wants digits only, country code included, no "+" or leading zeros.
const hashPhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '').replace(/^0+/, '');
  return digits.length >= 8 ? sha256(digits) : null;
};

export function buildEvent({ name, eventId, url, ip, userAgent, email, phone, scClickId, scCookie, custom }) {
  const user = {};
  const em = hashEmail(email);
  const ph = hashPhone(phone);
  if (em) user.em = [em];
  if (ph) user.ph = [ph];
  if (ip) user.client_ip_address = ip;
  if (userAgent) user.client_user_agent = userAgent;
  if (scClickId) user.sc_click_id = scClickId;
  if (scCookie) user.sc_cookie1 = scCookie;

  const event = {
    event_name: name,
    event_time: Date.now(),
    action_source: 'WEB',
    event_source_url: url,
    user_data: user,
  };
  if (eventId) event.event_id = eventId;
  if (custom && Object.keys(custom).length) event.custom_data = custom;
  return event;
}

export async function sendSnapEvents(events, { validateOnly = false } = {}) {
  if (!snapEnabled) return { ok: false, skipped: 'SNAP_CAPI_TOKEN not set' };

  const body = { data: events };
  if (TEST_CODE) body.test_event_code = TEST_CODE;

  const endpoint = `${BASE}/${PIXEL_ID}/events${validateOnly || VALIDATE_ONLY ? '/validate' : ''}`;
  const response = await fetch(`${endpoint}?access_token=${encodeURIComponent(TOKEN)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) console.error('[snap] CAPI error', response.status, text.slice(0, 300));
  if (VALIDATE_ONLY) console.log('[snap] validate ->', response.status, text.slice(0, 200));
  return { ok: response.ok, status: response.status, body: text.slice(0, 500) };
}
