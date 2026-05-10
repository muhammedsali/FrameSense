import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const urn = searchParams.get('urn');
  const page = searchParams.get('page') || '1';

  if (!urn) {
    return NextResponse.json(
      { error: 'urn parameter is required' },
      { status: 400 }
    );
  }

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      'x-rapidapi-host': 'fresh-linkedin-scraper-api.p.rapidapi.com'
    }
  };

  const url = `https://fresh-linkedin-scraper-api.p.rapidapi.com/api/v1/user/posts?urn=${urn}&page=${page}`;

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LinkedIn user posts' },
      { status: 500 }
    );
  }
}