// api/get-key.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rzaqgswkrjnshrxgqsnb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("keys1")
    .select("*")
    .eq("used", false)
    .limit(1)
    .order("RANDOM()", { ascending: false });

  if (error || !data || data.length === 0) {
    return res.status(500).send("❌ Không còn key khả dụng!");
  }

  const selectedKey = data[0];

  await supabase
    .from("keys1")
    .update({ used: true })
    .eq("id", selectedKey.id);

  res.redirect(
    `https://traitimtrongvag.github.io/KeyCopy/index.html?key=${encodeURIComponent(selectedKey.key)}`
  );
}
