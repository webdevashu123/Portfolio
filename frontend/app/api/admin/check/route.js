import {
  API_URL,
  IS_DEV,
  buildForwardHeaders,
  fetchWithTimeout,
  getClientIp,
  jsonResponse,
  rateLimit
} from '../../_utils/security';

export async function GET(request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`admin-check:${ip}`, 60, 60_000);
    if (!limit.ok) {
      return jsonResponse({ success: false, authenticated: false }, 429, {
        'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000)
      });
    }

    const response = await fetchWithTimeout(`${API_URL}/api/admin/check`, {
      method: 'GET',
      headers: buildForwardHeaders(request),
      cache: 'no-store'
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = { success: false, authenticated: false };
    }

    return jsonResponse(data, response.status);
  } catch (error) {
    if (IS_DEV) {
      return jsonResponse({ success: false, authenticated: false, demo: true }, 200);
    }
    return jsonResponse({ success: false, authenticated: false }, 502);
  }
}
