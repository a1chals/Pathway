/**
 * Chatbot module exports
 */

export { parseQuery, type ParsedQuery } from './queryParser';
export { 
  executeQuery, 
  queryExitsFrom,
  queryExitsTo,
  queryCompare,
  queryGeneric,
  companyExists,
  getAvailableCompanies,
  type QueryResult, 
  type ExitDestination, 
  type ExitSource,
  type IndustryBreakdown,
  type CompanyComparison,
} from './supabaseQueries';

