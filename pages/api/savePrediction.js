// pages/api/savePrediction.js
import supabase from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, answers, results, imageUrl } = req.body;

  const { data, error } = await supabase.from('predictions').insert([
    {
      question,
      answers,   // JSON array
      votes: results,  // JSON array
      image_url: imageUrl || null,
    },
  ]);

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to save prediction' });
  }

  res.status(200).json({ success: true, data });
}
