// api/get-key.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  try {
    // 1. Lấy key chưa sử dụng
    const { data, error } = await supabase
      .from("keys1")
      .select("id, key")
      .eq("used", false)
      .limit(1)
      .order("RANDOM()");

    if (error) throw error;
    if (!data?.length) return res.status(404).send("❌ Hết key!");

    // 2. Đánh dấu key đã dùng
    const { error: updateError } = await supabase
      .from("keys1")
      .update({ used: true })
      .eq("id", data[0].id);

    if (updateError) throw updateError;

    // 3. Redirect với key
    const redirectUrl = new URL(
      "https://traitimtrongvag.github.io/KeyCopy/index.html"
    );
    redirectUrl.searchParams.set("key", data[0].key);
    return res.redirect(302, redirectUrl.toString());

  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).send("⚠️ Lỗi server: " + error.message);
  }
}
