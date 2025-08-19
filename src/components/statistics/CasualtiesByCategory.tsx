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

// Label desktop: nama + persen, di luar pie
const renderDesktopLabel = (props: any, total: number) => {
  const { name, value, cx, cy, midAngle, innerRadius, outerRadius } = props;
  const radius = outerRadius * 1.15;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "14px", fontWeight: 500 }}
    >
      {`${name} (${Math.round((value / total) * 100)}%)`}
    </text>
  );
};

// Label mobile: persen kecil di dalam slice
const renderMobileLabel = (props: any, total: number) => {
  const { value, cx, cy, midAngle, innerRadius, outerRadius } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "10px", fontWeight: 600 }}
    >
      {`${Math.round((value / total) * 100)}%`}
    </text>
  );
};

export default function CasualtiesDonut() {
  const [data, setData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    axios
      .get("https://data.techforpalestine.org/api/v3/summary.json")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
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
    <div className={`${isMobile ? "mt-10" : "mt-20"} w-full px-4`}>
      <SectionTitle>Casualties by Category</SectionTitle>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="p-6 md:p-10 rounded-2xl shadow-lg flex justify-center bg-gradient-to-b from-[#CE1126]/40 to-black/40"
      >
        <ResponsiveContainer width="100%" height={isMobile ? 320 : 400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? "35%" : "40%"}
              outerRadius={isMobile ? "70%" : "70%"}
              label={(props) =>
                isMobile
                  ? renderMobileLabel(props, gaza.killed.total)
                  : renderDesktopLabel(props, gaza.killed.total)
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
                fontSize: isMobile ? "12px" : "16px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
