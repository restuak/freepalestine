"use client";

import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ delay: 2, duration: 1, ease: "easeInOut" }}
    >
      <motion.h1
        className="text-white text-md md:text-5xl font-bold tracking-widest uppercase text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <p className="p-4">🍉🍉🍉</p>
        <p>From the river to the sea</p>
      </motion.h1>
    </motion.div>
  );
}
