import { NextRequest, NextResponse } from 'next/server';
import { aviato } from '@/lib/aviato';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') || undefined;
    const domain = searchParams.get('domain') || undefined;
    const linkedinUrl = searchParams.get('linkedinUrl') || undefined;

    if (!id && !domain && !linkedinUrl) {
      return NextResponse.json(
        { error: 'At least one of id, domain, or linkedinUrl is required' },
        { status: 400 }
      );
    }

    const result = await aviato.enrichCompany({ id, domain, linkedinUrl });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Company enrich error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to enrich company' },
      { status: 500 }
    );
  }
}

