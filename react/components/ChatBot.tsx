import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  from: "user" | "bot";
  text: string;
}

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Khởi tạo sessionId nếu chưa có
  useEffect(() => {
    let storedId = localStorage.getItem("sessionId");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("sessionId", storedId);
    }
    setSessionId(storedId);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId,
        }),
      });

      const data = await res.json();
      const botReply: Message = {
        from: "bot",
        text:
          data.output || data.reply || "Không nhận được phản hồi từ chatbot.",
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ Đã xảy ra lỗi khi gửi tin nhắn.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="h-96 overflow-y-auto border border-white/20 rounded p-4 bg-black text-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 text-${msg.from === "user" ? "right" : "left"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-xl max-w-[75%] ${
                msg.from === "user"
                  ? "bg-green-600 ml-auto"
                  : "bg-gray-700 mr-auto"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left mt-2 text-gray-400 italic">
            Đang phản hồi...
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 rounded border border-white/20 bg-gray-900 text-white"
          placeholder="Nhập câu hỏi..."
        />
        <button
          onClick={handleSend}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
          disabled={loading}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
