"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Network, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TalentGraph, { TalentGraphRef } from '@/components/TalentGraph';
import TalentNetworkSidebar from '@/components/TalentNetworkSidebar';
import { useTalentGraphData, fetchCompanyNeighbors, fetchTopSuperNodes } from '@/lib/hooks/useTalentGraphData';
import { TalentGraphNode } from '@/types/talentGraph';
import { searchCompaniesFromDB, CompanySearchResult } from '@/lib/compareUtils';

export default function TalentNetworkPage() {
  const router = useRouter();
  const { data, loading, error, setLoading, setError, addToGraph, clearGraph } = useTalentGraphData();
  const [selectedNode, setSelectedNode] = useState<TalentGraphNode | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<TalentGraphNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchingCompanies, setIsSearchingCompanies] = useState(false);
  const graphRef = useRef<TalentGraphRef>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Ensure graph starts empty on mount
  useEffect(() => {
    clearGraph();
  }, [clearGraph]);

  // Search for companies as user types (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearchingCompanies(true);
      try {
        const results = await searchCompaniesFromDB(searchQuery, 10);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error('Error searching companies:', err);
        setSearchResults([]);
      } finally {
        setIsSearchingCompanies(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Load super nodes on mount (optional entry points)
  useEffect(() => {
    const loadSuperNodes = async () => {
      setLoading(true);
      try {
        const superNodes = await fetchTopSuperNodes(5);
        if (superNodes.length > 0) {
          // Add super nodes without connections initially
          superNodes.forEach(node => {
            addToGraph(node, [], []);
          });
        }
      } catch (err) {
        console.error('Error loading super nodes:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Uncomment to load super nodes on mount
    // loadSuperNodes();
  }, [addToGraph]);

  // Handle search
  const handleSearch = useCallback(async (companyName: string) => {
    if (!companyName.trim()) return;

    setShowDropdown(false);
    setIsSearching(true);
    setLoading(true);
    setError(null);

    try {
      const result = await fetchCompanyNeighbors(companyName.trim(), 10);
      if (result) {
        // Clear graph and add new company (or add to existing)
        // For now, we'll add to existing - change clearGraph() to clearGraph() if you want to clear
        addToGraph(result.node, result.links, result.neighborNodes);
        
        // Mark as expanded
        setExpandedNodes(prev => new Set(prev).add(result.node.id));
        
        // Clear search query
        setSearchQuery('');
        
        // Center on new node (wait for graph to render)
        setTimeout(() => {
          if (graphRef.current) {
            graphRef.current.centerAt(result.node.id, 0, 0);
            setTimeout(() => {
              if (graphRef.current) {
                graphRef.current.zoom(1.5, 1000);
              }
            }, 500);
          }
        }, 500);
      } else {
        setError(`Company "${companyName}" not found in database`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search company');
      console.error('Error searching company:', err);
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  }, [addToGraph]);

  // Handle selecting a company from dropdown
  const handleSelectCompany = useCallback((company: CompanySearchResult) => {
    setSearchQuery(company.name);
    setShowDropdown(false);
    handleSearch(company.name);
  }, [handleSearch]);

  // Handle node click - expand if not already expanded
  const handleNodeClick = useCallback(async (node: TalentGraphNode | null, event?: MouseEvent) => {
    if (!node) {
      setSelectedNode(null);
      setSelectedNodes([]);
      return;
    }

    if (event?.ctrlKey || event?.metaKey) {
      // Ctrl/Cmd click - add to compare mode
      if (selectedNodes.length === 0) {
        setSelectedNodes([node]);
        setSelectedNode(node);
      } else if (selectedNodes.length === 1) {
        if (selectedNodes[0].id !== node.id) {
          setSelectedNodes([selectedNodes[0], node]);
          setSelectedNode(null);
        }
      } else {
        // Reset and start new selection
        setSelectedNodes([node]);
        setSelectedNode(node);
      }
    } else {
      // Regular click - check if we should expand
      const isLeafNode = !data.links.some(
        link => (link.source === node.id || link.target === node.id)
      );
      
      // If it's a leaf node or not expanded yet, expand it
      if (isLeafNode || !expandedNodes.has(node.id)) {
        setLoading(true);
        try {
          const result = await fetchCompanyNeighbors(node.name, 10);
          if (result) {
            addToGraph(result.node, result.links, result.neighborNodes);
            setExpandedNodes(prev => new Set(prev).add(node.id));
          }
        } catch (err) {
          console.error('Error expanding node:', err);
        } finally {
          setLoading(false);
        }
      }
      
      // Set selection
      setSelectedNode(node);
      setSelectedNodes([node]);
    }
  }, [selectedNodes, data.links, expandedNodes, addToGraph]);

  const handleNodeRightClick = useCallback((node: TalentGraphNode) => {
    if (selectedNodes.length === 0) {
      setSelectedNodes([node]);
      setSelectedNode(node);
    } else if (selectedNodes.length === 1) {
      if (selectedNodes[0].id !== node.id) {
        setSelectedNodes([selectedNodes[0], node]);
        setSelectedNode(null);
      }
    } else {
      // Reset and start new selection
      setSelectedNodes([node]);
      setSelectedNode(node);
    }
  }, [selectedNodes]);

  const handleCloseSidebar = useCallback(() => {
    setSelectedNode(null);
    setSelectedNodes([]);
  }, []);

  return (
    <div className="min-h-screen checkered-bg pt-12">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-gray-700 bg-white retro-outset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/")}
                  className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-800" />
                </button>
                <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                  <Network className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                    Talent Exit Network
                  </h1>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Visualize talent flow between companies
                  </p>
                </div>
              </div>
            </motion.div>
            
            <div className="text-xs text-gray-600">
              {selectedNodes.length === 2 ? (
                <span className="text-gray-800 font-bold">Compare Mode Active</span>
              ) : selectedNode ? (
                <span>Click node to view details • Ctrl+Click for compare</span>
              ) : (
                <span>Click a node to explore • Ctrl+Click two nodes to compare</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Graph Area */}
      <div className="relative min-h-[calc(100vh-5rem)]">
        {/* Search Bar - Show when graph is empty or always visible */}
        {data.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="w-full max-w-2xl px-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600 z-10" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay to allow click on dropdown item
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleSearch(searchQuery);
                    } else if (e.key === 'Escape') {
                      setShowDropdown(false);
                    }
                  }}
                  placeholder="Search for a company (e.g., OpenAI, Google, McKinsey)..."
                  className="w-full pl-12 pr-4 py-4 rounded-sm border-2 border-gray-700 bg-white outline-none text-base text-gray-800 placeholder-gray-500 transition-all duration-150 retro-inset focus:retro-pressed"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowDropdown(false);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-800" />
                  </button>
                )}
                
                {/* Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-sm border-2 border-gray-700 bg-white retro-outset shadow-lg z-30">
                    {isSearchingCompanies ? (
                      <div className="p-4 text-center text-sm text-gray-600">Searching...</div>
                    ) : (
                      searchResults.map((company, index) => (
                        <button
                          key={`${company.name}-${index}`}
                          onClick={() => handleSelectCompany(company)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-all border-b border-gray-300 last:border-b-0 flex items-center gap-3"
                        >
                          {company.logo && (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-8 h-8 rounded"
                              onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                              {company.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {company.industry || 'Unknown'} {company.totalExits && `• ${company.totalExits} exits`}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {error && (
                <div className="mt-4 p-3 rounded-sm border-2 border-red-600 bg-red-50 retro-outset">
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Search Bar - Always visible when graph has nodes */}
        {data.nodes.length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 z-10" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSearch(searchQuery);
                  } else if (e.key === 'Escape') {
                    setShowDropdown(false);
                  }
                }}
                placeholder="Search company..."
                className="w-full pl-10 pr-4 py-2 rounded-sm border-2 border-gray-700 bg-white outline-none text-sm text-gray-800 placeholder-gray-500 transition-all duration-150 retro-inset focus:retro-pressed shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <X className="h-3 w-3 text-gray-800" />
                </button>
              )}
              
              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-sm border-2 border-gray-700 bg-white retro-outset shadow-lg z-30">
                  {isSearchingCompanies ? (
                    <div className="p-3 text-center text-xs text-gray-600">Searching...</div>
                  ) : (
                    searchResults.map((company, index) => (
                      <button
                        key={`${company.name}-${index}`}
                        onClick={() => handleSelectCompany(company)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-all border-b border-gray-300 last:border-b-0 flex items-center gap-2"
                      >
                        {company.logo && (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-6 h-6 rounded"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                            {company.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {company.industry || 'Unknown'} {company.totalExits && `• ${company.totalExits} exits`}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="text-center">
              <div className="text-gray-800 text-lg mb-2">
                {isSearching ? 'Searching...' : 'Loading...'}
              </div>
              <div className="text-gray-600 text-sm">Fetching from database</div>
            </div>
          </div>
        )}

        {error && data.nodes.length > 0 && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 px-4">
            <div className="p-3 rounded-sm border-2 border-red-600 bg-red-50 retro-outset">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </div>
        )}

        {data.nodes.length > 0 && (
          <TalentGraph
            ref={graphRef}
            nodes={data.nodes}
            links={data.links}
            selectedNode={selectedNode}
            selectedNodes={selectedNodes}
            onNodeClick={handleNodeClick}
            onNodeRightClick={handleNodeRightClick}
          />
        )}

        {/* Sidebar */}
        {(selectedNode || selectedNodes.length > 0) && (
          <TalentNetworkSidebar
            selectedNode={selectedNode}
            selectedNodes={selectedNodes}
            onClose={handleCloseSidebar}
          />
        )}
      </div>

      {/* Instructions Overlay (shown on first visit) */}
      {!selectedNode && selectedNodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 max-w-sm p-4 rounded-sm border-2 border-gray-700 bg-white retro-outset shadow-lg"
        >
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
            How to Use
          </h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Click a node to view company details</li>
            <li>• Ctrl+Click (Cmd+Click on Mac) two nodes to compare</li>
            <li>• Nodes are colored by industry and sized by activity</li>
            <li>• Links show talent flow between companies</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}

