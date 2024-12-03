import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const response = await fetch(`https://api.quotapath.com/v1/deal/${id}/`, {
      headers: {
        'Authorization': `Token ${process.env.QUOTAPATH_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching deal: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/qp/deal/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 });
  }
}