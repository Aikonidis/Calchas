// pages/api/train-model.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    // This is where training logic or Supabase storage would go
    console.log("🚀 Starting training process with data:", req.body);

    // You could store to Supabase or trigger external API here

    return res.status(200).json({ success: true, message: "Training started!" });
  } catch (error) {
    console.error("Training error:", error);
    return res.status(500).json({ error: "Training failed" });
  }
}
