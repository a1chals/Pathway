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
    normal: "w-16 h-16",
    wide: "w-24 h-16",
    "extra-wide": "w-32 h-16",
  };

  // Truncate or shorten long company names
  const displayName = company
    .replace("Oliver Wyman", "O. Wyman")
    .replace("A.T. Kearney", "A.T.K")
    .replace("Goldman Sachs", "Goldman")
    .replace("Morgan Stanley", "Morgan S.")
    .replace("Bank of America", "BofA")
    .replace("Bain Capital", "Bain Cap")
    .replace("Andreessen", "A16Z")
    .replace("General Catalyst", "Gen Cat");

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${sizeClasses[size]}
        border-2 border-gray-700 bg-white
        rounded-sm text-[9px] font-semibold text-gray-800
        transition-all duration-150
        flex items-center justify-center
        retro-outset hover:retro-pressed
        active:retro-pressed
        overflow-hidden
      `}
    >
      <span className="leading-tight text-center px-1.5 uppercase tracking-wide truncate w-full">
        {displayName}
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

// Map keyboard display names to actual company names used in heatmap data
const companyNameMap: Record<string, string> = {
  "Bain": "Bain & Company",
  "McKinsey": "McKinsey & Company",
  "BCG": "Boston Consulting Group",
  "EY": "EY",
  "Deloitte": "Deloitte",
  "PwC": "PwC",
  "KPMG": "KPMG",
  "Accenture": "Accenture",
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
  "TPG": "TPG",
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
  "Sequoia": "Sequoia Capital",
  "Andreessen": "Andreessen Horowitz",
  "General Catalyst": "General Catalyst",
  "Accel": "Accel",
  "DoorDash": "DoorDash",
  "Spotify": "Spotify",
  "Tesla": "Tesla",
  "Zoom": "Zoom",
  "LinkedIn": "LinkedIn",
};

// Convert company name to heatmap ID format
function getCompanyId(companyName: string): string {
  const actualName = companyNameMap[companyName] || companyName;
  return actualName.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

export default function KeyboardLanding() {
  const router = useRouter();

  const handleKeyClick = (company: string) => {
    // Navigate to heatmap company page
    const companyId = getCompanyId(company);
    router.push(`/heatmap/${companyId}`);
  };

  return (
    <div className="min-h-screen checkered-bg flex flex-col items-center justify-center p-8 pt-16 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-3 tracking-tight">
          PATHWAY
        </h1>
        <p className="text-base text-gray-700 mb-1 uppercase tracking-widest font-medium">
          Explore career paths from top companies
        </p>
        <p className="text-xs text-gray-600 uppercase tracking-wide">
          Click any key to discover exit opportunities
        </p>
      </motion.div>

      {/* Keyboard Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-6xl"
      >
        {/* Keyboard Base */}
        <div className="bg-gray-100 border-4 border-gray-700 rounded-lg p-8 retro-outset relative z-10 shadow-lg">
          {/* Row 1 - Top Row */}
          <div className="flex gap-2.5 mb-2.5 justify-center">
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
          <div className="flex gap-2.5 mb-2.5 justify-center">
            <div className="w-10" /> {/* Spacer for Tab */}
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
          <div className="flex gap-2.5 mb-2.5 justify-center">
            <div className="w-14" /> {/* Spacer for Caps Lock */}
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
          <div className="flex gap-2.5 mb-2.5 justify-center">
            <div className="w-20" /> {/* Spacer */}
            {companies.row4.slice(0, 7).map((company, index) => (
              <Key
                key={`row4-${index}`}
                company={company}
                size={index === 5 ? "extra-wide" : "normal"}
                onClick={() => handleKeyClick(company)}
              />
            ))}
          </div>

          {/* Space Bar / Action Buttons */}
          <div className="grid grid-cols-2 gap-3 justify-center mt-6">
            <motion.button
              onClick={() => router.push("/explore")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-16 border-2 border-gray-700 bg-white rounded-sm flex items-center justify-center transition-all duration-150 retro-outset hover:retro-pressed active:retro-pressed shadow-md"
            >
              <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                EXPLORE CONSULTING EXITS
              </span>
            </motion.button>
            <motion.button
              onClick={() => router.push("/heatmap")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-16 border-2 border-gray-700 bg-purple-500 rounded-sm flex items-center justify-center transition-all duration-150 retro-outset hover:retro-pressed active:retro-pressed shadow-md"
            >
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                MOVEMENT MAP
              </span>
            </motion.button>
            <motion.button
              onClick={() => router.push("/incoming")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-16 border-2 border-gray-700 bg-green-500 rounded-sm flex items-center justify-center transition-all duration-150 retro-outset hover:retro-pressed active:retro-pressed shadow-md"
            >
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                TALENT PIPELINE
              </span>
            </motion.button>
            <motion.button
              onClick={() => router.push("/compare")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-16 border-2 border-gray-700 bg-orange-500 rounded-sm flex items-center justify-center transition-all duration-150 retro-outset hover:retro-pressed active:retro-pressed shadow-md"
            >
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                COMPARE COMPANIES
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
        className="mt-8 text-center"
      >
        <p className="text-xs text-gray-600 uppercase tracking-widest font-medium">
          Select a company to view career transition data
        </p>
      </motion.div>
    </div>
  );
}


