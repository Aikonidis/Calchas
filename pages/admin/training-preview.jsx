'use client';
import { useEffect, useState } from 'react';

export default function TrainingPreview() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const res = await fetch('/api/get-training');
        const json = await res.json();
        setEntries(json.data || []);
      } catch (err) {
        console.error('Failed to load training data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingData();
  }, []);

  const handleAddTag = async (entryId, newTag) => {
    if (!newTag.trim()) return;

    const updated = entries.map((entry) =>
      entry.id === entryId && !entry.ai_tags.includes(newTag)
        ? { ...entry, ai_tags: [...entry.ai_tags, newTag] }
        : entry
    );
    setEntries(updated);

    await fetch('/api/update-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: entryId,
        tags: updated.find((e) => e.id === entryId).ai_tags,
      }),
    });
  };

  const handleRemoveTag = async (entryId, tagToRemove) => {
    const updated = entries.map((entry) =>
      entry.id === entryId
        ? { ...entry, ai_tags: entry.ai_tags.filter((tag) => tag !== tagToRemove) }
        : entry
    );
    setEntries(updated);

    await fetch('/api/update-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: entryId,
        tags: updated.find((e) => e.id === entryId).ai_tags,
      }),
    });
  };

  if (loading) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold">🧠 Calchas Training Preview</h1>
        <p className="mt-4 text-gray-400">Loading training data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        🧠 Calchas Training Preview
      </h1>

      {entries.map((entry) => (
        <div key={entry.id} className="mb-6 border-b border-gray-700 pb-4">
          <p className="text-sm text-gray-400">Source: {entry.source}</p>
          <p className="italic text-lg mb-2">"{entry.quote}"</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {entry.ai_tags.map((tag) => (
              <button
                key={tag}
                className="bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded text-sm"
                onClick={() => handleRemoveTag(entry.id, tag)}
              >
                {tag} ✕
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              className="p-1 text-black"
              placeholder="Add tag..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(entry.id, e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
