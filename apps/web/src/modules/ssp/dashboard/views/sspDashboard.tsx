
"use client";

import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Wallet,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Search,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AccountClassificationChart from "../components/charts/pastdueChart";
import AgentSalesChart from "../components/charts/agentSales";

type PensionerStatus = "Active" | "Inactive" | "Pending";

interface Pensioner {
  id: number;
  name: string;
  pensionerCode: string;
  bank: string;
  pensionAmount: number;
  status: PensionerStatus;
}

interface MonthlyActivity {
  month: string;
  active: number;
  inactive: number;
}

const monthlyActivity: MonthlyActivity[] = [
  { month: "Jan", active: 85, inactive: 12 },
  { month: "Feb", active: 98, inactive: 16 },
  { month: "Mar", active: 112, inactive: 19 },
  { month: "Apr", active: 104, inactive: 14 },
  { month: "May", active: 130, inactive: 20 },
  { month: "Jun", active: 120, inactive: 17 },
  { month: "Jul", active: 142, inactive: 24 },
  { month: "Aug", active: 150, inactive: 20 },
  { month: "Sep", active: 158, inactive: 23 },
  { month: "Oct", active: 166, inactive: 19 },
  { month: "Nov", active: 0, inactive: 0 },
  { month: "Dec", active: 0, inactive: 0 },
];

const recentPensioners: Pensioner[] = [
  {
    id: 1,
    name: "Maria Santos",
    pensionerCode: "PEN-001",
    bank: "Landbank",
    pensionAmount: 15200,
    status: "Active",
  },
  {
    id: 2,
    name: "Juan Dela Cruz",
    pensionerCode: "PEN-002",
    bank: "BDO",
    pensionAmount: 12800,
    status: "Active",
  },
  {
    id: 3,
    name: "Rosa Mendoza",
    pensionerCode: "PEN-003",
    bank: "PNB",
    pensionAmount: 18500,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Pedro Reyes",
    pensionerCode: "PEN-004",
    bank: "Landbank",
    pensionAmount: 14300,
    status: "Pending",
  },
];

const statusColors: Record<PensionerStatus, string> = {
  Active: "#526F5D",
  Inactive: "#D6DED5",
  Pending: "#D9B98A",
};

const currency = (value: number): string =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);

function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-[14px] border border-[#E0E2DC] bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-[12px] text-[#929A93]">{title}</p>

        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F0F3EF] text-[#65796B]">
          <Icon size={17} strokeWidth={1.7} />
        </div>
      </div>

      <h3 className="mt-3 text-[26px] font-semibold tracking-tight text-[#26342F]">
        {value}
      </h3>

      <div className="mt-1 flex items-center gap-1 text-[11px] text-[#6E9278]">
        <ArrowUpRight size={13} />
        {change}
      </div>
    </div>
  );
}

