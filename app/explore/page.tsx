"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sparkles, ArrowLeft, Network } from "lucide-react";
import { useRouter } from "next/navigation";
import { PathwayNavigationVertical } from "@/components/ui/pathway-navigation-vertical";
import bainExitsData from "@/data/bain_exits.json";
import mckinseyExitsData from "@/data/mckinsey_exits.json";
import bcgExitsData from "@/data/bcg_exits.json";
import lekExitsData from "@/data/lek_exits.json";
import eyExitsData from "@/data/ey_exits.json";
import deloitteExitsData from "@/data/deloitte_exits.json";
import pwcExitsData from "@/data/pwc_exits.json";
import kpmgExitsData from "@/data/kpmg_exits.json";
import oliverWymanExitsData from "@/data/oliver_wyman_exits.json";
import atKearneyExitsData from "@/data/at_kearney_exits.json";
import accentureExitsData from "@/data/accenture_exits.json";
import StatsCards from "@/components/StatsCards";
import IndustryChart from "@/components/IndustryChart";
import ExitList from "@/components/ExitList";
import ExampleExits from "@/components/ExampleExits";
import { ExitData } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FIRM_DATA: Record<string, ExitData[]> = {
  "Bain & Company": bainExitsData as ExitData[],
  "McKinsey & Company": mckinseyExitsData as ExitData[],
  "Boston Consulting Group": bcgExitsData as ExitData[],
  "LEK Consulting": lekExitsData as ExitData[],
  "EY": eyExitsData as ExitData[],
  "Deloitte": deloitteExitsData as ExitData[],
  "PwC": pwcExitsData as ExitData[],
  "KPMG": kpmgExitsData as ExitData[],
  "Oliver Wyman": oliverWymanExitsData as ExitData[],
  "A.T. Kearney": atKearneyExitsData as ExitData[],
  "Accenture": accentureExitsData as ExitData[],
};

const FIRM_NAMES = Object.keys(FIRM_DATA).sort();

// Company name mappings for keyboard -> data
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

function ExplorePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firmParam = searchParams.get("firm");
  
  // Find matching firm from param
  const getInitialFirm = useCallback(() => {
    if (firmParam) {
      // Try direct match first
      if (FIRM_DATA[firmParam]) return firmParam;
      // Try company mappings
      if (COMPANY_MAPPINGS[firmParam]) return COMPANY_MAPPINGS[firmParam];
      // If no match, default to first available firm
    }
    return "Bain & Company";
  }, [firmParam]);

  const [selectedFirm, setSelectedFirm] = useState<string>(getInitialFirm());
  const currentExits = FIRM_DATA[selectedFirm] || FIRM_DATA["Bain & Company"];

  useEffect(() => {
    if (firmParam) {
      const matchedFirm = getInitialFirm();
      setSelectedFirm(matchedFirm);
    }
  }, [firmParam, getInitialFirm]);

  return (
    <div className="min-h-screen checkered-bg">
      {/* Vertical Navigation */}
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
              <Select value={selectedFirm} onValueChange={setSelectedFirm}>
                <SelectTrigger className="w-64 border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors rounded-sm retro-outset hover:retro-pressed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIRM_NAMES.map((firm) => (
                    <SelectItem key={firm} value={firm}>
                      {firm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <Select value={selectedFirm} onValueChange={setSelectedFirm}>
          <SelectTrigger className="w-full border-2 border-gray-700 rounded-sm retro-outset">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FIRM_NAMES.map((firm) => (
              <SelectItem key={firm} value={firm}>
                {firm}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            <span>Explore career paths from {selectedFirm}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 uppercase tracking-tight">
            Where do consultants go next?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover real exit opportunities and career transitions from top consulting firms
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFirm}
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
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t-2 border-gray-700 mt-16 retro-outset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">About</h3>
              <p className="text-sm text-gray-600">
                PathSearch visualizes career transitions to help you understand
                where your first job can lead.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Feedback</h3>
              <p className="text-sm text-gray-600">
                Have suggestions? We&apos;d love to hear from you.
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
            <p>© 2024 PathSearch. Built with Next.js & TailwindCSS.</p>
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
