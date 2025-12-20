import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { TalentGraphData, TalentGraphNode, TalentGraphLink, PersonTransition, CompanyStats } from '@/types/talentGraph';
import { CompanyType } from '@/types';
import { mapIndustryToType } from '../compareUtils';

/**
 * Fetch aggregated company nodes from database
 * @deprecated - Use fetchCompanyNeighbors instead for incremental loading
 */
async function fetchCompanyNodes_DEPRECATED(): Promise<TalentGraphNode[]> {
  try {
    console.log('Fetching company nodes...');
    
    // Get all unique companies from exits table
    const { data: exitsData, error: exitsError } = await supabase
      .from('exits')
      .select('source_company_name, exit_company_name, exit_industry, years_at_source')
      .limit(10000); // Limit to prevent huge queries

    if (exitsError) {
      console.error('Error fetching exits:', exitsError);
      return [];
    }

    if (!exitsData || exitsData.length === 0) {
      console.log('No exits data found');
      return [];
    }

    console.log(`Found ${exitsData.length} exits`);

    // Get all unique company names
    const companyNames = new Set<string>();
    exitsData.forEach(exit => {
      if (exit.source_company_name) companyNames.add(exit.source_company_name);
      if (exit.exit_company_name) companyNames.add(exit.exit_company_name);
    });

    console.log(`Found ${companyNames.size} unique companies`);

    // Fetch all company metadata in one query (much faster!)
    const companyNamesArray = Array.from(companyNames);
    const { data: allCompaniesData } = await supabase
      .from('companies')
      .select('name, industry_list, logo_url, employee_count');

    // Create a map for quick lookup - use exact name matching
    const companyMap = new Map<string, any>();
    if (allCompaniesData) {
      allCompaniesData.forEach(company => {
        // Store by exact name (case-insensitive)
        companyMap.set(company.name.toLowerCase().trim(), company);
      });
    }

    // Build nodes
    const nodes: TalentGraphNode[] = [];
    
    for (const companyName of companyNamesArray) {
      // Calculate stats from exits
      const outgoingExits = exitsData.filter(e => e.source_company_name === companyName) || [];
      const incomingExits = exitsData.filter(e => e.exit_company_name === companyName) || [];
      
      const totalExits = outgoingExits.length;
      const incoming = incomingExits.length;
      const outgoing = outgoingExits.length;

      // Get company metadata from map (try exact match)
      const companyData = companyMap.get(companyName.toLowerCase().trim());

      // Determine industry
      let industry: CompanyType = 'Other';
      if (companyData?.industry_list && companyData.industry_list.length > 0) {
        industry = mapIndustryToType(companyData.industry_list[0]);
      } else if (outgoingExits.length > 0) {
        // Use most common exit industry
        const industryCounts = new Map<string, number>();
        outgoingExits.forEach(e => {
          const ind = e.exit_industry || 'Other';
          industryCounts.set(ind, (industryCounts.get(ind) || 0) + 1);
        });
        const mostCommon = Array.from(industryCounts.entries())
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Other';
        industry = mapIndustryToType(mostCommon);
      }

      nodes.push({
        id: companyName,
        name: companyName,
        industry,
        employeeCount: companyData?.employee_count,
        totalExits,
        incoming,
        outgoing,
        logo: companyData?.logo_url,
      });
    }

    console.log(`Created ${nodes.length} nodes`);
    return nodes;
  } catch (error) {
    console.error('Error fetching company nodes:', error);
    return [];
  }
}

/**
 * Fetch aggregated links (transitions) between companies
 * @deprecated - Use fetchCompanyNeighbors instead for incremental loading
 */
async function fetchCompanyLinks_DEPRECATED(): Promise<TalentGraphLink[]> {
  try {
    console.log('Fetching company links...');
    
    const { data: exitsData, error } = await supabase
      .from('exits')
      .select('source_company_name, exit_company_name, years_at_source')
      .limit(10000); // Limit to prevent huge queries

    if (error) {
      console.error('Error fetching links:', error);
      return [];
    }

    if (!exitsData || exitsData.length === 0) {
      console.log('No exits data for links');
      return [];
    }

    // Aggregate transitions
    const linkMap = new Map<string, { count: number; totalYears: number }>();
    
    exitsData.forEach(exit => {
      if (exit.source_company_name && exit.exit_company_name) {
        const key = `${exit.source_company_name}->${exit.exit_company_name}`;
        if (!linkMap.has(key)) {
          linkMap.set(key, { count: 0, totalYears: 0 });
        }
        const link = linkMap.get(key)!;
        link.count++;
        link.totalYears += exit.years_at_source || 0;
      }
    });

    // Convert to links array
    const links: TalentGraphLink[] = Array.from(linkMap.entries())
      .map(([key, stats]) => {
        const [source, target] = key.split('->');
        return {
          source,
          target,
          count: stats.count,
          avgYears: stats.totalYears / stats.count,
        };
      })
      .filter(link => link.count > 0 && link.source && link.target);

    console.log(`Created ${links.length} links`);
    return links;
  } catch (error) {
    console.error('Error fetching company links:', error);
    return [];
  }
}

