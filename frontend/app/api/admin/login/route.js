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
    const limit = rateLimit(`admin-login:${ip}`, 5, 10 * 60_000);
    if (!limit.ok) {
      return jsonResponse(
        { success: false, message: 'Too many attempts. Please try again later.' },
        429,
        { 'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000) }
      );
    }

    const { data: body, error } = await readJson(request, 8_000);
    if (error) {
      return jsonResponse({ success: false, message: error }, 400);
    }

    const email = sanitizeString(body?.email, 254);
    const password = sanitizeString(body?.password, 200);
    if (!email || !isValidEmail(email) || !password) {
      return jsonResponse({ success: false, message: 'Invalid credentials.' }, 400);
    }

    const response = await fetchWithTimeout(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: buildForwardHeaders(request, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ ...body, email, password }),
      cache: 'no-store'
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = { success: false, message: 'Upstream error' };
    }

    const setCookie = response.headers.get('set-cookie');
    return jsonResponse(data, response.status, setCookie ? { 'Set-Cookie': setCookie } : {});
  } catch (error) {
    if (IS_DEV) {
      return jsonResponse({ success: false, message: 'Connection error (demo mode)' }, 200);
    }
    return jsonResponse({ success: false, message: 'Connection error' }, 502);
  }
}
