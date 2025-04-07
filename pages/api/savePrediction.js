// pages/api/savePrediction.js
import supabase from '@/lib/supabase-admin'; // ✅ use @ alias if configured, otherwise use relative

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, answers, predictions, imageUrl } = req.body;

    if (!question || !answers || !predictions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase.from('predictions').insert([
      {
        question,
        answers,           // JSON array
        votes: predictions, // renamed from `results` for clarity
        image_url: imageUrl || null,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save prediction' });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('API Handler Error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
