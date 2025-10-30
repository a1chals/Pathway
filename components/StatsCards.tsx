import { ExitData } from "@/types";

interface StatsCardsProps {
  data: ExitData[];
}

export default function StatsCards({ data }: StatsCardsProps) {
  // Calculate average years before exit
  const avgYears = (
    data.reduce((sum, exit) => sum + exit.avg_years_before_exit, 0) / data.length
  ).toFixed(1);

  // Find most common industry
  const industryCounts: Record<string, number> = {};
  data.forEach((exit) => {
    industryCounts[exit.industry] = (industryCounts[exit.industry] || 0) + 1;
  });
  const mostCommonIndustry = Object.entries(industryCounts).reduce((a, b) =>
    industryCounts[a[0]] > industryCounts[b[0]] ? a : b
  )[0];

  // Count MBA exits
  const mbaExits = data.filter(
    (exit) => exit.industry === "Graduate Education"
  ).length;
  const mbaPercentage = ((mbaExits / data.length) * 100).toFixed(0);

  // Count unique exit companies
  const uniqueCompanies = new Set(data.map((exit) => exit.exit_company)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-sm font-medium text-slate-600 mb-2">
          Avg. Years Before Exit
        </h3>
        <p className="text-3xl font-bold text-slate-800">{avgYears}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-sm font-medium text-slate-600 mb-2">
          Most Common Exit
        </h3>
        <p className="text-3xl font-bold text-slate-800">{mostCommonIndustry}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-sm font-medium text-slate-600 mb-2">
          % Pursuing MBAs
        </h3>
        <p className="text-3xl font-bold text-slate-800">{mbaPercentage}%</p>
      </div>
    </div>
  );
}

