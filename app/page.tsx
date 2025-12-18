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
    description: "Explore the most common career paths after leaving Bain & Company",
    query: "Where do consultants from Bain exit to?",
  },
  {
    icon: <Building2 className="h-4 w-4" />,
    title: "Where does Blackstone hire from?",
    description: "Discover which companies and backgrounds lead to Private Equity",
    query: "Where does Blackstone hire from?",
  },
  {
    icon: <GitCompare className="h-4 w-4" />,
    title: "Bain vs McKinsey for PE exits",
    description: "Compare which consulting firm has better Private Equity placement",
    query: "Is Bain or McKinsey better for PE?",
  },
  {
    icon: <Briefcase className="h-4 w-4" />,
    title: "Goldman Sachs exit opportunities",
    description: "See where investment bankers go after Goldman Sachs",
    query: "Where do Goldman Sachs bankers exit to?",
  },
];

export default function HomePage() {
  const router = useRouter();

  const handleCardClick = (query?: string) => {
    if (query) {
      // Navigate to chat with pre-filled query
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    } else {
      // Navigate to chat without query (ask your own)
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-8 md:py-16 px-4 md:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          PathSearch
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Discover where careers lead. Powered by real data from 4,000+ career transitions.
        </p>
      </div>

      {/* Glowing Cards Grid */}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full max-w-4xl">
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
        <li className="min-h-[10rem] list-none md:col-span-2">
          <div 
            onClick={() => handleCardClick()}
            className="relative h-full rounded-[1.25rem] border-[0.75px] border-gray-800 p-2 md:rounded-[1.5rem] md:p-3 cursor-pointer group"
          >
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-gray-800 bg-[#111111] p-6 shadow-sm md:p-6 transition-all group-hover:bg-[#161616]">
              <div className="relative flex flex-1 flex-col justify-between gap-3">
                <div className="w-fit rounded-lg border-[0.75px] border-gray-700 bg-gray-800/50 p-2">
                  <Search className="h-4 w-4 text-gray-300" />
                </div>
                <div className="space-y-3">
                  <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-white flex items-center gap-2">
                    Ask your own question
                    <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-gray-500">
                    Type any question about career paths, exits, or company hiring patterns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-sm">
          Data from 75 companies • 6,500+ professionals • Updated daily
        </p>
      </div>
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
    <li className="min-h-[12rem] list-none">
      <div 
        onClick={onClick}
        className="relative h-full rounded-[1.25rem] border-[0.75px] border-gray-800 p-2 md:rounded-[1.5rem] md:p-3 cursor-pointer group"
      >
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-gray-800 bg-[#111111] p-6 shadow-sm md:p-6 transition-all group-hover:bg-[#161616]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-gray-700 bg-gray-800/50 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-white">
                {title}
              </h3>
              <p className="text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-gray-500">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
