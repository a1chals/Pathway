import { NextRequest, NextResponse } from 'next/server';
import { aviato } from '@/lib/aviato';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const perPage = parseInt(searchParams.get('perPage') || '100', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const currentParam = searchParams.get('current');
    const current = currentParam === 'true' ? true : currentParam === 'false' ? false : undefined;

    const result = await aviato.getCompanyEmployees(companyId, {
      perPage,
      page,
      current,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get employees' },
      { status: 500 }
    );
  }
}






