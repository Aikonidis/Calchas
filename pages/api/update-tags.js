// pages/api/update-tags.js
import supabase from '@/lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, tags } = req.body;

  const { error } = await supabase
    .from('training_data')
    .update({ ai_tags: tags })
    .eq('id', id);

  if (error) {
    console.error('Update error:', error);
    return res.status(500).json({ error: 'Failed to update tags' });
  }

  return res.status(200).json({ success: true });
}
