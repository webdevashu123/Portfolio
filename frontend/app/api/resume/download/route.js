import { NextResponse } from 'next/server';
import {
  API_URL,
  IS_DEV,
  applySecurityHeaders,
  buildForwardHeaders,
  fetchWithTimeout,
  getClientIp,
  jsonResponse,
  rateLimit
} from '../_utils/security';

export async function GET(request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`resume:${ip}`, 20, 60_000);
    if (!limit.ok) {
      return jsonResponse(
        { success: false, message: 'Too many requests. Please try again soon.' },
        429,
        { 'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000) }
      );
    }

    const response = await fetchWithTimeout(
      `${API_URL}/api/resume/download`,
      {
        method: 'GET',
        headers: buildForwardHeaders(request),
        cache: 'no-store'
      },
      10_000
    );

    if (!response.ok) {
      let message = 'Resume download failed.';
      try {
        const data = await response.json();
        if (data?.message) message = data.message;
      } catch (err) {
        // ignore
      }
      return jsonResponse({ success: false, message }, response.status);
    }

    const data = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/pdf';
    const setCookie = response.headers.get('set-cookie');

    const headers = applySecurityHeaders({
      'Content-Type': contentType,
      'Content-Disposition': 'attachment; filename="Ashutosh-Ranjan-Resume.pdf"',
      ...(setCookie ? { 'Set-Cookie': setCookie } : {})
    });

    return new NextResponse(Buffer.from(data), { headers });
  } catch (error) {
    if (IS_DEV) {
      return jsonResponse(
        {
          success: false,
          message: 'Resume download failed (demo mode). Backend may be offline.'
        },
        200
      );
    }
    return jsonResponse(
      { success: false, message: 'Resume download failed. Please try again later.' },
      502
    );
  }
}

