"use client";

import { useState } from "react";

const mockData = [
  {
    source: "Etsy",
    text: '“Love this hoodie, super soft and perfect for streaming!”',
    aiTags: ["streamwear", "esports", "comfy"],
  },
  {
    source: "Instagram",
    text: '"Drip check 🔥 #cyberpunk #gamingstyle"',
    aiTags: ["edgy streetwear", "cyberpunk"],
  },
  {
    source: "Amazon",
    text: '“The print is high quality. Would wear to a LAN party!”',
    aiTags: ["gamer-core"],
  },
];

const suggestions = [
  "esports", "anime", "streetwear", "cosplay", "minimalist",
  "cyberpunk", "streamwear", "techwear", "positive", "neutral", "negative",
];

export default function TrainingPreview() {
  const [data, setData] = useState(mockData);

  const handleAddTag = (i, newTag) => {
    if (!newTag.trim()) return;
    const updated = [...data];
    if (!updated[i].aiTags.includes(newTag)) {
      updated[i].aiTags.push(newTag);
      setData(updated);
    }
  };

  const handleRemoveTag = (i, tagToRemove) => {
    const updated = [...data];
    updated[i].aiTags = updated[i].aiTags.filter(tag => tag !== tagToRemove);
    setData(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">🧠 Calchas Training Preview</h1>
          <div className="space-x-3">
            <button className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded text-white text-sm font-semibold">
              📄 Download CSV
            </button>
            <button className="bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded text-white text-sm font-semibold">
              🚀 Start Training
            </button>
          </div>
        </div>

        {data.map((entry, i) => (
          <div key={i} className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <p className="text-sm text-gray-400 mb-2">Source: {entry.source}</p>
            <p className="italic text-lg mb-4">“{entry.text}”</p>

            <p className="text-sm font-medium text-purple-300 mb-1">AI Suggests:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {entry.aiTags.map((tag, j) => (
                <span
                  key={j}
                  onClick={() => handleRemoveTag(i, tag)}
                  className="bg-purple-700 text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-purple-600"
                >
                  {tag} ✕
                </span>
              ))}
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                id={`input-${i}`}
                placeholder="Add tag..."
                className="bg-gray-700 text-sm px-3 py-2 rounded w-full focus:outline-none"
              />
              <button
                onClick={() => {
                  const val = document.getElementById(`input-${i}`).value;
                  handleAddTag(i, val);
                  document.getElementById(`input-${i}`).value = "";
                }}
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-medium text-white"
              >
                + Add Tag
              </button>
            </div>

            <div className="text-sm text-gray-400 mb-1">Suggestions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((tag, j) => (
                <button
                  key={j}
                  onClick={() => handleAddTag(i, tag)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
