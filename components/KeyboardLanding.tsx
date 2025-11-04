"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface KeyProps {
  company: string;
  size?: "normal" | "wide" | "extra-wide";
  onClick?: () => void;
}

const Key = ({ company, size = "normal", onClick }: KeyProps) => {
  const sizeClasses = {
    normal: "w-14 h-14",
    wide: "w-20 h-14",
    "extra-wide": "w-28 h-14",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${sizeClasses[size]}
        border-2 border-gray-700 bg-white
        rounded-sm text-[10px] font-medium text-gray-800
        transition-all duration-150
        flex items-center justify-center
        retro-outset hover:retro-pressed
        active:retro-pressed
      `}
    >
      <span className="leading-tight text-center px-1 uppercase tracking-wide">
        {company}
      </span>
    </motion.button>
  );
};

const companies = {
  row1: [
    "Bain", "McKinsey", "BCG", "EY", "Deloitte", "PwC", "KPMG", "Accenture",
    "Oliver Wyman", "A.T. Kearney", "LEK"
  ],
  row2: [
    "Goldman Sachs", "JPMorgan", "Morgan Stanley", "Bank of America", "Citi",
    "Blackstone", "KKR", "TPG", "Carlyle", "Bain Capital", "Apollo"
  ],
  row3: [
    "Google", "Apple", "Amazon", "Microsoft", "Meta", "Netflix", "Uber",
    "Airbnb", "Stripe", "Salesforce", "Adobe"
  ],
  row4: [
    "Sequoia", "Andreessen", "General Catalyst", "Accel", "DoorDash",
    "Spotify", "Tesla", "Zoom", "LinkedIn"
  ],
};

export default function KeyboardLanding() {
  const router = useRouter();

  const handleKeyClick = (company: string) => {
    // Navigate to explore page with company filter
    router.push(`/explore?firm=${encodeURIComponent(company)}`);
  };

  return (
    <div className="min-h-screen checkered-bg flex flex-col items-center justify-center p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 tracking-tight">
          PATHSEARCH
        </h1>
        <p className="text-lg text-gray-700 mb-2 uppercase tracking-wider">
          Explore career paths from top companies
        </p>
        <p className="text-sm text-gray-600 uppercase tracking-wide">
          Click any key to discover exit opportunities
        </p>
      </motion.div>

      {/* Keyboard Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-5xl"
      >
        {/* Keyboard Base */}
        <div className="bg-gray-100 border-4 border-gray-700 rounded-lg p-6 retro-outset relative z-10">
          {/* Row 1 - Top Row */}
          <div className="flex gap-2 mb-2 justify-center">
            {companies.row1.map((company, index) => (
              <Key
                key={`row1-${index}`}
                company={company}
                size={index === 9 ? "wide" : "normal"}
                onClick={() => handleKeyClick(company)}
              />
            ))}
          </div>

          {/* Row 2 - Home Row */}
          <div className="flex gap-2 mb-2 justify-center">
            <div className="w-8" /> {/* Spacer for Tab */}
            {companies.row2.slice(0, 10).map((company, index) => (
              <Key
                key={`row2-${index}`}
                company={company}
                size={index === 9 ? "wide" : "normal"}
                onClick={() => handleKeyClick(company)}
              />
            ))}
          </div>

          {/* Row 3 - Bottom Row */}
          <div className="flex gap-2 mb-2 justify-center">
            <div className="w-12" /> {/* Spacer for Caps Lock */}
            {companies.row3.map((company, index) => (
              <Key
                key={`row3-${index}`}
                company={company}
                size={index === 9 ? "wide" : "normal"}
                onClick={() => handleKeyClick(company)}
              />
            ))}
          </div>

          {/* Row 4 - Space Bar Row */}
          <div className="flex gap-2 mb-2 justify-center">
            <div className="w-16" /> {/* Spacer */}
            {companies.row4.slice(0, 7).map((company, index) => (
              <Key
                key={`row4-${index}`}
                company={company}
                size={index === 5 ? "extra-wide" : "normal"}
                onClick={() => handleKeyClick(company)}
              />
            ))}
          </div>

          {/* Space Bar */}
          <div className="flex gap-2 justify-center mt-4">
            <motion.button
              onClick={() => router.push("/explore")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full max-w-2xl h-14 border-2 border-gray-700 bg-white rounded-sm flex items-center justify-center transition-all duration-150 retro-outset hover:retro-pressed active:retro-pressed"
            >
              <span className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                EXPLORE ALL COMPANIES
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-gray-600 uppercase tracking-wide">
          Select a company to view career transition data
        </p>
      </motion.div>
    </div>
  );
}


