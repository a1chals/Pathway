import { ExitData } from "@/types";

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
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Top Exit Companies
      </h2>
      <div className="space-y-3">
        {topCompanies.map((company, index) => (
          <div
            key={company.company}
            className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-slate-800">
                  {company.company}
                </p>
                <p className="text-sm text-slate-600">{company.industry}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  {company.avgYears.toFixed(1)} yrs avg
                </p>
                <p className="text-xs text-slate-500">{company.count} exit{company.count > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

