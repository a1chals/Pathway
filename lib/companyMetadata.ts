import { CompanyType } from "@/types";

export interface CompanyMetadata {
  id: string;
  name: string;
  industry: CompanyType;
  employeeCount: number;
  founded: number;
  headquarters: string;
  website: string;
  description: string;
  focusAreas: string[];
  notableFacts: string[];
  logo?: string;
}

// Placeholder for API-fetched company metadata
export let companyMetadata: Record<string, CompanyMetadata> = {};

// Function to update company metadata from API
export function setCompanyMetadata(data: Record<string, CompanyMetadata>): void {
  companyMetadata = data;
}

// Helper function to get metadata for a company
export function getCompanyMetadata(companyName: string): CompanyMetadata | null {
  // Try exact match first
  if (companyMetadata[companyName]) {
    return companyMetadata[companyName];
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(companyMetadata)) {
    if (companyName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(companyName.toLowerCase())) {
      return value;
    }
  }
  
  return null;
}

// Helper function to get company logo URL
export function getCompanyLogo(companyName: string): string | null {
  const metadata = getCompanyMetadata(companyName);
  return metadata?.logo || null;
}
