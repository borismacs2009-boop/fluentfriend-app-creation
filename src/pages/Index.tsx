import { useState } from "react";
import Icon from "@/components/ui/icon";
import ChatScreen from "@/components/fluent/ChatScreen";
import ChatsTab from "@/components/fluent/ChatsTab";
import VoiceTab from "@/components/fluent/VoiceTab";
import ProgressTab from "@/components/fluent/ProgressTab";
import { Tab, Message, Stats, AI_URL, VOICE_PHRASES, LEVEL_MAP, APP_STYLES } from "@/components/fluent/types";

export default function Index() {
  const [tab, setTab] = useState<Tab>("chats");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hey! I'm FluentFriend, your personal English tutor. Just start chatting — I'll reply and gently correct any mistakes. Ready when you are! 🎓",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [stats, setStats] = useState<Stats>({ streak: 0, words: 0, sessions: 0, corrections: 0, xp: 0 });

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now(), role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history = messages.map((m) => ({ role: m.role, content: m.text }));

    try {
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.reply,
        correction: data.correction,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setStats((s) => ({
        ...s,
        sessions: s.sessions + 1,
        xp: s.xp + 10,
        corrections: data.correction ? s.corrections + 1 : s.corrections,
      }));
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: "Oops, something went wrong. Please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setTimeout(() => {
        setRecording(false);
        setPhraseIdx((i) => (i + 1) % VOICE_PHRASES.length);
      }, 2500);
    }
  };

  const levelIdx = Math.min(Math.floor(stats.xp / 1000), 5);

  if (chatOpen) {
    return (
      <>
        <style>{APP_STYLES}</style>
        <ChatScreen
          messages={messages}
          input={input}
          loading={loading}
          onClose={() => setChatOpen(false)}
          onSend={sendMessage}
          onInputChange={setInput}
        />
      </>
    );
  }

  return (
    <>
      <style>{APP_STYLES}</style>
      <div className="app-shell">
        <header className="app-header main-header">
          <div>
            <div className="app-logo">FluentFriend</div>
            <div className="app-sub">Практикуй английский каждый день</div>
          </div>
          <button className="streak-badge">
            🔥 {stats.streak}
          </button>
        </header>

        <main className="main-scroll">
          {tab === "chats" && (
            <ChatsTab messages={messages} onOpenChat={() => setChatOpen(true)} />
          )}
          {tab === "voice" && (
            <VoiceTab
              phraseIdx={phraseIdx}
              recording={recording}
              onRecord={toggleRecording}
              onSelectPhrase={setPhraseIdx}
            />
          )}
          {tab === "progress" && (
            <ProgressTab stats={stats} />
          )}
          {tab === "settings" && (
            <div className="tab-content">
              <div className="progress-card">
                <div className="section-title" style={{ marginBottom: 16 }}>Настройки</div>
                {[
                  { icon: "🌐", label: "Язык интерфейса", value: "Русский" },
                  { icon: "📊", label: "Уровень английского", value: LEVEL_MAP[levelIdx] },
                  { icon: "🔔", label: "Уведомления", value: "Вкл" },
                  { icon: "🎯", label: "Ежедневная цель", value: "15 мин" },
                ].map((s) => (
                  <div key={s.label} className="settings-row">
                    <span className="settings-icon">{s.icon}</span>
                    <span className="settings-label">{s.label}</span>
                    <span className="settings-value">{s.value}</span>
                    <Icon name="ChevronRight" size={16} style={{ color: "var(--text-muted)" }} />
                  </div>
                ))}
              </div>
              <div className="progress-card" style={{ marginTop: 12 }}>
                <div className="section-title" style={{ marginBottom: 12 }}>О приложении</div>
                <div className="settings-row">
                  <span className="settings-icon">ℹ️</span>
                  <span className="settings-label">Версия</span>
                  <span className="settings-value">1.0.0</span>
                </div>
                <div className="settings-row">
                  <span className="settings-icon">🤖</span>
                  <span className="settings-label">ИИ-движок</span>
                  <span className="settings-value">GigaChat</span>
                </div>
              </div>
            </div>
          )}
        </main>

        <nav className="bottom-nav">
          {([
            { id: "chats", icon: "MessageCircle", label: "Чаты" },
            { id: "voice", icon: "Mic", label: "Голос" },
            { id: "progress", icon: "BarChart2", label: "Прогресс" },
            { id: "settings", icon: "Settings", label: "Настройки" },
          ] as { id: Tab; icon: string; label: string }[]).map((t) => (
            <button
              key={t.id}
              className={`nav-item ${tab === t.id ? "nav-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} size={22} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
