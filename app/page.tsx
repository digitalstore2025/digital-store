"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <main className="min-h-screen relative bg-deep-space text-white selection:bg-neon-cyan selection:text-deep-space">
      <h1 className="text-center text-4xl font-bold mt-40">
        عقل اصطناعي
      </h1>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-center mt-10 text-neon-cyan"
      >
        تم النشر بنجاح 🚀
      </motion.div>
    </main>
  );
}
