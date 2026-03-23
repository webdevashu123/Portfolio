import {
  API_URL,
  IS_DEV,
  buildForwardHeaders,
  fetchWithTimeout,
  getClientIp,
  jsonResponse,
  rateLimit,
  readJson,
  sanitizeString
} from '../../_utils/security';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`analytics:${ip}`, 30, 60_000);
    if (!limit.ok) {
      return jsonResponse({ success: false, message: 'Too many requests.' }, 429, {
        'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000)
      });
    }

    const { data: body, error } = await readJson(request, 10_000);
    if (error) {
      return jsonResponse({ success: false, message: error }, 400);
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return jsonResponse({ success: false, message: 'Invalid payload.' }, 400);
    }

    const safeBody = {
      ...body,
      event: sanitizeString(body.event, 80),
      page: sanitizeString(body.page, 200),
      path: sanitizeString(body.path, 200),
      referrer: sanitizeString(body.referrer, 200),
      title: sanitizeString(body.title, 120)
    };

    const response = await fetchWithTimeout(`${API_URL}/api/analytics/track`, {
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
      return jsonResponse({ success: true, demo: true }, 200);
    }
    return jsonResponse({ success: false }, 502);
  }
}
