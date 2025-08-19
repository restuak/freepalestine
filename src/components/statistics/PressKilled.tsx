"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "./Title";

export default function PressKilled() {
  const [pressKilled, setPressKilled] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://data.techforpalestine.org/api/v3/summary.json"
        );
        const data = await res.json();
        setPressKilled(data.known_press_killed_in_gaza.records ?? null);
      } catch (err) {
        console.error("Error fetching press killed:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (pressKilled !== null && inView) {
      let start = 0;
      const duration = 2000; // durasi animasi dalam ms
      const startTime = performance.now();

      function animate(time: number) {
        const progress = Math.min((time - startTime) / duration, 1);
        setCount(Math.floor(progress * (pressKilled ?? 0)));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    }
  }, [pressKilled, inView]);

  return (
    <div className="mt-20" ref={ref}>
      <SectionTitle>Press Killed</SectionTitle>
      <div className="flex justify-center">
        {pressKilled !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[#0a0a0a] p-10 rounded-2xl shadow text-center"
          >
            <div className="text-6xl md:text-7xl font-extrabold text-[#E0404E]">
              {count.toLocaleString()}
            </div>
            <p className="mt-4 text-lg tracking-[0.3em] text-[#FBCAD1] uppercase">
              Journalists
            </p>
          </motion.div>
        ) : (
          <p className="text-gray-500 animate-pulse">Loading...</p>
        )}
      </div>
    </div>
  );
}
