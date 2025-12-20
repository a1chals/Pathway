"use client";

import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Users, ExternalLink } from 'lucide-react';
import { TalentGraphNode } from '@/types/talentGraph';
import { CompanyStats, PersonTransition } from '@/types/talentGraph';
import { fetchCompanyStats, fetchPersonTransitions } from '@/lib/hooks/useTalentGraphData';

interface TalentNetworkSidebarProps {
  selectedNode: TalentGraphNode | null;
  selectedNodes: TalentGraphNode[];
  onClose: () => void;
}

export default function TalentNetworkSidebar({
  selectedNode,
  selectedNodes,
  onClose,
}: TalentNetworkSidebarProps) {
  const [companyStats, setCompanyStats] = useState<CompanyStats | null>(null);
  const [personTransitions, setPersonTransitions] = useState<PersonTransition[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTransitions, setLoadingTransitions] = useState(false);

  // Load company stats for single selection
  useEffect(() => {
    if (selectedNode && selectedNodes.length === 1) {
      setLoading(true);
      fetchCompanyStats(selectedNode.name)
        .then(stats => {
          setCompanyStats(stats);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching company stats:', err);
          setLoading(false);
        });
    } else {
      setCompanyStats(null);
    }
  }, [selectedNode, selectedNodes]);

  // Load person transitions for compare mode
  useEffect(() => {
    if (selectedNodes.length === 2) {
      setLoadingTransitions(true);
      fetchPersonTransitions(selectedNodes[0].name, selectedNodes[1].name)
        .then(transitions => {
          setPersonTransitions(transitions);
          setLoadingTransitions(false);
        })
        .catch(err => {
          console.error('Error fetching person transitions:', err);
          setLoadingTransitions(false);
        });
    } else {
      setPersonTransitions([]);
    }
  }, [selectedNodes]);

  if (!selectedNode && selectedNodes.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l-2 border-gray-700 shadow-2xl z-50 overflow-y-auto retro-outset">
      <div className="sticky top-0 bg-white border-b-2 border-gray-700 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
          {selectedNodes.length === 2 ? 'Compare Mode' : 'Company Details'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
        >
          <X className="h-4 w-4 text-gray-800" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Compare Mode - Two Companies Selected */}
        {selectedNodes.length === 2 && (
          <>
            <div className="space-y-3">
              <div className="p-3 rounded-sm border-2 border-gray-700 bg-gray-50 retro-inset">
                <div className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                  {selectedNodes[0].name}
                </div>
                <div className="text-xs text-gray-600">{selectedNodes[0].industry}</div>
              </div>
              
              <div className="text-center text-gray-600">
                <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                <div className="text-xs">vs</div>
              </div>
              
              <div className="p-3 rounded-sm border-2 border-gray-700 bg-gray-50 retro-inset">
                <div className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                  {selectedNodes[1].name}
                </div>
                <div className="text-xs text-gray-600">{selectedNodes[1].industry}</div>
              </div>
            </div>

            {/* Person Transitions */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
                People Who Moved Between Companies
              </h3>
              
              {loadingTransitions ? (
                <div className="text-sm text-gray-600 text-center py-4">Loading...</div>
              ) : personTransitions.length === 0 ? (
                <div className="text-sm text-gray-600 text-center py-4">
                  No transitions found between these companies
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {personTransitions.map((person, index) => (
                    <div
                      key={`${person.personId}-${index}`}
                      className="p-3 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-800 mb-1">
                            {person.fullName}
                          </div>
                          {person.headline && (
                            <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {person.headline}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>
                              <span className="text-gray-600">From:</span> {person.sourceRole}
                            </div>
                            <div>
                              <span className="text-gray-600">To:</span> {person.exitRole}
                            </div>
                            <div>
                              <span className="text-gray-600">Years:</span> {person.yearsAtSource.toFixed(1)}
                            </div>
                          </div>
                        </div>
                        {person.linkedinUrl && (
                          <a
                            href={person.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-1.5 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
                            title="View LinkedIn Profile"
                          >
                            <ExternalLink className="h-3 w-3 text-gray-800" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Single Selection - Company Stats */}
        {selectedNodes.length === 1 && companyStats && (
          <>
            <div className="p-4 rounded-sm border-2 border-gray-700 bg-gray-50 retro-inset">
              <div className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2">
                {companyStats.name}
              </div>
              <div className="text-xs text-gray-600 mb-4">{companyStats.industry}</div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-sm border-2 border-gray-700 bg-white retro-outset">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Outgoing</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{companyStats.outgoing}</div>
                </div>
                
                <div className="p-3 rounded-sm border-2 border-gray-700 bg-white retro-outset">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-blue-600" />
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Incoming</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{companyStats.incoming}</div>
                </div>
              </div>

              <div className="p-3 rounded-sm border-2 border-gray-700 bg-white retro-outset mb-4">
                <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                  Avg. Years Before Exit
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {companyStats.avgYearsBeforeExit.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Top Destinations */}
            {companyStats.topDestinations.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
                  Top Destinations
                </h3>
                <div className="space-y-2">
                  {companyStats.topDestinations.map((dest, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-sm border-2 border-gray-700 bg-white retro-outset flex items-center justify-between"
                    >
                      <div className="text-sm text-gray-800 flex-1">{dest.company}</div>
                      <div className="text-sm font-bold text-gray-600">{dest.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Sources */}
            {companyStats.topSources.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
                  Top Sources
                </h3>
                <div className="space-y-2">
                  {companyStats.topSources.map((source, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-sm border-2 border-gray-700 bg-white retro-outset flex items-center justify-between"
                    >
                      <div className="text-sm text-gray-800 flex-1">{source.company}</div>
                      <div className="text-sm font-bold text-gray-600">{source.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {selectedNodes.length === 1 && loading && (
          <div className="text-sm text-gray-600 text-center py-8">Loading company stats...</div>
        )}
      </div>
    </div>
  );
}

