import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function DELETE(request, { params }) {
  const { type, id } = params;
  
  try {
    const response = await fetch(`${API_URL}/api/admin/submission/${type}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Connection error' }, { status: 500 });
  }
}
