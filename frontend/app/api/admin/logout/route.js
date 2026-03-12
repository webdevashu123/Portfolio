import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST() {
  try {
    const response = await fetch(`${API_URL}/api/admin/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
