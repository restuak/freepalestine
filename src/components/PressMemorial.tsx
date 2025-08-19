"use client";

import { useEffect, useState } from "react";
import LoadingPage from "./Loading";

interface Journalist {
  name: string;
  name_en: string;
  notes?: string;
}

export default function PressMemorial() {
  const [data, setData] = useState<Journalist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    async function fetchData() {
      try {
        const res = await fetch(
          "https://data.techforpalestine.org/api/v2/press_killed_in_gaza.json"
        );
        const json = await res.json();
        setData(json);

       
        timeout = setTimeout(() => {
          setLoading(false);
        }, 3000);
      } catch (err) {
        console.error("Failed to fetch press data", err);
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
    <div className="max-w-5xl mx-auto p-6">
      {/* Warning */}
      <div className="bg-black text-center py-10">
        <h1 className="text-4xl md:text-6xl font-bold text-[#910C1B] tracking-widest animate-pulse">
          REMEMBER {data.length} JOURNALISTS
        </h1>
        <p className="mt-3 text-sm md:text-lg text-gray-300 uppercase tracking-wide">
          Every name is a voice silenced
        </p>
      </div>

      {/* List of journalists */}
      <div className="mt-10 space-y-4">
        {data.map((j, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-md hover:bg-white/10 transition"
          >
            <h2 className="text-xl font-semibold text-[#00A050] flex items-center gap-2">
              {j.name_en?.toUpperCase()} <span> 🌹</span>
            </h2>

            {j.name && <p className="text-gray-300">{j.name}</p>}

            {j.notes && (
              <p className="text-sm text-[#5a5a5a] italic mt-1">{j.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
