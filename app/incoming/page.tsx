"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
// import { PathwayNavigationVertical } from "@/components/ui/pathway-navigation-vertical"; // DISABLED - Can be reactivated later
import { heatmapData } from "@/lib/heatmapData";
import { HeatmapCompany } from "@/lib/heatmapData";
import { CompanyType } from "@/types";

const industryColors: Record<CompanyType, string> = {
  Tech: "#8b7dff",
  Consulting: "#34d399",
  Banking: "#60a5fa",
  "PE/VC": "#fbbf24",
  Startup: "#f472b6",
  Education: "#fcd34d",
  Corporate: "#a3b8cc",
  Other: "#94a3b8",
};

interface IncomingSource {
  company: HeatmapCompany;
  count: number;
}

export default function IncomingTalentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  // Get all companies
  const allCompanies = useMemo(() => {
    return heatmapData.children.flatMap(group => group.children);
  }, []);

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return allCompanies.filter(company =>
      company.name.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results
  }, [searchQuery, allCompanies]);

  // Calculate incoming sources for selected company
  const incomingSources = useMemo(() => {
    if (!selectedCompany) return [];

    const sources: { [key: string]: IncomingSource } = {};

    // Look through all companies to find who has exits to the selected company
    allCompanies.forEach(company => {
      company.exits.forEach(exit => {
        if (exit.to.toLowerCase() === selectedCompany.toLowerCase()) {
          if (!sources[company.id]) {
            sources[company.id] = {
              company: company,
              count: 0
            };
          }
          sources[company.id].count += exit.count;
        }
      });
    });

    return Object.values(sources).sort((a, b) => b.count - a.count);
  }, [selectedCompany, allCompanies]);

  const selectedCompanyData = allCompanies.find(
    c => c.name.toLowerCase() === selectedCompany.toLowerCase()
  );

  const totalIncoming = incomingSources.reduce((sum, source) => sum + source.count, 0);

  return (
    <div className="relative w-full min-h-screen checkered-bg p-6">
      {/* Vertical Navigation */}
      {/* DISABLED - Can be reactivated later
      <div className="fixed left-4 top-0 bottom-0 z-50 flex items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="pointer-events-auto"
        >
          <PathwayNavigationVertical />
        </motion.div>
      </div>
      */}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="rounded-sm border-2 border-gray-700 bg-gray-100 px-5 py-4 retro-outset">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:retro-pressed transition-all duration-150 retro-outset"
            >
              <ArrowLeft className="w-4 h-4 text-gray-800" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight uppercase">
                Talent Pipeline
              </h1>
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Discover where companies source their talent from
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a company (e.g., Blackstone, Google, McKinsey)..."
              className="w-full pl-10 pr-4 py-3 rounded-sm border-2 border-gray-700 bg-white outline-none text-sm text-gray-800 placeholder-gray-500 transition-all duration-150 retro-inset focus:retro-pressed"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchQuery && filteredCompanies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 mt-2 w-full max-w-[calc(100%-2.5rem)] rounded-sm border-2 border-gray-700 bg-white retro-outset shadow-lg"
            >
              {filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => {
                    setSelectedCompany(company.name);
                    setSearchQuery("");
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-all border-b border-gray-300 last:border-b-0 flex items-center gap-3"
                >
                  {company.logo && (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-6 h-6 rounded"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      {company.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {company.industry}
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Results */}
      {selectedCompany && selectedCompanyData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Selected Company Card */}
          <div className="mb-6 rounded-sm border-2 border-gray-700 bg-gray-100 p-6 retro-outset">
            <div className="flex items-center gap-4 mb-4">
              {selectedCompanyData.logo && (
                <img
                  src={selectedCompanyData.logo}
                  alt={selectedCompanyData.name}
                  className="w-16 h-16 rounded-sm border-2 border-gray-700"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight mb-1">
                  {selectedCompanyData.name}
                </h2>
                <div
                  className="inline-block px-3 py-1 rounded-sm border-2 border-gray-700 text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: industryColors[selectedCompanyData.industry] + "40",
                    color: "#374151",
                  }}
                >
                  {selectedCompanyData.industry}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">{totalIncoming}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  Total Incoming
                </div>
              </div>
            </div>
          </div>

          {/* Incoming Sources */}
          {incomingSources.length > 0 ? (
            <div className="rounded-sm border-2 border-gray-700 bg-gray-100 p-6 retro-outset">
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4">
                Top Source Companies
              </h3>
              <div className="space-y-3">
                {incomingSources.map((source, index) => {
                  const percentage = (source.count / totalIncoming) * 100;
                  return (
                    <motion.div
                      key={source.company.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-sm border-2 border-gray-700 bg-white p-4 retro-outset hover:retro-pressed transition-all cursor-pointer"
                      onClick={() => router.push(`/heatmap/${source.company.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-gray-600 w-8">
                          #{index + 1}
                        </div>
                        {source.company.logo && (
                          <img
                            src={source.company.logo}
                            alt={source.company.name}
                            className="w-10 h-10 rounded"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                            {source.company.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {source.company.industry}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-800">
                            {source.count}
                          </div>
                          <div className="text-xs text-gray-600">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-3 h-2 bg-gray-200 rounded-sm border border-gray-400 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                          className="h-full rounded-sm"
                          style={{
                            backgroundColor: industryColors[source.company.industry],
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-sm border-2 border-gray-700 bg-gray-100 p-8 retro-outset text-center">
              <p className="text-gray-600 uppercase tracking-wide">
                No incoming data available for {selectedCompanyData.name}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!selectedCompany && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto text-center py-20"
        >
          <div className="rounded-sm border-2 border-gray-700 bg-gray-100 p-12 retro-outset">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-2">
              Search for a Company
            </h3>
            <p className="text-gray-600 uppercase tracking-wide text-sm">
              Type a company name above to discover where they source their talent
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

