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
    const limit = rateLimit(`admin-analytics:${ip}`, 30, 60_000);
    if (!limit.ok) {
      return jsonResponse(
        {
          success: false,
          data: {
            stats: {
              totalPageViews: 0,
              totalProjectViews: 0,
              totalResumeDownloads: 0,
              uniqueVisitors: 0
            },
            pageViews: [],
            projectViews: [],
            resumeDownloads: []
          }
        },
        429,
        { 'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000) }
      );
    }

    const response = await fetchWithTimeout(`${API_URL}/api/admin/analytics`, {
      method: 'GET',
      headers: buildForwardHeaders(request),
      cache: 'no-store'
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = { success: false };
    }

    return jsonResponse(data, response.status);
  } catch (error) {
    const fallback = {
      success: false,
      data: {
        stats: {
          totalPageViews: 0,
          totalProjectViews: 0,
          totalResumeDownloads: 0,
          uniqueVisitors: 0
        },
        pageViews: [],
        projectViews: [],
        resumeDownloads: []
      }
    };
    if (IS_DEV) {
      return jsonResponse({ ...fallback, demo: true }, 200);
    }
    return jsonResponse(fallback, 502);
  }
}
