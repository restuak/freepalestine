"use client";

import { useEffect, useState } from "react";

export default function HeroRemember() {
  const [deaths, setDeaths] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://data.techforpalestine.org/api/v3/summary.json"
        );
        const data = await res.json();
        setDeaths(data.gaza.killed.total ?? null);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-4xl md:text-8xl font-extrabold uppercase tracking-[0.5em] animate-pulse">
        remember
      </h1>
      {deaths !== null ? (
        <p className=" text-[#910C1B] text-7xl md:text-8xl font-bold mt-6 tracking-widest uppercase">
          {deaths.toLocaleString()}
        </p>
      ) : (
        <p className="text-gray-500 mt-6 animate-pulse items-center justify-center">
          Loading...
        </p>
      )}

      <p className="mt-6 text-lg md:text-xl text-[#E2707D] tracking-[0.3em] uppercase">
        Every Number is a Human
      </p>

      <p className="mt-6 text-xl md:text-xl text-[#910C1B] tracking-[0.3em] animate-ping uppercase">
        #FUCKZIONIS
      </p>
    </div>
  );
}
