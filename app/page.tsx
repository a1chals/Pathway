"use client";

import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  Building2, 
  GitCompare, 
  Briefcase, 
  Search,
  ArrowRight,
  MessageSquare
} from "lucide-react";

// The 4 best query types based on our Supabase data
const FEATURED_QUERIES = [
  {
    icon: <TrendingUp className="h-4 w-4 text-gray-600" />,
    title: "Where do Bain consultants exit to?",
    description: "Explore career paths after leaving Bain & Company",
    query: "Where do consultants from Bain exit to?",
  },
  {
    icon: <Building2 className="h-4 w-4 text-gray-600" />,
    title: "Talent Pipeline",
    description: "Discover where companies source their talent from",
    link: "/incoming",
  },
  {
    icon: <GitCompare className="h-4 w-4 text-gray-600" />,
    title: "Bain vs McKinsey for PE exits",
    description: "Compare PE placement between consulting firms",
    query: "Is Bain or McKinsey better for PE?",
  },
  {
    icon: <Briefcase className="h-4 w-4 text-gray-600" />,
    title: "Goldman Sachs exit opportunities",
    description: "See where investment bankers go after GS",
    query: "Where do Goldman Sachs bankers exit to?",
  },
];

export default function HomePage() {
  const router = useRouter();

  const handleCardClick = (item?: typeof FEATURED_QUERIES[0]) => {
    if (!item) {
      router.push("/chat");
      return;
    }
    if (item.link) {
      router.push(item.link);
    } else if (item.query) {
      router.push(`/chat?q=${encodeURIComponent(item.query)}`);
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="h-screen bg-white checkered-bg flex flex-col overflow-hidden pt-12">
      {/* Header */}
      <header className="flex-shrink-0 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              PathSearch
            </h1>
            <p className="text-xs text-gray-500">
              Discover where careers lead
            </p>
          </div>
        </div>
      </header>

      {/* Cards Grid - fills remaining space */}
      <div className="flex-1 grid grid-cols-2 grid-rows-[1fr_1fr_auto] gap-3 px-3 pb-20 min-h-0">
        {FEATURED_QUERIES.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(item)}
            className="border-2 border-gray-700 bg-white rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col justify-between retro-outset hover:retro-pressed"
          >
            <div className="w-fit rounded-sm border-2 border-gray-300 bg-gray-50 p-1.5">
              {item.icon}
            </div>
            <div className="mt-auto">
              <h3 className="text-sm font-bold text-gray-800 mb-0.5 uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        
        {/* Ask Your Own - Bottom Card */}
        <div 
          onClick={() => handleCardClick()}
          className="col-span-2 border-2 border-gray-700 bg-white rounded-sm p-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 retro-outset hover:retro-pressed"
        >
          <div className="w-fit rounded-sm border-2 border-gray-300 bg-gray-50 p-1.5 flex-shrink-0">
            <Search className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
              Ask your own question
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </h3>
            <p className="text-xs text-gray-600 truncate">
              Type any question about career paths, exits, or company hiring patterns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