export default function SSPDashboard() {
  const [year, setYear] = useState("2026");
  const [search, setSearch] = useState("");

  const totalPensioners = 1284;
  const activePensioners = 1142;
  const inactivePensioners = 102;
  const pendingPensioners = 40;
  const monthlyPension = 18400000;

  const pieData = [
    { name: "Active", value: activePensioners },
    { name: "Inactive", value: inactivePensioners },
    { name: "Pending", value: pendingPensioners },
  ];

  const filteredPensioners = useMemo(() => {
    const query = search.trim().toLowerCase();

    return recentPensioners.filter(
      (pensioner) =>
        pensioner.name.toLowerCase().includes(query) ||
        pensioner.pensionerCode.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="space-y-6 bg-[#F8F9F6] p-4">
      {/* Dashboard heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#929A93]">
            Pensioner Management
          </p>

          <h1 className="text-[25px] font-semibold tracking-tight text-[#26342F]">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-[12px] text-[#929A93]">
            Heres whats happening in your pensioner portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-[9px] border border-[#DCE0D9] bg-white px-3">
          <CalendarDays size={15} className="text-[#87918B]" />

          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="h-9 bg-transparent text-[12px] text-[#526459] outline-none"
          >
            <option value="2026">2026</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Pensioners"
          value={totalPensioners.toLocaleString()}
          change="8.2% this month"
          icon={Users}
        />

        <StatCard
          title="Active Pensioners"
          value={activePensioners.toLocaleString()}
          change="5.4% this month"
          icon={UserCheck}
        />

        <StatCard
          title="Monthly Pension"
          value={currency(monthlyPension)}
          change="3.1% this month"
          icon={Wallet}
        />

        <StatCard
          title="Inactive Pensioners"
          value={inactivePensioners.toLocaleString()}
          change="7.9% of total"
          icon={UserX}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Stacked Bar Chart */}
        <div className="min-w-0 rounded-[14px] border border-[#E0E2DC] bg-white p-5 xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-[14px] font-semibold text-[#26342F]">
              Pensioner Activity
            </h2>

            <p className="mt-1 text-[11px] text-[#929A93]">
              Monthly active and inactive pensioner records.
            </p>
          </div>

          <div className="h-77.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyActivity}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#EEF0EB"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#929A93" }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#929A93" }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E0E2DC",
                    fontSize: 12,
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: 11,
                    paddingTop: 12,
                  }}
                />

                <Bar
                  dataKey="active"
                  name="Active"
                  stackId="pensioners"
                  fill="#526F5D"
                  maxBarSize={35}
                />

                <Bar
                  dataKey="inactive"
                  name="Inactive"
                  stackId="pensioners"
                  fill="#D6DED5"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="min-w-0 rounded-[14px] border border-[#E0E2DC] bg-white p-5">
          <div>
            <h2 className="text-[14px] font-semibold text-[#26342F]">
              Pensioner Distribution
            </h2>

            <p className="mt-1 text-[11px] text-[#929A93]">
              Current pensioner status breakdown.
            </p>
          </div>

          <div className="relative h-62.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={98}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        statusColors[
                          entry.name as PensionerStatus
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[24px] font-semibold text-[#26342F]">
                {totalPensioners.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#929A93]">
                Pensioners
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {pieData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        statusColors[
                          item.name as PensionerStatus
                        ],
                    }}
                  />

                  <span className="text-[12px] text-[#87918B]">
                    {item.name}
                  </span>
                </div>

                <span className="text-[12px] font-semibold text-[#26342F]">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>



          
      

        </div>

              <div className="min-w-0 ">
                <AccountClassificationChart/>
            </div>
            <div className="min-w-0 col-span-2">
                <AgentSalesChart/>
            </div>


      </div>

      {/* Recent Pensioners */}
      <div className="overflow-hidden rounded-[14px] border border-[#E0E2DC] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E9EBE6] px-5 py-5">
          <div>
            <h2 className="text-[14px] font-semibold text-[#26342F]">
              Recent Pensioners
            </h2>

            <p className="mt-1 text-[11px] text-[#929A93]">
              Monitor your newest pensioner records.
            </p>
          </div>

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929A93]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pensioners..."
              className="h-9 w-55 rounded-[9px] border border-[#DCE0D9] bg-[#FAFBF9] pl-9 pr-3 text-[12px] outline-none focus:border-[#8BA194]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left">
            <thead className="bg-[#FAFBF9]">
              <tr>
                {[
                  "Pensioner",
                  "Pensioner ID",
                  "Bank",
                  "Pension Amount",
                  "Status",
                  "",
                ].map((heading, index) => (
                  <th
                    key={index}
                    className="border-b border-[#E9EBE6] px-5 py-3 text-[10px] font-semibold uppercase tracking-wildest text-[#929A93]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredPensioners.map((pensioner) => {
                const initials = pensioner.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={pensioner.id}
                    className="border-b border-[#EEF0EB] last:border-0 hover:bg-[#FAFBF9]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4E9E3] text-[10px] font-semibold text-[#526459]">
                          {initials}
                        </div>

                        <span className="text-[12px] font-medium text-[#26342F]">
                          {pensioner.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-[12px] text-[#87918B]">
                      {pensioner.pensionerCode}
                    </td>

                    <td className="px-5 py-3.5 text-[12px] text-[#87918B]">
                      {pensioner.bank}
                    </td>

                    <td className="px-5 py-3.5 text-[12px] font-semibold text-[#26342F]">
                      {currency(pensioner.pensionAmount)}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                        style={{
                          backgroundColor:
                            pensioner.status === "Active"
                              ? "#EAF2EB"
                              : pensioner.status === "Pending"
                                ? "#F7F0E4"
                                : "#F1F0ED",
                          color:
                            pensioner.status === "Active"
                              ? "#42674D"
                              : pensioner.status === "Pending"
                                ? "#997344"
                                : "#787F79",
                        }}
                      >
                        {pensioner.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <ChevronRight
                        size={15}
                        className="text-[#929A93]"
                      />
                    </td>
                  </tr>
                );
              })}

              {filteredPensioners.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-[12px] text-[#929A93]"
                  >
                    No pensioners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#E9EBE6] px-5 py-4">
          <p className="text-[11px] text-[#929A93]">
            Showing {filteredPensioners.length} pensioners
          </p>

          <span className="flex items-center gap-1 text-[12px] font-medium text-[#526F5D]">
            View all pensioners
            <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
