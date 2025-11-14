"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Info, X } from "lucide-react";
import { useRouter } from "next/navigation";
// import { PathwayNavigationVertical } from "@/components/ui/pathway-navigation-vertical"; // DISABLED - Can be reactivated later
import Treemap from "@/components/Treemap";
import { heatmapData } from "@/lib/heatmapData";
import { CompanyType } from "@/types";

const industryColors: Record<CompanyType, Record<string, string>> = {
  Tech: { bg: "#8b7dff", text: "#8b7dff" },
  Consulting: { bg: "#34d399", text: "#34d399" },
  Banking: { bg: "#60a5fa", text: "#60a5fa" },
  "PE/VC": { bg: "#fbbf24", text: "#fbbf24" },
  Startup: { bg: "#f472b6", text: "#f472b6" },
  Education: { bg: "#fcd34d", text: "#fcd34d" },
  Corporate: { bg: "#a3b8cc", text: "#a3b8cc" },
  Other: { bg: "#94a3b8", text: "#94a3b8" },
};

export default function HeatmapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeWindow, setTimeWindow] = useState<"1year" | "2years" | "all">("all");
  const [filteredTypes, setFilteredTypes] = useState<Set<CompanyType>>(
    new Set(["Consulting", "Banking", "Tech", "PE/VC", "Startup", "Corporate", "Education", "Other"])
  );
  const [showInfo, setShowInfo] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchQuery) return heatmapData;

    const query = searchQuery.toLowerCase();
    const filteredChildren = heatmapData.children
      .map(group => ({
        ...group,
        children: group.children.filter(company =>
          company.name.toLowerCase().includes(query)
        ),
      }))
      .filter(group => group.children.length > 0);

    return {
      ...heatmapData,
      children: filteredChildren,
    };
  }, [searchQuery]);

  const allCompanies = useMemo(() => {
    return heatmapData.children.flatMap(group => group.children);
  }, []);

  const handleToggleType = (type: CompanyType) => {
    setFilteredTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const types: CompanyType[] = ["Consulting", "Banking", "Tech", "PE/VC", "Startup", "Corporate", "Education", "Other"];

  return (
    <div className="min-h-screen checkered-bg">
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
      <header className="sticky top-0 z-50 w-full border-b-2 border-gray-700 bg-white retro-outset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Logo and Title */}
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
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                    Movement Map
                  </h1>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Visual exploration of talent movement
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Search and Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex items-center gap-3 flex-1 justify-end"
            >
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies..."
                  className="w-full pl-10 pr-4 py-2 rounded-sm border-2 border-gray-700 bg-white outline-none text-sm text-gray-800 placeholder-gray-500 transition-all duration-150 retro-inset focus:retro-pressed"
                />
              </div>
              <div className="flex items-center gap-1 border-2 border-gray-700 bg-white rounded-sm p-1 retro-inset">
                {(["1year", "2years", "all"] as const).map((window) => (
                  <button
                    key={window}
                    onClick={() => setTimeWindow(window)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-150 uppercase tracking-wide ${
                      timeWindow === window 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {window === "1year" ? "Past Year" : window === "2years" ? "Past 2 Years" : "All Time"}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Mobile Search and Controls */}
      <div className="md:hidden bg-white border-b-2 border-gray-700 px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies..."
            className="w-full pl-10 pr-4 py-2 rounded-sm border-2 border-gray-700 bg-white outline-none text-sm text-gray-800 placeholder-gray-500 transition-all duration-150 retro-inset focus:retro-pressed"
          />
        </div>
        <div className="flex items-center gap-1 border-2 border-gray-700 bg-white rounded-sm p-1 retro-inset">
          {(["1year", "2years", "all"] as const).map((window) => (
            <button
              key={window}
              onClick={() => setTimeWindow(window)}
              className={`flex-1 px-2 py-1.5 rounded-sm text-xs font-medium transition-all duration-150 uppercase tracking-wide ${
                timeWindow === window 
                  ? "bg-gray-700 text-white" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {window === "1year" ? "Past Year" : window === "2years" ? "2 Years" : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-sm border-2 border-gray-700 bg-white px-6 py-4 retro-outset"
        >
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">
                {allCompanies.length}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Companies</div>
            </div>
            <div className="w-px h-12 bg-gray-400" />
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">
                {allCompanies.reduce((sum, c) => sum + c.outgoing, 0)}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Transitions</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Treemap Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative" style={{ height: "calc(100vh - 320px)", minHeight: "500px" }}>
          <Treemap
            data={filteredData}
            filteredTypes={filteredTypes}
          />
        </div>

        {/* Filter Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-sm border-2 border-gray-700 bg-white p-4 retro-outset"
        >
          <div className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-800">
            Filter by Industry
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {types.map((type) => {
              const isActive = filteredTypes.has(type);
              const colors = industryColors[type];
              
              return (
                <button
                  key={type}
                  onClick={() => handleToggleType(type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-sm border-2 border-gray-700 transition-all duration-150 ${
                    isActive ? "bg-gray-700 text-white" : "bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-sm border border-gray-700"
                    style={{ backgroundColor: colors.bg }}
                  />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {type}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-300">
            <button
              onClick={() => {
                if (filteredTypes.size === types.length) {
                  types.forEach(type => handleToggleType(type));
                } else {
                  types.forEach(type => {
                    if (!filteredTypes.has(type)) {
                      handleToggleType(type);
                    }
                  });
                }
              }}
              className="text-xs font-medium hover:underline transition-all uppercase tracking-wide text-gray-600 hover:text-gray-800"
            >
              {filteredTypes.size === types.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

