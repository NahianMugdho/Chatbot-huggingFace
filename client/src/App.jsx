
// import SakeChatbot from './ChatbotCustomUI'

// // ── Color Palette ──────────────────────────────────
// const COLORS = {
//   bg: '#0d1117',
//   card: '#161b22',
//   border: '#30363d',
//   green: '#4ade80',
//   blue: '#60a5fa',
//   orange: '#fb923c',
//   purple: '#c084fc',
//   text: '#e6edf3',
//   muted: '#8b949e',
// }

// const LINE_COLORS = ['#4ade80', '#60a5fa', '#fb923c', '#c084fc', '#f472b6', '#facc15']

// // ── Main App ───────────────────────────────────────
// function App() {
//    return <SakeChatbot />
// }

// export default App
import { useState } from 'react'
import SakeChatbot from './ChatbotCustomUI'
import ChatbotIframe from './ChatbotIframe'

function App() {
  const [activeTab, setActiveTab] = useState('iframe')

  const tabs = [
    { id: 'iframe',  label: '🖼️ iframe Version' },
    { id: 'custom',  label: '🎨 Custom UI Version' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* ── Tab Bar ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '24px 24px 0',
        gap: '8px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 28px',
              borderRadius: '14px 14px 0 0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px',
              transition: 'all 0.2s',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                : '#161b22',
              color: activeTab === tab.id ? '#0d1117' : '#8b949e',
              borderBottom: activeTab === tab.id ? 'none' : '2px solid #30363d',
              boxShadow: activeTab === tab.id
                ? '0 -4px 20px rgba(74,222,128,0.25)'
                : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #4ade80, transparent)' }} />

      {/* ── Tab Content ── */}
      {activeTab === 'iframe' && <ChatbotIframe />}
      {activeTab === 'custom' && <SakeChatbot />}
    </div>
  )
}

export default App