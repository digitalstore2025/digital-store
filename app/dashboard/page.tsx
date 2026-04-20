"use client";

import { useState } from "react";
import { auth } from "@clerk/nextjs/server";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResult(data.result || data.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-deep-space text-white p-10">
      <h1 className="text-3xl font-bold mb-6">منصة توليد المحتوى</h1>

      <textarea
        className="w-full p-4 rounded bg-black/40 border border-white/10 mb-4"
        placeholder="اكتب طلبك (مثال: اكتب إعلان لمنتج رقمي)..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="bg-neon-cyan text-black px-6 py-3 rounded font-bold"
      >
        {loading ? "جاري التوليد..." : "توليد المحتوى"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-white/5 rounded whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
