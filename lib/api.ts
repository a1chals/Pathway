/**
 * Frontend API client for accessing Aviato data through our API routes
 * These functions call our Next.js API routes which securely access the Aviato API
 */

import { ExitData } from '@/types';

// Types
export interface CompanySearchResult {
  count: {
    value: number;
    isEstimate: boolean;
  };
  items: Company[];
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  country?: string;
  region?: string;
  locality?: string;
  description?: string;
  foundedYear?: number;
  employeeCount?: number;
  employeeCountRange?: string;
  industryList?: string[];
  URLs?: {
    website?: string;
    linkedin?: string;
  };
  logo?: string;
}

export interface ExitsResult {
  exits: ExitData[];
  totalResults: number;
  pages: number;
  currentPage: number;
}

export interface Person {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  headline?: string;
  URLs?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface PersonSearchResult {
  count: {
    value: number;
    isEstimate: boolean;
  };
  items: Person[];
}

/**
 * Search for companies by name
 */
export async function searchCompanies(params: {
  nameQuery?: string;
  domain?: string;
  industryList?: string[];
  limit?: number;
  offset?: number;
}): Promise<CompanySearchResult> {
  const response = await fetch('/api/aviato/company/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to search companies');
  }

  return response.json();
}

/**
 * Enrich company data by ID or domain
 */
export async function enrichCompany(params: {
  id?: string;
  domain?: string;
  linkedinUrl?: string;
}): Promise<Company> {
  const queryParams = new URLSearchParams();
  if (params.id) queryParams.set('id', params.id);
  if (params.domain) queryParams.set('domain', params.domain);
  if (params.linkedinUrl) queryParams.set('linkedinUrl', params.linkedinUrl);

  const response = await fetch(`/api/aviato/company/enrich?${queryParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to enrich company');
  }

  return response.json();
}

/**
 * Get exits data for a company - former employees and where they went
 */
export async function getCompanyExits(params: {
  companyId: string;
  companyName?: string;
  perPage?: number;
  page?: number;
}): Promise<ExitsResult> {
  const queryParams = new URLSearchParams();
  queryParams.set('companyId', params.companyId);
  if (params.companyName) queryParams.set('companyName', params.companyName);
  if (params.perPage) queryParams.set('perPage', String(params.perPage));
  if (params.page) queryParams.set('page', String(params.page));

  const response = await fetch(`/api/aviato/exits?${queryParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get exits');
  }

  return response.json();
}

/**
 * Get all exits for a company by fetching all pages
 */
export async function getAllCompanyExits(params: {
  companyId: string;
  companyName?: string;
  maxPages?: number;
}): Promise<ExitData[]> {
  const allExits: ExitData[] = [];
  const maxPages = params.maxPages || 10; // Limit to prevent too many requests
  
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= maxPages) {
    const result = await getCompanyExits({
      companyId: params.companyId,
      companyName: params.companyName,
      perPage: 100,
      page,
    });

    allExits.push(...result.exits);

    if (page >= result.pages) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return allExits;
}

/**
 * Search for people
 */
export async function searchPeople(params: {
  nameQuery?: string;
  companyId?: string;
  previousCompanyId?: string;
  title?: string;
  location?: string;
  limit?: number;
  offset?: number;
}): Promise<PersonSearchResult> {
  const response = await fetch('/api/aviato/person/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to search people');
  }

  return response.json();
}

/**
 * Enrich person data
 */
export async function enrichPerson(params: {
  id?: string;
  linkedinUrl?: string;
  email?: string;
}): Promise<Person> {
  const queryParams = new URLSearchParams();
  if (params.id) queryParams.set('id', params.id);
  if (params.linkedinUrl) queryParams.set('linkedinUrl', params.linkedinUrl);
  if (params.email) queryParams.set('email', params.email);

  const response = await fetch(`/api/aviato/person/enrich?${queryParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to enrich person');
  }

  return response.json();
}

/**
 * Predefined company mappings for quick lookup
 * Maps display names to Aviato company IDs (to be populated after first search)
 */
export const COMPANY_ID_CACHE: Record<string, string> = {};

/**
 * Get company ID by name (searches and caches)
 */
export async function getCompanyId(companyName: string): Promise<string | null> {
  // Check cache first
  if (COMPANY_ID_CACHE[companyName]) {
    return COMPANY_ID_CACHE[companyName];
  }

  try {
    const result = await searchCompanies({ nameQuery: companyName, limit: 1 });
    if (result.items.length > 0) {
      COMPANY_ID_CACHE[companyName] = result.items[0].id;
      return result.items[0].id;
    }
  } catch (error) {
    console.error(`Failed to get company ID for ${companyName}:`, error);
  }

  return null;
}

