'use client';

import { useEffect, useState } from 'react';
import { getTrainingData, updateTags } from '../../lib/dataFunctions';

export default function TrainingPreview() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    getTrainingData()
      .then(setEntries)
      .catch(console.error);
  }, []);

  const handleAddTag = async (entryId, newTag) => {
    const updated = entries.map((entry) =>
      entry.id === entryId
        ? { ...entry, tags: [...entry.tags, newTag] }
        : entry
    );
    setEntries(updated);
    await updateTags(entryId, updated.find((e) => e.id === entryId).tags);
  };

  const handleRemoveTag = async (entryId, tagToRemove) => {
    const updated = entries.map((entry) =>
      entry.id === entryId
        ? { ...entry, tags: entry.tags.filter((tag) => tag !== tagToRemove) }
        : entry
    );
    setEntries(updated);
    await updateTags(entryId, updated.find((e) => e.id === entryId).tags);
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        🧠 Calchas Training Preview
      </h1>

      {entries.map((entry) => (
        <div key={entry.id} className="mb-6 border-b border-gray-700 pb-4">
          <p className="text-sm text-gray-400">Source: {entry.source}</p>
          <p className="italic text-lg mb-2">"{entry.quote}"</p>
          <p>
            <span className="font-semibold">AI Suggests:</span>{' '}
            {entry.ai_suggestion}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
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
                  handleAddTag(entry.id, e.target.value.trim());
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
