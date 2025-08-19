"use client";

import { motion } from "framer-motion";

export default function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-center mb-8"
    >
      {children}
    </motion.h2>
  );
}
