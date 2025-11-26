"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Database } from "lucide-react";

export default function PoweredByAviato() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <a
        href="https://www.aviato.co/"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-700 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg retro-outset hover:retro-pressed"
      >
        {/* Icon */}
        <Database className="w-4 h-4 text-gray-700" />
        
        {/* Text */}
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            Data powered by
          </span>
          <span className="text-sm font-bold text-gray-800 tracking-wide">
            Aviato
          </span>
        </div>

        {/* Hover tooltip */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap"
          >
            Intelligence for people & companies
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </a>
    </motion.div>
  );
}

