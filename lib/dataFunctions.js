import supabase from './supabase-admin';

export async function getTrainingData() {
  const { data, error } = await supabase
    .from('training_data')
    .select('id, source, text, ai_tags');

  if (error) {
    console.error('Error fetching training data:', error);
    throw new Error('Failed to fetch training data');
  }

  return data.map(entry => ({
    id: entry.id,
    source: entry.source,
    quote: entry.text,
    ai_suggestion: entry.ai_tags.join(', '),
    tags: entry.ai_tags || []
  }));
}

export async function updateTags(entryId, tags) {
  const { error } = await supabase
    .from('training_data')
    .update({ ai_tags: tags })
    .eq('id', entryId);

  if (error) {
    console.error('Error updating tags:', error);
    throw new Error('Failed to update tags');
  }
}
