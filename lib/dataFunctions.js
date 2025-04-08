// lib/dataFunctions.js
import supabase from './supabase-admin';

// Fetch training data from Supabase
export async function getTrainingData() {
  const { data, error } = await supabase
    .from('training_data')
    .select('id, source, text, ai_tags');

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    source: row.source,
    quote: row.text,
    tags: row.ai_tags || [],
    ai_suggestion: row.ai_tags?.[0] || '',
  }));
}

// Update tags in Supabase for a given entry
export async function updateTags(id, newTags) {
  const { error } = await supabase
    .from('training_data')
    .update({ ai_tags: newTags })
    .eq('id', id);

  if (error) throw error;
}
