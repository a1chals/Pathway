import bainExitsData from "@/data/bain_exits.json";
import StatsCards from "@/components/StatsCards";
import IndustryChart from "@/components/IndustryChart";
import ExitList from "@/components/ExitList";
import ExampleExits from "@/components/ExampleExits";
import { ExitData } from "@/types";

export default function Home() {
  const bainExits = bainExitsData as ExitData[];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">PathSearch</h1>
              <p className="text-slate-600 mt-1">
                See where your first job can take you.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search companies..."
                  value="Bain & Company"
                  disabled
                  className="px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards data={bainExits} />

        {/* Charts and Top Companies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <IndustryChart data={bainExits} />
          <ExitList data={bainExits} />
        </div>

        {/* Example Exits */}
        <ExampleExits data={bainExits} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">About</h3>
              <p className="text-sm text-slate-600">
                PathSearch visualizes career transitions to help you understand
                where your first job can lead.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Feedback</h3>
              <p className="text-sm text-slate-600">
                Have suggestions? We&apos;d love to hear from you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Data Disclaimer
              </h3>
              <p className="text-sm text-slate-600">
                Data is aggregated and anonymized for illustrative purposes.
                Individual results may vary.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            <p>© 2024 PathSearch. Built with Next.js & TailwindCSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

