"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Info, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
    <div className="relative w-full h-screen overflow-hidden checkered-bg">

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-3 left-3 right-3 z-40"
      >
        <div
          className="rounded-sm border-2 border-gray-700 bg-gray-100 px-5 py-3 flex items-center justify-between retro-outset"
        >
          {/* Left: Back + Search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:retro-pressed transition-all duration-150 retro-outset"
            >
              <ArrowLeft className="w-4 h-4 text-gray-800" />
            </button>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-2 rounded-sm border-2 border-gray-700 bg-white outline-none text-sm text-gray-800 placeholder-gray-500 transition-all duration-150 retro-inset focus:retro-pressed"
              />
            </div>
          </div>

          {/* Center: Title */}
          <div className="text-center px-8">
            <h1 className="text-base font-bold text-gray-800 tracking-tight uppercase">
              Career Transition Heatmap
            </h1>
            <p className="text-xs text-gray-600 uppercase tracking-wide">
              Visual exploration of talent movement
            </p>
          </div>

          {/* Right: Time Window */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="flex items-center gap-1 border-2 border-gray-700 bg-white rounded-sm p-1 retro-inset">
              {(["1year", "2years", "all"] as const).map((window) => (
                <button
                  key={window}
                  onClick={() => setTimeWindow(window)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-150 uppercase tracking-wide ${
                    timeWindow === window 
                      ? "border-2 border-gray-700 bg-white retro-outset text-gray-800" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {window === "1year" ? "Past Year" : window === "2years" ? "Past 2 Years" : "All Time"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Treemap */}
      <div className="absolute inset-0 pt-20 pb-2 px-3">
        <Treemap
          data={filteredData}
          filteredTypes={filteredTypes}
        />
      </div>

      {/* Filter Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed bottom-4 left-4 rounded-sm border-2 border-gray-700 bg-gray-100 p-3 w-56 z-40 retro-outset"
      >
        <div className="text-[10px] font-bold uppercase tracking-wider mb-2 text-gray-800">
          Industry Types
        </div>
        
        <div className="space-y-1.5">
          {types.map((type) => {
            const isActive = filteredTypes.has(type);
            const colors = industryColors[type];
            
            return (
              <button
                key={type}
                onClick={() => handleToggleType(type)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border-2 border-gray-700 transition-all duration-150 ${
                  isActive ? "bg-white retro-outset" : "bg-gray-200 opacity-50 hover:opacity-75"
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full border border-gray-700"
                  style={{ backgroundColor: colors.bg }}
                />
                <span className="text-xs font-medium text-gray-800">
                  {type}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 pt-2 border-t border-gray-400">
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
            className="w-full text-[10px] font-medium hover:underline transition-all uppercase tracking-wide text-gray-600 hover:text-gray-800"
          >
            {filteredTypes.size === types.length ? "Deselect All" : "Select All"}
          </button>
        </div>
      </motion.div>

      {/* Info Icon (bottom-right) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => setShowInfo(!showInfo)}
        className="fixed bottom-4 right-4 w-10 h-10 rounded-sm border-2 border-gray-700 bg-white flex items-center justify-center z-40 hover:retro-pressed transition-all duration-150 retro-outset"
      >
        {showInfo ? (
          <X className="w-4 h-4 text-gray-800" />
        ) : (
          <Info className="w-4 h-4 text-gray-600" />
        )}
      </motion.button>

      {/* Info Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 right-4 rounded-sm border-2 border-gray-700 bg-gray-100 p-4 w-72 z-40 retro-outset"
          >
            <div className="text-sm font-bold mb-3 text-gray-800 uppercase tracking-wide">
              How to Use
            </div>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-gray-800" />
                <span>Size = company employee count</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-gray-800" />
                <span>Color = industry type</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-gray-800" />
                <span>Hover for company details</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-gray-800" />
                <span>Click to view detailed exit flow</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed top-20 right-4 rounded-sm border-2 border-gray-700 bg-gray-100 px-4 py-2.5 z-30 retro-outset"
      >
        <div className="flex items-center gap-6">
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {allCompanies.length}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Companies</div>
          </div>
          <div className="w-px h-8 bg-gray-400" />
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {allCompanies.reduce((sum, c) => sum + c.outgoing, 0)}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Transitions</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

