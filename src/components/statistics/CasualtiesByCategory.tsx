"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import SectionTitle from "./Title";

const palette = ["#CE1126", "#E0404E", "#E96B78", "#F296A2", "#FBCAD1"];

export default function CasualtiesDonut() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios
      .get("https://data.techforpalestine.org/api/v3/summary.json")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data)
    return (
      <p className="text-gray-400 text-center animate-pulse">Loading...</p>
    );

  const { gaza, west_bank } = data;

  const chartData = [
    {
      name: "Children",
      value: gaza.killed.children + west_bank.killed.children,
    },
    { name: "Women", value: gaza.killed.women },
    {
      name: "Rescue / Medics / Press",
      value: gaza.killed.medical + gaza.killed.press,
    },
    {
      name: "Others",
      value:
        gaza.killed.total -
        (gaza.killed.children +
          gaza.killed.women +
          gaza.killed.medical +
          gaza.killed.press),
    },
  ];

  return (
    <div className="mt-20 w-full px-4">
      <SectionTitle>Casualties by Category</SectionTitle>

      {/* Bungkus animasi container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="p-6 md:p-10 rounded-2xl shadow-lg flex justify-center bg-black/20"
      >
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="70%"
              label={({ name, value }) =>
                `${name} (${Math.round((value / gaza.killed.total) * 100)}%)`
              }
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={palette[index % palette.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(val: number) => val.toLocaleString()}
              labelStyle={{ color: "#111" }}
              contentStyle={{
                background: "#ffffff",
                borderRadius: "8px",
                border: "none",
                color: "black",
                fontSize: "14px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                color: "white",
                paddingTop: "10px",
                fontSize: "14px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
