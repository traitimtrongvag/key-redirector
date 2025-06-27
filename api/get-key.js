// api/get-key.js
import { createClient } from "@supabase/supabase-js";

// 1. Cấu hình Supabase (NÊN dùng biến môi trường)
const supabase = createClient(
  process.env.SUPABASE_URL || "https://rzaqgswkrjnshrxgqsnb.supabase.co",
  process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6YXFnc3drcmpuc2hyeGdxc25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjMwODQsImV4cCI6MjA2NjU5OTA4NH0.Ji_C2JhMGzYzIp0FfeF-1IX-nMMYblAZo3yhh-fA_0w"
);

export default async function handler(req, res) {
  try {
    // 2. Lấy key ngẫu nhiên
    const { data, error } = await supabase
      .from("keys1")
      .select("id, key")
      .eq("used", false)
      .limit(1)
      .order("RANDOM()");

    // 3. Xử lý khi không có key
    if (error) throw error;
    if (!data?.length) {
      return res.status(200).send(`
        <html>
          <body>
            <script>
              alert("❌ Hiện không còn key khả dụng!");
              window.location.href = "https://traitimtrongvag.github.io";
            </script>
          </body>
        </html>
      `);
    }

    // 4. Đánh dấu key đã dùng
    const selectedKey = data[0];
    await supabase
      .from("keys1")
      .update({ used: true, used_at: new Date().toISOString() })
      .eq("id", selectedKey.id);

    // 5. Chuyển hướng với key
    const redirectUrl = new URL("https://traitimtrongvag.github.io/KeyCopy/index.html");
    redirectUrl.searchParams.set("key", encodeURIComponent(selectedKey.key));
    
    return res.redirect(302, redirectUrl.toString());

  } catch (error) {
    console.error("Lỗi hệ thống:", error);
    return res.status(500).send(`
      <h1>⚠️ Lỗi hệ thống</h1>
      <p>${error.message}</p>
      <a href="https://traitimtrongvag.github.io">Quay về trang chủ</a>
    `);
  }
}
