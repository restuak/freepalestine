"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function HeroCounters({ data }: { data: any }) {
  const killed = data.gaza.killed.total;
  const injured = data.gaza.injured.total;
  const massacres = data.gaza.massacres;

  const counters = [
    { label: "Killed", value: killed.toLocaleString(), color: "#E2707D" },
    { label: "Injured", value: injured.toLocaleString(), color: "#339564" },
    { label: "Massacres", value: massacres.toLocaleString(), color: "#910C1B" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {counters.map((c, i) => (
        <Card key={i} className="rounded-2xl shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold" style={{ color: c.color }}>
              {c.value}
            </div>
            <div className="text-gray-600">{c.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
