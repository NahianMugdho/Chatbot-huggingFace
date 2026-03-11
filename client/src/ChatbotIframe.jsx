// ✅ Version 1: iframe — সহজ, কোনো install লাগবে না
export default function ChatbotIframe() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "24px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "50px", padding: "8px 20px", marginBottom: "16px",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80" }}/>
          <span style={{ color: "#4ade80", fontSize: "13px", fontWeight: 600 }}>Live</span>
        </div>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: 700, margin: 0 }}>
          🍶 Sake Brewing IoT Assistant
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px", fontSize: "15px" }}>
          Ask anything about sake brewing & IoT sensors
        </p>
      </div>

      {/* iframe Container */}
      <div style={{
        width: "100%", maxWidth: "860px",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <iframe
          src="https://mugdhoux-chatbot.hf.space"
          width="100%"
          height="600px"
          frameBorder="0"
          allow="microphone"
          style={{ display: "block" }}
        />
      </div>

      <p style={{ color: "rgba(255,255,255,0.3)", marginTop: "16px", fontSize: "12px" }}>
        Powered by Qwen2.5 · Hosted on HuggingFace Spaces
      </p>
    </div>
  );
}
