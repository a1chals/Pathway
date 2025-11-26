"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function AviatoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0d4d4d] to-[#0a3d3d] border-b-2 border-[#1a5f5f]"
    >
      <a
        href="https://www.aviato.co/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2.5 px-4 text-white hover:bg-[#0f5555] transition-all duration-200 group"
      >
        {/* Aviato Icon/Logo */}
        <div className="w-5 h-5 rounded-full bg-[#c4f542] flex items-center justify-center">
          <svg
            className="w-3 h-3 text-[#0d4d4d]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
          </svg>
        </div>

        {/* Text */}
        <span className="text-sm font-medium tracking-wide">
          Want More? Get all data on Aviato
        </span>

        {/* Arrow Icon */}
        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </motion.div>
  );
}

