// pages/api/get-training.js
import { supabase } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  const { data, error } = await supabase.from("training_data").select("*");

  if (error) {
    console.error("Supabase fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch training data" });
  }

  res.status(200).json({ data });
}
