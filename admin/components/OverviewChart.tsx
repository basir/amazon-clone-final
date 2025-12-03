"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface MonthlyData {
    name: string;
    total: number;
}

interface OverviewChartProps {
    data: MonthlyData[];
}

export function OverviewChart({ data }: OverviewChartProps) {
    return (
        <div className="rounded-xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <div className="p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-white">Overview</h3>
            </div>
            <div className="p-6 pt-0 pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Bar
                            dataKey="total"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-zinc-900 dark:fill-zinc-50"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
