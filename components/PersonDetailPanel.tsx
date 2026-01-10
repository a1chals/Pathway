"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Briefcase, TrendingUp } from 'lucide-react';
import { PersonExit } from '@/lib/talentExitNetwork';

interface PersonDetailPanelProps {
  person: PersonExit;
  sourceCompany?: string | string[];
  onClose: () => void;
}

export default function PersonDetailPanel({
  person,
  sourceCompany,
  onClose,
}: PersonDetailPanelProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full sm:w-96 h-[90vh] sm:h-auto bg-white border-l-2 border-gray-700 shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b-2 border-gray-700 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              Person Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
            >
              <X className="h-4 w-4 text-gray-800" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Name and LinkedIn */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {person.fullName || 'Unknown Name'}
              </h3>
              {person.linkedinUrl && (
                <a
                  href={person.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  View LinkedIn Profile
                </a>
              )}
            </div>

            {/* Career Transition */}
            <div className="border-2 border-gray-300 rounded-sm p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                <h4 className="font-bold text-gray-800 uppercase tracking-wide text-sm">
                  Career Transition
                </h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    From
                  </div>
                  <div className="font-semibold text-gray-800">
                    {sourceCompany 
                      ? (Array.isArray(sourceCompany) ? sourceCompany.join(', ') : sourceCompany)
                      : person.sourceCompanyName
                    }
                  </div>
                  <div className="text-sm text-gray-600">{person.sourceRole}</div>
                </div>
                <div className="flex items-center justify-center py-2">
                  <div className="w-full h-px bg-gray-300 relative">
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-400 text-xs">
                      →
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    To
                  </div>
                  <div className="font-semibold text-gray-800">{person.exitCompanyName}</div>
                  <div className="text-sm text-gray-600">{person.exitRole}</div>
                </div>
              </div>
            </div>

            {/* Tenure */}
            {person.yearsAtSource > 0 && (
              <div className="border-2 border-gray-300 rounded-sm p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h4 className="font-bold text-gray-800 uppercase tracking-wide text-sm">
                    Tenure at {sourceCompany 
                      ? (Array.isArray(sourceCompany) ? 'Source' : sourceCompany)
                      : person.sourceCompanyName
                    }
                  </h4>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {person.yearsAtSource.toFixed(1)} years
                </div>
                {person.sourceStartDate && person.sourceEndDate && (
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(person.sourceStartDate).toLocaleDateString()} -{' '}
                    {new Date(person.sourceEndDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                  <h4 className="font-bold text-gray-800 uppercase tracking-wide text-xs">
                    Dates
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  {person.sourceStartDate && person.sourceEndDate && (
                    <div>
                      <span className="text-gray-600">At {sourceCompany}: </span>
                      <span className="font-semibold text-gray-800">
                      {person.sourceStartDate && new Date(person.sourceStartDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      -{' '}
                      {person.sourceEndDate && new Date(person.sourceEndDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                      </span>
                    </div>
                  )}
                  {person.exitStartDate && (
                    <div>
                      <span className="text-gray-600">At {person.exitCompanyName}: </span>
                      <span className="font-semibold text-gray-800">
                        Started {new Date(person.exitStartDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t-2 border-gray-700 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full p-3 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed text-sm font-bold text-gray-800 uppercase tracking-wide"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
