import supabase from '../../lib/supabase-admin';

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('predictions_training')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Failed to load training data" });
  }

  res.status(200).json({ data });
}
