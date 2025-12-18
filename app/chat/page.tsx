"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  ArrowLeft, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  Users,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Database
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  QueryResult, 
  ExitDestination, 
  ExitSource,
  IndustryBreakdown as IndustryBreakdownType,
  CompanyComparison
} from "@/lib/chatbot/supabaseQueries";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  data?: QueryResult;
  timestamp: Date;
}

// Suggested queries for quick start
const SUGGESTED_QUERIES = [
  "Where do consultants from Bain exit to?",
  "What paths lead to Product Manager at Google?",
  "Where does Blackstone hire from?",
  "Is Bain or McKinsey better for PE?",
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (query?: string) => {
    const message = query || input.trim();
    if (!message || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: data.result.summary,
        data: data.result,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen checkered-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-gray-700 bg-white retro-outset">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
              >
                <ArrowLeft className="h-5 w-5 text-gray-800" />
              </button>
              <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                  PathSearch AI
                </h1>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  Ask about career paths & exits
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Database className="h-4 w-4" />
              <span>Powered by Supabase</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Welcome State */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm border-2 border-gray-700 bg-white mb-6 retro-outset">
                <TrendingUp className="h-8 w-8 text-gray-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
                Explore Career Paths
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Ask me where people exit to, where companies hire from, or compare exit opportunities between firms.
              </p>

              {/* Suggested Queries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {SUGGESTED_QUERIES.map((query, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSubmit(query)}
                    className="text-left p-4 border-2 border-gray-700 bg-white rounded-sm retro-outset hover:retro-pressed transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-sm bg-gray-50">
                        {index === 0 && <Building2 className="h-4 w-4 text-gray-600" />}
                        {index === 1 && <TrendingUp className="h-4 w-4 text-gray-600" />}
                        {index === 2 && <Users className="h-4 w-4 text-gray-600" />}
                        {index === 3 && <BarChart3 className="h-4 w-4 text-gray-600" />}
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {query}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-6 ${message.type === 'user' ? 'flex justify-end' : ''}`}
              >
                {message.type === 'user' ? (
                  <div className="max-w-[80%] p-4 border-2 border-gray-700 bg-gray-700 text-white rounded-sm retro-outset">
                    <p className="text-sm">{message.content}</p>
                  </div>
                ) : (
                  <div className="max-w-full">
                    <div className="p-4 border-2 border-gray-700 bg-white rounded-sm retro-outset">
                      <p className="text-sm text-gray-800 mb-4">{message.content}</p>
                      
                      {/* Render data visualizations */}
                      {message.data && <ResultsDisplay data={message.data} />}
                      
                      {/* Follow-up suggestion */}
                      {message.data?.followUp && (
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                          <p className="text-xs text-gray-600">
                            💡 {message.data.followUp}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Data source badge */}
                    {message.data?.success && (
                      <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        <span>Data from Supabase • {message.data.data.totalCount} records</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-gray-500 mb-6"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">Querying database...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t-2 border-gray-700 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask about career paths... (e.g., 'Where do Bain consultants go?')"
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-700 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed retro-inset"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 border-2 border-gray-700 bg-gray-700 text-white rounded-sm retro-outset hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline uppercase text-xs font-bold tracking-wide">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Results Display Component
 */
function ResultsDisplay({ data }: { data: QueryResult }) {
  if (!data.success) return null;

  return (
    <div className="space-y-4">
      {/* Exits FROM display (destinations) */}
      {data.data.destinations && data.data.destinations.length > 0 && (
        <ExitsTable exits={data.data.destinations} title="Top Exit Destinations" />
      )}

      {/* Exits TO display (sources) */}
      {data.data.sources && data.data.sources.length > 0 && (
        <SourcesTable sources={data.data.sources} title="Top Source Companies" />
      )}

      {/* Industry breakdown */}
      {data.data.industryBreakdown && data.data.industryBreakdown.length > 0 && (
        <IndustryBreakdown industries={data.data.industryBreakdown} />
      )}

      {/* Comparison display */}
      {data.data.comparison && data.data.comparison.length >= 2 && (
        <ComparisonDisplay comparison={data.data.comparison} />
      )}

      {/* Total analyzed */}
      {data.data.totalCount > 0 && (
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          Based on {data.data.totalCount} career transitions
        </div>
      )}
    </div>
  );
}

function ExitsTable({ exits, title }: { exits: ExitDestination[]; title: string }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">{title}</h4>
      <div className="border-2 border-gray-300 rounded-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="text-left p-2 font-bold uppercase tracking-wide">Company</th>
              <th className="text-left p-2 font-bold uppercase tracking-wide hidden sm:table-cell">Industry</th>
              <th className="text-center p-2 font-bold uppercase tracking-wide">Count</th>
              <th className="text-center p-2 font-bold uppercase tracking-wide">%</th>
              <th className="text-center p-2 font-bold uppercase tracking-wide hidden md:table-cell">Avg Years</th>
            </tr>
          </thead>
          <tbody>
            {exits.slice(0, 10).map((exit, index) => (
              <tr key={exit.company} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2 font-medium">{exit.company}</td>
                <td className="p-2 text-gray-600 hidden sm:table-cell">{exit.industry}</td>
                <td className="p-2 text-center font-bold">{exit.count}</td>
                <td className="p-2 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[40px]">
                      <div 
                        className="bg-gray-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(exit.percentage * 2, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{exit.percentage}%</span>
                  </div>
                </td>
                <td className="p-2 text-center text-gray-600 hidden md:table-cell">{exit.avgYears}y</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SourcesTable({ sources, title }: { sources: ExitSource[]; title: string }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">{title}</h4>
      <div className="border-2 border-gray-300 rounded-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="text-left p-2 font-bold uppercase tracking-wide">Company</th>
              <th className="text-left p-2 font-bold uppercase tracking-wide hidden sm:table-cell">Role</th>
              <th className="text-center p-2 font-bold uppercase tracking-wide">Count</th>
              <th className="text-center p-2 font-bold uppercase tracking-wide">%</th>
            </tr>
          </thead>
          <tbody>
            {sources.slice(0, 10).map((source, index) => (
              <tr key={source.company} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2 font-medium">{source.company}</td>
                <td className="p-2 text-gray-600 hidden sm:table-cell">{source.role}</td>
                <td className="p-2 text-center font-bold">{source.count}</td>
                <td className="p-2 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[40px]">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(source.percentage * 2, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{source.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IndustryBreakdown({ industries }: { industries: IndustryBreakdownType[] }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Industry Breakdown</h4>
      <div className="flex flex-wrap gap-2">
        {industries.map((ind) => (
          <div 
            key={ind.industry}
            className="px-3 py-1.5 border-2 border-gray-300 rounded-sm bg-gray-50 text-xs"
          >
            <span className="font-medium">{ind.industry}</span>
            <span className="text-gray-500 ml-1">({ind.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonDisplay({ comparison }: { comparison: CompanyComparison[] }) {
  const [c1, c2] = comparison;
  
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Comparison Results</h4>
      
      {/* Side by side comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* Company 1 */}
        <div className="p-3 border-2 border-gray-300 rounded-sm bg-gray-50">
          <h5 className="text-sm font-bold text-gray-800 mb-2">{c1.company}</h5>
          <p className="text-xs text-gray-600 mb-3">{c1.totalExits} exits tracked</p>
          
          {/* Industry breakdown */}
          <div className="space-y-1 mb-3">
            {c1.industryBreakdown.slice(0, 4).map((ind) => (
              <div key={ind.industry} className="flex justify-between text-xs">
                <span className="text-gray-600">{ind.industry}</span>
                <span className="font-medium">{ind.percentage}%</span>
              </div>
            ))}
          </div>
          
          {/* Top destinations */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-1">Top destinations:</p>
            {c1.topDestinations.slice(0, 3).map((dest) => (
              <div key={dest.company} className="text-xs text-gray-700">
                {dest.company} ({dest.count})
              </div>
            ))}
          </div>
        </div>

        {/* Company 2 */}
        <div className="p-3 border-2 border-gray-300 rounded-sm bg-gray-50">
          <h5 className="text-sm font-bold text-gray-800 mb-2">{c2.company}</h5>
          <p className="text-xs text-gray-600 mb-3">{c2.totalExits} exits tracked</p>
          
          {/* Industry breakdown */}
          <div className="space-y-1 mb-3">
            {c2.industryBreakdown.slice(0, 4).map((ind) => (
              <div key={ind.industry} className="flex justify-between text-xs">
                <span className="text-gray-600">{ind.industry}</span>
                <span className="font-medium">{ind.percentage}%</span>
              </div>
            ))}
          </div>
          
          {/* Top destinations */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-1">Top destinations:</p>
            {c2.topDestinations.slice(0, 3).map((dest) => (
              <div key={dest.company} className="text-xs text-gray-700">
                {dest.company} ({dest.count})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
