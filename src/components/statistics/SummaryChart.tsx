"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { colorAt } from "@/lib/colors";

export default function SummaryChart({ data }: { data: any }) {
  const chartData = [
    { name: "Massacres", value: data.gaza.massacres },
    { name: "Killed", value: data.gaza.killed.total },
    { name: "Injured", value: data.gaza.injured.total },
    { name: "West Bank Killed", value: data.west_bank.killed.total },
    { name: "West Bank Injured", value: data.west_bank.injured.total },
  ];

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#353535" />
            <YAxis stroke="#353535" />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((_, i) => (
                <Cell key={i} fill={colorAt(i)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
