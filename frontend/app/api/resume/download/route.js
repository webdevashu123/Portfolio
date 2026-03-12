import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/resume/download`, {
      method: 'GET'
    });
    
    const data = await response.arrayBuffer();
    return new NextResponse(Buffer.from(data), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Ashutosh-Ranjan-Resume.pdf"'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Resume generation failed. Make sure backend is running on port 5000.' 
    }, { status: 500 });
  }
}
