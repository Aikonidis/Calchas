// pages/api/predict.js
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { imageUrl, question, answers } = req.body;

  if (!question || !answers || answers.length < 2) {
    return res.status(400).json({ error: "Missing question or answers" });
  }

  try {
    const prompt = `
You're simulating a poll with 2,000 European participants aged 18–25.
Use the following image as the subject: ${imageUrl}.
The user asks: "${question}"
Answer options: ${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Estimate how people would respond and give the percentage per answer option (must total ~100%).
Also give an estimated accuracy percentage from 70 to 95 based on relevance and clarity.

Respond in JSON like:
{
  "predictions": { "Answer 1": 40, "Answer 2": 30, ... },
  "accuracy": 87
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content;
    const jsonStart = raw.indexOf("{");
    const json = JSON.parse(raw.slice(jsonStart));

    return res.status(200).json(json);
  } catch (err) {
    console.error("Prediction API Error:", err);
    return res.status(500).json({ error: "Failed to generate predictions" });
  }
}
