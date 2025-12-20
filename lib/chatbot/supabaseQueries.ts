/**
 * Supabase Query Service for Pathway
 * 
 * Executes SQL queries against our Supabase database
 * NO API calls - all data comes from our cached database!
 */

import { supabase } from '../supabase';
import { ParsedQuery } from './queryParser';

// ============================================
// RESULT TYPES
// ============================================

export interface ExitDestination {
  company: string;
  industry: string;
  count: number;
  percentage: number;
  avgYears: number;
  roles: string[];
}

export interface ExitSource {
  company: string;
  role: string;
  count: number;
  percentage: number;
  avgYears: number;
}

export interface IndustryBreakdown {
  industry: string;
  count: number;
  percentage: number;
}

export interface CompanyComparison {
  company: string;
  totalExits: number;
  industryBreakdown: IndustryBreakdown[];
  topDestinations: ExitDestination[];
}

export interface QueryResult {
  success: boolean;
  type: 'exits_from' | 'exits_to' | 'compare' | 'generic' | 'error';
  data: {
    destinations?: ExitDestination[];
    sources?: ExitSource[];
    industryBreakdown?: IndustryBreakdown[];
    comparison?: CompanyComparison[];
    totalCount: number;
    companies: string[];
  };
  summary: string;
  followUp?: string;
  error?: string;
}

// ============================================
// VALIDATION
// ============================================

/**
 * Check if a company exists in our database
 */
export async function companyExists(companyName: string): Promise<{ exists: boolean; exactName?: string }> {
  const { data, error } = await supabase
    .from('exits')
    .select('source_company_name')
    .ilike('source_company_name', `%${companyName.split(' ')[0]}%`)
    .limit(1);

  if (error || !data || data.length === 0) {
    // Also check exit destinations
    const { data: destData } = await supabase
      .from('exits')
      .select('exit_company_name')
      .ilike('exit_company_name', `%${companyName.split(' ')[0]}%`)
      .limit(1);
    
    if (destData && destData.length > 0) {
      return { exists: true, exactName: destData[0].exit_company_name };
    }
    return { exists: false };
  }

  return { exists: true, exactName: data[0].source_company_name };
}

/**
 * Get list of all companies in our database
 */
export async function getAvailableCompanies(): Promise<string[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('name')
    .order('name');

  if (error || !data) return [];
  return data.map(c => c.name);
}

// ============================================
// QUERY EXECUTORS
// ============================================

/**
 * Execute EXITS_FROM query - Where do people from X company go?
 */
