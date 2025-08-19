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

export default function InfrastructureBarChart({ data }: { data: any[] }) {
  const latest = data[0]; // ambil report terbaru
  const chartData = [
    {
      name: "Educational Destroyed",
      value: latest.educational_buildings.ext_destroyed || 0,
    },
    {
      name: "Mosques Destroyed",
      value: latest.places_of_worship.ext_mosques_destroyed || 0,
    },
    {
      name: "Churches Destroyed",
      value: latest.places_of_worship.ext_churches_destroyed || 0,
    },
    {
      name: "Residential Destroyed",
      value: latest.residential.ext_destroyed || 0,
    },
  ];

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Infrastructure Damage (Latest)</CardTitle>
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
