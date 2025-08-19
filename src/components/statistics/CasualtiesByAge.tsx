"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "./Title";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RecordItem = { age: number | null };

// Custom Tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded-lg shadow">
        <p className="font-semibold">Age: {label}</p>
        <p>Total: {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

export default function CasualtyByAgeChart() {
  const [ageCounts, setAgeCounts] = useState<Record<number, number>>({});
  const [loadingPage, setLoadingPage] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const summary = await axios.get(
          "https://data.techforpalestine.org/api/v3/summary.json"
        );
        const pages = summary.data.known_killed_in_gaza.pages;

        for (let page = 1; page <= pages; page++) {
          setLoadingPage(page);
          const res = await axios.get(
            `https://data.techforpalestine.org/api/v2/killed-in-gaza/page-${page}.json`
          );
          const records: RecordItem[] = res.data;

          setAgeCounts((prev) => {
            const copy = { ...prev };
            records.forEach((r) => {
              if (r.age != null) {
                copy[r.age] = (copy[r.age] || 0) + 1;
              }
            });
            return copy;
          });
        }
        setLoadingPage(null);
      } catch (err) {
        console.error("Error fetching killed-in-gaza pages:", err);
        setLoadingPage(null);
      }
    })();
  }, []);

  // Transform ke array untuk chart
  const chartData = Object.entries(ageCounts)
    .map(([age, count]) => ({ age: Number(age), count }))
    .sort((a, b) => a.age - b.age);

  return (
    <div className="mt-20">
      <SectionTitle>Casualties by Age</SectionTitle>
      {loadingPage && (
        <p className="text-center text-gray-400 mb-4">
          Loading page {loadingPage}...
        </p>
      )}
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#E0404E" animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