/**
 * Fetch specific people who moved between two companies
 */
export async function fetchPersonTransitions(
  company1: string,
  company2: string
): Promise<PersonTransition[]> {
  try {
    // Get transitions from company1 to company2
    const { data: exits1to2, error: error1 } = await supabase
      .from('exits')
      .select('person_id, source_role, exit_role, years_at_source, exit_start_date')
      .ilike('source_company_name', `%${company1}%`)
      .ilike('exit_company_name', `%${company2}%`);

    // Get transitions from company2 to company1
    const { data: exits2to1, error: error2 } = await supabase
      .from('exits')
      .select('person_id, source_role, exit_role, years_at_source, exit_start_date')
      .ilike('source_company_name', `%${company2}%`)
      .ilike('exit_company_name', `%${company1}%`);

    if (error1 || error2) {
      console.error('Error fetching person transitions:', error1 || error2);
      return [];
    }

    // Get person IDs
    const personIds = new Set<string>();
    [...(exits1to2 || []), ...(exits2to1 || [])].forEach(exit => {
      personIds.add(exit.person_id);
    });

    // Fetch person details
    const { data: persons, error: personsError } = await supabase
      .from('persons')
      .select('aviato_id, full_name, headline, linkedin_url')
      .in('aviato_id', Array.from(personIds));

    if (personsError) {
      console.error('Error fetching persons:', personsError);
      return [];
    }

    // Map person data
    const personMap = new Map(
      persons?.map(p => [p.aviato_id, p]) || []
    );

    // Build transitions array
    const transitions: PersonTransition[] = [];

    // Add transitions from company1 to company2
    exits1to2?.forEach(exit => {
      const person = personMap.get(exit.person_id);
      if (person) {
        transitions.push({
          personId: exit.person_id,
          fullName: person.full_name,
          headline: person.headline || undefined,
          linkedinUrl: person.linkedin_url || undefined,
          sourceRole: exit.source_role,
          exitRole: exit.exit_role,
          yearsAtSource: exit.years_at_source || 0,
          exitDate: exit.exit_start_date || undefined,
        });
      }
    });

    // Add transitions from company2 to company1
    exits2to1?.forEach(exit => {
      const person = personMap.get(exit.person_id);
      if (person) {
        transitions.push({
          personId: exit.person_id,
          fullName: person.full_name,
          headline: person.headline || undefined,
          linkedinUrl: person.linkedin_url || undefined,
          sourceRole: exit.source_role,
          exitRole: exit.exit_role,
          yearsAtSource: exit.years_at_source || 0,
          exitDate: exit.exit_start_date || undefined,
        });
      }
    });

    return transitions;
  } catch (error) {
    console.error('Error fetching person transitions:', error);
    return [];
  }
}

/**
 * Fetch company stats for sidebar
 */
export async function fetchCompanyStats(companyName: string): Promise<CompanyStats | null> {
  try {
    const { data: exits, error } = await supabase
      .from('exits')
      .select('exit_company_name, exit_industry, years_at_source, source_company_name')
      .or(`source_company_name.ilike.%${companyName}%,exit_company_name.ilike.%${companyName}%`);

    if (error || !exits || exits.length === 0) {
      return null;
    }

    // Get company metadata
    const { data: companyData } = await supabase
      .from('companies')
      .select('industry_list')
      .ilike('name', `%${companyName}%`)
      .limit(1)
      .single();

    const outgoingExits = exits.filter(e => e.source_company_name === companyName);
    const incomingExits = exits.filter(e => e.exit_company_name === companyName);

    const totalExits = outgoingExits.length;
    const incoming = incomingExits.length;
    const outgoing = outgoingExits.length;

    const avgYears = outgoingExits.length > 0
      ? outgoingExits.reduce((sum, e) => sum + (e.years_at_source || 0), 0) / outgoingExits.length
      : 0;

    // Top destinations
    const destMap = new Map<string, number>();
    outgoingExits.forEach(e => {
      destMap.set(e.exit_company_name, (destMap.get(e.exit_company_name) || 0) + 1);
    });
    const topDestinations = Array.from(destMap.entries())
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top sources
    const sourceMap = new Map<string, number>();
    incomingExits.forEach(e => {
      sourceMap.set(e.source_company_name, (sourceMap.get(e.source_company_name) || 0) + 1);
    });
    const topSources = Array.from(sourceMap.entries())
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Determine industry
    let industry: CompanyType = 'Other';
    if (companyData?.industry_list && companyData.industry_list.length > 0) {
      industry = mapIndustryToType(companyData.industry_list[0]);
    }

    return {
      name: companyName,
      industry,
      incoming,
      outgoing,
      totalExits,
      avgYearsBeforeExit: avgYears,
      topDestinations,
      topSources,
    };
  } catch (error) {
    console.error('Error fetching company stats:', error);
    return null;
  }
}

