/**
 * Recategorize exits with improved industry detection
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Improved categorization function with more comprehensive coverage
function categorizeCompany(name: string): string {
  const n = name.toLowerCase();
  
  // Education / MBA - Universities, business schools
  if (/university|college|school|mba|harvard|stanford|wharton|columbia|booth|kellogg|sloan|haas|stern|fuqua|tuck|ross|darden|anderson|insead|berkeley|mit|cornell|duke|northwestern|yale|upenn|princeton|nyu|ucla|usc|chicago|michigan|virginia|carnegie|georgetown|emory|rice|vanderbilt|notre dame|texas a&m|uiuc|purdue|penn state|ohio state|florida|georgia tech/i.test(n)) return 'Education / MBA';
  
  // Private Equity - Major PE firms
  if (/blackstone|kkr|carlyle|apollo|tpg|bain capital|warburg|general atlantic|advent|cvc|eqt|hellman|silver lake|vista equity|thoma bravo|providence|ta associates|summit partners|francisco partners|insight partners|sixth street|stepstone|centerbridge|sycamore|ares management|l catterton|veritas capital|apax|ardian|blue owl|oaktree|patient square|roark capital|audax|clearlake|ksl capital|bc partners|charlesbank|sk capital|omers private|new mountain|hg capital|permira|cinven|bridgepoint|pai partners|nordic capital|montagu|triton|onex|cerberus|kohlberg|welsh carson|golden gate|genstar|leonard green|american securities|gtcr|madison dearborn|h\.i\.g|lexington partners|hamilton lane|pantheon|ardian|atairos|searchlight|grain management|comvest|revelstoke|gryphon investors|alpine investors|norwest equity|platinum equity|kelso|rockwood|arclight|energy capital|kayne anderson|brookfield private|acon|sentinel capital|sun capital|american industrial|windpoint|frontenac|capvest|crestview|harvest partners|cortec|middle market|growth equity|lbo|buyout fund|private equity/i.test(n)) return 'Private Equity';
  
  // Venture Capital - VC firms
  if (/sequoia|andreessen|a16z|accel|greylock|benchmark|kleiner|lightspeed|nea|index ventures|general catalyst|bessemer|founders fund|first round|union square|khosla|battery|spark capital|sapphire ventures|norwest venture|dragoneer|tiger global ventures|coatue|ribbit capital|felicis|forerunner|initialized|lerer hippeau|maverick|redpoint|shasta|social capital|softbank vision|y combinator|yc|ggv|dstglobal|ivp|menlo ventures|emergence|valar|craft ventures|lowercase|homebrew|floodgate|balderton|atomico|northzone|creandum|eqt ventures|insight venture|turn\/river|venture capital|vc fund|series [a-e] investor/i.test(n)) return 'Venture Capital';
  
  // Hedge Fund - Hedge funds and quant firms
  if (/bridgewater|citadel|two sigma|de shaw|point72|millennium|elliott|third point|baupost|renaissance|jane street|hudson river|worldquant|aqr|chilton|viking global|rtw investments|walleye capital|mudrick capital|d1 capital|coatue management|lone pine|maverick capital|tiger global|sculptor|och.ziff|farallon|canyon|davidson kempner|fortress|king street|anchorage|cerberus|soros|moore capital|brevan howard|caxton|tudor|balyasny|millennium|schonfeld|magnetar|capula|winton|systematica|man group|marshall wace|egerton|lansdowne|tci|element capital|bluecrest|och|quantitative|quant fund|hedge fund|long.short|macro fund|distressed|credit fund|multi.strategy/i.test(n)) return 'Hedge Fund';
  
  // Investment Banking - Banks with IB divisions, boutiques
  if (/goldman sachs|morgan stanley|jpmorgan|jp morgan|j\.p\. morgan|bank of america|merrill lynch|citi|credit suisse|deutsche bank|barclays|ubs|evercore|lazard|centerview|moelis|pjt|perella|qatalyst|greenhill|rothschild|jefferies|hsbc|nomura|rbc|td securities|baird|houlihan|william blair|raymond james|guggenheim|bnp paribas|bny|texas capital|dtcc|cantor|societe generale|wells fargo securities|northern trust|cowen|stifel|piper sandler|truist|keefe bruyette|oppenheimer|wedbush|needham|craig.hallum|leerink|svb securities|lincoln international|harris williams|dc advisory|financo|peter j\. solomon|raine group|liontree|allen & co|sun trust robinson|investment bank/i.test(n)) return 'Investment Banking';
  
  // Consulting - Management consulting firms
  if (/mckinsey|boston consulting|bcg|bain & company|deloitte consulting|accenture strategy|pwc strategy|ey.parthenon|kpmg strategy|oliver wyman|lek consulting|l\.e\.k|kearney|a\.t\. kearney|strategy&|booz allen|alixpartners|monitor|parthenon|roland berger|zs associates|simon.kucher|analysis group|cornerstone|charles river|clearview healthcare|putnam associates|cra international|nera|brattle|compass lexecon|fti consulting|alvarez & marsal|huron|navigant|west monroe|slalom|north highland|pa consulting|capgemini invent|infosys consulting|tata consulting|ibm consulting|cognizant consulting|stax|accordian|management consult/i.test(n)) return 'Consulting';
  
  // Big Tech - Major tech companies
  if (/google|alphabet|meta|facebook|instagram|whatsapp|amazon|aws|microsoft|azure|apple|netflix|uber|airbnb|stripe|salesforce|snowflake|databricks|palantir|openai|anthropic|slack|zoom|shopify|robinhood|coinbase|doordash|lyft|twitter|x corp|linkedin|oracle|adobe|ibm|nvidia|tesla|tiktok|bytedance|bloomberg|mastercard|visa|paypal|square|block inc|pinterest|snap|spotify|dropbox|docusign|servicenow|workday|splunk|crowdstrike|okta|twilio|atlassian|asana|notion|figma|canva|instacart|klaviyo|plaid|chime|affirm|klarna|nubank|brex|ramp|rippling|gusto|deel|lattice|airtable|monday\.com|hubspot|zendesk|intercom|datadog|elastic|confluent|hashicorp|gitlab|github|vercel|supabase|planetscale|neon/i.test(n)) return 'Big Tech';
  
  // Healthcare / Pharma - Healthcare, biotech, pharma
  if (/pfizer|johnson & johnson|j&j|merck|novartis|roche|abbvie|bristol.myers|eli lilly|astrazeneca|sanofi|gsk|glaxo|gilead|amgen|biogen|regeneron|moderna|biontech|vertex|alexion|illumina|thermo fisher|danaher|becton|stryker|medtronic|abbott|boston scientific|intuitive surgical|edwards|zimmer|baxter|cardinal health|mckesson|amerisource|cvs|walgreens|unitedhealth|anthem|cigna|humana|centene|molina|wellcare|kaiser|mayo clinic|cleveland clinic|mass general|johns hopkins|optum|change healthcare|veeva|iqvia|cerner|epic|medidata|flatiron|tempus|grail|guardant|foundation medicine|23andme|color|ro health|hims|teladoc|amwell|livongo|omada|noom|headspace|calm|cerebral|talkspace|ginger|lyra|spring health|healthcare|pharma|biotech|life science|medical device|hospital|clinic|therapeutics|bioscience|diagnostic/i.test(n)) return 'Healthcare / Pharma';
  
  // Asset Management - Traditional asset managers, wealth management
  if (/blackrock|fidelity|vanguard|state street|pimco|wellington|t\. rowe|t\.rowe|franklin templeton|invesco|capital group|american funds|jpmorgan asset|goldman sachs asset|morgan stanley investment|ubs asset|credit suisse asset|neuberger|lazard asset|brookfield asset|nuveen|pgim|principal|northern trust asset|bny mellon|ssga|dimensional|aqr|gmofunds|ariel|dodge & cox|mfs|putnam|janus|hartford|columbia threadneedle|schroders|abrdn|legal & general|m&g|baillie gifford|marathon asset|gic|temasek|adia|kkr credit|apollo credit|ares credit|owl rock|golub|antares|monroe capital|pathlight|whitehorse|newstar|tcw|crescent|blue owl credit|hps|sixth street credit|asset management|wealth management|family office|endowment|pension fund|sovereign wealth/i.test(n)) return 'Asset Management';
  
  // Financial Services - Banks, fintech, insurance (non-IB)
  if (/capital one|chase|bank of america consumer|wells fargo bank|citibank|us bank|u\.s\. bank|pnc|truist|fifth third|regions|huntington|keybank|m&t bank|citizens|santander|td bank|bmo|scotiabank|american express|amex|discover|synchrony|ally|marcus|sofi|lendingclub|prosper|upstart|avant|earnest|commonbond|laurel road|figure|better\.com|rocket mortgage|blend|divvy|bilt|point|aven|upgrade|oportun|dave|current|varo|monzo|revolut|n26|chime consumer|greenlight|step|copper|till|acorns|betterment|wealthfront|personal capital|ellevest|m1 finance|public\.com|titan|stash|qapital|digit|albert|cleo|brigit|empower|nerdwallet|credit karma|mint|truebill|trim|cushion|aura|experian|equifax|transunion|fico|allstate|state farm|geico|progressive|liberty mutual|travelers|hartford insurance|chubb|aig|zurich|axa|allianz|metlife|prudential insurance|lincoln financial|principal financial|aflac|unum|guardian|mass mutual|new york life|northwestern mutual|tiaa|voya|aegon|ing|manulife|sunlife|great west|transamerica|pacific life|nationwide|usaa|lemonade|hippo|root|metromile|clearcover|branch|kin|jetty|sure|bestow|ladder|ethos|haven life|policygenius|the zebra|gabi|insurance|fintech|neobank|digital bank|payments|lending|credit/i.test(n)) return 'Financial Services';
  
  // Corporate (F500) - Fortune 500 and major corporations
  if (/walmart|amazon retail|target|costco|home depot|lowe|kroger|walgreens boots|cvs health|albertsons|publix|mcdonald|starbucks|chipotle|yum brands|restaurant brands|domino|darden|coca.cola|pepsico|nestle|mondelez|kraft heinz|general mills|kellogg|campbell|conagra|hormel|tyson|jbs|cargill|adm|bunge|procter|unilever|colgate|kimberly.clark|estee lauder|l'oreal|clorox|church & dwight|energizer|spectrum brands|nike|adidas|under armour|lululemon|vf corp|pvh|tapestry|capri|hanesbrands|gap|h&m|zara|inditex|fast retailing|lvmh|kering|hermes|richemont|ralph lauren|disney|comcast|at&t|verizon|t-mobile|charter|fox|paramount|warner|sony|universal|live nation|mgm|caesars|wynn|marriott|hilton|ihg|hyatt|airbnb ops|expedia|booking|tripadvisor|ford|gm|general motors|toyota|honda|volkswagen|bmw|mercedes|stellantis|rivian|lucid|boeing|airbus|lockheed|raytheon|northrop|general dynamics|l3harris|textron|ge aerospace|honeywell|3m|caterpillar|deere|parker|emerson|rockwell|illinois tool|eaton|dover|ingersoll|xylem|fortive|ametek|roper|idex|graco|lincoln electric|stanley black|snap-on|kennametal|exxon|chevron|conocophillips|occidental|pioneer|devon|diamondback|eog|marathon petroleum|valero|phillips 66|bp|shell|total|equinor|eni|duke energy|southern|dominion|nextera|aep|exelon|xcel|entergy|firstenergy|ppl|evergy|consolidated edison|at&t|verizon|lumen|frontier|charter|t-mobile|dish|altice|liberty broadband|f500|fortune 500|corporate strategy|corp dev|corporate development/i.test(n)) return 'Corporate (F500)';
  
  // Real Estate - Real estate firms, REITs
  if (/cbre|jll|cushman|colliers|newmark|marcus & millichap|eastdil|hff|berkadia|walker & dunlop|greystar|brookfield real|blackstone real|starwood capital|colony|prologis|equinix|digital realty|crown castle|american tower|simon property|brookfield property|boston properties|vornado|sl green|kilroy|alexandria|biomed realty|healthpeak|welltower|ventas|invitation homes|american homes|progress residential|tricon|pretium|amherst|cerberus real|ares real|oaktree real|apollo real|tpg real|carlyle real|kkr real|blackrock real|jpmorgam real|goldman real|morgan stanley real|cim group|related|tishman|hines|trammel crow|lincoln property|lendlease|skanska|turner|bechtel|aecom|jacobs|wsp|stantec|real estate|reit|property|commercial real estate|residential real estate|multifamily|industrial real estate|retail real estate/i.test(n)) return 'Real Estate';
  
  // Government / Non-profit / NGO
  if (/federal reserve|treasury|sec |securities and exchange|fdic|occ|cfpb|fhfa|fra|imf|world bank|ifc|ebrd|adb|aiib|undp|unicef|who|usaid|state department|defense department|pentagon|cia|nsa|fbi|doj|dhs|epa|fda|cdc|nih|nasa|doe|department of|white house|congress|senate|house of representatives|supreme court|internal revenue|irs|city of|county of|state of|government|public sector|non.profit|nonprofit|foundation|charity|ngo|philanthropic|gates foundation|ford foundation|rockefeller|bloomberg philanthropies|open society|macarthur|hewlett|packard foundation|moore foundation|walton|lilly endowment|kresge|carnegie|mellon foundation|knight foundation|pew|annie e casey|robert wood johnson|california endowment|weingart|simons foundation|kavli|gordon moore|sloan foundation|templeton|william and flora hewlett|david and lucile packard|sponsors for educational|seo|prep for prep|management leadership|mlt|joblyk|braven|year up/i.test(n)) return 'Government / Non-profit';
  
  // Startup - Early stage companies, accelerators
  if (/stealth|startup|early.stage|seed.stage|series a|series b|pre.seed|co.founder|founder|entrepreneur|techstars|500 startups|plug and play|alchemist|launch|antler|venture studio|incubator|accelerator|\.ai$|\.io$|labs$|tech$|hq$/i.test(n)) return 'Startup';
  
  // Media / Entertainment
  if (/disney|netflix|warner|paramount|universal|sony pictures|lionsgate|mgm|a24|blumhouse|legendary|amblin|bad robot|annapurna|skydance|imagine|participant|makeready|iac|viacom|fox|nbc|abc|cbs|hbo|showtime|starz|amc networks|discovery|scripps|vice|buzzfeed|vox|conde nast|hearst|meredith|time|forbes|bloomberg media|dow jones|wsj|new york times|washington post|la times|usa today|gannett|tribune|mcclatchy|news corp|spotify|pandora|siriusxm|iheartmedia|audacy|cumulus|entercom|live nation|aeg|msg|oak view|otter media|barstool|the athletic|espn|turner sports|nba|nfl|mlb|nhl|mls|pga|ufc|wwe|ea sports|activision|take.two|epic games|riot|roblox|unity|media|entertainment|content|streaming|broadcast|publishing|gaming|esports/i.test(n)) return 'Media / Entertainment';
  
  // If nothing matched, return Other
  return 'Other';
}

async function main() {
  console.log('\n🔄 Recategorizing all exits...\n');
  
  // Fetch all exits
  let allExits: any[] = [];
  let from = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data } = await supabase.from('exits').select('id, exit_company_name, exit_industry').range(from, from + pageSize - 1);
    if (!data || data.length === 0) break;
    allExits = allExits.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  
  console.log(`📊 Found ${allExits.length} exits to process\n`);
  
  // Track changes
  const changes: Record<string, { from: string; to: string; count: number }> = {};
  const newIndustryCount: Record<string, number> = {};
  let updated = 0;
  
  for (const exit of allExits) {
    const newIndustry = categorizeCompany(exit.exit_company_name || '');
    newIndustryCount[newIndustry] = (newIndustryCount[newIndustry] || 0) + 1;
    
    if (newIndustry !== exit.exit_industry) {
      const key = `${exit.exit_industry} → ${newIndustry}`;
      if (!changes[key]) changes[key] = { from: exit.exit_industry, to: newIndustry, count: 0 };
      changes[key].count++;
      
      // Update in database
      await supabase.from('exits').update({ exit_industry: newIndustry }).eq('id', exit.id);
      updated++;
    }
  }
  
  console.log('════════════════════════════════════════════════════════════');
  console.log('📊 NEW INDUSTRY DISTRIBUTION');
  console.log('════════════════════════════════════════════════════════════\n');
  
  const sorted = Object.entries(newIndustryCount).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([industry, count]) => {
    const pct = ((count / allExits.length) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(count / allExits.length * 40));
    console.log(`  ${industry.padEnd(24)} ${String(count).padStart(5)}  (${pct.padStart(5)}%)  ${bar}`);
  });
  
  console.log(`\n✅ Updated ${updated} exits\n`);
  
  // Show major reclassifications
  if (Object.keys(changes).length > 0) {
    console.log('════════════════════════════════════════════════════════════');
    console.log('🔄 RECLASSIFICATIONS');
    console.log('════════════════════════════════════════════════════════════\n');
    
    Object.entries(changes)
      .filter(([_, v]) => v.count >= 5)
      .sort((a, b) => b[1].count - a[1].count)
      .forEach(([key, { count }]) => {
        console.log(`  ${key}: ${count}`);
      });
  }
}

main().catch(console.error);
