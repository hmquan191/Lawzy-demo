import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;

// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://lawzy-demo.vercel.app"],
//   })
// );

app.use(
  cors({
    origin: "*", // ⚠️ Tạm thời mở toàn bộ cho testing, sau nên hạn chế
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.post("/api/chatbot", async (req, res) => {
  console.log("👉 Nhận từ frontend:", req.body);

  try {
    const response = await fetch("https://platform.phoai.vn/webhook/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("✅ Phản hồi từ n8n:", data);

    res.json(data);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi gọi chatbot" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server đang chạy tại http://localhost:${PORT}`);
});
