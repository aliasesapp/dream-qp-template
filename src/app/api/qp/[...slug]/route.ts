import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.quotapath.com/v1';
const API_TOKEN = process.env.QUOTAPATH_API_TOKEN; // Ensure this is set in your environment variables

// Helper function to make requests to QuotaPath API
const makeQuotaPathRequest = async (
  endpoint: string,
  method: string,
  body?: any,
  queryParams?: URLSearchParams
) => {
  const url = queryParams
    ? `${API_BASE_URL}/${endpoint}?${queryParams.toString()}`
    : `${API_BASE_URL}/${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${API_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  console.log(`Making request to QuotaPath API: ${url}`, {
    method,
    headers: options.headers,
    body: options.body,
  });

  const response = await fetch(url, options);
  const text = await response.text();

  try {
    const data = JSON.parse(text);
    if (!response.ok) {
      throw new Error(data.detail || 'QuotaPath API Error');
    }
    return data;
  } catch (error) {
    console.error('Failed to parse response from QuotaPath API:', error);
    throw new Error('Invalid response from QuotaPath API');
  }
};

// Helper to parse the slug
const parseSlug = (slug: string[]): { resource: string; action?: string; uuid?: string } => {
  const [resource, ...rest] = slug;
  let action = undefined;
  let uuid = undefined;

  if (rest.length === 1) {
    const segment = rest[0];
    if (segment === 'create' || segment === 'bulk') {
      action = segment;
    } else {
      uuid = segment;
    }
  } else if (rest.length === 2) {
    [uuid, action] = rest;
  }

  return { resource, action, uuid };
};

// Main handler for all API requests
export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  console.log('GET Request Params:', params);
  try {
    const { slug } = params;

    if (slug.length === 0) {
      return NextResponse.json({ message: 'Endpoint not found' }, { status: 404 });
    }

    const { resource, action, uuid } = parseSlug(slug);
    const { searchParams } = new URL(request.url); // Extract searchParams correctly

    let endpoint = '';
    let queryParams = new URLSearchParams();

    switch (resource) {
      case 'deal':
        if (!uuid && !action) {
          // Handle GET /api/qp/deal -> GET /deal/
          endpoint = 'deal/';
          queryParams = searchParams; // Pass through any query params
        } else if (uuid && !action) {
          // Handle GET /api/qp/deal/{uuid}/ -> GET /deal/{uuid}/
          endpoint = `deal/${uuid}/`;
        } else {
          return NextResponse.json({ message: 'Invalid GET request' }, { status: 400 });
        }
        break;

      // Add more resources here if needed

      default:
        return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    const data = await makeQuotaPathRequest(endpoint, 'GET', undefined, queryParams);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
  console.log('POST Request Params:', params);
  try {
    const { slug } = params;
    const { resource, action } = parseSlug(slug);
    const body = await request.json();

    let endpoint = '';

    switch (resource) {
      case 'deal':
        if (action === 'create') {
          // Handle POST /api/qp/deal/create -> POST /deal/
          endpoint = 'deal/';
        } else if (action === 'bulk') {
          // Handle POST /api/qp/deal/bulk -> POST /deal/bulk/
          endpoint = 'deal/bulk/';
        } else {
          return NextResponse.json({ message: 'Invalid POST request' }, { status: 400 });
        }
        break;

      // Add more resources here if needed

      default:
        return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    const data = await makeQuotaPathRequest(endpoint, 'POST', body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string[] } }) {
  console.log('PUT Request Params:', params);
  try {
    const { slug } = params;
    const { resource, action, uuid } = parseSlug(slug);
    const body = await request.json();

    let endpoint = '';

    switch (resource) {
      case 'deal':
        if (uuid && action === 'update') {
          // Handle PUT /api/qp/deal/{uuid}/update -> PUT /deal/{uuid}/
          endpoint = `deal/${uuid}/`;
        } else {
          return NextResponse.json({ message: 'Invalid PUT request' }, { status: 400 });
        }
        break;

      // Add more resources here if needed

      default:
        return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    const data = await makeQuotaPathRequest(endpoint, 'PUT', body);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { slug: string[] } }) {
  console.log('PATCH Request Params:', params);
  try {
    const { slug } = params;
    const { resource, action, uuid } = parseSlug(slug);
    const body = await request.json();

    let endpoint = '';

    switch (resource) {
      case 'deal':
        if (uuid && action === 'partial-update') {
          // Handle PATCH /api/qp/deal/{uuid}/partial-update -> PATCH /deal/{uuid}/
          endpoint = `deal/${uuid}/`;
        } else {
          return NextResponse.json({ message: 'Invalid PATCH request' }, { status: 400 });
        }
        break;

      // Add more resources here if needed

      default:
        return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    const data = await makeQuotaPathRequest(endpoint, 'PATCH', body);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('PATCH Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string[] } }) {
  console.log('DELETE Request Params:', params);
  try {
    const { slug } = params;
    const { resource, action, uuid } = parseSlug(slug);

    let endpoint = '';

    switch (resource) {
      case 'deal':
        if (uuid && !action) {
          // Handle DELETE /api/qp/deal/{uuid}/ -> DELETE /deal/{uuid}/
          endpoint = `deal/${uuid}/`;
        } else {
          return NextResponse.json({ message: 'Invalid DELETE request' }, { status: 400 });
        }
        break;

      // Add more resources here if needed

      default:
        return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    await makeQuotaPathRequest(endpoint, 'DELETE');
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 204 });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}