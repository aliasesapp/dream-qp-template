import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.quotapath.com/v1/plan/', {
      headers: {
        'Authorization': `Token ${process.env.QUOTAPATH_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching plans: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/qp/plan:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