export async function queryExitsFrom(
  companyName: string,
  filters?: { role?: string; industry?: string }
): Promise<QueryResult> {
  // Build the query
  let query = supabase
    .from('exits')
    .select('exit_company_name, exit_industry, exit_role, years_at_source, source_role')
    .ilike('source_company_name', `%${companyName.split(' ')[0]}%`);

  // Apply filters
  if (filters?.role) {
    query = query.ilike('source_role', `%${filters.role}%`);
  }
  if (filters?.industry) {
    query = query.ilike('exit_industry', `%${filters.industry}%`);
  }

  const { data, error } = await query;

  if (error) {
    return {
      success: false,
      type: 'error',
      data: { totalCount: 0, companies: [] },
      summary: 'Error querying database',
      error: error.message,
    };
  }

  if (!data || data.length === 0) {
    return {
      success: false,
      type: 'exits_from',
      data: { totalCount: 0, companies: [companyName] },
      summary: `I don't have exit data for ${companyName} yet. Try one of our indexed companies like Bain, McKinsey, Goldman Sachs, or Google.`,
    };
  }

  // Aggregate by destination company
  const destMap = new Map<string, { count: number; industry: string; roles: Set<string>; yearsSum: number }>();
  
  for (const exit of data) {
    const key = exit.exit_company_name;
    if (!destMap.has(key)) {
      destMap.set(key, { count: 0, industry: exit.exit_industry, roles: new Set(), yearsSum: 0 });
    }
    const entry = destMap.get(key)!;
    entry.count++;
    entry.roles.add(exit.exit_role);
    entry.yearsSum += exit.years_at_source || 0;
  }

  // Convert to sorted array
  const destinations: ExitDestination[] = Array.from(destMap.entries())
    .map(([company, stats]) => ({
      company,
      industry: stats.industry,
      count: stats.count,
      percentage: Math.round((stats.count / data.length) * 100 * 10) / 10,
      avgYears: Math.round((stats.yearsSum / stats.count) * 10) / 10,
      roles: Array.from(stats.roles).slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Industry breakdown
  const industryMap = new Map<string, number>();
  for (const exit of data) {
    industryMap.set(exit.exit_industry, (industryMap.get(exit.exit_industry) || 0) + 1);
  }
  
  const industryBreakdown: IndustryBreakdown[] = Array.from(industryMap.entries())
    .map(([industry, count]) => ({
      industry,
      count,
      percentage: Math.round((count / data.length) * 100 * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  // Generate summary
  const topIndustry = industryBreakdown[0];
  const topDest = destinations[0];
  const summary = `Based on ${data.length} exits from ${companyName}: ${topIndustry.percentage}% go to ${topIndustry.industry}. Top destination is ${topDest.company} (${topDest.count} people).`;

  return {
    success: true,
    type: 'exits_from',
    data: {
      destinations,
      industryBreakdown,
      totalCount: data.length,
      companies: [companyName],
    },
    summary,
    followUp: filters?.industry || filters?.role 
      ? undefined 
      : 'Would you like to filter by role (e.g., "consultants") or industry (e.g., "private equity")?',
  };
}

/**
 * Execute EXITS_TO query - Where do people at X company come from?
 */
export async function queryExitsTo(
  companyName: string,
  filters?: { role?: string; industry?: string }
): Promise<QueryResult> {
  let query = supabase
    .from('exits')
    .select('source_company_name, source_role, exit_role, years_at_source, exit_industry')
    .ilike('exit_company_name', `%${companyName.split(' ')[0]}%`);

  if (filters?.role) {
    query = query.ilike('exit_role', `%${filters.role}%`);
  }

  const { data, error } = await query;

  if (error) {
    return {
      success: false,
      type: 'error',
      data: { totalCount: 0, companies: [] },
      summary: 'Error querying database',
      error: error.message,
    };
  }

  if (!data || data.length === 0) {
    return {
      success: false,
      type: 'exits_to',
      data: { totalCount: 0, companies: [companyName] },
      summary: `I don't have hiring data for ${companyName} yet. This means either the company isn't in our database, or we don't have records of people joining there.`,
    };
  }

  // Aggregate by source company
  const sourceMap = new Map<string, { count: number; roles: Set<string>; yearsSum: number }>();
  
  for (const exit of data) {
    const key = exit.source_company_name;
    if (!sourceMap.has(key)) {
      sourceMap.set(key, { count: 0, roles: new Set(), yearsSum: 0 });
    }
    const entry = sourceMap.get(key)!;
    entry.count++;
    entry.roles.add(exit.source_role);
    entry.yearsSum += exit.years_at_source || 0;
  }

  const sources: ExitSource[] = Array.from(sourceMap.entries())
    .map(([company, stats]) => ({
      company,
      role: Array.from(stats.roles)[0] || 'Various',
      count: stats.count,
      percentage: Math.round((stats.count / data.length) * 100 * 10) / 10,
      avgYears: Math.round((stats.yearsSum / stats.count) * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const topSource = sources[0];
  const summary = `${companyName} hires from ${sources.length} different companies. Top source: ${topSource.company} (${topSource.count} people, ${topSource.percentage}%).`;

  return {
    success: true,
    type: 'exits_to',
    data: {
      sources,
      totalCount: data.length,
      companies: [companyName],
    },
    summary,
  };
}

/**
 * Execute COMPARE query - Compare two companies for exits
 */
export async function queryCompare(
  companies: string[],
  targetIndustry?: string
): Promise<QueryResult> {
  const comparisons: CompanyComparison[] = [];

  for (const company of companies.slice(0, 2)) {
    const result = await queryExitsFrom(company, targetIndustry ? { industry: targetIndustry } : undefined);
    
    if (result.success && result.data.destinations) {
      comparisons.push({
        company,
        totalExits: result.data.totalCount,
        industryBreakdown: result.data.industryBreakdown || [],
        topDestinations: result.data.destinations.slice(0, 5),
      });
    }
  }

  if (comparisons.length < 2) {
    return {
      success: false,
      type: 'compare',
      data: { totalCount: 0, companies },
      summary: `I need data for both companies to compare. One or both of ${companies.join(' and ')} may not be in our database.`,
    };
  }

  // Generate comparison summary
  const [c1, c2] = comparisons;
  
  let summary = `Comparing ${c1.company} vs ${c2.company}:\n`;
  
  if (targetIndustry) {
    const c1Industry = c1.industryBreakdown.find(i => i.industry.toLowerCase().includes(targetIndustry.toLowerCase()));
    const c2Industry = c2.industryBreakdown.find(i => i.industry.toLowerCase().includes(targetIndustry.toLowerCase()));
    
    const c1Pct = c1Industry?.percentage || 0;
    const c2Pct = c2Industry?.percentage || 0;
    
    const winner = c1Pct > c2Pct ? c1.company : c2.company;
    summary = `For ${targetIndustry} exits: ${c1.company} (${c1Pct}%) vs ${c2.company} (${c2Pct}%). ${winner} has better odds.`;
  } else {
    summary = `${c1.company} has ${c1.totalExits} tracked exits. ${c2.company} has ${c2.totalExits} tracked exits.`;
  }

  return {
    success: true,
    type: 'compare',
    data: {
      comparison: comparisons,
      totalCount: comparisons.reduce((sum, c) => sum + c.totalExits, 0),
      companies,
    },
    summary,
  };
}

/**
 * Execute generic query about a company
 */
export async function queryGeneric(companyName: string): Promise<QueryResult> {
  // Get both exits from AND exits to this company
  const [exitsFrom, exitsTo] = await Promise.all([
    queryExitsFrom(companyName),
    queryExitsTo(companyName),
  ]);

  if (!exitsFrom.success && !exitsTo.success) {
    return {
      success: false,
      type: 'generic',
      data: { totalCount: 0, companies: [companyName] },
      summary: `I don't have data for ${companyName}. Try companies like Bain, McKinsey, Goldman Sachs, Google, or Blackstone.`,
    };
  }

  const summary = `${companyName}: ${exitsFrom.data.totalCount} people have left, ${exitsTo.data.totalCount} people have joined from tracked companies.`;

  return {
    success: true,
    type: 'generic',
    data: {
      destinations: exitsFrom.data.destinations,
      sources: exitsTo.data.sources,
      industryBreakdown: exitsFrom.data.industryBreakdown,
      totalCount: exitsFrom.data.totalCount + exitsTo.data.totalCount,
      companies: [companyName],
    },
    summary,
    followUp: 'Would you like to see where people exit TO, or where they come FROM?',
  };
}

// ============================================
// MAIN EXECUTOR
// ============================================

/**
 * Execute a parsed query against Supabase
 */
export async function executeQuery(parsed: ParsedQuery): Promise<QueryResult> {
  const { type, companies, roles, industries } = parsed;

  // Validate we have companies to query
  if (companies.length === 0 && type !== 'CLARIFICATION') {
    return {
      success: false,
      type: 'error',
      data: { totalCount: 0, companies: [] },
      summary: "I couldn't identify a company in your question. Try asking about specific companies like 'Where do Bain consultants go?' or 'Where does Google hire from?'",
    };
  }

  // Build filters from parsed data
  const filters = {
    role: roles[0],
    industry: industries[0],
  };

  switch (type) {
    case 'EXITS_FROM':
      return queryExitsFrom(companies[0], filters);

    case 'EXITS_TO':
      return queryExitsTo(companies[0], filters);

    case 'COMPARE':
      return queryCompare(companies, industries[0]);

    case 'GENERIC':
      return queryGeneric(companies[0]);

    case 'CLARIFICATION':
    default:
      return {
        success: false,
        type: 'error',
        data: { totalCount: 0, companies: [] },
        summary: parsed.suggestedFollowUp || "Could you rephrase your question? Try: 'Where do McKinsey consultants exit to?' or 'Is Bain or BCG better for PE?'",
      };
  }
}



