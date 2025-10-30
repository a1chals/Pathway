import { ExitData } from "@/types";

interface ExampleExitsProps {
  data: ExitData[];
}

export default function ExampleExits({ data }: ExampleExitsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Example Career Transitions
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.map((exit, index) => (
          <div
            key={index}
            className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
          >
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-800">{exit.start_role}</span>
              {" → "}
              <span className="font-medium text-slate-800">{exit.exit_role}</span>
              {" @ "}
              <span className="font-medium text-blue-600">{exit.exit_company}</span>
              {" "}
              <span className="text-slate-500">
                ({exit.avg_years_before_exit} yrs)
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

