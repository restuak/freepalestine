"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { colorAt } from "@/lib/colors";

export default function InfrastructureTrend({ data }: { data: any[] }) {
  const chartData = data
    .filter((d) => d.report_date)
    .map((d) => ({
      date: d.report_date,
      educational: d.educational_buildings?.ext_destroyed || 0,
      residential: d.residential?.ext_destroyed || 0,
      mosques: d.places_of_worship?.ext_mosques_destroyed || 0,
      churches: d.places_of_worship?.ext_churches_destroyed || 0,
    }));

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Infrastructure Damage Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#353535" />
            <YAxis stroke="#353535" />
            <Tooltip />
            <Line type="monotone" dataKey="educational" stroke={colorAt(0)} />
            <Line type="monotone" dataKey="residential" stroke={colorAt(1)} />
            <Line type="monotone" dataKey="mosques" stroke={colorAt(2)} />
            <Line type="monotone" dataKey="churches" stroke={colorAt(3)} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
