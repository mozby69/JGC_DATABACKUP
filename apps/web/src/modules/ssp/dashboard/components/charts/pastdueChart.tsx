


"use client";

import { ShieldAlert } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

type AccountClassification =
  | "DECEASED"
  | "POLICE ACTION"
  | "WRITE OFF"
  | "FULLY PAID"
  | "LITIGATION";

interface ClassificationData {
  category: AccountClassification;
  count: number;
  color: string;
}

const data: ClassificationData[] = [
  { category: "DECEASED", count: 24, color: "#94A3B8" },
  { category: "POLICE ACTION", count: 12, color: "#D9B98A" },
  { category: "WRITE OFF", count: 38, color: "#C77D73" },
  { category: "FULLY PAID", count: 145, color: "#526F5D" },
  { category: "LITIGATION", count: 17, color: "#A88CBB" },
];

export default function AccountClassificationChart() {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="min-w-0 rounded-[14px] border border-[#E0E2DC] bg-white p-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-[14px] font-semibold text-[#26342F]">
            PAST DUE
          </h2>
          <p className="mt-1 text-[11px] text-[#929A93]">
            Account distribution by classification.
          </p>
        </div>

        <div className="rounded-lg bg-[#F0F3EF] p-2 text-[#526F5D]">
          <ShieldAlert size={17} />
        </div>
      </div>

      <div className="h-100 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 15 }}
          >
            <CartesianGrid stroke="#EEF0EB" vertical={false} />

            <XAxis
              dataKey="category"
              tick={{ fontSize: 9, fill: "#929A93" }}
              tickLine={false}
              axisLine={false}
              interval={0}
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
              dataKey="count"
              name="Accounts"
              radius={[5, 5, 0, 0]}
              maxBarSize={55}
            >
              {data.map((item) => (
                <Cell key={item.category} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EEF0EB] pt-4 sm:grid-cols-3">
        {data.map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <p className="text-[10px] text-[#929A93]">
                {item.category}
              </p>
              <p className="text-[14px] font-semibold text-[#26342F]">
                {item.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-[#929A93]">
        Total classified accounts: {total}
      </p>
    </div>
  );
}
