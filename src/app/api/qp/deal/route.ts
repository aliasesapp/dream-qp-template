import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.quotapath.com/v1/deal/', {
      headers: {
        'Authorization': `Token ${process.env.QUOTAPATH_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching deals: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/qp/deal:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  return NextResponse.json({ message: "Deal created" }, { status: 201 });
}
