"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import HeroCounters from "@/components/statistics/HeroCounters";
import SummaryChart from "@/components/statistics/SummaryChart";
import KilledPieChart from "@/components/statistics/KilledPieChart";
import InjuredChart from "@/components/statistics/InjuredChart";
import InfrastructureBarChart from "@/components/statistics/InfrastructureBarChart";
import InfrastructureTrend from "@/components/statistics/InfrastructureTrend";
import HeroRemember from "@/components/HeroRemember";

export default function StatisticsPage() {
  const [summary, setSummary] = useState<any | null>(null);
  const [infra, setInfra] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, infraRes] = await Promise.all([
          axios.get("https://data.techforpalestine.org/api/v3/summary.json"),
          axios.get(
            "https://data.techforpalestine.org/api/v3/infrastructure-damaged.json"
          ),
        ]);
        setSummary(summaryRes.data);
        setInfra(infraRes.data);
      } catch (err: any) {
        setError(err.message);
        throw new Error(`Failed to fetch data: ${err.message}`);
      }
    };
    fetchData();
  }, []);

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!summary || !infra) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <HeroRemember />
      <HeroCounters data={summary} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryChart data={summary} />
        <KilledPieChart data={summary} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InjuredChart data={summary} />
        <InfrastructureBarChart data={infra} />
      </div>
      <InfrastructureTrend data={infra} />
    </div>
  );
}
