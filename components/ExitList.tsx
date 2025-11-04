"use client";

import { motion } from "framer-motion";
import { Building2, Clock } from "lucide-react";
import { ExitData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExitListProps {
  data: ExitData[];
}

export default function ExitList({ data }: ExitListProps) {
  // Get top exit companies (by frequency)
  const companyCounts: Record<string, { count: number; avgYears: number }> = {};
  
  data.forEach((exit) => {
    if (!companyCounts[exit.exit_company]) {
      companyCounts[exit.exit_company] = { count: 0, avgYears: 0 };
    }
    companyCounts[exit.exit_company].count += 1;
    companyCounts[exit.exit_company].avgYears += exit.avg_years_before_exit;
  });

  // Calculate average years per company
  Object.keys(companyCounts).forEach((company) => {
    companyCounts[company].avgYears /= companyCounts[company].count;
  });

  // Sort by count and take top companies
  const topCompanies = Object.entries(companyCounts)
    .map(([company, stats]) => ({
      company,
      ...stats,
      industry: data.find((exit) => exit.exit_company === company)?.industry || "Unknown",
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-2 border-gray-700 bg-white hover:shadow-lg transition-all duration-300 retro-outset">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800 uppercase tracking-wide">
              Top Exit Companies
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCompanies.map((company, index) => (
              <motion.div
                key={company.company}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="group"
              >
                <div className="flex items-center justify-between p-4 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 retro-outset group-hover:retro-pressed">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        {company.company}
                      </p>
                      {index === 0 && (
                        <Badge variant="default" className="text-xs border-2 border-gray-700 bg-gray-700 text-white">
                          #1
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs mt-1 border border-gray-600">
                      {company.industry}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span>{company.avgYears.toFixed(1)} yrs</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {company.count} exit{company.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

