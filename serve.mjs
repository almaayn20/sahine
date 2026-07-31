import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { findPackage, convertAmount } from './src/data.mjs';
import { sendOrderEmails } from './mailer.mjs';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';

const FATORA_BASE_URL = process.env.FATORA_BASE_URL || 'https://api.fatora.io/v1';
const FATORA_API_KEY = process.env.FATORA_API_KEY || '';

// In-memory only — fine at this scale, since orders are settled within
// minutes and none of this needs to survive a process restart.
const pendingOrderNotes = new Map();
const emailedOrders = new Set();

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.ttf': 'font/ttf',
};

function siteOrigin(request) {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL.replace(/\/$/, '');
  const proto = request.headers['x-forwarded-proto'] || 'https';
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  return `${proto}://${host}`;
}

function readJsonBody(request) {
  return new Promise((resolvePromise, rejectPromise) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) request.destroy();
    });
    request.on('end', () => {
      try {
        resolvePromise(raw ? JSON.parse(raw) : {});
      } catch {
        rejectPromise(new Error('invalid_json'));
      }
    });
    request.on('error', rejectPromise);
  });
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  response.end(body);
}

function makeOrderId(packageId) {
  const random = Math.random().toString(36).slice(2, 8);
  return `SHN-${packageId}-${Date.now()}-${random}`.toUpperCase();
}

