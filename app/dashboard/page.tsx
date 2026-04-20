"use client";

import { useState } from "react";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResult(data.result || data.error);
  };

  return (
    <div className="min-h-screen bg-deep-space text-white p-10">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>

      <textarea
        className="w-full p-4 rounded bg-black/40 border border-white/10 mb-4"
        placeholder="اكتب النص هنا..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-neon-cyan text-black px-6 py-3 rounded font-bold"
      >
        توليد
      </button>

      {result && (
        <div className="mt-6 p-4 bg-white/5 rounded">{result}</div>
      )}
    </div>
  );
}
