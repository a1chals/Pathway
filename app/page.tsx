"use client";

import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  Building2, 
  GitCompare, 
  Briefcase, 
  Search,
  ArrowRight
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// The 4 best query types based on our Supabase data
const FEATURED_QUERIES = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    title: "Where do Bain consultants exit to?",
    description: "Explore career paths after leaving Bain & Company",
    query: "Where do consultants from Bain exit to?",
  },
  {
    icon: <Building2 className="h-4 w-4" />,
    title: "Where does Blackstone hire from?",
    description: "Discover which backgrounds lead to Private Equity",
    query: "Where does Blackstone hire from?",
  },
  {
    icon: <GitCompare className="h-4 w-4" />,
    title: "Bain vs McKinsey for PE exits",
    description: "Compare PE placement between consulting firms",
    query: "Is Bain or McKinsey better for PE?",
  },
  {
    icon: <Briefcase className="h-4 w-4" />,
    title: "Goldman Sachs exit opportunities",
    description: "See where investment bankers go after GS",
    query: "Where do Goldman Sachs bankers exit to?",
  },
];

export default function HomePage() {
  const router = useRouter();

  const handleCardClick = (query?: string) => {
    if (query) {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Header - compact */}
      <div className="text-center py-4 md:py-6 flex-shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
          PathSearch
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Discover where careers lead. Powered by real data from 4,000+ career transitions.
        </p>
      </div>

      {/* Glowing Cards Grid - fills remaining space */}
      <ul className="flex-1 grid grid-cols-2 grid-rows-[1fr_1fr_auto] gap-3 px-4 md:px-6 pb-4 md:pb-6 min-h-0">
        {FEATURED_QUERIES.map((item, index) => (
          <GridItem
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            onClick={() => handleCardClick(item.query)}
          />
        ))}
        
        {/* Ask Your Own - Bottom Card (spans full width) */}
        <li className="col-span-2 list-none min-h-0">
          <div 
            onClick={() => handleCardClick()}
            className="relative h-full rounded-2xl border-[0.75px] border-gray-800 p-2 cursor-pointer group"
          >
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <div className="relative flex h-full items-center gap-4 overflow-hidden rounded-xl border-[0.75px] border-gray-800 bg-[#111111] px-6 py-4 transition-all group-hover:bg-[#161616]">
              <div className="w-fit rounded-lg border-[0.75px] border-gray-700 bg-gray-800/50 p-2 flex-shrink-0">
                <Search className="h-4 w-4 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold tracking-[-0.04em] text-white flex items-center gap-2">
                  Ask your own question
                  <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  Type any question about career paths, exits, or company hiring patterns
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const GridItem = ({ icon, title, description, onClick }: GridItemProps) => {
  return (
    <li className="list-none min-h-0">
      <div 
        onClick={onClick}
        className="relative h-full rounded-2xl border-[0.75px] border-gray-800 p-2 cursor-pointer group"
      >
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border-[0.75px] border-gray-800 bg-[#111111] p-4 md:p-5 transition-all group-hover:bg-[#161616]">
          <div className="w-fit rounded-lg border-[0.75px] border-gray-700 bg-gray-800/50 p-2">
            {icon}
          </div>
          <div className="mt-auto">
            <h3 className="text-base md:text-lg font-semibold tracking-[-0.04em] text-white mb-1">
              {title}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};
