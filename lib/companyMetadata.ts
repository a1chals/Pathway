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
  },
  "LEK Consulting": {
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
  },
  
  // Banking
  "Goldman Sachs": {
    id: "goldman-sachs",
    name: "Goldman Sachs",
    industry: "Banking",
    employeeCount: 49000,
    founded: 1869,
    headquarters: "New York, NY, USA",
    website: "https://www.goldmansachs.com",
    description: "Leading global investment banking, securities, and investment management firm serving corporations, financial institutions, governments, and individuals.",
    focusAreas: ["Investment Banking", "Asset Management", "Securities Trading", "Wealth Management", "Consumer Banking"],
    notableFacts: [
      "One of the most prestigious investment banks",
      "Known for rigorous hiring and high compensation",
      "Strong alumni network in finance and business",
      "Pioneered many financial innovations"
    ],
    logo: "https://logo.clearbit.com/goldmansachs.com"
  },
  "JPMorgan Chase": {
    id: "jpmorgan-chase",
    name: "JPMorgan Chase",
    industry: "Banking",
    employeeCount: 293000,
    founded: 1799,
    headquarters: "New York, NY, USA",
    website: "https://www.jpmorganchase.com",
    description: "Largest bank in the United States providing investment banking, commercial banking, asset management, and consumer banking services.",
    focusAreas: ["Investment Banking", "Commercial Banking", "Asset Management", "Consumer Banking", "Trading"],
    notableFacts: [
      "Largest bank in the U.S. by assets",
      "Formed through merger of J.P. Morgan and Chase Manhattan",
      "Diverse business lines across finance",
      "Strong presence in investment banking and trading"
    ],
    logo: "https://logo.clearbit.com/jpmorganchase.com"
  },
  "JPMorgan": {
    id: "jpmorgan-chase",
    name: "JPMorgan Chase",
    industry: "Banking",
    employeeCount: 293000,
    founded: 1799,
    headquarters: "New York, NY, USA",
    website: "https://www.jpmorganchase.com",
    description: "Largest bank in the United States providing investment banking, commercial banking, asset management, and consumer banking services.",
    focusAreas: ["Investment Banking", "Commercial Banking", "Asset Management", "Consumer Banking", "Trading"],
    notableFacts: [
      "Largest bank in the U.S. by assets",
      "Formed through merger of J.P. Morgan and Chase Manhattan",
      "Diverse business lines across finance",
      "Strong presence in investment banking and trading"
    ],
    logo: "https://logo.clearbit.com/jpmorganchase.com"
  },
  "Morgan Stanley": {
    id: "morgan-stanley",
    name: "Morgan Stanley",
    industry: "Banking",
    employeeCount: 82000,
    founded: 1935,
    headquarters: "New York, NY, USA",
    website: "https://www.morganstanley.com",
    description: "Global financial services firm providing investment banking, securities, wealth management, and investment management services.",
    focusAreas: ["Investment Banking", "Wealth Management", "Institutional Securities", "Investment Management", "Trading"],
    notableFacts: [
      "One of the top investment banks globally",
      "Strong in wealth management and institutional services",
      "Known for client-focused culture",
      "Significant presence in M&A and capital markets"
    ],
    logo: "https://logo.clearbit.com/morganstanley.com"
  },
  "Bank of America": {
    id: "bank-of-america",
    name: "Bank of America",
    industry: "Banking",
    employeeCount: 213000,
    founded: 1904,
    headquarters: "Charlotte, NC, USA",
    website: "https://www.bankofamerica.com",
    description: "One of the largest financial institutions in the United States offering banking, investment, and financial services.",
    focusAreas: ["Consumer Banking", "Commercial Banking", "Investment Banking", "Wealth Management", "Trading"],
    notableFacts: [
      "Second-largest bank in the U.S. by assets",
      "Acquired Merrill Lynch in 2008",
      "Strong retail banking presence",
      "Diverse financial services offerings"
    ],
    logo: "https://logo.clearbit.com/bankofamerica.com"
  },
  "Citigroup": {
    id: "citigroup",
    name: "Citigroup",
    industry: "Banking",
    employeeCount: 240000,
    founded: 1812,
    headquarters: "New York, NY, USA",
    website: "https://www.citigroup.com",
    description: "Global financial services corporation providing consumer banking, investment banking, and wealth management services.",
    focusAreas: ["Consumer Banking", "Investment Banking", "Wealth Management", "Trading", "Global Markets"],
    notableFacts: [
      "One of the largest banks globally",
      "Strong international presence",
      "Diverse financial services portfolio",
      "Known as Citi in consumer markets"
    ],
    logo: "https://logo.clearbit.com/citigroup.com"
  },
  "Citi": {
    id: "citigroup",
    name: "Citigroup",
    industry: "Banking",
    employeeCount: 240000,
    founded: 1812,
    headquarters: "New York, NY, USA",
    website: "https://www.citigroup.com",
    description: "Global financial services corporation providing consumer banking, investment banking, and wealth management services.",
    focusAreas: ["Consumer Banking", "Investment Banking", "Wealth Management", "Trading", "Global Markets"],
    notableFacts: [
      "One of the largest banks globally",
      "Strong international presence",
      "Diverse financial services portfolio",
      "Known as Citi in consumer markets"
    ],
    logo: "https://logo.clearbit.com/citigroup.com"
  },
  "Deutsche Bank": {
    id: "deutsche-bank",
    name: "Deutsche Bank",
    industry: "Banking",
    employeeCount: 84000,
    founded: 1870,
    headquarters: "Frankfurt, Germany",
    website: "https://www.db.com",
    description: "German multinational investment bank and financial services company with global operations.",
    focusAreas: ["Investment Banking", "Corporate Banking", "Private Banking", "Asset Management", "Trading"],
    notableFacts: [
      "Largest bank in Germany",
      "Significant presence in investment banking",
      "Strong European operations",
      "Global financial services network"
    ],
    logo: "https://logo.clearbit.com/db.com"
  },
  "UBS": {
    id: "ubs",
    name: "UBS",
    industry: "Banking",
    employeeCount: 72000,
    founded: 1862,
    headquarters: "Zurich, Switzerland",
    website: "https://www.ubs.com",
    description: "Swiss multinational investment bank and financial services company specializing in wealth management and investment banking.",
    focusAreas: ["Wealth Management", "Investment Banking", "Asset Management", "Retail Banking", "Trading"],
    notableFacts: [
      "Largest wealth manager globally",
      "Strong Swiss banking heritage",
      "Focus on high-net-worth clients",
      "Global investment banking presence"
    ],
    logo: "https://logo.clearbit.com/ubs.com"
  },
  "Barclays": {
    id: "barclays",
    name: "Barclays",
    industry: "Banking",
    employeeCount: 89000,
    founded: 1690,
    headquarters: "London, UK",
    website: "https://www.barclays.com",
    description: "British multinational investment bank and financial services company with operations worldwide.",
    focusAreas: ["Investment Banking", "Corporate Banking", "Retail Banking", "Wealth Management", "Trading"],
    notableFacts: [
      "One of the oldest banks in the world",
      "Major player in investment banking",
      "Strong UK retail banking presence",
      "Global financial services network"
    ],
    logo: "https://logo.clearbit.com/barclays.com"
  },
  "Visa": {
    id: "visa",
    name: "Visa",
    industry: "Banking",
    employeeCount: 26500,
    founded: 1958,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.visa.com",
    description: "Global payments technology company facilitating electronic funds transfers and digital payments worldwide.",
    focusAreas: ["Payment Processing", "Digital Payments", "Financial Technology", "Merchant Services", "Credit Cards"],
    notableFacts: [
      "Largest payment processor globally",
      "Processes billions of transactions annually",
      "Pioneer in digital payment technology",
      "Strong brand recognition worldwide"
    ],
    logo: "https://logo.clearbit.com/visa.com"
  },
  "Mastercard": {
    id: "mastercard",
    name: "Mastercard",
    industry: "Banking",
    employeeCount: 24000,
    founded: 1966,
    headquarters: "Purchase, NY, USA",
    website: "https://www.mastercard.com",
    description: "Global payments technology company providing payment processing and financial services.",
    focusAreas: ["Payment Processing", "Digital Payments", "Financial Technology", "Merchant Services", "Credit Cards"],
    notableFacts: [
      "Second-largest payment processor globally",
      "Strong competitor to Visa",
      "Focus on innovation in payments",
      "Global payment network"
    ],
    logo: "https://logo.clearbit.com/mastercard.com"
  },
  "Wells Fargo": {
    id: "wells-fargo",
    name: "Wells Fargo",
    industry: "Banking",
    employeeCount: 238000,
    founded: 1852,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.wellsfargo.com",
    description: "American multinational financial services company providing banking, investment, and mortgage services.",
    focusAreas: ["Consumer Banking", "Commercial Banking", "Wealth Management", "Investment Banking", "Mortgage Services"],
    notableFacts: [
      "One of the largest banks in the U.S.",
      "Strong retail banking presence",
      "Diverse financial services",
      "Significant mortgage business"
    ],
    logo: "https://logo.clearbit.com/wellsfargo.com"
  },
  "American Express": {
    id: "american-express",
    name: "American Express",
    industry: "Banking",
    employeeCount: 64000,
    founded: 1850,
    headquarters: "New York, NY, USA",
    website: "https://www.americanexpress.com",
    description: "Global financial services corporation known for credit cards, charge cards, and travel services.",
    focusAreas: ["Credit Cards", "Travel Services", "Merchant Services", "Corporate Services", "Loyalty Programs"],
    notableFacts: [
      "Premium credit card brand",
      "Strong focus on affluent customers",
      "Extensive travel and lifestyle benefits",
      "Known for customer service excellence"
    ],
    logo: "https://logo.clearbit.com/americanexpress.com"
  },
  
  // PE/VC
  "Blackstone": {
    id: "blackstone",
    name: "Blackstone",
    industry: "PE/VC",
    employeeCount: 4700,
    founded: 1985,
    headquarters: "New York, NY, USA",
    website: "https://www.blackstone.com",
    description: "Largest alternative asset management firm globally, specializing in private equity, real estate, and credit investments.",
    focusAreas: ["Private Equity", "Real Estate", "Credit", "Hedge Funds", "Infrastructure"],
    notableFacts: [
      "Largest alternative asset manager globally",
      "Over $1 trillion in assets under management",
      "Strong track record in private equity",
      "Diverse investment strategies"
    ],
    logo: "https://logo.clearbit.com/blackstone.com"
  },
  "KKR": {
    id: "kkr",
    name: "KKR",
    industry: "PE/VC",
    employeeCount: 3500,
    founded: 1976,
    headquarters: "New York, NY, USA",
    website: "https://www.kkr.com",
    description: "Global investment firm specializing in private equity, credit, and real estate investments.",
    focusAreas: ["Private Equity", "Credit", "Real Estate", "Infrastructure", "Growth Equity"],
    notableFacts: [
      "Pioneer in leveraged buyouts",
      "One of the largest private equity firms",
      "Strong track record in value creation",
      "Global investment platform"
    ],
    logo: "https://logo.clearbit.com/kkr.com"
  },
  "Carlyle Group": {
    id: "carlyle-group",
    name: "Carlyle Group",
    industry: "PE/VC",
    employeeCount: 2100,
    founded: 1987,
    headquarters: "Washington, DC, USA",
    website: "https://www.carlyle.com",
    description: "Global investment firm managing private equity, credit, and real estate investments across multiple industries.",
    focusAreas: ["Private Equity", "Credit", "Real Estate", "Infrastructure", "Energy"],
    notableFacts: [
      "One of the largest private equity firms",
      "Strong government and defense connections",
      "Diverse investment portfolio",
      "Global investment presence"
    ],
    logo: "https://logo.clearbit.com/carlyle.com"
  },
  "Apollo Global Management": {
    id: "apollo-global-management",
    name: "Apollo Global Management",
    industry: "PE/VC",
    employeeCount: 2000,
    founded: 1990,
    headquarters: "New York, NY, USA",
    website: "https://www.apollo.com",
    description: "Global alternative investment manager specializing in private equity, credit, and real estate.",
    focusAreas: ["Private Equity", "Credit", "Real Estate", "Infrastructure", "Natural Resources"],
    notableFacts: [
      "Major player in private equity",
      "Strong focus on credit investments",
      "Value-oriented investment approach",
      "Significant assets under management"
    ],
    logo: "https://logo.clearbit.com/apollo.com"
  },
  "Bain Capital": {
    id: "bain-capital",
    name: "Bain Capital",
    industry: "PE/VC",
    employeeCount: 1600,
    founded: 1984,
    headquarters: "Boston, MA, USA",
    website: "https://www.baincapital.com",
    description: "Global private investment firm managing assets across private equity, credit, public equity, and venture capital.",
    focusAreas: ["Private Equity", "Credit", "Venture Capital", "Public Equity", "Real Estate"],
    notableFacts: [
      "Founded by Mitt Romney and partners",
      "Strong operational focus",
      "Diverse investment strategies",
      "Global investment platform"
    ],
    logo: "https://logo.clearbit.com/baincapital.com"
  },
  "TPG": {
    id: "tpg",
    name: "TPG",
    industry: "PE/VC",
    employeeCount: 1400,
    founded: 1992,
    headquarters: "Fort Worth, TX, USA",
    website: "https://www.tpg.com",
    description: "Global alternative asset management firm specializing in private equity, growth equity, and impact investing.",
    focusAreas: ["Private Equity", "Growth Equity", "Impact Investing", "Real Estate", "Credit"],
    notableFacts: [
      "Major private equity firm",
      "Strong focus on growth investments",
      "Pioneer in impact investing",
      "Global investment presence"
    ],
    logo: "https://logo.clearbit.com/tpg.com"
  },
  "TPG Capital": {
    id: "tpg",
    name: "TPG",
    industry: "PE/VC",
    employeeCount: 1400,
    founded: 1992,
    headquarters: "Fort Worth, TX, USA",
    website: "https://www.tpg.com",
    description: "Global alternative asset management firm specializing in private equity, growth equity, and impact investing.",
    focusAreas: ["Private Equity", "Growth Equity", "Impact Investing", "Real Estate", "Credit"],
    notableFacts: [
      "Major private equity firm",
      "Strong focus on growth investments",
      "Pioneer in impact investing",
      "Global investment presence"
    ],
    logo: "https://logo.clearbit.com/tpg.com"
  },
  "Warburg Pincus": {
    id: "warburg-pincus",
    name: "Warburg Pincus",
    industry: "PE/VC",
    employeeCount: 900,
    founded: 1966,
    headquarters: "New York, NY, USA",
    website: "https://www.warburgpincus.com",
    description: "Global private equity firm focused on growth investing across multiple sectors and geographies.",
    focusAreas: ["Private Equity", "Growth Equity", "Healthcare", "Technology", "Financial Services"],
    notableFacts: [
      "Pioneer in growth equity investing",
      "Strong focus on healthcare and technology",
      "Global investment platform",
      "Long-term value creation approach"
    ],
    logo: "https://logo.clearbit.com/warburgpincus.com"
  },
  "Sequoia Capital": {
    id: "sequoia-capital",
    name: "Sequoia Capital",
    industry: "PE/VC",
    employeeCount: 280,
    founded: 1972,
    headquarters: "Menlo Park, CA, USA",
    website: "https://www.sequoiacap.com",
    description: "Venture capital firm known for early-stage investments in technology companies, with a focus on building category-defining businesses.",
    focusAreas: ["Venture Capital", "Early-Stage Investing", "Technology", "Healthcare", "Consumer"],
    notableFacts: [
      "Backed companies like Apple, Google, Airbnb",
      "One of the most successful VC firms",
      "Focus on category-defining companies",
      "Strong global presence"
    ],
    logo: "https://logo.clearbit.com/sequoiacap.com"
  },
  "Andreessen Horowitz": {
    id: "andreessen-horowitz",
    name: "Andreessen Horowitz",
    industry: "PE/VC",
    employeeCount: 450,
    founded: 2009,
    headquarters: "Menlo Park, CA, USA",
    website: "https://www.a16z.com",
    description: "Silicon Valley venture capital firm investing in technology companies across stages, from seed to growth.",
    focusAreas: ["Venture Capital", "Technology", "Crypto", "Bio", "Consumer"],
    notableFacts: [
      "Founded by Marc Andreessen and Ben Horowitz",
      "Strong focus on crypto and web3",
      "Thought leadership in tech",
      "Portfolio includes many unicorns"
    ],
    logo: "https://logo.clearbit.com/a16z.com"
  },
  "General Catalyst": {
    id: "general-catalyst",
    name: "General Catalyst",
    industry: "PE/VC",
    employeeCount: 180,
    founded: 2000,
    headquarters: "Cambridge, MA, USA",
    website: "https://www.generalcatalyst.com",
    description: "Venture capital firm investing in technology companies across stages, with a focus on building enduring businesses.",
    focusAreas: ["Venture Capital", "Technology", "Healthcare", "Consumer", "Enterprise"],
    notableFacts: [
      "Strong focus on consumer and enterprise tech",
      "Portfolio includes major tech companies",
      "Multi-stage investment approach",
      "East Coast and West Coast presence"
    ],
    logo: "https://logo.clearbit.com/generalcatalyst.com"
  },
  "Accel": {
    id: "accel",
    name: "Accel",
    industry: "PE/VC",
    employeeCount: 150,
    founded: 1983,
    headquarters: "Palo Alto, CA, USA",
    website: "https://www.accel.com",
    description: "Venture capital firm investing in technology companies from seed to growth stages globally.",
    focusAreas: ["Venture Capital", "Technology", "Enterprise Software", "Consumer Internet", "Healthcare"],
    notableFacts: [
      "Early investor in Facebook, Dropbox, Slack",
      "Global venture capital platform",
      "Strong track record in enterprise software",
      "Multi-stage investment focus"
    ],
    logo: "https://logo.clearbit.com/accel.com"
  },
  "Accel Partners": {
    id: "accel",
    name: "Accel",
    industry: "PE/VC",
    employeeCount: 150,
    founded: 1983,
    headquarters: "Palo Alto, CA, USA",
    website: "https://www.accel.com",
    description: "Venture capital firm investing in technology companies from seed to growth stages globally.",
    focusAreas: ["Venture Capital", "Technology", "Enterprise Software", "Consumer Internet", "Healthcare"],
    notableFacts: [
      "Early investor in Facebook, Dropbox, Slack",
      "Global venture capital platform",
      "Strong track record in enterprise software",
      "Multi-stage investment focus"
    ],
    logo: "https://logo.clearbit.com/accel.com"
  },
  "Greylock Partners": {
    id: "greylock-partners",
    name: "Greylock Partners",
    industry: "PE/VC",
    employeeCount: 120,
    founded: 1965,
    headquarters: "Menlo Park, CA, USA",
    website: "https://www.greylock.com",
    description: "Venture capital firm investing in early-stage technology companies, with a focus on enterprise and consumer software.",
    focusAreas: ["Venture Capital", "Early-Stage Investing", "Enterprise Software", "Consumer Internet", "Technology"],
    notableFacts: [
      "One of the oldest VC firms",
      "Early investor in LinkedIn, Facebook",
      "Strong focus on enterprise software",
      "Long-term partnership approach"
    ],
    logo: "https://logo.clearbit.com/greylock.com"
  },
  "Lightspeed Venture Partners": {
    id: "lightspeed-venture-partners",
    name: "Lightspeed Venture Partners",
    industry: "PE/VC",
    employeeCount: 100,
    founded: 2000,
    headquarters: "Menlo Park, CA, USA",
    website: "https://www.lsvp.com",
    description: "Venture capital firm investing in technology companies across stages, with a focus on enterprise and consumer markets.",
    focusAreas: ["Venture Capital", "Technology", "Enterprise Software", "Consumer", "Healthcare"],
    notableFacts: [
      "Early investor in Snap, Nutanix",
      "Strong focus on enterprise technology",
      "Global investment platform",
      "Multi-stage investment approach"
    ],
    logo: "https://logo.clearbit.com/lsvp.com"
  },
  "Benchmark": {
    id: "benchmark",
    name: "Benchmark",
    industry: "PE/VC",
    employeeCount: 50,
    founded: 1995,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.benchmark.com",
    description: "Venture capital firm known for early-stage investments in technology companies, with a focus on building category leaders.",
    focusAreas: ["Venture Capital", "Early-Stage Investing", "Technology", "Consumer Internet", "Enterprise"],
    notableFacts: [
      "Early investor in eBay, Twitter, Uber",
      "Small partnership model",
      "Focus on category-defining companies",
      "Strong track record in consumer internet"
    ],
    logo: "https://logo.clearbit.com/benchmark.com"
  },
  "Silver Lake": {
    id: "silver-lake",
    name: "Silver Lake",
    industry: "PE/VC",
    employeeCount: 400,
    founded: 1999,
    headquarters: "Menlo Park, CA, USA",
    website: "https://www.silverlake.com",
    description: "Global technology investment firm specializing in large-scale private equity investments in technology companies.",
    focusAreas: ["Private Equity", "Technology", "Software", "Hardware", "Media"],
    notableFacts: [
      "Focus on technology private equity",
      "Large-scale technology investments",
      "Strong operational expertise",
      "Global technology platform"
    ],
    logo: "https://logo.clearbit.com/silverlake.com"
  },
  "Hellman & Friedman": {
    id: "hellman-friedman",
    name: "Hellman & Friedman",
    industry: "PE/VC",
    employeeCount: 200,
    founded: 1984,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.hf.com",
    description: "Private equity firm specializing in large-scale investments in growth-oriented companies.",
    focusAreas: ["Private Equity", "Growth Equity", "Technology", "Financial Services", "Healthcare"],
    notableFacts: [
      "Focus on growth-oriented companies",
      "Large-scale private equity investments",
      "Strong operational approach",
      "Long-term value creation"
    ],
    logo: "https://logo.clearbit.com/hf.com"
  },
  "Thomas H. Lee Partners": {
    id: "thomas-h-lee-partners",
    name: "Thomas H. Lee Partners",
    industry: "PE/VC",
    employeeCount: 150,
    founded: 1974,
    headquarters: "Boston, MA, USA",
    website: "https://www.thl.com",
    description: "Private equity firm investing in growth-oriented companies across multiple industries.",
    focusAreas: ["Private Equity", "Growth Equity", "Business Services", "Healthcare", "Financial Services"],
    notableFacts: [
      "One of the oldest private equity firms",
      "Focus on growth-oriented companies",
      "Strong operational expertise",
      "Long-term partnership approach"
    ],
    logo: "https://logo.clearbit.com/thl.com"
  },
  
  // Tech
  "Google": {
    id: "google",
    name: "Google",
    industry: "Tech",
    employeeCount: 182000,
    founded: 1998,
    headquarters: "Mountain View, CA, USA",
    website: "https://www.google.com",
    description: "Multinational technology company specializing in Internet-related services and products, including search, cloud computing, and advertising.",
    focusAreas: ["Search", "Cloud Computing", "Advertising", "Hardware", "AI/ML"],
    notableFacts: [
      "Largest search engine globally",
      "Parent company Alphabet includes many subsidiaries",
      "Strong focus on innovation and moonshot projects",
      "One of the most valuable companies globally"
    ],
    logo: "https://logo.clearbit.com/google.com"
  },
  "Apple": {
    id: "apple",
    name: "Apple",
    industry: "Tech",
    employeeCount: 164000,
    founded: 1976,
    headquarters: "Cupertino, CA, USA",
    website: "https://www.apple.com",
    description: "Multinational technology company designing and manufacturing consumer electronics, software, and online services.",
    focusAreas: ["Hardware", "Software", "Services", "Wearables", "Entertainment"],
    notableFacts: [
      "Most valuable company globally",
      "Known for design excellence and innovation",
      "Strong ecosystem of products and services",
      "Iconic brand and customer loyalty"
    ],
    logo: "https://logo.clearbit.com/apple.com"
  },
  "Amazon": {
    id: "amazon",
    name: "Amazon",
    industry: "Tech",
    employeeCount: 1540000,
    founded: 1994,
    headquarters: "Seattle, WA, USA",
    website: "https://www.amazon.com",
    description: "Multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    focusAreas: ["E-commerce", "Cloud Computing (AWS)", "Digital Media", "Hardware", "AI/ML"],
    notableFacts: [
      "Largest e-commerce company globally",
      "AWS is leading cloud provider",
      "Diverse business lines",
      "Strong focus on customer obsession"
    ],
    logo: "https://logo.clearbit.com/amazon.com"
  },
  "Amazon Web Services": {
    id: "amazon-web-services",
    name: "Amazon Web Services",
    industry: "Tech",
    employeeCount: 100000,
    founded: 2006,
    headquarters: "Seattle, WA, USA",
    website: "https://aws.amazon.com",
    description: "Cloud computing platform and subsidiary of Amazon providing on-demand cloud computing services.",
    focusAreas: ["Cloud Computing", "Infrastructure", "Enterprise Software", "AI/ML", "Data Analytics"],
    notableFacts: [
      "Largest cloud provider globally",
      "Significant portion of Amazon's profits",
      "Wide range of cloud services",
      "Strong enterprise customer base"
    ],
    logo: "https://logo.clearbit.com/amazonaws.com"
  },
  "Microsoft": {
    id: "microsoft",
    name: "Microsoft",
    industry: "Tech",
    employeeCount: 221000,
    founded: 1975,
    headquarters: "Redmond, WA, USA",
    website: "https://www.microsoft.com",
    description: "Multinational technology corporation developing computer software, consumer electronics, and cloud services.",
    focusAreas: ["Software", "Cloud Computing (Azure)", "Hardware", "Gaming", "Enterprise Services"],
    notableFacts: [
      "One of the largest software companies",
      "Azure is second-largest cloud provider",
      "Strong enterprise software presence",
      "Diverse product portfolio"
    ],
    logo: "https://logo.clearbit.com/microsoft.com"
  },
  "Meta": {
    id: "meta",
    name: "Meta",
    industry: "Tech",
    employeeCount: 86000,
    founded: 2004,
    headquarters: "Menlo Park, CA, USA",
    website: "https://www.meta.com",
    description: "Technology company focusing on social media, virtual reality, and augmented reality platforms.",
    focusAreas: ["Social Media", "Virtual Reality", "Augmented Reality", "Advertising", "Messaging"],
    notableFacts: [
      "Parent company of Facebook, Instagram, WhatsApp",
      "Focus on metaverse development",
      "Large user base globally",
      "Strong advertising revenue"
    ],
    logo: "https://logo.clearbit.com/meta.com"
  },
  "Facebook": {
    id: "meta",
    name: "Meta",
    industry: "Tech",
    employeeCount: 86000,
    founded: 2004,
    headquarters: "Menlo Park, CA, USA",
    website: "https://www.meta.com",
    description: "Technology company focusing on social media, virtual reality, and augmented reality platforms.",
    focusAreas: ["Social Media", "Virtual Reality", "Augmented Reality", "Advertising", "Messaging"],
    notableFacts: [
      "Parent company of Facebook, Instagram, WhatsApp",
      "Focus on metaverse development",
      "Large user base globally",
      "Strong advertising revenue"
    ],
    logo: "https://logo.clearbit.com/meta.com"
  },
  "Netflix": {
    id: "netflix",
    name: "Netflix",
    industry: "Tech",
    employeeCount: 13000,
    founded: 1997,
    headquarters: "Los Gatos, CA, USA",
    website: "https://www.netflix.com",
    description: "Entertainment company providing streaming media and video-on-demand services globally.",
    focusAreas: ["Streaming Media", "Content Production", "Entertainment", "Technology", "International Expansion"],
    notableFacts: [
      "Largest streaming service globally",
      "Significant original content production",
      "Strong subscriber base",
      "Pioneer in streaming technology"
    ],
    logo: "https://logo.clearbit.com/netflix.com"
  },
  "Uber": {
    id: "uber",
    name: "Uber",
    industry: "Tech",
    employeeCount: 32800,
    founded: 2009,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.uber.com",
    description: "Technology company providing ride-sharing, food delivery, and freight transportation services.",
    focusAreas: ["Ride-Sharing", "Food Delivery", "Freight", "Mobility", "Technology"],
    notableFacts: [
      "Largest ride-sharing platform globally",
      "Expanded into food delivery and freight",
      "Strong global presence",
      "Focus on mobility solutions"
    ],
    logo: "https://logo.clearbit.com/uber.com"
  },
  "Airbnb": {
    id: "airbnb",
    name: "Airbnb",
    industry: "Tech",
    employeeCount: 6800,
    founded: 2008,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.airbnb.com",
    description: "Online marketplace for short-term lodging and experiences, connecting hosts with guests worldwide.",
    focusAreas: ["Hospitality", "Travel", "Marketplace", "Experiences", "Technology"],
    notableFacts: [
      "Largest accommodation platform globally",
      "Disrupted traditional hospitality industry",
      "Strong brand and community",
      "Expanded into experiences and long-term stays"
    ],
    logo: "https://logo.clearbit.com/airbnb.com"
  },
  "Stripe": {
    id: "stripe",
    name: "Stripe",
    industry: "Tech",
    employeeCount: 8000,
    founded: 2010,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.stripe.com",
    description: "Technology company providing payment processing and financial infrastructure for online businesses.",
    focusAreas: ["Payment Processing", "Financial Infrastructure", "Developer Tools", "E-commerce", "Technology"],
    notableFacts: [
      "Leading online payment processor",
      "Strong developer-focused approach",
      "Rapid growth and high valuation",
      "Expanding into broader financial services"
    ],
    logo: "https://logo.clearbit.com/stripe.com"
  },
  "Salesforce": {
    id: "salesforce",
    name: "Salesforce",
    industry: "Tech",
    employeeCount: 79000,
    founded: 1999,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.salesforce.com",
    description: "Cloud-based software company providing customer relationship management and enterprise software solutions.",
    focusAreas: ["CRM", "Cloud Software", "Enterprise Software", "Marketing", "Sales"],
    notableFacts: [
      "Largest CRM software provider",
      "Pioneer in cloud-based software",
      "Strong enterprise customer base",
      "Acquisitive growth strategy"
    ],
    logo: "https://logo.clearbit.com/salesforce.com"
  },
  "Adobe": {
    id: "adobe",
    name: "Adobe",
    industry: "Tech",
    employeeCount: 29000,
    founded: 1982,
    headquarters: "San Jose, CA, USA",
    website: "https://www.adobe.com",
    description: "Software company providing creative, marketing, and document management solutions.",
    focusAreas: ["Creative Software", "Marketing Software", "Document Management", "Digital Media", "Cloud Services"],
    notableFacts: [
      "Industry leader in creative software",
      "Transitioned to subscription model",
      "Strong brand recognition",
      "Diverse software portfolio"
    ],
    logo: "https://logo.clearbit.com/adobe.com"
  },
  "DoorDash": {
    id: "doordash",
    name: "DoorDash",
    industry: "Tech",
    employeeCount: 8600,
    founded: 2013,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.doordash.com",
    description: "Technology company providing on-demand food delivery and logistics services.",
    focusAreas: ["Food Delivery", "Logistics", "Marketplace", "Technology", "Local Commerce"],
    notableFacts: [
      "Largest food delivery platform in U.S.",
      "Expanded into grocery and convenience",
      "Strong market position",
      "Focus on local commerce"
    ],
    logo: "https://logo.clearbit.com/doordash.com"
  },
  "Spotify": {
    id: "spotify",
    name: "Spotify",
    industry: "Tech",
    employeeCount: 9800,
    founded: 2006,
    headquarters: "Stockholm, Sweden",
    website: "https://www.spotify.com",
    description: "Audio streaming and media services provider offering music, podcasts, and audiobooks.",
    focusAreas: ["Music Streaming", "Podcasts", "Audio Content", "Technology", "Entertainment"],
    notableFacts: [
      "Largest music streaming service globally",
      "Strong focus on podcasts",
      "Freemium business model",
      "Global user base"
    ],
    logo: "https://logo.clearbit.com/spotify.com"
  },
  "Tesla": {
    id: "tesla",
    name: "Tesla",
    industry: "Tech",
    employeeCount: 128000,
    founded: 2003,
    headquarters: "Austin, TX, USA",
    website: "https://www.tesla.com",
    description: "Electric vehicle and clean energy company manufacturing electric cars, energy storage, and solar products.",
    focusAreas: ["Electric Vehicles", "Energy Storage", "Solar Energy", "Autonomous Driving", "Manufacturing"],
    notableFacts: [
      "Largest electric vehicle manufacturer",
      "Pioneer in autonomous driving technology",
      "Strong brand and innovation focus",
      "Vertical integration approach"
    ],
    logo: "https://logo.clearbit.com/tesla.com"
  },
  "Zoom": {
    id: "zoom",
    name: "Zoom",
    industry: "Tech",
    employeeCount: 7700,
    founded: 2011,
    headquarters: "San Jose, CA, USA",
    website: "https://www.zoom.us",
    description: "Video communications company providing video conferencing and collaboration tools.",
    focusAreas: ["Video Conferencing", "Collaboration", "Communication", "Enterprise Software", "Technology"],
    notableFacts: [
      "Leading video conferencing platform",
      "Rapid growth during pandemic",
      "Strong enterprise adoption",
      "Expanding into broader collaboration tools"
    ],
    logo: "https://logo.clearbit.com/zoom.us"
  },
  "LinkedIn": {
    id: "linkedin",
    name: "LinkedIn",
    industry: "Tech",
    employeeCount: 20000,
    founded: 2002,
    headquarters: "Sunnyvale, CA, USA",
    website: "https://www.linkedin.com",
    description: "Professional networking and career development platform owned by Microsoft.",
    focusAreas: ["Professional Networking", "Recruiting", "Learning", "Sales", "Marketing"],
    notableFacts: [
      "Largest professional network globally",
      "Owned by Microsoft",
      "Strong focus on B2B services",
      "Valuable recruiting platform"
    ],
    logo: "https://logo.clearbit.com/linkedin.com"
  },
  "Twitter": {
    id: "twitter",
    name: "Twitter",
    industry: "Tech",
    employeeCount: 7500,
    founded: 2006,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.twitter.com",
    description: "Social media platform enabling users to share short messages and engage in real-time conversations.",
    focusAreas: ["Social Media", "Real-Time Communication", "News", "Advertising", "Technology"],
    notableFacts: [
      "Major social media platform",
      "Real-time news and information",
      "Strong user engagement",
      "Significant cultural impact"
    ],
    logo: "https://logo.clearbit.com/twitter.com"
  },
  "Snap": {
    id: "snap",
    name: "Snap",
    industry: "Tech",
    employeeCount: 5600,
    founded: 2011,
    headquarters: "Santa Monica, CA, USA",
    website: "https://www.snap.com",
    description: "Technology company providing camera and social media applications, including Snapchat.",
    focusAreas: ["Social Media", "Camera Technology", "AR/VR", "Advertising", "Entertainment"],
    notableFacts: [
      "Creator of Snapchat",
      "Focus on augmented reality",
      "Strong young user base",
      "Innovative camera technology"
    ],
    logo: "https://logo.clearbit.com/snap.com"
  },
  "Pinterest": {
    id: "pinterest",
    name: "Pinterest",
    industry: "Tech",
    employeeCount: 4100,
    founded: 2010,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.pinterest.com",
    description: "Visual discovery engine for finding ideas and inspiration through images and videos.",
    focusAreas: ["Visual Search", "E-commerce", "Content Discovery", "Advertising", "Technology"],
    notableFacts: [
      "Unique visual discovery platform",
      "Strong e-commerce integration",
      "Focus on inspiration and planning",
      "Growing advertising business"
    ],
    logo: "https://logo.clearbit.com/pinterest.com"
  },
  "IBM": {
    id: "ibm",
    name: "IBM",
    industry: "Tech",
    employeeCount: 282000,
    founded: 1911,
    headquarters: "Armonk, NY, USA",
    website: "https://www.ibm.com",
    description: "Multinational technology corporation providing hardware, software, cloud services, and consulting.",
    focusAreas: ["Cloud Computing", "AI/ML", "Enterprise Software", "Consulting", "Hardware"],
    notableFacts: [
      "One of the oldest tech companies",
      "Strong focus on enterprise solutions",
      "Pioneer in AI and quantum computing",
      "Diverse technology portfolio"
    ],
    logo: "https://logo.clearbit.com/ibm.com"
  },
  "SAP": {
    id: "sap",
    name: "SAP",
    industry: "Tech",
    employeeCount: 107000,
    founded: 1972,
    headquarters: "Walldorf, Germany",
    website: "https://www.sap.com",
    description: "European multinational software corporation providing enterprise software for business operations.",
    focusAreas: ["Enterprise Software", "ERP", "Cloud Services", "Business Intelligence", "Supply Chain"],
    notableFacts: [
      "Largest European software company",
      "Leader in ERP software",
      "Strong enterprise customer base",
      "Global software presence"
    ],
    logo: "https://logo.clearbit.com/sap.com"
  },
  "Oracle": {
    id: "oracle",
    name: "Oracle",
    industry: "Tech",
    employeeCount: 164000,
    founded: 1977,
    headquarters: "Austin, TX, USA",
    website: "https://www.oracle.com",
    description: "Multinational technology corporation providing database software, cloud services, and enterprise software.",
    focusAreas: ["Database Software", "Cloud Services", "Enterprise Software", "Hardware", "Applications"],
    notableFacts: [
      "Largest database software provider",
      "Strong enterprise software presence",
      "Focus on cloud transformation",
      "Diverse technology portfolio"
    ],
    logo: "https://logo.clearbit.com/oracle.com"
  },
  "Cisco": {
    id: "cisco",
    name: "Cisco",
    industry: "Tech",
    employeeCount: 83000,
    founded: 1984,
    headquarters: "San Jose, CA, USA",
    website: "https://www.cisco.com",
    description: "Multinational technology conglomerate providing networking hardware, software, and services.",
    focusAreas: ["Networking", "Cybersecurity", "Collaboration", "Cloud Services", "Infrastructure"],
    notableFacts: [
      "Largest networking equipment provider",
      "Strong focus on cybersecurity",
      "Enterprise infrastructure leader",
      "Diverse technology solutions"
    ],
    logo: "https://logo.clearbit.com/cisco.com"
  },
  "Shopify": {
    id: "shopify",
    name: "Shopify",
    industry: "Tech",
    employeeCount: 10000,
    founded: 2006,
    headquarters: "Ottawa, Canada",
    website: "https://www.shopify.com",
    description: "E-commerce platform enabling businesses to create online stores and manage retail operations.",
    focusAreas: ["E-commerce", "Retail Technology", "Payment Processing", "Logistics", "Technology"],
    notableFacts: [
      "Leading e-commerce platform",
      "Strong focus on small businesses",
      "Expanding into broader commerce solutions",
      "Growing merchant base"
    ],
    logo: "https://logo.clearbit.com/shopify.com"
  },
  "Palantir": {
    id: "palantir",
    name: "Palantir",
    industry: "Tech",
    employeeCount: 3800,
    founded: 2003,
    headquarters: "Denver, CO, USA",
    website: "https://www.palantir.com",
    description: "Big data analytics company providing software for data integration and analysis.",
    focusAreas: ["Data Analytics", "Big Data", "Government Services", "Enterprise Software", "AI/ML"],
    notableFacts: [
      "Strong focus on government and defense",
      "Big data analytics leader",
      "Controversial but powerful technology",
      "Expanding into commercial markets"
    ],
    logo: "https://logo.clearbit.com/palantir.com"
  },
  "PayPal": {
    id: "paypal",
    name: "PayPal",
    industry: "Tech",
    employeeCount: 29000,
    founded: 1998,
    headquarters: "San Jose, CA, USA",
    website: "https://www.paypal.com",
    description: "Financial technology company providing online payment and digital wallet services.",
    focusAreas: ["Payment Processing", "Digital Wallets", "E-commerce", "Financial Technology", "Money Transfer"],
    notableFacts: [
      "Largest online payment processor",
      "Strong e-commerce integration",
      "Global payment network",
      "Expanding into broader financial services"
    ],
    logo: "https://logo.clearbit.com/paypal.com"
  },
  "Square": {
    id: "square",
    name: "Square",
    industry: "Tech",
    employeeCount: 8500,
    founded: 2009,
    headquarters: "San Francisco, CA, USA",
    website: "https://www.square.com",
    description: "Financial technology company providing payment processing and financial services for businesses.",
    focusAreas: ["Payment Processing", "Point of Sale", "Financial Services", "Small Business", "Technology"],
    notableFacts: [
      "Focus on small business payments",
      "Expanded into broader financial services",
      "Strong hardware and software integration",
      "Growing merchant base"
    ],
    logo: "https://logo.clearbit.com/square.com"
  },
  "Nvidia": {
    id: "nvidia",
    name: "Nvidia",
    industry: "Tech",
    employeeCount: 29000,
    founded: 1993,
    headquarters: "Santa Clara, CA, USA",
    website: "https://www.nvidia.com",
    description: "Technology company designing graphics processing units and AI computing platforms.",
    focusAreas: ["Graphics Processing", "AI Computing", "Gaming", "Data Centers", "Automotive"],
    notableFacts: [
      "Leader in GPU technology",
      "Strong focus on AI and machine learning",
      "Gaming industry leader",
      "Expanding into data centers and automotive"
    ],
    logo: "https://logo.clearbit.com/nvidia.com"
  },
  
  // Education
  "Harvard Business School": {
    id: "harvard-business-school",
    name: "Harvard Business School",
    industry: "Education",
    employeeCount: 900,
    founded: 1908,
    headquarters: "Boston, MA, USA",
    website: "https://www.hbs.edu",
    description: "Graduate business school of Harvard University, offering MBA and executive education programs.",
    focusAreas: ["MBA Program", "Executive Education", "Research", "Case Method", "Leadership Development"],
    notableFacts: [
      "Most prestigious MBA program globally",
      "Pioneer of case method teaching",
      "Strong alumni network",
      "Highly selective admissions"
    ],
    logo: "https://logo.clearbit.com/hbs.edu"
  },
  "Stanford GSB": {
    id: "stanford-gsb",
    name: "Stanford GSB",
    industry: "Education",
    employeeCount: 850,
    founded: 1925,
    headquarters: "Stanford, CA, USA",
    website: "https://www.gsb.stanford.edu",
    description: "Graduate business school of Stanford University, known for innovation and entrepreneurship.",
    focusAreas: ["MBA Program", "Executive Education", "Entrepreneurship", "Innovation", "Leadership"],
    notableFacts: [
      "Top-ranked MBA program",
      "Strong focus on entrepreneurship",
      "Silicon Valley location advantage",
      "Highly selective admissions"
    ],
    logo: "https://logo.clearbit.com/gsb.stanford.edu"
  },
  "Wharton School": {
    id: "wharton-school",
    name: "Wharton School",
    industry: "Education",
    employeeCount: 800,
    founded: 1881,
    headquarters: "Philadelphia, PA, USA",
    website: "https://www.wharton.upenn.edu",
    description: "Business school of the University of Pennsylvania, known for finance and analytical rigor.",
    focusAreas: ["MBA Program", "Finance", "Analytics", "Executive Education", "Research"],
    notableFacts: [
      "First business school in the U.S.",
      "Strong focus on finance",
      "Top-ranked MBA program",
      "Strong alumni network in finance"
    ],
    logo: "https://logo.clearbit.com/wharton.upenn.edu"
  },
  "MIT Sloan": {
    id: "mit-sloan",
    name: "MIT Sloan",
    industry: "Education",
    employeeCount: 750,
    founded: 1914,
    headquarters: "Cambridge, MA, USA",
    website: "https://www.mitsloan.mit.edu",
    description: "Business school of MIT, known for technology, innovation, and analytical approach.",
    focusAreas: ["MBA Program", "Technology", "Innovation", "Analytics", "Entrepreneurship"],
    notableFacts: [
      "Strong focus on technology and innovation",
      "Analytical and quantitative approach",
      "Top-ranked MBA program",
      "Strong connections to tech industry"
    ],
    logo: "https://logo.clearbit.com/mitsloan.mit.edu"
  },
  "Columbia Business School": {
    id: "columbia-business-school",
    name: "Columbia Business School",
    industry: "Education",
    employeeCount: 700,
    founded: 1916,
    headquarters: "New York, NY, USA",
    website: "https://www.gsb.columbia.edu",
    description: "Business school of Columbia University, located in New York City financial district.",
    focusAreas: ["MBA Program", "Finance", "Real Estate", "Executive Education", "Value Investing"],
    notableFacts: [
      "Strong focus on finance",
      "New York City location advantage",
      "Top-ranked MBA program",
      "Strong connections to Wall Street"
    ],
    logo: "https://logo.clearbit.com/gsb.columbia.edu"
  },
  "Kellogg School of Management": {
    id: "kellogg-school-of-management",
    name: "Kellogg School of Management",
    industry: "Education",
    employeeCount: 650,
    founded: 1908,
    headquarters: "Evanston, IL, USA",
    website: "https://www.kellogg.northwestern.edu",
    description: "Business school of Northwestern University, known for marketing and collaborative culture.",
    focusAreas: ["MBA Program", "Marketing", "General Management", "Executive Education", "Collaboration"],
    notableFacts: [
      "Strong focus on marketing",
      "Collaborative culture",
      "Top-ranked MBA program",
      "Strong alumni network"
    ],
    logo: "https://logo.clearbit.com/kellogg.northwestern.edu"
  },
  "Northwestern Kellogg": {
    id: "kellogg-school-of-management",
    name: "Kellogg School of Management",
    industry: "Education",
    employeeCount: 650,
    founded: 1908,
    headquarters: "Evanston, IL, USA",
    website: "https://www.kellogg.northwestern.edu",
    description: "Business school of Northwestern University, known for marketing and collaborative culture.",
    focusAreas: ["MBA Program", "Marketing", "General Management", "Executive Education", "Collaboration"],
    notableFacts: [
      "Strong focus on marketing",
      "Collaborative culture",
      "Top-ranked MBA program",
      "Strong alumni network"
    ],
    logo: "https://logo.clearbit.com/kellogg.northwestern.edu"
  },
  "Chicago Booth": {
    id: "chicago-booth",
    name: "Chicago Booth",
    industry: "Education",
    employeeCount: 600,
    founded: 1898,
    headquarters: "Chicago, IL, USA",
    website: "https://www.chicagobooth.edu",
    description: "Business school of the University of Chicago, known for economics and analytical rigor.",
    focusAreas: ["MBA Program", "Economics", "Finance", "Analytics", "Research"],
    notableFacts: [
      "Strong focus on economics",
      "Analytical and rigorous approach",
      "Top-ranked MBA program",
      "Nobel Prize winners on faculty"
    ],
    logo: "https://logo.clearbit.com/chicagobooth.edu"
  },
  "Cornell Johnson": {
    id: "cornell-johnson",
    name: "Cornell Johnson",
    industry: "Education",
    employeeCount: 550,
    founded: 1946,
    headquarters: "Ithaca, NY, USA",
    website: "https://www.johnson.cornell.edu",
    description: "Business school of Cornell University, offering MBA and executive education programs.",
    focusAreas: ["MBA Program", "General Management", "Finance", "Executive Education", "Hospitality"],
    notableFacts: [
      "Strong focus on hospitality management",
      "Top-ranked MBA program",
      "Ivy League business school",
      "Strong alumni network"
    ],
    logo: "https://logo.clearbit.com/johnson.cornell.edu"
  },
  "Yale SOM": {
    id: "yale-som",
    name: "Yale SOM",
    industry: "Education",
    employeeCount: 500,
    founded: 1976,
    headquarters: "New Haven, CT, USA",
    website: "https://www.som.yale.edu",
    description: "Business school of Yale University, known for integrated curriculum and social impact focus.",
    focusAreas: ["MBA Program", "Social Impact", "Integrated Curriculum", "Executive Education", "Nonprofit"],
    notableFacts: [
      "Focus on social impact",
      "Integrated curriculum approach",
      "Top-ranked MBA program",
      "Strong connections to nonprofit sector"
    ],
    logo: "https://logo.clearbit.com/som.yale.edu"
  },
  "USC Marshall": {
    id: "usc-marshall",
    name: "USC Marshall",
    industry: "Education",
    employeeCount: 480,
    founded: 1920,
    headquarters: "Los Angeles, CA, USA",
    website: "https://www.marshall.usc.edu",
    description: "Business school of the University of Southern California, located in Los Angeles.",
    focusAreas: ["MBA Program", "Entertainment", "Real Estate", "Entrepreneurship", "Executive Education"],
    notableFacts: [
      "Strong focus on entertainment industry",
      "Los Angeles location advantage",
      "Top-ranked MBA program",
      "Strong connections to entertainment and media"
    ],
    logo: "https://logo.clearbit.com/marshall.usc.edu"
  },
  "Duke Fuqua": {
    id: "duke-fuqua",
    name: "Duke Fuqua",
    industry: "Education",
    employeeCount: 460,
    founded: 1969,
    headquarters: "Durham, NC, USA",
    website: "https://www.fuqua.duke.edu",
    description: "Business school of Duke University, known for team-based learning and collaborative culture.",
    focusAreas: ["MBA Program", "General Management", "Team-Based Learning", "Executive Education", "Healthcare"],
    notableFacts: [
      "Strong focus on team-based learning",
      "Collaborative culture",
      "Top-ranked MBA program",
      "Strong connections to healthcare industry"
    ],
    logo: "https://logo.clearbit.com/fuqua.duke.edu"
  },
  "NYU Stern": {
    id: "nyu-stern",
    name: "NYU Stern",
    industry: "Education",
    employeeCount: 450,
    founded: 1900,
    headquarters: "New York, NY, USA",
    website: "https://www.stern.nyu.edu",
    description: "Business school of New York University, located in Manhattan financial district.",
    focusAreas: ["MBA Program", "Finance", "Entertainment", "Real Estate", "Executive Education"],
    notableFacts: [
      "Strong focus on finance",
      "New York City location advantage",
      "Top-ranked MBA program",
      "Strong connections to Wall Street and media"
    ],
    logo: "https://logo.clearbit.com/stern.nyu.edu"
  },
  "UC Berkeley Haas": {
    id: "uc-berkeley-haas",
    name: "UC Berkeley Haas",
    industry: "Education",
    employeeCount: 420,
    founded: 1898,
    headquarters: "Berkeley, CA, USA",
    website: "https://www.haas.berkeley.edu",
    description: "Business school of UC Berkeley, known for innovation and social impact.",
    focusAreas: ["MBA Program", "Innovation", "Social Impact", "Technology", "Entrepreneurship"],
    notableFacts: [
      "Strong focus on innovation",
      "Silicon Valley proximity",
      "Top-ranked MBA program",
      "Strong connections to tech industry"
    ],
    logo: "https://logo.clearbit.com/haas.berkeley.edu"
  },
  "UCLA Anderson": {
    id: "ucla-anderson",
    name: "UCLA Anderson",
    industry: "Education",
    employeeCount: 400,
    founded: 1935,
    headquarters: "Los Angeles, CA, USA",
    website: "https://www.anderson.ucla.edu",
    description: "Business school of UCLA, located in Los Angeles.",
    focusAreas: ["MBA Program", "Entertainment", "Real Estate", "Entrepreneurship", "Executive Education"],
    notableFacts: [
      "Strong focus on entertainment industry",
      "Los Angeles location advantage",
      "Top-ranked MBA program",
      "Strong connections to media and entertainment"
    ],
    logo: "https://logo.clearbit.com/anderson.ucla.edu"
  },
  "Ross School of Business": {
    id: "ross-school-of-business",
    name: "Ross School of Business",
    industry: "Education",
    employeeCount: 380,
    founded: 1924,
    headquarters: "Ann Arbor, MI, USA",
    website: "https://www.michiganross.umich.edu",
    description: "Business school of the University of Michigan, known for action-based learning.",
    focusAreas: ["MBA Program", "Action-Based Learning", "General Management", "Executive Education", "Consulting"],
    notableFacts: [
      "Strong focus on action-based learning",
      "Top-ranked MBA program",
      "Strong alumni network",
      "Focus on practical business skills"
    ],
    logo: "https://logo.clearbit.com/michiganross.umich.edu"
  },
  "Tuck School of Business": {
    id: "tuck-school-of-business",
    name: "Tuck School of Business",
    industry: "Education",
    employeeCount: 350,
    founded: 1900,
    headquarters: "Hanover, NH, USA",
    website: "https://www.tuck.dartmouth.edu",
    description: "Business school of Dartmouth College, known for small class size and close-knit community.",
    focusAreas: ["MBA Program", "General Management", "Close Community", "Executive Education", "Consulting"],
    notableFacts: [
      "Small class size and close community",
      "Top-ranked MBA program",
      "Strong alumni network",
      "Focus on general management"
    ],
    logo: "https://logo.clearbit.com/tuck.dartmouth.edu"
  },
  
  // Corporate
  "Procter & Gamble": {
    id: "procter-gamble",
    name: "Procter & Gamble",
    industry: "Corporate",
    employeeCount: 107000,
    founded: 1837,
    headquarters: "Cincinnati, OH, USA",
    website: "https://www.pg.com",
    description: "Multinational consumer goods corporation manufacturing and selling consumer products worldwide.",
    focusAreas: ["Consumer Goods", "Brand Management", "Marketing", "Innovation", "Supply Chain"],
    notableFacts: [
      "Largest consumer goods company",
      "Strong brand portfolio",
      "Focus on innovation and R&D",
      "Global market presence"
    ],
    logo: "https://logo.clearbit.com/pg.com"
  },
  "Johnson & Johnson": {
    id: "johnson-johnson",
    name: "Johnson & Johnson",
    industry: "Corporate",
    employeeCount: 152000,
    founded: 1886,
    headquarters: "New Brunswick, NJ, USA",
    website: "https://www.jnj.com",
    description: "Multinational corporation manufacturing pharmaceuticals, medical devices, and consumer health products.",
    focusAreas: ["Pharmaceuticals", "Medical Devices", "Consumer Health", "Research & Development", "Healthcare"],
    notableFacts: [
      "Diverse healthcare portfolio",
      "Strong focus on R&D",
      "Global healthcare leader",
      "Long history of innovation"
    ],
    logo: "https://logo.clearbit.com/jnj.com"
  },
  "Unilever": {
    id: "unilever",
    name: "Unilever",
    industry: "Corporate",
    employeeCount: 127000,
    founded: 1929,
    headquarters: "London, UK",
    website: "https://www.unilever.com",
    description: "British-Dutch multinational consumer goods company manufacturing food, beverages, and personal care products.",
    focusAreas: ["Consumer Goods", "Food & Beverages", "Personal Care", "Sustainability", "Brand Management"],
    notableFacts: [
      "Major consumer goods company",
      "Strong focus on sustainability",
      "Diverse brand portfolio",
      "Global market presence"
    ],
    logo: "https://logo.clearbit.com/unilever.com"
  },
  "PepsiCo": {
    id: "pepsico",
    name: "PepsiCo",
    industry: "Corporate",
    employeeCount: 309000,
    founded: 1965,
    headquarters: "Purchase, NY, USA",
    website: "https://www.pepsico.com",
    description: "American multinational food and beverage corporation manufacturing snacks, beverages, and food products.",
    focusAreas: ["Beverages", "Snacks", "Food Products", "Brand Management", "Supply Chain"],
    notableFacts: [
      "Second-largest food and beverage company",
      "Strong brand portfolio",
      "Global market presence",
      "Focus on innovation"
    ],
    logo: "https://logo.clearbit.com/pepsico.com"
  },
  "Coca-Cola": {
    id: "coca-cola",
    name: "Coca-Cola",
    industry: "Corporate",
    employeeCount: 86000,
    founded: 1892,
    headquarters: "Atlanta, GA, USA",
    website: "https://www.coca-cola.com",
    description: "American multinational beverage corporation manufacturing and selling non-alcoholic beverages worldwide.",
    focusAreas: ["Beverages", "Brand Management", "Marketing", "Supply Chain", "Innovation"],
    notableFacts: [
      "Largest beverage company globally",
      "Iconic brand recognition",
      "Global market presence",
      "Strong marketing and distribution"
    ],
    logo: "https://logo.clearbit.com/coca-cola.com"
  },
  "Nike": {
    id: "nike",
    name: "Nike",
    industry: "Corporate",
    employeeCount: 77000,
    founded: 1964,
    headquarters: "Beaverton, OR, USA",
    website: "https://www.nike.com",
    description: "American multinational corporation designing, developing, and selling athletic footwear, apparel, and equipment.",
    focusAreas: ["Athletic Apparel", "Footwear", "Sports Equipment", "Brand Marketing", "Innovation"],
    notableFacts: [
      "Largest athletic apparel company",
      "Strong brand and marketing",
      "Focus on innovation and technology",
      "Global market leader"
    ],
    logo: "https://logo.clearbit.com/nike.com"
  },
  "Walmart": {
    id: "walmart",
    name: "Walmart",
    industry: "Corporate",
    employeeCount: 2300000,
    founded: 1962,
    headquarters: "Bentonville, AR, USA",
    website: "https://www.walmart.com",
    description: "American multinational retail corporation operating hypermarkets, discount stores, and grocery stores.",
    focusAreas: ["Retail", "E-commerce", "Supply Chain", "Grocery", "Logistics"],
    notableFacts: [
      "Largest retailer globally",
      "Largest private employer",
      "Strong supply chain operations",
      "Growing e-commerce presence"
    ],
    logo: "https://logo.clearbit.com/walmart.com"
  },
  "Target": {
    id: "target",
    name: "Target",
    industry: "Corporate",
    employeeCount: 450000,
    founded: 1902,
    headquarters: "Minneapolis, MN, USA",
    website: "https://www.target.com",
    description: "American retail corporation operating discount stores and hypermarkets.",
    focusAreas: ["Retail", "E-commerce", "Private Label", "Design", "Supply Chain"],
    notableFacts: [
      "Major U.S. retailer",
      "Strong focus on design and style",
      "Growing e-commerce business",
      "Private label brand success"
    ],
    logo: "https://logo.clearbit.com/target.com"
  },
  "Home Depot": {
    id: "home-depot",
    name: "Home Depot",
    industry: "Corporate",
    employeeCount: 500000,
    founded: 1978,
    headquarters: "Atlanta, GA, USA",
    website: "https://www.homedepot.com",
    description: "American home improvement retail corporation selling tools, construction products, and services.",
    focusAreas: ["Home Improvement", "Retail", "E-commerce", "Contractor Services", "Supply Chain"],
    notableFacts: [
      "Largest home improvement retailer",
      "Strong contractor customer base",
      "Growing e-commerce business",
      "Focus on customer service"
    ],
    logo: "https://logo.clearbit.com/homedepot.com"
  },
  "Disney": {
    id: "disney",
    name: "Disney",
    industry: "Corporate",
    employeeCount: 223000,
    founded: 1923,
    headquarters: "Burbank, CA, USA",
    website: "https://www.disney.com",
    description: "American multinational entertainment and media conglomerate operating theme parks, media networks, and studios.",
    focusAreas: ["Entertainment", "Media", "Theme Parks", "Streaming", "Consumer Products"],
    notableFacts: [
      "Largest entertainment company",
      "Iconic brand and characters",
      "Strong theme park business",
      "Growing streaming services"
    ],
    logo: "https://logo.clearbit.com/disney.com"
  },
  "Comcast": {
    id: "comcast",
    name: "Comcast",
    industry: "Corporate",
    employeeCount: 190000,
    founded: 1963,
    headquarters: "Philadelphia, PA, USA",
    website: "https://www.comcast.com",
    description: "American telecommunications conglomerate providing cable television, internet, and phone services.",
    focusAreas: ["Cable", "Internet", "Telecommunications", "Media", "Entertainment"],
    notableFacts: [
      "Largest cable provider in U.S.",
      "Owns NBCUniversal",
      "Strong broadband business",
      "Diverse media holdings"
    ],
    logo: "https://logo.clearbit.com/comcast.com"
  },
  "Verizon": {
    id: "verizon",
    name: "Verizon",
    industry: "Corporate",
    employeeCount: 135000,
    founded: 1983,
    headquarters: "New York, NY, USA",
    website: "https://www.verizon.com",
    description: "American multinational telecommunications conglomerate providing wireless, internet, and media services.",
    focusAreas: ["Wireless", "Internet", "Telecommunications", "Media", "5G"],
    notableFacts: [
      "Largest wireless carrier in U.S.",
      "Strong focus on 5G",
      "Diverse telecommunications services",
      "Media and content investments"
    ],
    logo: "https://logo.clearbit.com/verizon.com"
  },
  "AT&T": {
    id: "at-t",
    name: "AT&T",
    industry: "Corporate",
    employeeCount: 160000,
    founded: 1885,
    headquarters: "Dallas, TX, USA",
    website: "https://www.att.com",
    description: "American multinational telecommunications conglomerate providing wireless, internet, and media services.",
    focusAreas: ["Wireless", "Internet", "Telecommunications", "Media", "Entertainment"],
    notableFacts: [
      "Major telecommunications provider",
      "Diverse service offerings",
      "Strong wireless business",
      "Media and entertainment holdings"
    ],
    logo: "https://logo.clearbit.com/att.com"
  },
  "GE": {
    id: "general-electric",
    name: "General Electric",
    industry: "Corporate",
    employeeCount: 174000,
    founded: 1892,
    headquarters: "Boston, MA, USA",
    website: "https://www.ge.com",
    description: "American multinational conglomerate operating in aviation, power, renewable energy, and healthcare.",
    focusAreas: ["Aviation", "Power", "Renewable Energy", "Healthcare", "Industrial"],
    notableFacts: [
      "One of the oldest industrial companies",
      "Diverse industrial portfolio",
      "Strong focus on innovation",
      "Global industrial presence"
    ],
    logo: "https://logo.clearbit.com/ge.com"
  },
  "General Electric": {
    id: "general-electric",
    name: "General Electric",
    industry: "Corporate",
    employeeCount: 174000,
    founded: 1892,
    headquarters: "Boston, MA, USA",
    website: "https://www.ge.com",
    description: "American multinational conglomerate operating in aviation, power, renewable energy, and healthcare.",
    focusAreas: ["Aviation", "Power", "Renewable Energy", "Healthcare", "Industrial"],
    notableFacts: [
      "One of the oldest industrial companies",
      "Diverse industrial portfolio",
      "Strong focus on innovation",
      "Global industrial presence"
    ],
    logo: "https://logo.clearbit.com/ge.com"
  },
  "General Motors": {
    id: "general-motors",
    name: "General Motors",
    industry: "Corporate",
    employeeCount: 167000,
    founded: 1908,
    headquarters: "Detroit, MI, USA",
    website: "https://www.gm.com",
    description: "American multinational automotive corporation manufacturing vehicles and automotive parts.",
    focusAreas: ["Automotive", "Electric Vehicles", "Manufacturing", "Technology", "Mobility"],
    notableFacts: [
      "One of the largest automakers",
      "Focus on electric vehicles",
      "Strong manufacturing capabilities",
      "Global automotive presence"
    ],
    logo: "https://logo.clearbit.com/gm.com"
  },
  "Ford": {
    id: "ford",
    name: "Ford",
    industry: "Corporate",
    employeeCount: 186000,
    founded: 1903,
    headquarters: "Dearborn, MI, USA",
    website: "https://www.ford.com",
    description: "American multinational automotive corporation manufacturing vehicles and automotive parts.",
    focusAreas: ["Automotive", "Electric Vehicles", "Manufacturing", "Technology", "Mobility"],
    notableFacts: [
      "One of the largest automakers",
      "Focus on electric vehicles",
      "Strong brand recognition",
      "Global automotive presence"
    ],
    logo: "https://logo.clearbit.com/ford.com"
  },
  "Boeing": {
    id: "boeing",
    name: "Boeing",
    industry: "Corporate",
    employeeCount: 142000,
    founded: 1916,
    headquarters: "Chicago, IL, USA",
    website: "https://www.boeing.com",
    description: "American multinational aerospace corporation manufacturing aircraft, defense systems, and space systems.",
    focusAreas: ["Aerospace", "Defense", "Commercial Aviation", "Space Systems", "Manufacturing"],
    notableFacts: [
      "Largest aerospace company",
      "Major defense contractor",
      "Strong commercial aviation business",
      "Global aerospace presence"
    ],
    logo: "https://logo.clearbit.com/boeing.com"
  },
  "Caterpillar": {
    id: "caterpillar",
    name: "Caterpillar",
    industry: "Corporate",
    employeeCount: 107000,
    founded: 1925,
    headquarters: "Deerfield, IL, USA",
    website: "https://www.caterpillar.com",
    description: "American corporation manufacturing construction and mining equipment, diesel engines, and locomotives.",
    focusAreas: ["Construction Equipment", "Mining Equipment", "Engines", "Manufacturing", "Services"],
    notableFacts: [
      "Largest construction equipment manufacturer",
      "Strong global presence",
      "Focus on innovation and technology",
      "Diverse industrial equipment portfolio"
    ],
    logo: "https://logo.clearbit.com/caterpillar.com"
  },
  "Honeywell": {
    id: "honeywell",
    name: "Honeywell",
    industry: "Corporate",
    employeeCount: 103000,
    founded: 1885,
    headquarters: "Charlotte, NC, USA",
    website: "https://www.honeywell.com",
    description: "American multinational conglomerate operating in aerospace, building technologies, and performance materials.",
    focusAreas: ["Aerospace", "Building Technologies", "Performance Materials", "Safety", "Automation"],
    notableFacts: [
      "Diverse industrial portfolio",
      "Strong focus on technology",
      "Global industrial presence",
      "Innovation in automation and safety"
    ],
    logo: "https://logo.clearbit.com/honeywell.com"
  },
  "3M": {
    id: "3m",
    name: "3M",
    industry: "Corporate",
    employeeCount: 95000,
    founded: 1902,
    headquarters: "Maplewood, MN, USA",
    website: "https://www.3m.com",
    description: "American multinational conglomerate manufacturing industrial, safety, and consumer products.",
    focusAreas: ["Industrial Products", "Safety", "Healthcare", "Consumer Products", "Innovation"],
    notableFacts: [
      "Diverse product portfolio",
      "Strong focus on innovation",
      "Thousands of products",
      "Global market presence"
    ],
    logo: "https://logo.clearbit.com/3m.com"
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

