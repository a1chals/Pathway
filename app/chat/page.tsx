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
  MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import { QueryResult, ExitDestination, ExitSource } from "@/lib/chatbot";

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
              <Sparkles className="h-4 w-4" />
              <span>Powered by Aviato</span>
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
                      {message.data?.followUpSuggestion && (
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                          <p className="text-xs text-gray-600 whitespace-pre-line">
                            {message.data.followUpSuggestion}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* API calls badge */}
                    {message.data?.apiCallsUsed !== undefined && message.data.apiCallsUsed > 0 && (
                      <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>{message.data.apiCallsUsed} API calls used</span>
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
              <span className="text-sm">Analyzing career paths...</span>
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
      {/* Exits FROM display */}
      {data.data.exits && data.data.exits.length > 0 && (
        <ExitsTable exits={data.data.exits} title="Top Exit Destinations" />
      )}

      {/* Exits TO display */}
      {data.data.sources && data.data.sources.length > 0 && (
        <SourcesTable sources={data.data.sources} title="Top Source Companies" />
      )}

      {/* Industry breakdown */}
      {data.data.topIndustries && data.data.topIndustries.length > 0 && (
        <IndustryBreakdown industries={data.data.topIndustries} />
      )}

      {/* Comparison display */}
      {data.data.comparison && (
        <ComparisonDisplay comparison={data.data.comparison} />
      )}

      {/* Total analyzed */}
      {data.data.totalPeopleAnalyzed !== undefined && (
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          Based on analysis of {data.data.totalPeopleAnalyzed} professionals
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
              <th className="text-center p-2 font-bold uppercase tracking-wide">Count</th>
              <th className="text-center p-2 font-bold uppercase tracking-wide hidden sm:table-cell">%</th>
              <th className="text-left p-2 font-bold uppercase tracking-wide hidden md:table-cell">Roles</th>
              <th className="text-center p-2 font-bold uppercase tracking-wide hidden sm:table-cell">Avg Years</th>
            </tr>
          </thead>
          <tbody>
            {exits.map((exit, index) => (
              <tr key={exit.company} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2 font-medium">{exit.company}</td>
                <td className="p-2 text-center">{exit.count}</td>
                <td className="p-2 text-center hidden sm:table-cell">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                      <div 
                        className="bg-gray-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(exit.percentage, 100)}%` }}
                      />
                    </div>
                    <span>{exit.percentage}%</span>
                  </div>
                </td>
                <td className="p-2 hidden md:table-cell text-gray-600">
                  {exit.roles.slice(0, 2).join(', ')}
                </td>
                <td className="p-2 text-center hidden sm:table-cell">{exit.avgYearsBeforeExit}y</td>
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
              <th className="text-center p-2 font-bold uppercase tracking-wide">Count</th>
              <th className="text-center p-2 font-bold uppercase tracking-wide hidden sm:table-cell">%</th>
              <th className="text-left p-2 font-bold uppercase tracking-wide hidden md:table-cell">Industry</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source, index) => (
              <tr key={source.company} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2 font-medium">{source.company}</td>
                <td className="p-2 text-center">{source.count}</td>
                <td className="p-2 text-center hidden sm:table-cell">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(source.percentage, 100)}%` }}
                      />
                    </div>
                    <span>{source.percentage}%</span>
                  </div>
                </td>
                <td className="p-2 hidden md:table-cell text-gray-600">
                  {source.industry}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IndustryBreakdown({ industries }: { industries: { industry: string; count: number; percentage: number }[] }) {
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

function ComparisonDisplay({ comparison }: { 
  comparison: { 
    company1: { name: string; exits: ExitDestination[] };
    company2: { name: string; exits: ExitDestination[] };
    winner?: string;
    insight: string;
  } 
}) {
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Comparison Results</h4>
      
      {/* Winner badge */}
      {comparison.winner && (
        <div className="mb-3 p-3 bg-green-50 border-2 border-green-300 rounded-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-bold text-green-800">{comparison.winner} has the edge</span>
          </div>
        </div>
      )}
      
      {/* Insight */}
      <p className="text-sm text-gray-700 mb-4">{comparison.insight}</p>
      
      {/* Side by side comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h5 className="text-xs font-bold text-gray-600 mb-2">{comparison.company1.name}</h5>
          <div className="space-y-1">
            {comparison.company1.exits.slice(0, 5).map((exit) => (
              <div key={exit.company} className="text-xs flex justify-between">
                <span className="truncate">{exit.company}</span>
                <span className="text-gray-500">{exit.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-xs font-bold text-gray-600 mb-2">{comparison.company2.name}</h5>
          <div className="space-y-1">
            {comparison.company2.exits.slice(0, 5).map((exit) => (
              <div key={exit.company} className="text-xs flex justify-between">
                <span className="truncate">{exit.company}</span>
                <span className="text-gray-500">{exit.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

