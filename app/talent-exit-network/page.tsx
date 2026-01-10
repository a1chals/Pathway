"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Network, ChevronDown, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCompanySummaries,
  CompanySummary,
} from '@/lib/talentExitNetwork';

export default function TalentExitNetworkPage() {
  const router = useRouter();
  const [category, setCategory] = useState<'investment_banking' | 'consulting'>('investment_banking');
  const [companies, setCompanies] = useState<Map<string, CompanySummary>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      setLoading(true);
      try {
        const data = await getCompanySummaries(category);
        setCompanies(data);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, [category]);

  const handleCompanyClick = (companyName: string) => {
    router.push(`/talent-exit-network/company?company=${encodeURIComponent(companyName)}&category=${category}`);
  };

  const companiesArray = Array.from(companies.entries()).sort((a, b) => b[1].totalExits - a[1].totalExits);

  return (
    <div className="min-h-screen checkered-bg pt-12">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-gray-700 bg-white retro-outset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
              >
                <ArrowLeft className="h-5 w-5 text-gray-800" />
              </button>
              <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                <Network className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                  Talent Exit Network
                </h1>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  Where do professionals exit to by industry
                </p>
              </div>
            </motion.div>
            
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
              >
                <Building2 className="h-4 w-4 text-gray-800" />
                <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  {category === 'investment_banking' ? 'Investment Banking' : 'Consulting'}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-800 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 rounded-sm border-2 border-gray-700 bg-white retro-outset shadow-lg z-50"
                  >
                    <button
                      onClick={() => {
                        setCategory('investment_banking');
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-300 flex items-center gap-3 ${
                        category === 'investment_banking' ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-wide">Investment Banking</div>
                        <div className="text-xs text-gray-600">7 firms</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setCategory('consulting');
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        category === 'consulting' ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-wide">Consulting</div>
                        <div className="text-xs text-gray-600">10 firms</div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
            <div className="text-center">
              <div className="text-gray-800 text-lg mb-2">Loading...</div>
              <div className="text-gray-600 text-sm">Fetching company data</div>
            </div>
          </div>
        ) : companiesArray.length === 0 ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
            <div className="text-center">
              <div className="text-gray-800 text-lg mb-2">No data available</div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2">
                {category === 'investment_banking' ? 'Investment Banking Firms' : 'Consulting Firms'}
              </h2>
              <p className="text-sm text-gray-600">
                Click on a company to see where their alumni exit to by industry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companiesArray.map(([companyName, summary], index) => (
                <motion.button
                  key={companyName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCompanyClick(companyName)}
                  className="p-6 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed text-left"
                >
                  {/* Logo and Name */}
                  <div className="flex items-start gap-4 mb-4">
                    {summary.logoUrl ? (
                      <img
                        src={summary.logoUrl}
                        alt={summary.displayName}
                        className="w-12 h-12 rounded-sm border border-gray-300 object-contain bg-white p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-sm border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-base uppercase tracking-wide mb-1 truncate">
                        {summary.displayName}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">{summary.totalExits}</span> total exits
                      </div>
                    </div>
                  </div>

                  {/* Top Industries */}
                  {summary.topIndustries.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Top Industries</div>
                      <div className="flex flex-wrap gap-2">
                        {summary.topIndustries.slice(0, 3).map((industry, i) => (
                          <div
                            key={i}
                            className="px-2 py-1 rounded-sm border border-gray-300 bg-gray-50 text-xs text-gray-700"
                          >
                            {industry.industry} ({industry.percentage}%)
                          </div>
                        ))}
                        {summary.topIndustries.length > 3 && (
                          <div className="px-2 py-1 rounded-sm border border-gray-300 bg-gray-50 text-xs text-gray-500">
                            +{summary.topIndustries.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
