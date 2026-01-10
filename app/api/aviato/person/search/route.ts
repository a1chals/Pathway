import { NextRequest, NextResponse } from 'next/server';
import { aviato } from '@/lib/aviato';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameQuery, companyId, previousCompanyId, title, location, limit, offset } = body;

    const result = await aviato.searchPeople({
      nameQuery,
      companyId,
      previousCompanyId,
      title,
      location,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Person search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search people' },
      { status: 500 }
    );
  }
}






