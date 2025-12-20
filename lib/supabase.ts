/**
 * Supabase Client for Pathway
 * 
 * Used for caching Aviato API responses to save credits
 * and enable faster queries
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Caching will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our cached data
export interface CachedCompany {
  id: string;
  aviato_id: string;
  name: string;
  country?: string;
  region?: string;
  locality?: string;
  industry_list: string[];
  website?: string;
  linkedin?: string;
  employee_count?: number;
  founded_year?: number;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CachedPerson {
  id: string;
  aviato_id: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  location?: string;
  headline?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CachedExperience {
  id: string;
  person_id: string;
  company_id?: string;
  company_name: string;
  title: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  created_at: string;
}

export interface CachedExit {
  id: string;
  person_id: string;
  source_company_id: string;
  source_company_name: string;
  source_role: string;
  source_start_date?: string;
  source_end_date?: string;
  exit_company_id?: string;
  exit_company_name: string;
  exit_role: string;
  exit_start_date?: string;
  exit_industry: string;
  years_at_source: number;
  created_at: string;
}

/**
 * Cache helper functions
 */
export const cache = {
  /**
   * Check if we have cached exit data for a company
   */
  async getCompanyExits(companyName: string): Promise<CachedExit[] | null> {
    if (!supabaseUrl) return null;
    
    const { data, error } = await supabase
      .from('exits')
      .select('*')
      .ilike('source_company_name', `%${companyName}%`)
      .order('created_at', { ascending: false });
    
    if (error || !data || data.length === 0) {
      return null;
    }
    
    return data;
  },

  /**
   * Save exit data for a company
   */
  async saveCompanyExits(exits: Omit<CachedExit, 'id' | 'created_at'>[]): Promise<void> {
    if (!supabaseUrl || exits.length === 0) return;
    
    const { error } = await supabase
      .from('exits')
      .upsert(exits, { onConflict: 'person_id,source_company_name' });
    
    if (error) {
      console.error('Error saving exits to cache:', error);
    }
  },

  /**
   * Get cached company by name
   */
  async getCompany(name: string): Promise<CachedCompany | null> {
    if (!supabaseUrl) return null;
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(1)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data;
  },

  /**
   * Save company data
   */
  async saveCompany(company: Omit<CachedCompany, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    if (!supabaseUrl) return;
    
    const { error } = await supabase
      .from('companies')
      .upsert(company, { onConflict: 'aviato_id' });
    
    if (error) {
      console.error('Error saving company to cache:', error);
    }
  },

  /**
   * Check cache freshness (data older than 7 days is stale)
   */
  isFresh(createdAt: string, maxAgeDays: number = 7): boolean {
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays < maxAgeDays;
  },
};

export default supabase;



