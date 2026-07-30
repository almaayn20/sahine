// Order notification emails — sent server-side only, after a payment is
// confirmed with Fatora (never trust the browser's success redirect alone).
import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
  MAIL_TO_INTERNAL,
} = process.env;

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

const from = MAIL_FROM || 'Shahin <info@shahin.bh>';
const internalTo = MAIL_TO_INTERNAL || 'info@shahin.bh';

function formatMoney(amount, currency) {
  const decimals = currency === 'BHD' ? 3 : 0;
  return `${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} ${currency}`;
}

function orderRowsHtml(order) {
  return `
    <tr><td style="padding:4px 12px 4px 0;color:#666">الباقة</td><td><strong>${order.packageTitle}</strong></td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">المبلغ</td><td><strong>${formatMoney(order.amount, order.currency)}</strong></td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">رقم الطلب</td><td>${order.orderId}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">رقم العملية</td><td>${order.transactionId || '—'}</td></tr>
  `;
}

export async function sendOrderEmails(order) {
  if (!transporter) {
    console.warn('⚠️  SMTP is not configured — skipping order emails for', order.orderId);
    return { sent: false, reason: 'smtp_not_configured' };
  }

  const internalHtml = `
    <div dir="rtl" style="font-family:sans-serif;font-size:15px;color:#111">
      <h2>طلب جديد مدفوع — ${order.packageTitle}</h2>
      <table cellpadding="0" cellspacing="0">${orderRowsHtml(order)}</table>
      <h3>بيانات العميل</h3>
      <table cellpadding="0" cellspacing="0">
        <tr><td style="padding:4px 12px 4px 0;color:#666">الاسم</td><td>${order.client.name || '—'}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">البريد</td><td>${order.client.email || '—'}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">الجوال</td><td dir="ltr">${order.client.phone || '—'}</td></tr>
      </table>
      ${order.notes ? `<h3>ملاحظات المشروع</h3><p>${order.notes}</p>` : ''}
    </div>
  `;

  const customerHtml = `
    <div dir="rtl" style="font-family:sans-serif;font-size:15px;color:#111">
      <h2>شكرًا لك، ${order.client.name || ''} 🎉</h2>
      <p>وصلنا طلبك واستلمنا الدفع بنجاح. بنتواصل معك قريبًا لبدء العمل على مشروعك.</p>
      <table cellpadding="0" cellspacing="0">${orderRowsHtml(order)}</table>
      <p style="margin-top:24px;color:#666">لأي استفسار، تقدر تتواصل معنا على info@shahin.bh أو عبر واتساب.</p>
      <p style="color:#666">فريق شاهين</p>
    </div>
  `;

  const results = await Promise.allSettled([
    transporter.sendMail({
      from,
      to: internalTo,
      subject: `طلب جديد مدفوع — ${order.packageTitle} (${order.orderId})`,
      html: internalHtml,
    }),
    order.client.email
      ? transporter.sendMail({
          from,
          to: order.client.email,
          subject: `تأكيد استلام دفعتك — ${order.packageTitle}`,
          html: customerHtml,
        })
      : Promise.resolve({ skipped: true }),
  ]);

  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length) {
    console.error('Order email send failure:', failed.map((f) => f.reason));
  }

  return { sent: failed.length === 0, results };
}
