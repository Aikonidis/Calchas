"use client";

import "../styles/globals.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([""]);
  const [predictions, setPredictions] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const addAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const submit = () => {
    const random = answers.map(() => Math.floor(Math.random() * 100));
    const total = random.reduce((a, b) => a + b, 0);
    const normalized = random.map((r) => Math.round((r / total) * 100));
    setPredictions(normalized);
  };
  // 👇 Add this part to send to the API route
  await fetch('/api/savePrediction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      answers,
      predictions: normalized,
    }),
  });
};
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-8 tracking-wide uppercase">
          Calchas Prediction Agent
        </h1>

        <label className="block mb-2 font-semibold">Upload Product Image</label>
        <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 text-center hover:border-gray-400 transition-all">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
          <Upload className="mx-auto mb-2" />
          <p className="text-gray-400">Click or drag to upload</p>
        </div>

        {image && (
          <motion.img
            src={image}
            alt="preview"
            className="w-full h-auto rounded shadow mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        <label className="block mb-2 font-semibold">Enter Poll Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded mb-4"
          placeholder="Would you wear this to TwitchCon?"
        />

        <label className="block mb-2 font-semibold">Answer Options</label>
        {answers.map((ans, i) => (
          <input
            key={i}
            type="text"
            value={ans}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded mb-2"
            placeholder={`Option ${i + 1}`}
          />
        ))}

        <button
          onClick={addAnswer}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded mb-6"
        >
          + Add Option
        </button>

        <button
          onClick={submit}
          className="w-full bg-purple-700 hover:bg-purple-600 text-white py-3 rounded text-lg font-semibold mb-6 transition-all"
        >
          Predict Responses
        </button>

        {predictions && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4 text-purple-300">Predicted Poll Results</h2>
            <ul className="space-y-3">
              {answers.map((ans, i) => (
                <li key={i} className="bg-gray-800 p-3 rounded shadow">
                  <div className="flex justify-between mb-1">
                    <span>{ans}</span>
                    <span>{predictions[i]}%</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded">
                    <motion.div
                      className="h-2 rounded bg-purple-500"
                      style={{ width: `${predictions[i]}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${predictions[i]}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
