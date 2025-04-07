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

  const submit = async () => {
    const random = answers.map(() => Math.floor(Math.random() * 100));
    const total = random.reduce((a, b) => a + b, 0);
    const normalized = random.map((r) => Math.round((r / total) * 100));
    setPredictions(normalized);

    try {
      await fetch("/api/savePrediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answers,
          predictions: normalized,
        }),
      });
    } catch (err) {
      console.error("Failed to save prediction:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className
