import {
  API_URL,
  IS_DEV,
  buildForwardHeaders,
  fetchWithTimeout,
  getClientIp,
  isValidEmail,
  jsonResponse,
  rateLimit,
  readJson,
  sanitizeString
} from '../../_utils/security';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`newsletter:${ip}`, 8, 60_000);
    if (!limit.ok) {
      return jsonResponse(
        { success: false, message: 'Too many requests. Please try again soon.' },
        429,
        { 'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000) }
      );
    }

    const { data: body, error } = await readJson(request, 12_000);
    if (error) {
      return jsonResponse({ success: false, message: error }, 400);
    }

    const email = sanitizeString(body?.email, 254);
    if (!email || !isValidEmail(email)) {
      return jsonResponse({ success: false, message: 'Invalid email address.' }, 400);
    }

    const safeBody = { ...body, email };

    const response = await fetchWithTimeout(`${API_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: buildForwardHeaders(request, { 'Content-Type': 'application/json' }),
      body: JSON.stringify(safeBody),
      cache: 'no-store'
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = { success: false, message: 'Upstream error' };
    }

    return jsonResponse(data, response.status);
  } catch (error) {
    if (IS_DEV) {
      return jsonResponse(
        { success: true, message: 'Subscribed successfully (demo mode)', demo: true },
        200
      );
    }
    return jsonResponse(
      { success: false, message: 'Service unavailable. Please try again later.' },
      502
    );
  }
}
