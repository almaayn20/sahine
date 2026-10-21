// Ad/analytics tracking for the single-page app. Every event goes to the Snap
// pixel in the browser AND (via /api/track) to Snap's Conversions API on the
// server, sharing one id so Snap counts it once while using the richer
// server-side signals (hashed email/phone, IP, user agent) for match quality.

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

// Snap appends ScCid to the landing URL on ad clicks; keep it for the session
// because the hash router drops the query string on later pages.
function snapClickId() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('ScCid');
    if (fromUrl) sessionStorage.setItem('shahin_sc_click_id', fromUrl);
    return sessionStorage.getItem('shahin_sc_click_id') || '';
  } catch {
    return '';
  }
}

export function track(name, { eventId = newId(), pixel = {}, custom, email, phone } = {}) {
  try {
    if (typeof window.snaptr === 'function') {
      const userFields = {};
      if (email) userFields.user_email = email;
      if (phone) userFields.user_phone_number = phone;
      window.snaptr('track', name, { ...pixel, ...userFields, client_dedup_id: eventId });
    }
  } catch {
    /* tracking must never break the page */
  }

  try {
    if (name === 'PURCHASE') return eventId; // PURCHASE is sent by the server after Fatora confirms
    const payload = JSON.stringify({
      name,
      eventId,
      url: window.location.href,
      email,
      phone,
      custom,
      scClickId: snapClickId(),
      scCookie: readCookie('_scid'),
    });
    if (!navigator.sendBeacon?.('/api/track', payload)) {
      fetch('/api/track', { method: 'POST', body: payload, keepalive: true }).catch(() => {});
    }
  } catch {
    /* ignore */
  }
  return eventId;
}
