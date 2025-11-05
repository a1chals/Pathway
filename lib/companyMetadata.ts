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

export const companyMetadata: Record<string, CompanyMetadata> = {
  // Consulting Firms
  "McKinsey & Company": {
    id: "mckinsey-company",
    name: "McKinsey & Company",
    industry: "Consulting",
    employeeCount: 45000,
    founded: 1926,
    headquarters: "New York, NY, USA",
    website: "https://www.mckinsey.com",
    description: "Global management consulting firm known for strategic advisory services to Fortune 500 companies, governments, and institutions worldwide.",
    focusAreas: ["Strategy", "Operations", "Digital Transformation", "Organization", "M&A"],
    notableFacts: [
      "One of the 'Big Three' management consulting firms",
      "Alumni include CEOs of major corporations and political leaders",
      "Known for rigorous analytical approach and problem-solving methodology",
      "Highly selective hiring process with ~1% acceptance rate"
    ],
    logo: "https://logo.clearbit.com/mckinsey.com"
  },
  "Boston Consulting Group": {
    id: "boston-consulting-group",
    name: "Boston Consulting Group",
    industry: "Consulting",
    employeeCount: 32000,
    founded: 1963,
    headquarters: "Boston, MA, USA",
    website: "https://www.bcg.com",
    description: "Global management consulting firm specializing in business strategy, innovation, and digital transformation.",
    focusAreas: ["Strategy", "Digital & Technology", "Innovation", "Sustainability", "People & Organization"],
    notableFacts: [
      "One of the 'Big Three' management consulting firms",
      "Invented the BCG Growth-Share Matrix",
      "Known for innovative frameworks and thought leadership",
      "Strong culture of mentorship and professional development"
    ],
    logo: "https://logo.clearbit.com/bcg.com"
  },
  "BCG": {
    id: "boston-consulting-group",
    name: "Boston Consulting Group",
    industry: "Consulting",
    employeeCount: 32000,
    founded: 1963,
    headquarters: "Boston, MA, USA",
    website: "https://www.bcg.com",
    description: "Global management consulting firm specializing in business strategy, innovation, and digital transformation.",
    focusAreas: ["Strategy", "Digital & Technology", "Innovation", "Sustainability", "People & Organization"],
    notableFacts: [
      "One of the 'Big Three' management consulting firms",
      "Invented the BCG Growth-Share Matrix",
      "Known for innovative frameworks and thought leadership",
      "Strong culture of mentorship and professional development"
    ],
    logo: "https://logo.clearbit.com/bcg.com"
  },
  "Bain & Company": {
    id: "bain-company",
    name: "Bain & Company",
    industry: "Consulting",
    employeeCount: 14000,
    founded: 1973,
    headquarters: "Boston, MA, USA",
    website: "https://www.bain.com",
    description: "Global management consulting firm focused on helping clients achieve extraordinary results through strategy, operations, and organizational transformation.",
    focusAreas: ["Strategy", "Private Equity", "Customer Strategy", "M&A", "Performance Improvement"],
    notableFacts: [
      "One of the 'Big Three' management consulting firms",
      "Strong focus on private equity and M&A work",
      "Known for results-oriented culture and collaborative environment",
      "High employee satisfaction and retention rates"
    ],
    logo: "https://logo.clearbit.com/bain.com"
  },
  "Deloitte": {
    id: "deloitte",
    name: "Deloitte",
    industry: "Consulting",
    employeeCount: 415000,
    founded: 1845,
    headquarters: "London, UK",
    website: "https://www.deloitte.com",
    description: "Global professional services network providing audit, consulting, tax, and advisory services to clients worldwide.",
    focusAreas: ["Audit & Assurance", "Consulting", "Tax", "Risk Advisory", "Financial Advisory"],
    notableFacts: [
      "One of the 'Big Four' accounting firms",
      "Largest professional services firm by revenue",
      "Diverse service offerings beyond consulting",
      "Strong global presence with offices in 150+ countries"
    ],
    logo: "https://logo.clearbit.com/deloitte.com"
  },
  "EY": {
    id: "ernst-young",
    name: "EY",
    industry: "Consulting",
    employeeCount: 365000,
    founded: 1989,
    headquarters: "London, UK",
    website: "https://www.ey.com",
    description: "Global professional services organization providing assurance, tax, consulting, and strategy services.",
    focusAreas: ["Assurance", "Tax", "Consulting", "Strategy & Transactions", "People Advisory"],
    notableFacts: [
      "One of the 'Big Four' accounting firms",
      "Known as Ernst & Young until rebranding in 2013",
      "Strong focus on digital transformation and innovation",
      "Commitment to building a better working world"
    ],
    logo: "https://logo.clearbit.com/ey.com"
  },
  "Ernst & Young": {
    id: "ernst-young",
    name: "EY",
    industry: "Consulting",
    employeeCount: 365000,
    founded: 1989,
    headquarters: "London, UK",
    website: "https://www.ey.com",
    description: "Global professional services organization providing assurance, tax, consulting, and strategy services.",
    focusAreas: ["Assurance", "Tax", "Consulting", "Strategy & Transactions", "People Advisory"],
    notableFacts: [
      "One of the 'Big Four' accounting firms",
      "Known as Ernst & Young until rebranding in 2013",
      "Strong focus on digital transformation and innovation",
      "Commitment to building a better working world"
    ],
    logo: "https://logo.clearbit.com/ey.com"
  },
  "PwC": {
    id: "pricewaterhousecoopers",
    name: "PwC",
    industry: "Consulting",
    employeeCount: 364000,
    founded: 1849,
    headquarters: "London, UK",
    website: "https://www.pwc.com",
    description: "Global professional services network providing assurance, tax, and consulting services to help organizations build trust and create value.",
    focusAreas: ["Assurance", "Tax", "Consulting", "Deals", "Forensics"],
    notableFacts: [
      "One of the 'Big Four' accounting firms",
      "Formed from merger of Price Waterhouse and Coopers & Lybrand",
      "Strong focus on technology and digital services",
      "Extensive global network with offices worldwide"
    ],
    logo: "https://logo.clearbit.com/pwc.com"
  },
  "PricewaterhouseCoopers": {
    id: "pricewaterhousecoopers",
    name: "PwC",
    industry: "Consulting",
    employeeCount: 364000,
    founded: 1849,
    headquarters: "London, UK",
    website: "https://www.pwc.com",
    description: "Global professional services network providing assurance, tax, and consulting services to help organizations build trust and create value.",
    focusAreas: ["Assurance", "Tax", "Consulting", "Deals", "Forensics"],
    notableFacts: [
      "One of the 'Big Four' accounting firms",
      "Formed from merger of Price Waterhouse and Coopers & Lybrand",
      "Strong focus on technology and digital services",
      "Extensive global network with offices worldwide"
    ],
    logo: "https://logo.clearbit.com/pwc.com"
  },
  "KPMG": {
    id: "kpmg",
    name: "KPMG",
    industry: "Consulting",
    employeeCount: 273000,
    founded: 1987,
    headquarters: "Amstelveen, Netherlands",
    website: "https://www.kpmg.com",
    description: "Global professional services firm providing audit, tax, and advisory services to help organizations navigate complex business challenges.",
    focusAreas: ["Audit", "Tax", "Advisory", "Risk Consulting", "Deal Advisory"],
    notableFacts: [
      "One of the 'Big Four' accounting firms",
      "Formed from merger of Klynveld Main Goerdeler and Peat Marwick",
      "Strong focus on innovation and technology solutions",
      "Comprehensive service offerings across industries"
    ],
    logo: "https://logo.clearbit.com/kpmg.com"
  },
  "Accenture": {
    id: "accenture",
    name: "Accenture",
    industry: "Consulting",
    employeeCount: 738000,
    founded: 1989,
    headquarters: "Dublin, Ireland",
    website: "https://www.accenture.com",
    description: "Global professional services company providing strategy, consulting, digital, technology, and operations services.",
    focusAreas: ["Technology Consulting", "Digital Transformation", "Cloud Services", "Operations", "Strategy"],
    notableFacts: [
      "Largest consulting firm by employee count",
      "Spun off from accounting firm Arthur Andersen",
      "Heavy focus on technology and digital innovation",
      "Strong presence in IT consulting and outsourcing"
    ],
    logo: "https://logo.clearbit.com/accenture.com"
  },
  "Oliver Wyman": {
    id: "oliver-wyman",
    name: "Oliver Wyman",
    industry: "Consulting",
    employeeCount: 6000,
    founded: 1984,
    headquarters: "New York, NY, USA",
    website: "https://www.oliverwyman.com",
    description: "Global management consulting firm specializing in strategy, operations, risk management, and organizational transformation.",
    focusAreas: ["Strategy", "Operations", "Risk Management", "Financial Services", "Digital"],
    notableFacts: [
      "Part of Marsh McLennan Companies",
      "Strong focus on financial services and risk management",
      "Known for deep industry expertise",
      "Collaborative and entrepreneurial culture"
    ],
    logo: "https://logo.clearbit.com/oliverwyman.com"
  },
  "A.T. Kearney": {
    id: "at-kearney",
    name: "A.T. Kearney",
    industry: "Consulting",
    employeeCount: 3600,
    founded: 1926,
    headquarters: "Chicago, IL, USA",
    website: "https://www.atkearney.com",
    description: "Global management consulting firm providing strategic, operational, and organizational services to help clients achieve sustainable results.",
    focusAreas: ["Strategy", "Operations", "Digital Transformation", "M&A", "Procurement"],
    notableFacts: [
      "Founded by former McKinsey partner Andrew Thomas Kearney",
      "Strong focus on operations and supply chain",
      "Known for analytical rigor and client impact",
      "Independent partnership structure"
    ],
    logo: "https://logo.clearbit.com/atkearney.com"
  },
  "L.E.K. Consulting": {
    id: "lek-consulting",
    name: "L.E.K. Consulting",
    industry: "Consulting",
    employeeCount: 1600,
    founded: 1983,
    headquarters: "London, UK",
    website: "https://www.lek.com",
    description: "Global strategy consulting firm specializing in strategy, mergers and acquisitions, and organizational transformation.",
    focusAreas: ["Strategy", "M&A", "Private Equity", "Life Sciences", "Consumer"],
    notableFacts: [
      "Founded by three former Bain & Company partners",
      "Strong focus on strategy and M&A advisory",
      "Known for analytical depth and strategic insights",
      "Boutique consulting firm with global reach"
    ],
    logo: "https://logo.clearbit.com/lek.com"
  }
};

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