async function handleCheckout(request, response) {
  if (!FATORA_API_KEY) {
    sendJson(response, 500, { error: 'بوابة الدفع غير مفعّلة على السيرفر (مفتاح Fatora غير موجود).' });
    return;
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch {
    sendJson(response, 400, { error: 'طلب غير صالح.' });
    return;
  }

  const { packageId, currency, client, notes } = body;
  const pkg = findPackage(packageId);
  if (!pkg) {
    sendJson(response, 400, { error: 'الباقة المطلوبة غير موجودة.' });
    return;
  }

  const currencyCode = currency === 'BHD' ? 'BHD' : 'SAR';
  const amount = convertAmount(pkg.price, currencyCode);

  if (!client || (!client.email && !client.phone)) {
    sendJson(response, 400, { error: 'محتاجين بريدك الإلكتروني أو رقم جوالك لإتمام الدفع.' });
    return;
  }

  const orderId = makeOrderId(pkg.id);
  const origin = siteOrigin(request);
  if (notes) pendingOrderNotes.set(orderId, notes);

  const payload = {
    amount,
    currency: currencyCode,
    order_id: orderId,
    client: {
      name: client.name || undefined,
      email: client.email || undefined,
      phone: client.phone || undefined,
    },
    language: 'ar',
    success_url: `${origin}/#/payment-success?order_id=${encodeURIComponent(orderId)}`,
    failure_url: `${origin}/#/payment-failure?order_id=${encodeURIComponent(orderId)}`,
    note: [pkg.title, notes].filter(Boolean).join(' — ').slice(0, 500),
  };

  try {
    const fatoraResponse = await fetch(`${FATORA_BASE_URL}/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        api_key: FATORA_API_KEY,
      },
      body: JSON.stringify(payload),
    });
    const data = await fatoraResponse.json();

    if (!fatoraResponse.ok || data.status !== 'SUCCESS' || !data.result?.checkout_url) {
      const message = data.error?.description || data.message || 'تعذر إنشاء عملية الدفع مع بوابة فاتورة.';
      console.error('Fatora checkout error:', fatoraResponse.status, data);
      sendJson(response, 502, { error: message });
      return;
    }

    sendJson(response, 200, { checkout_url: data.result.checkout_url, order_id: orderId });
  } catch (error) {
    sendJson(response, 502, { error: 'تعذر الاتصال ببوابة الدفع، حاول مرة ثانية.' });
  }
}

async function verifyWithFatora(orderId) {
  const fatoraResponse = await fetch(`${FATORA_BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      api_key: FATORA_API_KEY,
    },
    body: JSON.stringify({ order_id: orderId }),
  });
  const data = await fatoraResponse.json();
  return {
    ok: fatoraResponse.ok,
    status: data.status,
    payment_status: data.payment_status || data.result?.payment_status || 'FAILURE',
    amount: data.amount ?? data.result?.amount,
    currency: data.currency ?? data.result?.currency,
    transaction_id: data.transaction_id ?? data.result?.transaction_id,
    client: data.client ?? data.result?.client ?? {},
  };
}

async function handleVerify(request, response, orderId) {
  if (!FATORA_API_KEY) {
    sendJson(response, 500, { error: 'بوابة الدفع غير مفعّلة على السيرفر.' });
    return;
  }
  if (!orderId) {
    sendJson(response, 400, { error: 'رقم الطلب مفقود.' });
    return;
  }

  try {
    const result = await verifyWithFatora(orderId);
    console.log('[verify]', orderId, '->', result.payment_status);
    sendJson(response, result.ok ? 200 : 502, { ...result, order_id: orderId });
    if (result.payment_status === 'SUCCESS') {
      await notifyOrderPaid(orderId, result);
    }
  } catch (error) {
    console.error('[verify] failed for', orderId, error);
    sendJson(response, 502, { error: 'تعذر التحقق من حالة الدفع.' });
  }
}

// packageId is embedded in the order_id we generate ourselves — see makeOrderId.
function packageIdFromOrderId(orderId) {
  const parts = String(orderId).split('-');
  return parts.length >= 2 ? parts[1].toLowerCase() : null;
}

async function notifyOrderPaid(orderId, verifyResult) {
  if (emailedOrders.has(orderId)) {
    console.log('[notify] already emailed, skipping', orderId);
    return;
  }
  emailedOrders.add(orderId);

  const pkg = findPackage(packageIdFromOrderId(orderId));
  const notes = pendingOrderNotes.get(orderId) || '';
  pendingOrderNotes.delete(orderId);

  console.log('[notify] sending order emails for', orderId, 'to', verifyResult.client?.email);
  try {
    const result = await sendOrderEmails({
      orderId,
      transactionId: verifyResult.transaction_id,
      packageTitle: pkg?.title || 'باقة شاهين',
      amount: verifyResult.amount,
      currency: verifyResult.currency,
      client: verifyResult.client || {},
      notes,
    });
    console.log('[notify] result for', orderId, '->', JSON.stringify(result.sent), result.results);
  } catch (error) {
    emailedOrders.delete(orderId); // allow a retry on the next webhook/verify hit
    console.error('[notify] failed to send order emails for', orderId, error);
  }
}

// Fatora calls this server-to-server after a payment completes (configured
// in the Fatora dashboard under Integration → Settings → Webhook URL).
// Docs show the params on the query string regardless of method, so we read
// from the URL rather than the body.
async function handleWebhook(request, response, params) {
  const orderId = params.get('order_id');
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('ok');

  if (!orderId || !FATORA_API_KEY) return;

  try {
    const result = await verifyWithFatora(orderId);
    if (result.payment_status === 'SUCCESS') {
      await notifyOrderPaid(orderId, result);
    }
  } catch (error) {
    console.error('Webhook verify failed for', orderId, error);
  }
}

function serveStatic(request, response) {
  const url = new URL(request.url || '/', `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  let filePath = normalize(join(root, pathname));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(root, 'index.html');
  }

  response.writeHead(200, {
    'Content-Type': types[extname(filePath)] || 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
}

createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${host}:${port}`);

  if (url.pathname === '/api/checkout' && request.method === 'POST') {
    handleCheckout(request, response);
    return;
  }

  if (url.pathname === '/api/verify' && request.method === 'GET') {
    handleVerify(request, response, url.searchParams.get('order_id'));
    return;
  }

  if (url.pathname === '/api/fatora-webhook') {
    handleWebhook(request, response, url.searchParams);
    return;
  }

  serveStatic(request, response);
}).listen(port, host, () => {
  console.log(`Shahin site preview: http://${host}:${port}/`);
  if (!FATORA_API_KEY) {
    console.warn('⚠️  FATORA_API_KEY is not set — payment endpoints will return 500.');
  }
});
