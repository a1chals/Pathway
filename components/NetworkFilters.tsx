"use client";

import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

interface NetworkFiltersProps {
  onSearch: (query: string) => void;
  timeWindow: "1year" | "2years" | "all";
  onTimeWindowChange: (window: "1year" | "2years" | "all") => void;
}

export default function NetworkFilters({
  onSearch,
  timeWindow,
  onTimeWindowChange,
}: NetworkFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="fixed top-6 left-6 right-6 md:right-auto md:w-96 z-40"
    >
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        {/* Time Window Filter */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Time Window
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onTimeWindowChange("1year")}
              className={`
                px-3 py-2 rounded-lg text-xs font-medium transition-all
                ${timeWindow === "1year"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              Past Year
            </button>
            <button
              onClick={() => onTimeWindowChange("2years")}
              className={`
                px-3 py-2 rounded-lg text-xs font-medium transition-all
                ${timeWindow === "2years"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              Past 2 Years
            </button>
            <button
              onClick={() => onTimeWindowChange("all")}
              className={`
                px-3 py-2 rounded-lg text-xs font-medium transition-all
                ${timeWindow === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              All Time
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

