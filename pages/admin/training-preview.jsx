"use client";
import { useEffect, useState } from "react";

const suggestions = [
  "esports", "anime", "streetwear", "cosplay", "minimalist",
  "cyberpunk", "streamwear", "techwear", "positive", "neutral", "negative",
];

export default function TrainingPreview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/get-training");
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Failed to load");

        setData(json.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load training data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddTag = (i, newTag) => {
    if (!newTag.trim()) return;
    const updated = [...data];
    if (!Array.isArray(updated[i].aiTags)) updated[i].aiTags = [];
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

  const downloadCSV = () => {
    const header = "source,text,tags\n";
    const rows = data
      .map(item =>
        `${item.source},"${item.text}","${(item.aiTags || []).join(" | ")}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "training_data.csv";
    a.click();
  };

  const startTraining = async () => {
    try {
      const response = await fetch("/api/train-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Calchas training started!");
      } else {
        alert("⚠️ Something went wrong: " + result.error);
      }
    } catch (err) {
      alert("🚨 Error starting training");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">🧠 Calchas Training Preview</h1>
          <div className="space-x-3">
            <button
              onClick={downloadCSV}
              className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded text-white text-sm font-semibold"
            >
              📄 Download CSV
            </button>
            <button
              onClick={startTraining}
              className="bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded text-white text-sm font-semibold"
            >
              🚀 Start Training
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center mt-10">Loading training data...</p>
        ) : error ? (
          <p className="text-red-500 text-center mt-10">{error}</p>
        ) : data.length > 0 ? (
          data.map((entry, i) => (
            <div key={i} className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <p className="text-sm text-gray-400 mb-2">Source: {entry.source}</p>
              <p className="italic text-lg mb-4">“{entry.text}”</p>

              <p className="text-sm font-medium text-purple-300 mb-1">AI Tags:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(entry.aiTags) ? (
                  entry.aiTags.map((tag, j) => (
                    <span
                      key={j}
                      onClick={() => handleRemoveTag(i, tag)}
                      className="bg-purple-700 text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-purple-600"
                    >
                      {tag} ✕
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-red-500">No tags available</span>
                )}
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
          ))
        ) : (
          <p className="text-gray-400 text-center mt-10">No training data found.</p>
        )}
      </div>
    </div>
  );
}
