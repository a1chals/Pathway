"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Building2 } from "lucide-react";

interface SourceCompany {
  company: string;
  count: number;
  percentage: number;
  roles: string[];
  industry: string;
}

interface IndustryBreakdown {
  industry: string;
  count: number;
  percentage: number;
}

interface IncomingData {
  company: string;
  companyIndustry: string;
  totalIncoming: number;
  sources: SourceCompany[];
  industryBreakdown: IndustryBreakdown[];
}

export default function IncomingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [data, setData] = useState<IncomingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for company in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const company = params.get('company');
    if (company) {
      setCompanyName(company);
      handleSearch(company);
    }
  }, []);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery.trim();
    if (!searchTerm) return;

    setIsLoading(true);
    setError(null);
    setCompanyName(searchTerm);

    try {
      const response = await fetch(`/api/incoming?company=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white checkered-bg flex flex-col pt-12">
      {/* Header */}
      <header className="flex-shrink-0 bg-white px-4 py-3 border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
          >
            <ArrowLeft className="h-5 w-5 text-gray-800" />
          </button>
          <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              Talent Pipeline
            </h1>
            <p className="text-xs text-gray-500">
              Discover where companies source their talent from
            </p>
          </div>
        </div>
      </header>

      {/* Search Card */}
      <div className="px-4 py-4">
        <div className="border-2 border-gray-700 bg-white rounded-sm p-4 retro-outset">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for a company (e.g., Blackstone, Google, McKinsey)..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-500 retro-inset"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={!searchQuery.trim() || isLoading}
              className="px-4 py-2 border-2 border-gray-700 bg-gray-700 text-white rounded-sm retro-outset hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors uppercase text-xs font-bold"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      )}

      {/* Empty State */}
      {!data && !isLoading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="border-2 border-gray-700 bg-white rounded-sm p-8 text-center retro-outset max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border-2 border-gray-300 bg-gray-50 rounded-sm">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-2">
              Search for a Company
            </h2>
            <p className="text-sm text-gray-600">
              Type a company name above to discover where they source their talent
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {data && !isLoading && (
        <div className="flex-1 overflow-y-auto px-4 pb-20">
          {/* Company Info Card */}
          <div className="border-2 border-gray-700 bg-white rounded-sm p-4 mb-4 retro-outset">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide mb-2">
                  {data.company}
                </h2>
                <div className="inline-block px-3 py-1 bg-purple-100 border-2 border-purple-300 rounded-sm">
                  <span className="text-xs font-bold text-purple-800 uppercase">
                    {data.companyIndustry}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">{data.totalIncoming}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Total Incoming</div>
              </div>
            </div>
          </div>

          {/* Top Source Companies */}
          {data.sources.length > 0 && (
            <div className="border-2 border-gray-700 bg-white rounded-sm p-4 mb-4 retro-outset">
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4">
                Top Source Companies
              </h3>
              <div className="space-y-3">
                {data.sources.map((source, index) => (
                  <div
                    key={source.company}
                    className="border-2 border-gray-300 bg-gray-50 rounded-sm p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                          <h4 className="text-sm font-bold text-gray-800 uppercase">
                            {source.company}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600">{source.industry}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{source.count}</div>
                        <div className="text-xs text-gray-600">{source.percentage}%</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(source.percentage * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {data.totalIncoming === 0 && (
            <div className="border-2 border-gray-700 bg-white rounded-sm p-8 text-center retro-outset">
              <p className="text-gray-600">
                No incoming talent data found for {data.company}. This company may not be in our database yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
