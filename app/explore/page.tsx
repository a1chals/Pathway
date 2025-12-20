"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sparkles, ArrowLeft, Network, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import StatsCards from "@/components/StatsCards";
import IndustryChart from "@/components/IndustryChart";
import ExitList from "@/components/ExitList";
import ExampleExits from "@/components/ExampleExits";
import { ExitData } from "@/types";
import { searchCompanies, getCompanyExits, Company } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Company name mappings for keyboard -> search query
const COMPANY_MAPPINGS: Record<string, string> = {
  "Bain": "Bain & Company",
  "McKinsey": "McKinsey & Company",
  "BCG": "Boston Consulting Group",
  "Oliver Wyman": "Oliver Wyman",
  "A.T. Kearney": "A.T. Kearney",
  "LEK": "LEK Consulting",
  "Goldman Sachs": "Goldman Sachs",
  "JPMorgan": "JPMorgan Chase",
  "Morgan Stanley": "Morgan Stanley",
  "Bank of America": "Bank of America",
  "Citi": "Citigroup",
  "Blackstone": "Blackstone",
  "KKR": "KKR",
  "TPG": "TPG Capital",
  "Carlyle": "Carlyle Group",
  "Bain Capital": "Bain Capital",
  "Apollo": "Apollo Global Management",
  "Google": "Google",
  "Apple": "Apple",
  "Amazon": "Amazon",
  "Microsoft": "Microsoft",
  "Meta": "Meta",
  "Netflix": "Netflix",
  "Uber": "Uber",
  "Airbnb": "Airbnb",
  "Stripe": "Stripe",
  "Salesforce": "Salesforce",
  "Adobe": "Adobe",
};

// Default companies to show in dropdown
const DEFAULT_COMPANIES = [
  "McKinsey & Company",
  "Boston Consulting Group", 
  "Bain & Company",
  "Goldman Sachs",
  "Google",
  "Meta",
  "Amazon",
];

function ExplorePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firmParam = searchParams.get("firm");
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [currentExits, setCurrentExits] = useState<ExitData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExits, setIsLoadingExits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load initial companies
  useEffect(() => {
    const loadInitialCompanies = async () => {
      setIsLoading(true);
      try {
        // Search for default companies
        const searchPromises = DEFAULT_COMPANIES.map(name => 
          searchCompanies({ nameQuery: name, limit: 1 })
        );
        
        const results = await Promise.all(searchPromises);
        const foundCompanies = results
          .flatMap(r => r.items)
          .filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i); // Dedupe
        
        setCompanies(foundCompanies);

        // If there's a firm param, try to find and select it
        if (firmParam) {
          const mappedName = COMPANY_MAPPINGS[firmParam] || firmParam;
          const matchingCompany = foundCompanies.find(
            c => c.name.toLowerCase().includes(mappedName.toLowerCase())
          );
          
          if (matchingCompany) {
            setSelectedCompany(matchingCompany);
          } else {
            // Search for the company
            const searchResult = await searchCompanies({ nameQuery: mappedName, limit: 1 });
            if (searchResult.items.length > 0) {
              setSelectedCompany(searchResult.items[0]);
              setCompanies(prev => [...prev, searchResult.items[0]]);
            }
          }
        } else if (foundCompanies.length > 0) {
          setSelectedCompany(foundCompanies[0]);
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
        setError("Failed to load companies. Please check your API connection.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialCompanies();
  }, [firmParam]);

  // Load exits when company changes
  useEffect(() => {
    if (!selectedCompany) return;

    const loadExits = async () => {
      setIsLoadingExits(true);
      setError(null);
      try {
        const result = await getCompanyExits({
          companyId: selectedCompany.id,
          companyName: selectedCompany.name,
          perPage: 100,
        });
        setCurrentExits(result.exits);
      } catch (err) {
        console.error("Failed to load exits:", err);
        setError("Failed to load exit data. Please try again.");
        setCurrentExits([]);
      } finally {
        setIsLoadingExits(false);
      }
    };

    loadExits();
  }, [selectedCompany]);

  // Handle company search
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await searchCompanies({ nameQuery: searchQuery, limit: 10 });
      if (result.items.length > 0) {
        // Add new companies to the list (dedupe)
        setCompanies(prev => {
          const newCompanies = result.items.filter(
            c => !prev.some(p => p.id === c.id)
          );
          return [...prev, ...newCompanies];
        });
        setSelectedCompany(result.items[0]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleCompanyChange = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
    }
  };

  if (isLoading && companies.length === 0) {
    return (
      <div className="min-h-screen checkered-bg flex items-center justify-center">
        <div className="text-gray-600">Loading companies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen checkered-bg pt-12">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-gray-700 bg-white retro-outset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/")}
                  className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-800" />
                </button>
                <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                    Pathway
                  </h1>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    See where your first job can take you
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex items-center gap-3"
            >
              <button
                onClick={() => router.push("/heatmap")}
                className="flex items-center gap-2 px-4 py-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
              >
                <Network className="h-4 w-4 text-gray-800" />
                <span className="text-sm font-medium text-gray-800 uppercase tracking-wide">
                  Movement Map
                </span>
              </button>
              
              {/* Search input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search company..."
                  className="w-48 px-3 py-2 border-2 border-gray-700 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  onClick={handleSearch}
                  className="p-2 border-2 border-gray-700 bg-gray-700 text-white rounded-sm hover:bg-gray-600 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {companies.length > 0 && (
                <Select 
                  value={selectedCompany?.id || ""} 
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger className="w-64 border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors rounded-sm retro-outset hover:retro-pressed">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Mobile Firm Selector */}
      <div className="md:hidden bg-white border-b-2 border-gray-700 px-4 py-3 space-y-3">
        <button
          onClick={() => router.push("/heatmap")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
        >
          <Network className="h-4 w-4 text-gray-800" />
          <span className="text-sm font-medium text-gray-800 uppercase tracking-wide">
            Heatmap View
          </span>
        </button>
        
        {/* Mobile Search */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search company..."
            className="flex-1 px-3 py-2 border-2 border-gray-700 rounded-sm text-sm focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="p-2 border-2 border-gray-700 bg-gray-700 text-white rounded-sm"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {companies.length > 0 && (
          <Select 
            value={selectedCompany?.id || ""} 
            onValueChange={handleCompanyChange}
          >
            <SelectTrigger className="w-full border-2 border-gray-700 rounded-sm retro-outset">
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border-2 border-gray-700 bg-white text-gray-800 text-sm font-medium mb-4 retro-outset uppercase tracking-wide">
            <Sparkles className="h-4 w-4" />
            <span>Explore career paths{selectedCompany ? ` from ${selectedCompany.name}` : ''}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 uppercase tracking-tight">
            Where do professionals go next?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover real exit opportunities and career transitions powered by Aviato data
          </p>
        </motion.div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-sm p-4 text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {isLoadingExits ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              Loading exit data...
            </div>
          </div>
        ) : currentExits.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCompany?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <StatsCards data={currentExits} />

              {/* Charts and Top Companies Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <IndustryChart data={currentExits} />
                <ExitList data={currentExits} />
              </div>

              {/* Example Exits */}
              <ExampleExits data={currentExits} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {selectedCompany 
                ? "No exit data found for this company. Try searching for another company."
                : "Select a company to view exit data."}
            </p>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t-2 border-gray-700 mt-16 retro-outset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">About</h3>
              <p className="text-sm text-gray-600">
                Pathway visualizes career transitions to help you understand
                where your first job can lead.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Data Source</h3>
              <p className="text-sm text-gray-600">
                Powered by Aviato - comprehensive professional data on 233M+ people.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Data Disclaimer
              </h3>
              <p className="text-sm text-gray-600">
                Data is aggregated and anonymized for illustrative purposes.
                Individual results may vary.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
            <p>© 2024 Pathway. Built with Next.js & TailwindCSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen checkered-bg flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
}
