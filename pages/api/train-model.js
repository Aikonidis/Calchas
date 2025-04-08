import supabase from '../../lib/supabase-admin'; // Your Supabase client

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const dataset = req.body;

  try {
    const { data, error } = await supabase.from('predictions_training').insert(
      dataset.map(entry => ({
        source: entry.source,
        text: entry.text,
        tags: entry.aiTags,
      }))
    );

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to save training data" });
    }

    return res.status(200).json({ success: true, inserted: data.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
