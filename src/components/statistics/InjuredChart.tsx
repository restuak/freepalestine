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

export default function InjuredChart({ data }: { data: any }) {
  const chartData = [
    { name: "Gaza Injured", value: data.gaza.injured.total },
    { name: "West Bank Injured", value: data.west_bank.injured.total },
  ];

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Injured</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#353535" />
            <YAxis stroke="#353535" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={colorAt(0)} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
