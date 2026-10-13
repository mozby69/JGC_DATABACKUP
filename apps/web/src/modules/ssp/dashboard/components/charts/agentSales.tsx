
"use client";

import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface AgentSalesData {
  agentId: number;
  agentName: string;
  pensioners: number;
  loanAmount: number;
}

const data: AgentSalesData[] = [
  { agentId: 1, agentName: "Agent A", pensioners: 42, loanAmount: 1850000 },
  { agentId: 2, agentName: "Agent B", pensioners: 35, loanAmount: 1420000 },
  { agentId: 3, agentName: "Agent C", pensioners: 28, loanAmount: 1180000 },
  { agentId: 4, agentName: "Agent D", pensioners: 24, loanAmount: 960000 },
  { agentId: 5, agentName: "Agent E", pensioners: 18, loanAmount: 720000 },
];

const currency = (amount: number): string =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);

export default function AgentSalesChart() {
  return (
    <div className="min-w-0 rounded-[14px] border border-[#E0E2DC] bg-white p-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-[14px] font-semibold text-[#26342F]">
            Agent & Sales Performance
          </h2>
          <p className="mt-1 text-[11px] text-[#929A93]">
            Pensioners referred and loan production by agent.
          </p>
        </div>

        <div className="rounded-lg bg-[#F0F3EF] p-2 text-[#526F5D]">
          <TrendingUp size={17} />
        </div>
      </div>

      <div className="h-70 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke="#EEF0EB" vertical={false} />

            <XAxis
              dataKey="agentName"
              tick={{ fontSize: 11, fill: "#929A93" }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#929A93" }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E0E2DC",
                fontSize: 12,
              }}
            />

            <Bar
              dataKey="pensioners"
              name="Pensioners Referred"
              fill="#526F5D"
              radius={[5, 5, 0, 0]}
              maxBarSize={55}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 overflow-x-auto border-t border-[#EEF0EB] pt-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-[#929A93]">
              <th className="pb-3 font-medium">Agent</th>
              <th className="pb-3 text-center font-medium">Pensioners</th>
              <th className="pb-3 text-right font-medium">Loan Sales</th>
            </tr>
          </thead>

          <tbody>
            {data.map((agent) => (
              <tr
                key={agent.agentId}
                className="border-t border-[#EEF0EB]"
              >
                <td className="py-3 text-[12px] font-medium text-[#26342F]">
                  {agent.agentName}
                </td>
                <td className="py-3 text-center text-[12px] text-[#526459]">
                  {agent.pensioners}
                </td>
                <td className="py-3 text-right text-[12px] font-semibold text-[#26342F]">
                  {currency(agent.loanAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
