"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { colorAt } from "@/lib/colors";

export default function KilledPieChart({ data }: { data: any }) {
  const killed = data.gaza.killed;
  const chartData = [
    { name: "Children", value: killed.children },
    { name: "Women", value: killed.women },
    { name: "Medical", value: killed.medical },
    { name: "Press", value: killed.press },
    { name: "Civil Defence", value: killed.civil_defence },
  ];

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Killed Composition</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={colorAt(i)} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
