/**
 * Final Recategorization - More precise matching
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function categorizeCompany(name: string): string {
  if (!name || name === 'Unknown') return 'Other';
  
  const n = name.toLowerCase().trim();
  
  // Exact matches for common companies (most specific first)
  const exactMatches: Record<string, string> = {
    'meta': 'Big Tech',
    'alphabet': 'Big Tech',
    'google': 'Big Tech',
    'amazon': 'Big Tech',
    'apple': 'Big Tech',
    'microsoft': 'Big Tech',
    'netflix': 'Big Tech',
    'uber': 'Big Tech',
    'airbnb': 'Big Tech',
    'stripe': 'Big Tech',
    'salesforce': 'Big Tech',
    'snowflake': 'Big Tech',
    'palantir': 'Big Tech',
    'linkedin': 'Big Tech',
    'twitter': 'Big Tech',
    'oracle': 'Big Tech',
    'adobe': 'Big Tech',
    'nvidia': 'Big Tech',
    'tesla': 'Big Tech',
    'spotify': 'Big Tech',
    'paypal': 'Big Tech',
    'visa': 'Big Tech',
    'mastercard': 'Big Tech',
    'intuit': 'Big Tech',
    'cisco': 'Big Tech',
    'ibm': 'Big Tech',
    'angi': 'Big Tech',
    'wayfair': 'Big Tech',
    'ebay': 'Big Tech',
    'tencent': 'Big Tech',
    'target': 'Corporate (F500)',
    'walmart': 'Corporate (F500)',
    'costco': 'Corporate (F500)',
    'starbucks': 'Corporate (F500)',
    'nike': 'Corporate (F500)',
    'pepsi': 'Corporate (F500)',
    'coca-cola': 'Corporate (F500)',
    'bank of america': 'Investment Banking',
    'ubs': 'Investment Banking',
    'rbc': 'Investment Banking',
    'barclays': 'Investment Banking',
    'hsbc': 'Investment Banking',
    'citi': 'Investment Banking',
    'nomura': 'Investment Banking',
    'tpg': 'Private Equity',
    'gic': 'Asset Management',
    'temasek': 'Asset Management',
    'adia': 'Asset Management',
    'apax': 'Private Equity',
    'ardian': 'Private Equity',
    'permira': 'Private Equity',
    'cinven': 'Private Equity',
    'triton': 'Private Equity',
    'bridgepoint': 'Private Equity',
    'eqt': 'Private Equity',
    'cvc': 'Private Equity',
    'citizens': 'Financial Services',
    'pnc': 'Financial Services',
    'truist': 'Financial Services',
    'ally': 'Financial Services',
    'sofi': 'Financial Services',
    'chime': 'Financial Services',
    'millennium': 'Hedge Fund',
    'citadel': 'Hedge Fund',
    'bridgewater': 'Hedge Fund',
    'guggenheim partners': 'Investment Banking',
    'strategic value partners': 'Private Equity',
    'deloitte': 'Consulting',
    'pwc': 'Consulting',
    'ey': 'Consulting',
    'kpmg': 'Consulting',
    'accenture': 'Consulting',
    'mckinsey': 'Consulting',
    'bcg': 'Consulting',
    'bain': 'Consulting',
  };
  
  // Check exact matches first
  if (exactMatches[n]) return exactMatches[n];
  
  // Education / MBA
  if (/university|college|school|mba|harvard|stanford|wharton|columbia|booth|kellogg|sloan|haas|stern|fuqua|tuck|ross|darden|anderson|insead|berkeley|mit|cornell|duke|northwestern|yale|upenn|princeton|nyu|ucla|usc|chicago|michigan|virginia|carnegie|georgetown|emory|rice|vanderbilt|notre dame|texas a&m|uiuc|purdue|penn state|ohio state|florida|georgia tech|massachusetts institute|project destined|correlation one|braven|year up|sponsors for educational|seo career|prep for prep|management leadership|mlt |joblyk/i.test(n)) return 'Education / MBA';
  
  // Private Equity
  if (/blackstone|kkr|carlyle|apollo management|tpg capital|bain capital|warburg pincus|general atlantic|advent international|cvc capital|eqt partners|hellman & friedman|silver lake|vista equity|thoma bravo|providence equity|ta associates|summit partners|francisco partners|insight partners|sixth street|stepstone|centerbridge|sycamore partners|ares management|l catterton|veritas capital|apax partners|ardian|blue owl capital|oaktree capital|patient square|roark capital|audax|clearlake capital|ksl capital|bc partners|charlesbank|sk capital|omers private|new mountain|hg capital|permira|cinven|bridgepoint|pai partners|nordic capital|montagu|triton partners|onex|cerberus capital|kohlberg|welsh carson|golden gate capital|genstar|leonard green|american securities|gtcr|madison dearborn|h\.i\.g capital|lexington partners|hamilton lane|pantheon|atairos|searchlight|grain management|comvest|revelstoke|gryphon investors|alpine investors|norwest equity|platinum equity|kelso|rockwood|arclight|energy capital|kayne anderson|brookfield private|acon|sentinel capital|sun capital|american industrial|windpoint|frontenac|capvest|crestview|harvest partners|cortec|oceansound|shamrock capital|all seas capital|tidal partners|26north|bansk group|private equity fund|buyout fund|growth equity/i.test(n)) return 'Private Equity';
  
  // Venture Capital  
  if (/sequoia|andreessen|a16z|accel partners|greylock|benchmark|kleiner perkins|lightspeed venture|nea partners|index ventures|general catalyst|bessemer|founders fund|first round|union square ventures|khosla ventures|battery ventures|spark capital|sapphire ventures|norwest venture|dragoneer|coatue ventures|ribbit capital|felicis|forerunner ventures|initialized capital|lerer hippeau|maverick ventures|redpoint ventures|shasta ventures|social capital|softbank vision|y combinator|ggv capital|dst global|ivp|menlo ventures|emergence capital|valar ventures|craft ventures|lowercase capital|homebrew|floodgate fund|balderton|atomico|northzone|creandum|eqt ventures|insight venture partners|turn\/river|orbiMed|venture capital fund/i.test(n)) return 'Venture Capital';
  
  // Hedge Fund
  if (/bridgewater associates|citadel|two sigma|d\.e\. shaw|de shaw|point72|millennium management|elliott management|third point|baupost|renaissance technologies|jane street|hudson river trading|worldquant|aqr capital|viking global|rtw investments|walleye capital|mudrick capital|d1 capital|coatue management|lone pine capital|maverick capital|tiger global management|sculptor capital|farallon|canyon partners|davidson kempner|fortress investment|king street capital|anchorage capital|soros fund|moore capital|brevan howard|caxton|tudor investment|balyasny|schonfeld|magnetar capital|capula|winton group|systematica|man group|marshall wace|egerton capital|lansdowne partners|tci fund|element capital|bluecrest|graham capital|hedge fund/i.test(n)) return 'Hedge Fund';
  
  // Investment Banking
  if (/goldman sachs|morgan stanley|jpmorgan|jp morgan|j\.p\. morgan|bank of america|bofa securities|merrill lynch|citigroup|credit suisse|deutsche bank|barclays capital|ubs investment|ubs securities|evercore|lazard|centerview partners|moelis|pjt partners|perella weinberg|qatalyst|greenhill|rothschild|jefferies|hsbc securities|nomura securities|rbc capital|td securities|baird|houlihan lokey|william blair|raymond james|guggenheim securities|bnp paribas|bny mellon capital|texas capital|cantor fitzgerald|societe generale|wells fargo securities|northern trust securities|cowen|stifel|piper sandler|truist securities|keefe bruyette|oppenheimer holdings|wedbush securities|needham|craig.hallum|leerink|svb securities|lincoln international|harris williams|financo|raine group|liontree|allen & company|haitong securities|investment banking/i.test(n)) return 'Investment Banking';
  
  // Consulting
  if (/mckinsey|boston consulting group|bain & company|deloitte consulting|accenture|pricewaterhousecoopers|pwc strategy|ernst & young|ey-parthenon|kpmg|oliver wyman|l\.e\.k|lek consulting|kearney|a\.t\. kearney|strategy&|booz allen|alixpartners|monitor deloitte|parthenon|roland berger|zs associates|simon.kucher|analysis group|cornerstone research|charles river associates|clearview healthcare|putnam associates|cra international|nera economic|brattle group|compass lexecon|fti consulting|alvarez & marsal|huron consulting|navigant|west monroe|slalom|north highland|pa consulting|capgemini invent|infosys consulting|ibm consulting|stax|accordion|rsm|milliman|management consulting|strategy consulting/i.test(n)) return 'Consulting';
  
  // Big Tech
  if (/google|alphabet|meta platforms|facebook|instagram|whatsapp|amazon web|aws|microsoft|azure|apple inc|netflix|uber technologies|airbnb|stripe|salesforce|snowflake|databricks|palantir|openai|anthropic|slack|zoom video|shopify|robinhood|coinbase|doordash|lyft|twitter|linkedin|oracle|adobe|ibm|nvidia|tesla|tiktok|bytedance|bloomberg|pinterest|snap inc|spotify|dropbox|docusign|servicenow|workday|splunk|crowdstrike|okta|twilio|atlassian|asana|notion|figma|canva|instacart|klaviyo|plaid|affirm|klarna|nubank|brex|ramp|rippling|gusto|deel|lattice|airtable|monday\.com|hubspot|zendesk|intercom|datadog|elastic|confluent|hashicorp|gitlab|github|intuit|cisco|wayfair|palo alto networks|c3 ai|sap|unqork|cognizant|ebay|tencent|fanatics|angi|deliverr|takeoff technologies/i.test(n)) return 'Big Tech';
  
  // Healthcare / Pharma
  if (/pfizer|johnson & johnson|merck|novartis|roche|abbvie|bristol.myers|eli lilly|astrazeneca|sanofi|gsk|gilead|amgen|biogen|regeneron|moderna|vertex|illumina|thermo fisher|danaher|stryker|medtronic|abbott|boston scientific|intuitive surgical|unitedhealth|anthem|cigna|humana|centene|kaiser|mayo clinic|cleveland clinic|optum|veeva|iqvia|cerner|epic|medidata|flatiron|tempus|healthcare|pharma|biotech|medical|hospital|clinic|therapeutics/i.test(n)) return 'Healthcare / Pharma';
  
  // Asset Management
  if (/blackrock|fidelity investments|vanguard|state street|pimco|wellington management|t\. rowe price|franklin templeton|invesco|capital group|neuberger berman|lazard asset|brookfield asset|nuveen|pgim|principal global|dimensional fund|gic private|temasek holdings|asset management|wealth management|family office/i.test(n)) return 'Asset Management';
  
  // Financial Services
  if (/capital one|wells fargo|chase bank|citibank|us bank|pnc bank|truist|fifth third|regions bank|huntington|keybank|m&t bank|citizens bank|santander|td bank|american express|discover|synchrony|ally financial|marcus|sofi|chime|betterment|wealthfront|allstate|state farm|geico|progressive|liberty mutual|metlife|prudential|aflac|usaa|fintech|neobank|insurance|banking/i.test(n)) return 'Financial Services';
  
  // Corporate (F500)
  if (/walmart|target corporation|costco|home depot|kroger|mcdonald|starbucks|pepsico|coca.cola|general mills|procter & gamble|unilever|nike|disney|comcast|at&t|verizon|ford motor|general motors|boeing|lockheed|raytheon|honeywell|3m|caterpillar|exxon|chevron|duke energy|corporate strategy|fortune 500/i.test(n)) return 'Corporate (F500)';
  
  // Real Estate
  if (/cbre|jll|cushman|colliers|prologis|equinix|simon property|blackstone real|brookfield real|real estate|reit|property/i.test(n)) return 'Real Estate';
  
  // Government / Non-profit
  if (/federal reserve|treasury|sec |fdic|imf|world bank|usaid|state department|defense|cia|fbi|internal revenue|irs|city of|county of|state of|government|public sector|non.profit|nonprofit|foundation|ngo|philanthropic/i.test(n)) return 'Government / Non-profit';
  
  // Media / Entertainment
  if (/disney|netflix|warner|paramount|universal|sony pictures|spotify|live nation|espn|nba|nfl|creative artists|caa|endeavor|media|entertainment|streaming|gaming/i.test(n)) return 'Media / Entertainment';
  
  // Law Firm
  if (/kirkland|latham|skadden|sullivan & cromwell|wachtell|cravath|davis polk|simpson thacher|paul weiss|cleary|debevoise|gibson dunn|sidley|jones day|white & case|willkie|milbank|weil|quinn emanuel|vinson & elkins|cooley|law firm|attorney|legal/i.test(n)) return 'Law Firm';
  
  // Startup
  if (/stealth|early.stage|seed|series [a-c]|co.founder|founder|entrepreneur|techstars|accelerator|incubator/i.test(n)) return 'Startup';
  
  // Catch-all patterns for remaining
  if (/capital|partners|fund|equity|ventures|holdings|investment/i.test(n)) return 'Private Equity';
  if (/tech|software|digital|data|platform|app|labs|systems|\.ai|\.io/i.test(n)) return 'Big Tech';
  if (/consult|advisory|solutions|strategy/i.test(n)) return 'Consulting';
  if (/bank|financial|credit|loan/i.test(n)) return 'Financial Services';
  if (/health|medical|bio|pharma|clinic/i.test(n)) return 'Healthcare / Pharma';
  
  return 'Other';
}

async function main() {
  console.log('\n🔄 Final Recategorization...\n');
  
  let allExits: any[] = [];
  let from = 0;
  
  while (true) {
    const { data } = await supabase.from('exits').select('id, exit_company_name, exit_industry').range(from, from + 999);
    if (!data || data.length === 0) break;
    allExits = allExits.concat(data);
    from += 1000;
  }
  
  console.log(`📊 Processing ${allExits.length} exits\n`);
  
  const newIndustryCount: Record<string, number> = {};
  let updated = 0;
  
  for (const exit of allExits) {
    const newIndustry = categorizeCompany(exit.exit_company_name || '');
    newIndustryCount[newIndustry] = (newIndustryCount[newIndustry] || 0) + 1;
    
    if (newIndustry !== exit.exit_industry) {
      await supabase.from('exits').update({ exit_industry: newIndustry }).eq('id', exit.id);
      updated++;
    }
  }
  
  console.log('════════════════════════════════════════════════════════════');
  console.log('📊 FINAL INDUSTRY DISTRIBUTION');
  console.log('════════════════════════════════════════════════════════════\n');
  
  const sorted = Object.entries(newIndustryCount).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([industry, count]) => {
    const pct = ((count / allExits.length) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(count / allExits.length * 40));
    console.log(`  ${industry.padEnd(24)} ${String(count).padStart(5)}  (${pct.padStart(5)}%)  ${bar}`);
  });
  
  console.log(`\n📈 Total: ${allExits.length} exits`);
  console.log(`✅ Updated ${updated} exits\n`);
}

main().catch(console.error);
