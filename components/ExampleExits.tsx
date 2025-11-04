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
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-800">
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
                <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                        {exit.start_role}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                        {exit.exit_role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-medium text-purple-600 group-hover:text-purple-700">
                        {exit.exit_company}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {exit.industry}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-auto flex-shrink-0">
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

