import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/admin/analytics`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ 
      success: true, 
      data: { 
        stats: { totalPageViews: 0, totalProjectViews: 0, totalResumeDownloads: 0, uniqueVisitors: 0 },
        pageViews: [],
        projectViews: [],
        resumeDownloads: []
      } 
    }, { status: 200 });
  }
}
