"use client";

import { useState } from "react";
import bainExitsData from "@/data/bain_exits.json";
import mckinseyExitsData from "@/data/mckinsey_exits.json";
import bcgExitsData from "@/data/bcg_exits.json";
import lekExitsData from "@/data/lek_exits.json";
import eyExitsData from "@/data/ey_exits.json";
import deloitteExitsData from "@/data/deloitte_exits.json";
import pwcExitsData from "@/data/pwc_exits.json";
import StatsCards from "@/components/StatsCards";
import IndustryChart from "@/components/IndustryChart";
import ExitList from "@/components/ExitList";
import ExampleExits from "@/components/ExampleExits";
import { ExitData } from "@/types";

const FIRM_DATA: Record<string, ExitData[]> = {
  "Bain & Company": bainExitsData as ExitData[],
  "McKinsey & Company": mckinseyExitsData as ExitData[],
  "Boston Consulting Group": bcgExitsData as ExitData[],
  "LEK Consulting": lekExitsData as ExitData[],
  "EY": eyExitsData as ExitData[],
  "Deloitte": deloitteExitsData as ExitData[],
  "PwC": pwcExitsData as ExitData[],
};

const FIRM_NAMES = Object.keys(FIRM_DATA);

export default function Home() {
  const [selectedFirm, setSelectedFirm] = useState<string>("Bain & Company");
  const currentExits = FIRM_DATA[selectedFirm];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">PathSearch</h1>
              <p className="text-slate-600 mt-1">
                See where your first job can take you.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <select
                  value={selectedFirm}
                  onChange={(e) => setSelectedFirm(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 cursor-pointer w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FIRM_NAMES.map((firm) => (
                    <option key={firm} value={firm}>
                      {firm}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Firm Selector */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4">
        <select
          value={selectedFirm}
          onChange={(e) => setSelectedFirm(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {FIRM_NAMES.map((firm) => (
            <option key={firm} value={firm}>
              {firm}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards data={currentExits} />

        {/* Charts and Top Companies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <IndustryChart data={currentExits} />
          <ExitList data={currentExits} />
        </div>

        {/* Example Exits */}
        <ExampleExits data={currentExits} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">About</h3>
              <p className="text-sm text-slate-600">
                PathSearch visualizes career transitions to help you understand
                where your first job can lead.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Feedback</h3>
              <p className="text-sm text-slate-600">
                Have suggestions? We&apos;d love to hear from you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
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

