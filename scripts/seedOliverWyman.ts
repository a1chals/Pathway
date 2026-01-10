/**
 * Seed Script - Oliver Wyman
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const AVIATO_API_KEY = process.env.AVIATO_API_KEY;
const AVIATO_BASE_URL = process.env.AVIATO_API_BASE_URL || 'https://data.api.aviato.co';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!AVIATO_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MAX_EMPLOYEES = 1500;
const EXIT_DATE_CUTOFF = new Date('2020-01-01');
const RATE_LIMIT_MS = 400;

const OLIVER_WYMAN = {
  displayName: 'Oliver Wyman',
  aliases: ['oliver wyman', 'oliverwyman']
};

// Simple and accurate - Aviato locations always end with country name
function isUSA(location: string | null): boolean {
  if (!location) return false;
  return location.toLowerCase().includes('united states');
}

function isOliverWyman(name: string): boolean {
  const n = name.toLowerCase();
  return OLIVER_WYMAN.aliases.some(a => n.includes(a));
}

function categorizeCompany(name: string): string {
  const n = name.toLowerCase();
  
  if (/university|college|school|mba|harvard|stanford|wharton|columbia|booth|kellogg|sloan|haas|stern|fuqua|tuck|ross|darden|anderson|insead|berkeley|mit|cornell|duke|northwestern|yale|upenn/i.test(n)) return 'Education / MBA';
  if (/blackstone|kkr|carlyle|apollo|tpg|bain capital|warburg|general atlantic|advent|cvc|eqt|hellman|silver lake|vista equity|thoma bravo|providence|ta associates|summit partners|francisco partners|insight partners|sixth street|stepstone/i.test(n)) return 'Private Equity';
  if (/sequoia|andreessen|a16z|accel|greylock|benchmark|kleiner|lightspeed|nea|index ventures|general catalyst|bessemer|founders fund|first round|union square|khosla|battery|spark capital/i.test(n)) return 'Venture Capital';
  if (/bridgewater|citadel|two sigma|de shaw|point72|millennium|elliott|third point|baupost|tiger global|renaissance|jane street|hudson river|worldquant|aqr|chilton/i.test(n)) return 'Hedge Fund';
  if (/goldman sachs|morgan stanley|jpmorgan|jp morgan|j\.p\. morgan|bank of america|merrill lynch|citi|credit suisse|deutsche bank|barclays|ubs|evercore|lazard|centerview|moelis|pjt|perella|qatalyst|greenhill|rothschild|jefferies|hsbc|nomura|rbc|td securities|baird|houlihan|william blair|raymond james|guggenheim|bnp paribas|bny|texas capital|dtcc|cantor|societe generale|wells fargo|northern trust/i.test(n)) return 'Investment Banking';
  if (/mckinsey|boston consulting|bcg|bain & company|deloitte|accenture|pwc|ey |ernst|kpmg|oliver wyman|lek|kearney|strategy&|booz allen|alixpartners|monitor|parthenon/i.test(n)) return 'Consulting';
  if (/google|alphabet|meta|facebook|amazon|microsoft|apple|netflix|uber|airbnb|stripe|salesforce|snowflake|databricks|palantir|openai|slack|zoom|shopify|robinhood|coinbase|doordash|lyft|twitter|linkedin|oracle|adobe|ibm|nvidia|tesla|tiktok|bloomberg|mastercard|visa|verizon|indeed|nextdoor|cognizant|nerdwallet|nutanix|cash app|comcast/i.test(n)) return 'Big Tech';
  if (/blackrock|fidelity|vanguard|state street|pimco|wellington|t\. rowe|t\.rowe|franklin|invesco|asset management|wealth|advisors|calstrs|epoch|cerity|mariner|ameriprise/i.test(n)) return 'Asset Management';
  if (/insurance|prudential|aetna|cigna|humana|united health|kaiser|anthem|aflac|massmutual|aon|axis/i.test(n)) return 'Corporate';
  if (/startup|\.io|\.ai|fintech|healthtech|edtech|saas|series [a-d]|seed stage/i.test(n)) return 'Startup';
  
  return 'Other';
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 5): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        await sleep(Math.pow(2, i + 1) * 1000);
        continue;
      }
      return res;
    } catch (e) {
      if (i < retries - 1) {
        await sleep(Math.pow(2, i + 1) * 1000);
        continue;
      }
      throw e;
    }
  }
  return fetch(url, options);
}

function getHeaders() {
  return {
    'Authorization': `Bearer ${AVIATO_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

let totalApiCalls = 0;
let totalExits = 0;
let skippedUSA = 0;
let skipped2020 = 0;

async function main() {
  console.log('════════════════════════════════════════════════════════════');
  console.log('📊 Processing: Oliver Wyman');
  console.log('════════════════════════════════════════════════════════════\n');

  console.log('🔍 Searching for Oliver Wyman...');
  await sleep(RATE_LIMIT_MS);
  const searchRes = await fetchWithRetry(`${AVIATO_BASE_URL}/company/search`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ dsl: { nameQuery: 'Oliver Wyman', limit: 10, offset: 0 } }),
  });
  totalApiCalls++;
  
  const searchData = await searchRes.json();
  console.log('Search results:', searchData.items?.map((c: any) => `${c.name} (${c.id})`));
  
  const company = searchData.items?.find((c: any) => 
    c.name.toLowerCase().includes('oliver wyman')
  );
  
  if (!company) {
    console.log('❌ Company not found');
    return;
  }
  console.log(`✅ Found: ${company.name} (ID: ${company.id})`);

  await supabase.from('companies').upsert({
    aviato_id: company.id,
    name: company.name,
    country: company.country,
    region: company.region,
    locality: company.locality,
    industry_list: company.industryList || [],
    website: company.URLs?.website,
    linkedin: company.URLs?.linkedin,
    employee_count: company.employeeCount,
    founded_year: company.foundedYear,
  }, { onConflict: 'aviato_id' });
  console.log('💾 Saved company\n');

  console.log('📋 Fetching former employees...');
  let allEmployees: any[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && allEmployees.length < MAX_EMPLOYEES) {
    await sleep(RATE_LIMIT_MS);
    const empRes = await fetchWithRetry(
      `${AVIATO_BASE_URL}/company/employees?id=${company.id}&perPage=100&page=${page}&current=false`,
      { headers: getHeaders() }
    );
    totalApiCalls++;

    if (!empRes.ok) {
      console.log(`  ❌ Page ${page} failed: ${empRes.status}`);
      page++;
      continue;
    }

    const empData = await empRes.json();
    if (empData.employees?.length > 0) {
      allEmployees = allEmployees.concat(empData.employees);
      totalPages = empData.pages || 1;
      console.log(`  Page ${page}/${totalPages}: +${empData.employees.length} (Total: ${allEmployees.length})`);
    } else {
      break;
    }
    
    if (allEmployees.length >= MAX_EMPLOYEES) {
      console.log(`  ⚠️ Hit cap of ${MAX_EMPLOYEES}`);
      allEmployees = allEmployees.slice(0, MAX_EMPLOYEES);
      break;
    }
    page++;
  }

  console.log(`\n✅ Total employees: ${allEmployees.length}`);
  console.log('👤 Enriching and finding exits...\n');

  for (let i = 0; i < allEmployees.length; i++) {
    const emp = allEmployees[i];
    
    if (i > 0 && i % 50 === 0) {
      console.log(`  Progress: ${i}/${allEmployees.length} | Exits: ${totalExits} | Non-USA: ${skippedUSA} | Pre-2020: ${skipped2020}`);
    }

    try {
      await sleep(RATE_LIMIT_MS);
      const enrichRes = await fetchWithRetry(
        `${AVIATO_BASE_URL}/person/enrich?id=${emp.personID}`,
        { headers: getHeaders() }
      );
      totalApiCalls++;

      if (!enrichRes.ok) continue;
      const person = await enrichRes.json();
      if (!person?.experienceList) continue;

      if (!isUSA(person.location)) {
        skippedUSA++;
        continue;
      }

      await supabase.from('persons').upsert({
        aviato_id: person.id,
        full_name: person.fullName,
        first_name: person.firstName,
        last_name: person.lastName,
        location: person.location,
        headline: person.headline,
        linkedin_url: person.URLs?.linkedin,
      }, { onConflict: 'aviato_id' });

      for (const exp of person.experienceList) {
        await supabase.from('experiences').upsert({
          person_id: emp.personID,
          company_id: exp.companyID,
          company_name: exp.companyName || 'Unknown',
          title: exp.positionList?.[0]?.title || 'Unknown',
          start_date: exp.startDate?.split('T')[0] || null,
          end_date: exp.endDate?.split('T')[0] || null,
          is_current: !exp.endDate,
        }, { onConflict: 'person_id,company_name,title,start_date' });
      }

      const sortedExp = [...person.experienceList].sort((a: any, b: any) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      });

      const sourceExp = sortedExp.find((exp: any) => isOliverWyman(exp.companyName || ''));

      if (!sourceExp?.endDate) continue;

      const sourceEnd = new Date(sourceExp.endDate);
      if (sourceEnd < EXIT_DATE_CUTOFF) {
        skipped2020++;
        continue;
      }

      let nextJob = null;
      for (const exp of sortedExp) {
        if (isOliverWyman(exp.companyName || '')) continue;
        
        const expStart = exp.startDate ? new Date(exp.startDate) : null;
        if (expStart && expStart >= sourceEnd) {
          if (!nextJob || expStart < new Date(nextJob.startDate)) {
            nextJob = exp;
          }
        }
      }

      if (!nextJob) continue;

      let years = 0;
      if (sourceExp.startDate && sourceExp.endDate) {
        const start = new Date(sourceExp.startDate);
        const end = new Date(sourceExp.endDate);
        years = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      }

      const { error } = await supabase.from('exits').upsert({
        person_id: emp.personID,
        source_company_id: company.id,
        source_company_name: 'Oliver Wyman',
        source_role: emp.positionList?.[0]?.title || sourceExp.positionList?.[0]?.title || 'Unknown',
        source_start_date: sourceExp.startDate?.split('T')[0] || null,
        source_end_date: sourceExp.endDate?.split('T')[0] || null,
        exit_company_id: nextJob.companyID,
        exit_company_name: nextJob.companyName || 'Unknown',
        exit_role: nextJob.positionList?.[0]?.title || 'Unknown',
        exit_start_date: nextJob.startDate?.split('T')[0] || null,
        exit_industry: categorizeCompany(nextJob.companyName || ''),
        years_at_source: Math.round(years * 100) / 100,
      }, { onConflict: 'person_id,source_company_name' });

      if (!error) totalExits++;
    } catch (e) {
      // Continue on error
    }
  }

  console.log('\n════════════════════════════════════════════════════════════');
  console.log('✅ OLIVER WYMAN COMPLETE');
  console.log('════════════════════════════════════════════════════════════');
  console.log(`  Employees processed: ${allEmployees.length}`);
  console.log(`  Exits found: ${totalExits}`);
  console.log(`  Skipped (non-USA): ${skippedUSA}`);
  console.log(`  Skipped (pre-2020): ${skipped2020}`);
  console.log(`  API calls: ${totalApiCalls}`);

  const { count: exitCount } = await supabase.from('exits').select('*', { count: 'exact', head: true });
  console.log(`\n📊 Total exits in database: ${exitCount}`);
}

main().catch(console.error);
