import {
  API_URL,
  IS_DEV,
  buildForwardHeaders,
  fetchWithTimeout,
  getClientIp,
  jsonResponse,
  rateLimit,
  sanitizeString
} from '../../../../_utils/security';

export async function DELETE(request, { params }) {
  const { type, id } = params;
  
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`admin-delete:${ip}`, 20, 60_000);
    if (!limit.ok) {
      return jsonResponse({ success: false, message: 'Too many requests.' }, 429, {
        'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000)
      });
    }

    const safeType = sanitizeString(type, 32);
    const safeId = sanitizeString(id, 64);
    if (!/^[a-zA-Z0-9_-]{1,32}$/.test(safeType) || !/^[a-zA-Z0-9_-]{1,64}$/.test(safeId)) {
      return jsonResponse({ success: false, message: 'Invalid request.' }, 400);
    }

    const response = await fetchWithTimeout(
      `${API_URL}/api/admin/submission/${safeType}/${safeId}`,
      {
        method: 'DELETE',
        headers: buildForwardHeaders(request),
        cache: 'no-store'
      }
    );

    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = { success: false, message: 'Upstream error' };
    }
    return jsonResponse(data, response.status);
  } catch (error) {
    if (IS_DEV) {
      return jsonResponse({ success: false, message: 'Connection error (demo mode)' }, 200);
    }
    return jsonResponse({ success: false, message: 'Connection error' }, 502);
  }
}
