import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { imageUrl, question, answers } = req.body;

  const prompt = `
You are a fashion market analyst AI. A user is testing a new apparel design.

Target Market: 18–25 y/o, Europe  
Price Point: €40

🖼️ Product Image: ${imageUrl}  
❓ Poll Question: "${question}"  
✅ Options: ${JSON.stringify(answers)}

💡 Real-world trends:
- Etsy: Top streamer gear blends comfy and edgy
- TikTok: High-contrast gaming fits get traction
- LTTStore: Futuristic designs with a techwear vibe are popular
- Amazon: Most 5-star rated hoodies are priced €35–€45, with strong materials and unique patterns

🗳️ Simulate how 2,000 people in this demographic would respond to this poll.

📊 Also estimate an accuracy level from 0–100%, based on available trend data and user fit.

Return this JSON:

{
  "predictions": {
    "Option1": %,
    ...
  },
  "accuracy": number
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    const parsed = JSON.parse(aiResponse);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("AI Prediction error:", err);
    return res.status(500).json({ error: "Prediction failed" });
  }
}
