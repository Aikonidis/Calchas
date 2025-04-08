// pages/admin/training-preview.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const mockData = [
  {
    id: 1,
    source: "Etsy",
    text: "Love this hoodie, super soft and perfect for streaming!",
    tags: ["esports", "comfy"],
    aiPrediction: "streamwear",
  },
  {
    id: 2,
    source: "Instagram",
    text: "Drip check 🔥 #cyberpunk #gamingstyle",
    tags: ["cyberpunk"],
    aiPrediction: "edgy streetwear",
  },
  {
    id: 3,
    source: "Amazon",
    text: "The print is high quality. Would wear to a LAN party!",
    tags: [],
    aiPrediction: "gamer-core",
  },
];

const possibleTags = [
  "esports",
  "anime",
  "streetwear",
  "cosplay",
  "minimalist",
  "cyberpunk",
  "streamwear",
  "techwear",
  "positive",
  "neutral",
  "negative",
];

export default function TrainingPreview() {
  const [data, setData] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setData(mockData);
  }, []);

  const handleAddTag = (id, tag) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id && tag
          ? { ...item, tags: [...new Set([...item.tags, tag])] }
          : item
      )
    );
    setTagInput("");
  };

  const handleRemoveTag = (id, tagToRemove) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, tags: item.tags.filter((t) => t !== tagToRemove) }
          : item
      )
    );
  };

  const downloadCSV = () => {
    const header = "id,source,text,tags\n";
    const rows = data
      .map((item) => `${item.id},${item.source},"${item.text}","${item.tags.join(" | ")}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "training_data.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">🧠 Calchas Training Preview</h1>

        <div className="mb-6">
          <button
            onClick={downloadCSV}
            className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded text-white"
          >
            📥 Download CSV
          </button>
          <button
            onClick={() => alert("🧠 Training started! (not yet connected)")}
            className="ml-4 bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white"
          >
            🚀 Start Training
          </button>
        </div>

        {data.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-700 rounded p-4 mb-4 bg-gray-900"
          >
            <p className="text-sm text-gray-400 mb-1">Source: {entry.source}</p>
            <p className="text-lg mb-2">"{entry.text}"</p>

            <div className="mb-2">
              <span className="text-sm text-purple-400">
                AI Suggests: {entry.aiPrediction}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-800 text-sm px-2 py-1 rounded cursor-pointer hover:bg-red-600"
                  onClick={() => handleRemoveTag(entry.id, tag)}
                >
                  {tag} ✕
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                className="bg-gray-800 text-white p-2 rounded"
              />
              <button
                onClick={() => handleAddTag(entry.id, tagInput)}
                className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded"
              >
                ➕ Add Tag
              </button>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              Suggestions:
              {possibleTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(entry.id, tag)}
                  className="ml-2 bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