/**
 * Fetch a company and its top neighbors (connections)
 */
export async function fetchCompanyNeighbors(
  companyName: string,
  limit: number = 10
): Promise<{ node: TalentGraphNode; links: TalentGraphLink[]; neighborNodes: TalentGraphNode[] } | null> {
  try {
    console.log(`Fetching neighbors for: ${companyName}`);
    
    // Get exits from this company
    const { data: outgoingExits, error: outgoingError } = await supabase
      .from('exits')
      .select('exit_company_name, exit_industry, years_at_source')
      .ilike('source_company_name', `%${companyName}%`)
      .limit(1000);

    // Get exits to this company
    const { data: incomingExits, error: incomingError } = await supabase
      .from('exits')
      .select('source_company_name, exit_industry, years_at_source')
      .ilike('exit_company_name', `%${companyName}%`)
      .limit(1000);

    if (outgoingError || incomingError) {
      console.error('Error fetching exits:', outgoingError || incomingError);
      return null;
    }

    if ((!outgoingExits || outgoingExits.length === 0) && (!incomingExits || incomingExits.length === 0)) {
      console.log(`No exits found for ${companyName}`);
      return null;
    }

    // Get company metadata
    const { data: companyData } = await supabase
      .from('companies')
      .select('industry_list, logo_url, employee_count')
      .ilike('name', `%${companyName}%`)
      .limit(1)
      .single();

    // Calculate stats
    const totalExits = (outgoingExits?.length || 0);
    const incoming = (incomingExits?.length || 0);
    const outgoing = totalExits;

    // Determine industry
    let industry: CompanyType = 'Other';
    if (companyData?.industry_list && companyData.industry_list.length > 0) {
      industry = mapIndustryToType(companyData.industry_list[0]);
    } else if (outgoingExits && outgoingExits.length > 0) {
      const industryCounts = new Map<string, number>();
      outgoingExits.forEach(e => {
        const ind = e.exit_industry || 'Other';
        industryCounts.set(ind, (industryCounts.get(ind) || 0) + 1);
      });
      const mostCommon = Array.from(industryCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Other';
      industry = mapIndustryToType(mostCommon);
    }

    // Create main node
    const node: TalentGraphNode = {
      id: companyName,
      name: companyName,
      industry,
      employeeCount: companyData?.employee_count,
      totalExits,
      incoming,
      outgoing,
      logo: companyData?.logo_url,
    };

    // Aggregate top destinations (outgoing)
    const destMap = new Map<string, { count: number; totalYears: number }>();
    outgoingExits?.forEach(exit => {
      const dest = exit.exit_company_name;
      if (!destMap.has(dest)) {
        destMap.set(dest, { count: 0, totalYears: 0 });
      }
      const entry = destMap.get(dest)!;
      entry.count++;
      entry.totalYears += exit.years_at_source || 0;
    });

    // Aggregate top sources (incoming)
    const sourceMap = new Map<string, { count: number; totalYears: number }>();
    incomingExits?.forEach(exit => {
      const source = exit.source_company_name;
      if (!sourceMap.has(source)) {
        sourceMap.set(source, { count: 0, totalYears: 0 });
      }
      const entry = sourceMap.get(source)!;
      entry.count++;
      entry.totalYears += exit.years_at_source || 0;
    });

    // Get top connections (combine incoming and outgoing, take top N)
    const allConnections = new Map<string, { count: number; totalYears: number; direction: 'in' | 'out' }>();
    
    destMap.forEach((stats, company) => {
      allConnections.set(company, { ...stats, direction: 'out' });
    });
    
    sourceMap.forEach((stats, company) => {
      const existing = allConnections.get(company);
      if (existing) {
        existing.count += stats.count;
        existing.totalYears += stats.totalYears;
      } else {
        allConnections.set(company, { ...stats, direction: 'in' });
      }
    });

    // Sort by count and take top N
    const topConnections = Array.from(allConnections.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit);

    // Create links
    const links: TalentGraphLink[] = topConnections.map(([company, stats]) => ({
      source: stats.direction === 'out' ? companyName : company,
      target: stats.direction === 'out' ? company : companyName,
      count: stats.count,
      avgYears: stats.totalYears / stats.count,
    }));

    // Fetch metadata for neighbor companies
    const neighborNames = topConnections.map(([name]) => name);
    const { data: neighborCompanies } = await supabase
      .from('companies')
      .select('name, industry_list, logo_url, employee_count')
      .in('name', neighborNames);

    const neighborMap = new Map<string, any>();
    neighborCompanies?.forEach(c => {
      neighborMap.set(c.name.toLowerCase().trim(), c);
    });

    // Create neighbor nodes
    const neighborNodes: TalentGraphNode[] = topConnections.map(([name, stats]) => {
      const neighborData = neighborMap.get(name.toLowerCase().trim());
      
      // Determine industry for neighbor
      let neighborIndustry: CompanyType = 'Other';
      if (neighborData?.industry_list && neighborData.industry_list.length > 0) {
        neighborIndustry = mapIndustryToType(neighborData.industry_list[0]);
      }

      return {
        id: name,
        name: name,
        industry: neighborIndustry,
        employeeCount: neighborData?.employee_count,
        totalExits: stats.count,
        incoming: stats.direction === 'in' ? stats.count : 0,
        outgoing: stats.direction === 'out' ? stats.count : 0,
        logo: neighborData?.logo_url,
      };
    });

    console.log(`Found ${links.length} links and ${neighborNodes.length} neighbors for ${companyName}`);
    return { node, links, neighborNodes };
  } catch (error) {
    console.error('Error fetching company neighbors:', error);
    return null;
  }
}

/**
 * Fetch top super nodes (entry points)
 */
export async function fetchTopSuperNodes(limit: number = 5): Promise<TalentGraphNode[]> {
  try {
    // Get companies with most exits
    const { data: exitsData } = await supabase
      .from('exits')
      .select('source_company_name')
      .limit(10000);

    if (!exitsData) return [];

    // Count exits per company
    const exitCounts = new Map<string, number>();
    exitsData.forEach(exit => {
      const name = exit.source_company_name;
      exitCounts.set(name, (exitCounts.get(name) || 0) + 1);
    });

    // Get top companies
    const topCompanies = Array.from(exitCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name]) => name);

    // Fetch their data - create nodes directly without fetching neighbors
    const nodes: TalentGraphNode[] = [];
    for (const name of topCompanies) {
      // Get basic stats for the node
      const { data: exitsData } = await supabase
        .from('exits')
        .select('exit_industry, years_at_source')
        .ilike('source_company_name', `%${name}%`)
        .limit(100);

      const { data: companyData } = await supabase
        .from('companies')
        .select('industry_list, logo_url, employee_count')
        .ilike('name', `%${name}%`)
        .limit(1)
        .single();

      const totalExits = exitsData?.length || 0;
      let industry: CompanyType = 'Other';
      
      if (companyData?.industry_list && companyData.industry_list.length > 0) {
        industry = mapIndustryToType(companyData.industry_list[0]);
      } else if (exitsData && exitsData.length > 0) {
        const industryCounts = new Map<string, number>();
        exitsData.forEach(e => {
          const ind = e.exit_industry || 'Other';
          industryCounts.set(ind, (industryCounts.get(ind) || 0) + 1);
        });
        const mostCommon = Array.from(industryCounts.entries())
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Other';
        industry = mapIndustryToType(mostCommon);
      }

      nodes.push({
        id: name,
        name: name,
        industry,
        employeeCount: companyData?.employee_count,
        totalExits,
        incoming: 0, // Will be calculated when expanded
        outgoing: totalExits,
        logo: companyData?.logo_url,
      });
    }

    return nodes;
  } catch (error) {
    console.error('Error fetching super nodes:', error);
    return [];
  }
}

/**
 * Hook to manage talent graph data (now for incremental loading)
 */
export function useTalentGraphData() {
  const [data, setData] = useState<TalentGraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add node and links to graph
  const addToGraph = useCallback((newNode: TalentGraphNode, newLinks: TalentGraphLink[], newNeighborNodes: TalentGraphNode[] = []) => {
    setData(prev => {
      const existingNodeIds = new Set(prev.nodes.map(n => n.id));
      
      // Add main node if not exists
      const nodesToAdd = [newNode, ...newNeighborNodes].filter(n => !existingNodeIds.has(n.id));
      
      // Add links, avoiding duplicates
      const existingLinkKeys = new Set(
        prev.links.map(l => `${l.source}->${l.target}`)
      );
      const linksToAdd = newLinks.filter(
        l => !existingLinkKeys.has(`${l.source}->${l.target}`)
      );

      return {
        nodes: [...prev.nodes, ...nodesToAdd],
        links: [...prev.links, ...linksToAdd],
      };
    });
  }, []);

  // Clear graph
  const clearGraph = useCallback(() => {
    setData({ nodes: [], links: [] });
  }, []);

  return { data, loading, error, setLoading, setError, addToGraph, clearGraph };
}

