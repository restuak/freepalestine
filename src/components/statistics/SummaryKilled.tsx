"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "./Title";

export default function OverviewSummary({ data }: { data: any }) {
  const [count, setCount] = useState({
    gazaKilled: 0,
    gazaInjured: 0,
    wbKilled: 0,
    wbInjured: 0,
  });

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (!data || !inView) return;

    const duration = 1500;
    const steps = 60;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      setCount({
        gazaKilled: Math.floor((data.gaza.killed.total / steps) * frame),
        gazaInjured: Math.floor((data.gaza.injured.total / steps) * frame),
        wbKilled: Math.floor((data.west_bank.killed.total / steps) * frame),
        wbInjured: Math.floor((data.west_bank.injured.total / steps) * frame),
      });
      if (frame >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [data, inView]);

  return (
    <div ref={ref}>
      <SectionTitle>Casualty Overview</SectionTitle>
      <p className="text-center text-gray-400 mb-12 text-sm md:text-base">
        Last Update: {data.gaza.last_update}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Gaza */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-4">GAZA</h3>
          <div className="text-5xl md:text-6xl font-extrabold text-[#E0404E]">
            {count.gazaKilled.toLocaleString()}
          </div>
          <p className="mt-1 text-lg">Killed</p>
          <div className="text-5xl md:text-6xl font-extrabold text-[#F296A2] mt-6">
            {count.gazaInjured.toLocaleString()}
          </div>
          <p className="mt-1 text-lg">Injured</p>
        </motion.div>

        {/* West Bank */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-4">WEST BANK</h3>
          <div className="text-5xl md:text-6xl font-extrabold text-[#E0404E]">
            {count.wbKilled.toLocaleString()}
          </div>
          <p className="mt-1 text-lg">Killed</p>
          <div className="text-5xl md:text-6xl font-extrabold text-[#F296A2] mt-6">
            {count.wbInjured.toLocaleString()}
          </div>
          <p className="mt-1 text-lg">Injured</p>
        </motion.div>
      </div>
    </div>
  );
}
