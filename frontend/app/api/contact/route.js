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
} from '../_utils/security';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`contact:${ip}`, 6, 60_000);
    if (!limit.ok) {
      return jsonResponse(
        { success: false, message: 'Too many requests. Please try again soon.' },
        429,
        { 'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000) }
      );
    }

    const { data: body, error } = await readJson(request, 24_000);
    if (error) {
      return jsonResponse({ success: false, message: error }, 400);
    }

    const email = sanitizeString(body?.email, 254);
    const message = sanitizeString(body?.message, 2000);
    const name = sanitizeString(body?.name, 100);
    const projectType = sanitizeString(body?.projectType, 80);
    const budget = sanitizeString(body?.budget, 40);

    if (!email || !isValidEmail(email)) {
      return jsonResponse({ success: false, message: 'Invalid email address.' }, 400);
    }
    if (!message) {
      return jsonResponse({ success: false, message: 'Message is required.' }, 400);
    }

    const safeBody = {
      ...body,
      email,
      message,
      name,
      projectType,
      budget
    };

    const response = await fetchWithTimeout(`${API_URL}/api/contact`, {
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
        { success: true, message: 'Message received (demo mode)', demo: true },
        200
      );
    }
    return jsonResponse(
      { success: false, message: 'Service unavailable. Please try again later.' },
      502
    );
  }
}
