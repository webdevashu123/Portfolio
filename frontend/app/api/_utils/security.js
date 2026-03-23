import { NextResponse } from 'next/server';

export const API_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const IS_DEV = process.env.NODE_ENV !== 'production';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'same-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Cache-Control': 'no-store'
};

const rateBuckets = new Map();

export const applySecurityHeaders = (extra = {}) => ({
  ...SECURITY_HEADERS,
  ...extra
});

export const jsonResponse = (data, status = 200, extraHeaders = {}) =>
  NextResponse.json(data, { status, headers: applySecurityHeaders(extraHeaders) });

export const getClientIp = (request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
};

export const buildForwardHeaders = (request, extra = {}) => {
  const headers = { ...extra };
  const cookie = request.headers.get('cookie');
  const userAgent = request.headers.get('user-agent');
  const ip = getClientIp(request);
  if (cookie) headers.cookie = cookie;
  if (userAgent) headers['user-agent'] = userAgent;
  if (ip && ip !== 'unknown') headers['x-forwarded-for'] = ip;
  return headers;
};

export const rateLimit = (key, limit, windowMs) => {
  const now = Date.now();
  const entry = rateBuckets.get(key);
  if (!entry || now - entry.start > windowMs) {
    rateBuckets.set(key, { start: now, count: 1 });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, reset: entry.start + windowMs };
  }
  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, reset: entry.start + windowMs };
};

export const readJson = async (request, maxBytes = 16_000) => {
  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > maxBytes) {
    return { error: 'Payload too large' };
  }
  try {
    const data = await request.json();
    return { data };
  } catch (error) {
    return { error: 'Invalid JSON' };
  }
};

export const sanitizeString = (value, maxLen = 200) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
};

export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const fetchWithTimeout = async (url, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
};

