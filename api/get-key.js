// api/get-key.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rzaqgswkrjnshrxgqsnb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6YXFnc3drcmpuc2hyeGdxc25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjMwODQsImV4cCI6MjA2NjU5OTA4NH0.Ji_C2JhMGzYzIp0FfeF-1IX-nMMYblAZo3yhh-fA_0w"; // Rút gọn để dễ nhìn

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

  return res.redirect(
    `https://traitimtrongvag.github.io/KeyCopy/index.html?key=${encodeURIComponent(selectedKey.key)}`
  );
}