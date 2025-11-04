"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sparkles } from "lucide-react";
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

const FIRM_NAMES = Object.keys(FIRM_DATA);

export default function Home() {
  const [selectedFirm, setSelectedFirm] = useState<string>("Bain & Company");
  const currentExits = FIRM_DATA[selectedFirm];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    PathSearch
                  </h1>
                  <p className="text-xs text-slate-500">
                    See where your first job can take you
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              <Select value={selectedFirm} onValueChange={setSelectedFirm}>
                <SelectTrigger className="w-64 border-2 hover:border-purple-300 transition-colors">
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
      <div className="md:hidden bg-white/80 backdrop-blur-xl border-b px-4 py-3">
        <Select value={selectedFirm} onValueChange={setSelectedFirm}>
          <SelectTrigger className="w-full border-2">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Explore career paths from {selectedFirm}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Where do consultants go next?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">About</h3>
              <p className="text-sm text-slate-600">
                PathSearch visualizes career transitions to help you understand
                where your first job can lead.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Feedback</h3>
              <p className="text-sm text-slate-600">
                Have suggestions? We&apos;d love to hear from you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">
                Data Disclaimer
              </h3>
              <p className="text-sm text-slate-600">
                Data is aggregated and anonymized for illustrative purposes.
                Individual results may vary.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            <p>© 2024 PathSearch. Built with Next.js & TailwindCSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

