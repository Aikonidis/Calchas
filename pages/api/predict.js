// pages/api/predict.js
import formidable from "formidable";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = new formidable.IncomingForm();
  form.uploadDir = "/tmp";
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    const { question, answers } = fields;
    const image = files.image;

    // Upload image to Supabase
    const fileData = fs.readFileSync(image.filepath);
    const fileExt = image.originalFilename.split(".").pop();
    const fileName = `poll-images/${Date.now()}.${fileExt}`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from("poll-assets")
      .upload(fileName, fileData, {
        contentType: image.mimetype,
        upsert: true,
      });

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      return res.status(500).json({ error: "Image upload failed" });
    }

    const { data: urlData } = supabase.storage.from("poll-assets").getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    // GPT-4 Vision: Describe the image
    const visionRes = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this product image in detail for fashion/marketing analysis." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 100,
    });

    const imageDesc = visionRes.choices[0]?.message?.content || "a fashion item";

    // Final prompt for prediction
    const fullPrompt = `
You are an AI simulating the results of a marketing poll.

A fashion brand uploaded an image of a product described as: "${imageDesc}"
They asked the following question to 2,000 Europeans aged 18-25:

"${question}"

Answer choices were:
${answers.split(",").map((a) => `- ${a}`).join("\n")}

Simulate realistic responses and return the result as JSON with percentage values. Percentages should be integers and total 100.
Example: { "Yes": 60, "No": 30, "Maybe": 10 }
`;

    const pollRes = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.7,
    });

    const reply = pollRes.choices[0].message.content;

    // Try parsing JSON from response
    try {
      const json = JSON.parse(reply);
      return res.status(200).json({ success: true, prediction: json, imageUrl });
    } catch (err) {
      console.error("JSON parse error:", err);
      return res.status(500).json({ error: "AI returned invalid response", raw: reply });
    }
  });
}
