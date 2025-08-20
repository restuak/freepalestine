"use client";

import { useEffect, useState } from "react";

export default function HeroRemember() {
  const [deaths, setDeaths] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://data.techforpalestine.org/api/v3/summary.json"
        );
        const data = await res.json();
        setDeaths(data.gaza.killed.total + data.west_bank.killed.total);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    }
    fetchData();
  }, []);


  useEffect(() => {
    if (deaths !== null) {
      let frame = 0;
      const steps = 40; 
      const duration = 1500; 
      const increment = deaths / steps;

      const interval = setInterval(() => {
        frame++;
        setCount(Math.floor(increment * frame));
        if (frame >= steps) {
          setCount(deaths);
          clearInterval(interval);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [deaths]);

  return (
    <section className="pb-15">
      <div className="bg-black text-white flex flex-col items-center justify-start min-h-screen w-full text-center px-4 pt-[20vh] max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-8xl font-extrabold uppercase tracking-[0.5em] animate-pulse">
          remember
        </h1>

        {deaths !== null ? (
          <p className="text-[#CE1126] text-6xl md:text-8xl font-extrabold mt-6 tracking-widest uppercase transition-all duration-500">
            {count.toLocaleString()}
          </p>
        ) : (
          <p className="text-[#CE1126] mt-6 animate-pulse items-center justify-center">
            ...
          </p>
        )}

        <p className="mt-6 text-md md:text-xl text-[#E96B78] tracking-[0.3em] uppercase">
          Every Number is a Human
        </p>

        <p className="mt-6 text-lg md:text-xl text-[#E0404E] tracking-[0.3em] animate-ping uppercase">
          #FUCKZIONIS
        </p>
      </div>
    </section>
  );
}
