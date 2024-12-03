import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('https://api.quotapath.com/v1/deal/bulk/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.QUOTAPATH_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create deals');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/qp/deal/bulk:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create deals' },
      { status: 500 }
    );
  }
}
