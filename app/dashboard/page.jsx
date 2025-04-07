"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [topPredictions] = useState([
    {
      id: 1,
      image: "/sample1.jpg",
      question: "Would you wear this at TwitchCon?",
      topAnswer: "Yes",
      confidence: 76,
    },
    {
      id: 2,
      image: "/sample2.jpg",
      question: "Best fit for cyberpunk cosplay?",
      topAnswer: "Option 2",
      confidence: 88,
    },
  ]);

  const trendData = [
    { name: "Mon", value: 30 },
    { name: "Tue", value: 60 },
    { name: "Wed", value: 80 },
    { name: "Thu", value: 50 },
    { name: "Fri", value: 70 },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Calchas Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {topPredictions.map((poll) => (
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 border border-gray-700 p-4 rounded"
          >
            <img src={poll.image} alt="Product" className="w-full h-40 object-cover rounded mb-4" />
            <h2 className="text-lg font-semibold">{poll.question}</h2>
            <p className="text-purple-400 mt-2">Top Answer: {poll.topAnswer}</p>
            <p className="text-sm text-gray-400">Confidence: {poll.confidence}%</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Poll Trend (Dummy)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
