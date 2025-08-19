"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import OverviewSummary from "@/components/statistics/SummaryKilled";
import CasualtyByAge from "@/components/statistics/CasualtyByAge";
import HeroRemember from "@/components/HeroRemember";
import CasualtiesDonut from "@/components/statistics/CasualtiesByCategory";
import PressKilled from "@/components/statistics/PressKilled";
import LoadingPage from "@/components/Loading";

export default function Overview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    async function fetchData() {
      try {
        const res = await axios.get(
          "https://data.techforpalestine.org/api/v3/summary.json"
        );
        setData(res.data);

       
        timeout = setTimeout(() => {
          setLoading(false);
        }, 3000);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <HeroRemember />
      <OverviewSummary data={data} />
      <CasualtyByAge />
      <CasualtiesDonut />
      <PressKilled />
    </div>
  );
}
