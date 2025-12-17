import { NextRequest, NextResponse } from 'next/server';
import { aviato } from '@/lib/aviato';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') || undefined;
    const linkedinUrl = searchParams.get('linkedinUrl') || undefined;
    const email = searchParams.get('email') || undefined;

    if (!id && !linkedinUrl && !email) {
      return NextResponse.json(
        { error: 'At least one of id, linkedinUrl, or email is required' },
        { status: 400 }
      );
    }

    const result = await aviato.enrichPerson({ id, linkedinUrl, email });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Person enrich error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to enrich person' },
      { status: 500 }
    );
  }
}

