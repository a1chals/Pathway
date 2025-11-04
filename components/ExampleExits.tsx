"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { ExitData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExampleExitsProps {
  data: ExitData[];
}

export default function ExampleExits({ data }: ExampleExitsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-2 border-gray-700 bg-white hover:shadow-lg transition-all duration-300 retro-outset">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800 uppercase tracking-wide">
              Example Career Transitions
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {data.map((exit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.03 }}
                className="group"
              >
                <div className="flex items-center gap-3 p-4 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 retro-outset group-hover:retro-pressed">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        {exit.start_role}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        {exit.exit_role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-medium text-gray-800 group-hover:text-gray-900">
                        {exit.exit_company}
                      </span>
                      <Badge variant="outline" className="text-xs border border-gray-600">
                        {exit.industry}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-auto flex-shrink-0 border border-gray-600 bg-gray-100">
                    {exit.avg_years_before_exit} yrs
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

