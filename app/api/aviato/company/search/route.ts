import { NextRequest, NextResponse } from 'next/server';
import { aviato } from '@/lib/aviato';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameQuery, domain, industryList, limit, offset } = body;

    const result = await aviato.searchCompanies({
      nameQuery,
      domain,
      industryList,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Company search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search companies' },
      { status: 500 }
    );
  }
}






