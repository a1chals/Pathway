/**
 * Utility functions for company comparison using database data
 */

import { supabase } from './supabase';
import { CompanyType } from '@/types';

export interface CompanySearchResult {
  name: string;
  industry?: string;
  logo?: string;
  totalExits?: number;
  avgYearsBeforeExit?: number;
}

export interface CompanyExitData {
  industry: string;
  count: number;
  avgYears: number;
}

export interface CompanyComparisonData {
  name: string;
  totalExits: number;
  avgYearsBeforeExit: number;
  industryBreakdown: CompanyExitData[];
}

/**
 * Map database industry values to CompanyType
 * Database stores: "Education / MBA", "Venture Capital", "Private Equity", "Hedge Fund",
 * "Consulting", "Investment Banking", "Big Tech", "Startup", "Corporate", "Other"
 */
export function mapIndustryToType(industry: string): CompanyType {
  if (!industry) return 'Other';
  
  const normalized = industry.trim();
  
  // Exact matches first
  if (normalized === 'Consulting') return 'Consulting';
  if (normalized === 'Corporate') return 'Corporate';
  if (normalized === 'Startup') return 'Startup';
  if (normalized === 'Other') return 'Other';
  
  // Education
  if (normalized.includes('Education') || normalized.includes('MBA')) {
    return 'Education';
  }
  
  // PE/VC - includes both Private Equity and Venture Capital
  if (normalized === 'Private Equity' || normalized === 'Venture Capital' || normalized === 'Hedge Fund') {
    return 'PE/VC';
  }
  
  // Banking
  if (normalized === 'Investment Banking') {
    return 'Banking';
  }
  
  // Tech
  if (normalized === 'Big Tech') {
    return 'Tech';
  }
  
  // Fallback: try to infer from keywords
  const lower = normalized.toLowerCase();
  if (lower.includes('tech') || lower.includes('software') || lower.includes('technology')) {
    return 'Tech';
  }
  if (lower.includes('banking') || lower.includes('investment bank') || lower.includes('finance')) {
    return 'Banking';
  }
  if (lower.includes('private equity') || lower.includes('pe') || lower.includes('vc') || lower.includes('venture capital') || lower.includes('hedge fund')) {
    return 'PE/VC';
  }
  if (lower.includes('consulting')) {
    return 'Consulting';
  }
  if (lower.includes('corporate')) {
    return 'Corporate';
  }
  if (lower.includes('startup')) {
    return 'Startup';
  }
  if (lower.includes('education') || lower.includes('university') || lower.includes('school') || lower.includes('mba')) {
    return 'Education';
  }
  
  return 'Other';
}

/**
 * Search for companies in the database by name
 */
export async function searchCompaniesFromDB(query: string, limit: number = 10): Promise<CompanySearchResult[]> {
  if (!query.trim()) return [];

  try {
    // Search in exits table for companies that have exit data
    const { data: exitsData, error: exitsError } = await supabase
      .from('exits')
      .select('source_company_name')
      .ilike('source_company_name', `%${query}%`)
      .limit(limit * 2); // Get more to dedupe

    if (exitsError) {
      console.error('Error searching exits:', exitsError);
      return [];
    }

    // Get unique company names
    const uniqueCompanies = Array.from(
      new Set(exitsData?.map(e => e.source_company_name) || [])
    ).slice(0, limit);

    // For each company, get basic stats
    const results: CompanySearchResult[] = [];
    
    for (const companyName of uniqueCompanies) {
      const { data: companyExits } = await supabase
        .from('exits')
        .select('exit_industry, years_at_source')
        .ilike('source_company_name', companyName);

      if (companyExits && companyExits.length > 0) {
        const avgYears = companyExits.reduce((sum, e) => sum + (e.years_at_source || 0), 0) / companyExits.length;
        
        // Try to get company metadata from companies table
        const { data: companyData } = await supabase
          .from('companies')
          .select('industry_list, logo_url')
          .ilike('name', `%${companyName}%`)
          .limit(1)
          .single();

        // Determine industry: use company's industry_list if available, otherwise infer from exit data
        let industry: CompanyType;
        if (companyData?.industry_list && companyData.industry_list.length > 0) {
          // Map the first industry from the list
          industry = mapIndustryToType(companyData.industry_list[0]);
        } else if (companyExits.length > 0) {
          // Use the most common exit industry
          const industryCounts = new Map<string, number>();
          companyExits.forEach(e => {
            const ind = e.exit_industry || 'Other';
            industryCounts.set(ind, (industryCounts.get(ind) || 0) + 1);
          });
          const mostCommon = Array.from(industryCounts.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Other';
          industry = mapIndustryToType(mostCommon);
        } else {
          industry = 'Other';
        }

        results.push({
          name: companyName,
          industry,
          logo: companyData?.logo_url,
          totalExits: companyExits.length,
          avgYearsBeforeExit: avgYears,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error searching companies:', error);
    return [];
  }
}

/**
 * Get exit data for a company from the database
 */
export async function getCompanyExitData(companyName: string): Promise<CompanyComparisonData | null> {
  try {
    const { data: exits, error } = await supabase
      .from('exits')
      .select('exit_industry, years_at_source')
      .ilike('source_company_name', `%${companyName}%`);

    if (error) {
      console.error('Error fetching exits:', error);
      return null;
    }

    if (!exits || exits.length === 0) {
      return null;
    }

    // Calculate average years
    const avgYears = exits.reduce((sum, e) => sum + (e.years_at_source || 0), 0) / exits.length;

    // Group by industry
    const industryMap = new Map<string, { count: number; totalYears: number }>();
    
    for (const exit of exits) {
      const industry = exit.exit_industry || 'Other';
      if (!industryMap.has(industry)) {
        industryMap.set(industry, { count: 0, totalYears: 0 });
      }
      const entry = industryMap.get(industry)!;
      entry.count++;
      entry.totalYears += exit.years_at_source || 0;
    }

    // Convert to array
    const industryBreakdown: CompanyExitData[] = Array.from(industryMap.entries())
      .map(([industry, stats]) => ({
        industry: mapIndustryToType(industry),
        count: stats.count,
        avgYears: stats.totalYears / stats.count,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      name: companyName,
      totalExits: exits.length,
      avgYearsBeforeExit: avgYears,
      industryBreakdown,
    };
  } catch (error) {
    console.error('Error getting company exit data:', error);
    return null;
  }
}

