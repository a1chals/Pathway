/**
 * Aviato API Client
 * Documentation: https://docs.data.aviato.co/
 * 
 * This client provides access to the Aviato API for:
 * - Person search and enrichment (career history, experiences)
 * - Company search and enrichment (metadata, employees)
 * - Exit/transition data analysis
 */

const API_BASE_URL = process.env.AVIATO_API_BASE_URL || 'https://data.api.aviato.co';
const API_KEY = process.env.AVIATO_API_KEY;

// Types for Aviato API responses
export interface AviatoPosition {
  startDate: string | null;
  endDate: string | null;
  title: string;
  description?: string;
  companyID?: string;
  companyName?: string;
}

export interface AviatoPerson {
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
  experienceList?: AviatoExperience[];
  educationList?: AviatoEducation[];
}

export interface AviatoExperience {
  companyID: string;
  companyName: string;
  positionList: AviatoPosition[];
  startDate?: string;
  endDate?: string;
}

export interface AviatoEducation {
  schoolName: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

export interface AviatoCompany {
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

export interface AviatoEmployee {
  person: AviatoPerson;
  positionList: AviatoPosition[];
  companyID: string;
  companyName: string;
  startDate?: string;
  endDate?: string;
}

export interface CompanySearchResult {
  count: {
    value: number;
    isEstimate: boolean;
  };
  items: AviatoCompany[];
}

export interface PersonSearchResult {
  count: {
    value: number;
    isEstimate: boolean;
  };
  items: AviatoPerson[];
}

export interface EmployeesResult {
  employees: AviatoEmployee[];
  pages: number;
  totalResults: number;
}

// API Client class
class AviatoClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    if (!API_KEY) {
      console.warn('AVIATO_API_KEY is not set. API calls will fail.');
    }
    this.apiKey = API_KEY || '';
    this.baseUrl = API_BASE_URL;
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private async fetchWithError<T>(url: string, options?: RequestInit): Promise<T> {
    console.log('[Aviato API] Calling:', url);
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Aviato API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('[Aviato API] Response keys:', Object.keys(data));
    console.log('[Aviato API] Response sample:', JSON.stringify(data).slice(0, 500));
    return data;
  }

  /**
   * Search for companies using Aviato DSL
   * @see https://docs.data.aviato.co/api-reference/company/search
   */
  async searchCompanies(params: {
    nameQuery?: string;
    domain?: string;
    industryList?: string[];
    limit?: number;
    offset?: number;
  }): Promise<CompanySearchResult> {
    const dsl: Record<string, unknown> = {
      limit: params.limit || 10,
      offset: params.offset || 0,
    };

    if (params.nameQuery) {
      dsl.nameQuery = params.nameQuery;
    }

    if (params.domain) {
      dsl.filters = {
        ...dsl.filters as object,
        domain: { operation: 'eq', value: params.domain },
      };
    }

    if (params.industryList && params.industryList.length > 0) {
      dsl.filters = {
        ...dsl.filters as object,
        industryList: { operation: 'in', value: params.industryList },
      };
    }

    return this.fetchWithError<CompanySearchResult>(
      `${this.baseUrl}/company/search`,
      {
        method: 'POST',
        body: JSON.stringify({ dsl }),
      }
    );
  }

  /**
   * Enrich company data by ID or domain
   * @see https://docs.data.aviato.co/api-reference/company/enrich
   */
  async enrichCompany(params: {
    id?: string;
    domain?: string;
    linkedinUrl?: string;
  }): Promise<AviatoCompany> {
    const queryParams = new URLSearchParams();
    if (params.id) queryParams.set('id', params.id);
    if (params.domain) queryParams.set('domain', params.domain);
    if (params.linkedinUrl) queryParams.set('linkedinUrl', params.linkedinUrl);

    return this.fetchWithError<AviatoCompany>(
      `${this.baseUrl}/company/enrich?${queryParams.toString()}`
    );
  }

  /**
   * Get employees for a company (current and former)
   * @see https://docs.data.aviato.co/api-reference/company/get-employees
   */
  async getCompanyEmployees(
    companyId: string,
    params?: {
      perPage?: number;
      page?: number;
      current?: boolean;
    }
  ): Promise<EmployeesResult> {
    const queryParams = new URLSearchParams();
    queryParams.set('id', companyId); // Company ID goes as query param
    queryParams.set('perPage', String(params?.perPage || 100));
    queryParams.set('page', String(params?.page || 1));
    if (params?.current !== undefined) {
      queryParams.set('current', String(params.current));
    }

    return this.fetchWithError<EmployeesResult>(
      `${this.baseUrl}/company/employees?${queryParams.toString()}`
    );
  }

  /**
   * Search for people using Aviato DSL
   * @see https://docs.data.aviato.co/api-reference/person/search
   */
  async searchPeople(params: {
    nameQuery?: string;
    companyId?: string;
    previousCompanyId?: string;
    title?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }): Promise<PersonSearchResult> {
    const dsl: Record<string, unknown> = {
      limit: params.limit || 50,
      offset: params.offset || 0,
    };

    if (params.nameQuery) {
      dsl.nameQuery = params.nameQuery;
    }

    const filters: Record<string, unknown> = {};

    if (params.companyId) {
      filters['experiences.companyID'] = { operation: 'eq', value: params.companyId };
    }

    if (params.previousCompanyId) {
      filters['previousExperiences.companyID'] = { operation: 'eq', value: params.previousCompanyId };
    }

    if (params.title) {
      filters['experiences.title'] = { operation: 'contains', value: params.title };
    }

    if (params.location) {
      filters['location'] = { operation: 'contains', value: params.location };
    }

    if (Object.keys(filters).length > 0) {
      dsl.filters = filters;
    }

    return this.fetchWithError<PersonSearchResult>(
      `${this.baseUrl}/person/search`,
      {
        method: 'POST',
        body: JSON.stringify({ dsl }),
      }
    );
  }

  /**
   * Enrich person data by ID
   * @see https://docs.data.aviato.co/api-reference/person/enrich
   */
  async enrichPerson(params: {
    id?: string;
    linkedinUrl?: string;
    email?: string;
  }): Promise<AviatoPerson> {
    const queryParams = new URLSearchParams();
    if (params.id) queryParams.set('id', params.id);
    if (params.linkedinUrl) queryParams.set('linkedinUrl', params.linkedinUrl);
    if (params.email) queryParams.set('email', params.email);

    return this.fetchWithError<AviatoPerson>(
      `${this.baseUrl}/person/enrich?${queryParams.toString()}`
    );
  }
}

// Export singleton instance
export const aviato = new AviatoClient();

// Export types for use in other files
export type { AviatoClient };

