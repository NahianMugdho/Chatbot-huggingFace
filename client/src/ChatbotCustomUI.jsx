// ✅ Version 2: Custom UI — নিজের design এ
// npm install @gradio/client
import { useState, useRef, useEffect } from "react";
import { Client } from "@gradio/client";

const SAKE_GREEN = "#4ade80";
const BG_DARK = "#0d1117";
const BUBBLE_USER = "linear-gradient(135deg, #4ade80, #22c55e)";
const BUBBLE_BOT = "#1e2630";

export default function SakeChatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "🍶 Hello! I am the Sake Brewing IoT Assistant. Ask me anything about sake fermentation, sensors, or IoT monitoring!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const client = await Client.connect("MugdhoUX/Chatbot");
      const result = await client.predict("/chat", {
        message: text,
        history: messages.map(m => [
          m.role === "user" ? m.content : null,
          m.role === "assistant" ? m.content : null,
        ]).filter(([u, a]) => u || a),
      });
      const reply = typeof result.data === "string" ? result.data : result.data?.[0] ?? "Sorry, no response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error connecting to the server. Please try again." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: BG_DARK,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "720px",
        background: "#161b22",
        borderRadius: "24px",
        border: "1px solid #30363d",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Top Bar */}
        <div style={{
          background: "linear-gradient(90deg, #0d1117, #1a2332)",
          borderBottom: "1px solid #30363d",
          padding: "18px 24px",
          display: "flex", alignItems: "center", gap: "14px"
        }}>
          <span style={{ fontSize: "28px" }}>🍶</span>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "16px" }}>Sake Brewing IoT Assistant</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: SAKE_GREEN, display: "inline-block", boxShadow: `0 0 6px ${SAKE_GREEN}` }}/>
              <span style={{ color: SAKE_GREEN, fontSize: "12px" }}>Online · Powered by Qwen2.5</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "24px 20px",
          display: "flex", flexDirection: "column", gap: "16px",
          minHeight: "420px", maxHeight: "480px",
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              alignItems: "flex-end", gap: "10px",
            }}>
              {m.role === "assistant" && (
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg, #4ade80, #22c55e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", flexShrink: 0,
                }}>🍶</div>
              )}
              <div style={{
                maxWidth: "75%",
                background: m.role === "user" ? BUBBLE_USER : BUBBLE_BOT,
                color: m.role === "user" ? "#0d1117" : "#e6edf3",
                padding: "12px 16px",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                fontSize: "14px", lineHeight: "1.6",
                boxShadow: m.role === "user" ? "0 4px 12px rgba(74,222,128,0.3)" : "none",
                fontWeight: m.role === "user" ? 600 : 400,
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #4ade80, #22c55e)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
              }}>🍶</div>
              <div style={{
                background: BUBBLE_BOT, borderRadius: "18px 18px 18px 4px",
                padding: "14px 18px", display: "flex", gap: "5px", alignItems: "center",
              }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: "50%", background: SAKE_GREEN,
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${delay}s`,
                    display: "inline-block",
                  }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid #30363d",
          background: "#0d1117",
          display: "flex", gap: "12px", alignItems: "center",
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask about sake brewing, IoT sensors..."
            style={{
              flex: 1, background: "#21262d",
              border: "1px solid #30363d", borderRadius: "12px",
              color: "#e6edf3", padding: "12px 16px", fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? "#21262d" : "linear-gradient(135deg, #4ade80, #22c55e)",
              color: loading || !input.trim() ? "#555" : "#0d1117",
              border: "none", borderRadius: "12px",
              padding: "12px 22px", fontWeight: 700, fontSize: "14px",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "..." : "Send →"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
