// api/get-key.js
import { createClient } from "@supabase/supabase-js";

// Khởi tạo Supabase Client (sử dụng biến môi trường)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false // Tắt session cho serverless function
    }
  }
);

// Cache config cho hiệu năng
const CACHE_CONTROL = "no-cache, no-store, must-revalidate";
const EXPIRES = "0";

export default async function handler(req, res) {
  try {
    // Thiết lập headers bảo mật
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", CACHE_CONTROL);
    res.setHeader("Expires", EXPIRES);

    // Chỉ chấp nhận method GET
    if (req.method !== "GET") {
      return res.status(405).json({ 
        error: "Method Not Allowed",
        message: "Chỉ hỗ trợ GET request"
      });
    }

    console.log("🔄 Đang xử lý yêu cầu key...");

    // 1. Lấy key ngẫu nhiên chưa sử dụng
    const { data, error } = await supabase
      .from("keys1")
      .select("id, key, created_at")
      .eq("used", false)
      .limit(1)
      .order("RANDOM()");

    if (error) throw new Error(`Supabase error: ${error.message}`);
    if (!data?.length) throw new Error("Không còn key khả dụng");

    const [keyData] = data;
    console.log(`🔑 Key được chọn: ${keyData.key}`);

    // 2. Đánh dấu key đã sử dụng (transaction)
    const { error: updateError } = await supabase
      .from("keys1")
      .update({ 
        used: true,
        used_at: new Date().toISOString() 
      })
      .eq("id", keyData.id);

    if (updateError) throw new Error(`Update error: ${updateError.message}`);

    // 3. Tạo redirect URL an toàn
    const redirectUrl = new URL(
      "https://traitimtrongvag.github.io/KeyCopy/index.html"
    );
    redirectUrl.searchParams.set("key", encodeURIComponent(keyData.key));
    redirectUrl.searchParams.set("ts", Date.now()); // Chống cache

    console.log(`✅ Redirect đến: ${redirectUrl.toString()}`);

    // 4. Redirect với mã 302
    return res.redirect(302, redirectUrl.toString());

  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    
    // Xử lý các loại lỗi khác nhau
    const statusCode = error.message.includes("Không còn key") ? 404 : 500;
    
    return res.status(statusCode).json({
      error: "Lỗi hệ thống",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
