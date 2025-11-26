"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Database, X } from "lucide-react";

export default function PoweredByAviato() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="relative">
          <a
            href="https://www.aviato.co/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group flex items-center gap-3 px-5 py-3 rounded-lg border-2 border-[#0d4d4d] bg-gradient-to-br from-[#0d4d4d] to-[#0a3d3d] backdrop-blur-sm transition-all duration-200 hover:from-[#0f5555] hover:to-[#0c4545] hover:shadow-lg hover:shadow-[#c4f542]/20"
          >
            {/* Icon */}
            <Database className="w-5 h-5 text-[#c4f542]" />
            
            {/* Text */}
            <div className="flex flex-col items-start">
              <span className="text-[11px] text-[#c4f542]/70 uppercase tracking-wider font-medium">
                Data powered by
              </span>
              <span className="text-base font-bold text-white tracking-wide">
                Aviato
              </span>
            </div>

            {/* Hover tooltip */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#0d4d4d] text-white text-xs rounded-md whitespace-nowrap border border-[#c4f542]/30"
              >
                Intelligence for people & companies
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0d4d4d]" />
              </motion.div>
            )}
          </a>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsVisible(false);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#c4f542] hover:bg-[#b3e832] text-[#0d4d4d] flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

