import {
  API_URL,
  IS_DEV,
  buildForwardHeaders,
  fetchWithTimeout,
  getClientIp,
  jsonResponse,
  rateLimit
} from '../../_utils/security';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`admin-logout:${ip}`, 10, 60_000);
    if (!limit.ok) {
      return jsonResponse({ success: false, message: 'Too many requests.' }, 429, {
        'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000)
      });
    }

    const response = await fetchWithTimeout(`${API_URL}/api/admin/logout`, {
      method: 'POST',
      headers: buildForwardHeaders(request),
      cache: 'no-store'
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = { success: true };
    }

    const setCookie = response.headers.get('set-cookie');
    return jsonResponse(data, response.status, setCookie ? { 'Set-Cookie': setCookie } : {});
  } catch (error) {
    if (IS_DEV) {
      return jsonResponse({ success: true, demo: true }, 200);
    }
    return jsonResponse({ success: false }, 502);
  }
}
