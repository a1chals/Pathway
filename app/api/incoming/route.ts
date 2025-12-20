import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Get incoming talent pipeline for a company
 * Shows where people who joined this company came from
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyName = searchParams.get('company');

    if (!companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Query exits table where exit_company_name matches (people who joined this company)
    const { data: exits, error } = await supabase
      .from('exits')
      .select('source_company_name, source_role, exit_role, exit_industry')
      .ilike('exit_company_name', `%${companyName}%`);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    if (!exits || exits.length === 0) {
      return NextResponse.json({
        company: companyName,
        totalIncoming: 0,
        sources: [],
        industryBreakdown: [],
      });
    }

    // Aggregate by source company
    const sourceMap = new Map<string, {
      count: number;
      roles: Set<string>;
      industry: string;
    }>();

    const industryMap = new Map<string, number>();

    for (const exit of exits) {
      const sourceCompany = exit.source_company_name;
      
      // Aggregate sources
      if (!sourceMap.has(sourceCompany)) {
        sourceMap.set(sourceCompany, {
          count: 0,
          roles: new Set(),
          industry: exit.exit_industry || 'Unknown',
        });
      }
      const source = sourceMap.get(sourceCompany)!;
      source.count++;
      if (exit.source_role) source.roles.add(exit.source_role);

      // Aggregate industries
      const industry = exit.exit_industry || 'Unknown';
      industryMap.set(industry, (industryMap.get(industry) || 0) + 1);
    }

    // Convert to sorted array
    const totalIncoming = exits.length;
    const sources = Array.from(sourceMap.entries())
      .map(([company, stats]) => ({
        company,
        count: stats.count,
        percentage: Math.round((stats.count / totalIncoming) * 100 * 10) / 10,
        roles: Array.from(stats.roles).slice(0, 3),
        industry: stats.industry,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 sources

    const industryBreakdown = Array.from(industryMap.entries())
      .map(([industry, count]) => ({
        industry,
        count,
        percentage: Math.round((count / totalIncoming) * 100 * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count);

    // Get company info if available
    const { data: companyData } = await supabase
      .from('companies')
      .select('name, industry_list')
      .ilike('name', `%${companyName}%`)
      .limit(1)
      .single();

    return NextResponse.json({
      company: companyData?.name || companyName,
      companyIndustry: companyData?.industry_list?.[0] || industryBreakdown[0]?.industry || 'Unknown',
      totalIncoming,
      sources,
      industryBreakdown,
    });
  } catch (error) {
    console.error('Incoming talent API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch incoming talent' },
      { status: 500 }
    );
  }
}



