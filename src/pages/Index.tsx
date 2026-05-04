import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const AI_URL = "https://functions.poehali.dev/4439836c-a584-4b76-b30a-6432ee661613";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "chats" | "voice" | "progress" | "settings";

interface Correction {
  original: string;
  fixed: string;
  explanation: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  correction?: Correction | null;
}

interface Stats {
  streak: number;
  words: number;
  sessions: number;
  corrections: number;
  xp: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const VOICE_PHRASES = [
  { text: '"The weather is lovely today, isn\'t it?"', topic: "Present Simple", level: "Лёгко" },
  { text: '"She has been studying English for five years."', topic: "Present Perfect", level: "Средне" },
  { text: '"If I had known, I would have told you."', topic: "Conditional II", level: "Сложно" },
  { text: '"Could you please pass me the salt?"', topic: "Polite request", level: "Лёгко" },
  { text: '"The meeting was postponed until next Monday."', topic: "Passive Voice", level: "Средне" },
];

const ACHIEVEMENTS = [
  { icon: "🔥", name: "На огне", desc: "7 дней подряд", key: "streak7" },
  { icon: "💬", name: "Говорун", desc: "50 практик", key: "sessions50" },
  { icon: "📖", name: "Читатель", desc: "100 слов изучено", key: "words100" },
  { icon: "⚡", name: "Первый шаг", desc: "Начал практику", key: "first" },
  { icon: "🎯", name: "Точность", desc: "10 исправлений", key: "corrections10" },
];

const LEVEL_MAP = ["A1", "A2", "B1", "B2", "C1", "C2"];

const STARTERS = [
  "Tell me about your hobby",
  "What did you do yesterday?",
  "Describe your favorite movie",
  "Talk about your dream trip",
];

// ─── App ─────────────────────────────────────────────────────────────────────
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
  const nextLevel = LEVEL_MAP[Math.min(levelIdx + 1, 5)];
  const xpForNext = (levelIdx + 1) * 1000;
  const xpProgress = ((stats.xp % 1000) / 1000) * 100;

  // ─── Chat screen ──────────────────────────────────────────────────────────
  if (chatOpen) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <button onClick={() => setChatOpen(false)} className="back-btn">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="avatar-sm">🤖</div>
            <div>
              <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>AI Tutor</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>B2 · онлайн</div>
            </div>
          </div>
          <div style={{ marginLeft: "auto" }} />
        </header>

        <main className="chat-body">
          {messages.map((m) => (
            <div key={m.id} className={`msg-row ${m.role === "user" ? "msg-user" : "msg-ai"}`}>
              {m.role === "assistant" && <div className="avatar-sm">🤖</div>}
              <div className="msg-col">
                <div className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}>
                  {m.text}
                </div>
                {m.correction && (
                  <div className="correction-card">
                    <div className="correction-title">
                      <Icon name="Pencil" size={12} /> Небольшая правка
                    </div>
                    <div className="correction-body">
                      <span className="line-through opacity-50">{m.correction.original}</span>
                      <Icon name="ArrowRight" size={12} />
                      <span className="correction-good">{m.correction.fixed}</span>
                    </div>
                    <p className="correction-explanation">{m.correction.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg-row msg-ai">
              <div className="avatar-sm">🤖</div>
              <div className="bubble bubble-ai typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </main>

        {messages.length <= 1 && (
          <div className="starters">
            {STARTERS.map((s) => (
              <button key={s} className="starter-btn" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        <div className="input-bar">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKey}
            placeholder="Type in English..."
            className="chat-input"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="send-btn"
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ─── Main screens ─────────────────────────────────────────────────────────
  return (
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

        {/* ── CHATS TAB ── */}
        {tab === "chats" && (
          <div className="tab-content">
            <div className="section-label">АКТИВНЫЕ ЧАТЫ</div>
            <div className="card-list">
              <button className="chat-item" onClick={() => setChatOpen(true)}>
                <div className="chat-avatar ai-avatar">🤖</div>
                <div className="chat-meta">
                  <div className="chat-name">AI Tutor</div>
                  <div className="chat-preview">
                    {messages.length > 1
                      ? messages[messages.length - 1].text.slice(0, 40) + "…"
                      : "Great job! Let's practice conditionals."}
                  </div>
                  <span className="level-badge blue">B2</span>
                </div>
                <div className="chat-right">
                  <div className="chat-time">сейчас</div>
                  {messages.length > 1 && (
                    <div className="unread-dot">{messages.filter((m) => m.role === "assistant").length - 1}</div>
                  )}
                </div>
              </button>

              {[
                { name: "Maria Santos", flag: "BR", preview: "Can we practice tomorrow?", level: "B1", time: "5м" },
                { name: "Yuki Tanaka", flag: "JP", preview: "How do you say 'serendipity'?", level: "", time: "1ч" },
                { name: "Ahmed Hassan", flag: "EG", preview: "I learned 10 new words!", level: "", time: "2ч" },
              ].map((c) => (
                <div key={c.name} className="chat-item">
                  <div className="chat-avatar initials-avatar">{c.flag}</div>
                  <div className="chat-meta">
                    <div className="chat-name">{c.name}</div>
                    <div className="chat-preview">{c.preview}</div>
                    {c.level && <span className="level-badge green">{c.level}</span>}
                  </div>
                  <div className="chat-right">
                    <div className="chat-time">{c.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-label" style={{ marginTop: 20 }}>НАЙТИ ПАРТНЁРА</div>
            <div className="card-list">
              <button className="chat-item partner-item">
                <div className="chat-avatar partner-avatar">
                  <Icon name="UserSearch" size={22} style={{ color: "var(--text-muted)" }} />
                </div>
                <div className="chat-meta">
                  <div className="chat-name">Найти собеседника</div>
                  <div className="chat-preview">Практикуй с людьми со всего мира</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── VOICE TAB ── */}
        {tab === "voice" && (
          <div className="tab-content voice-tab">
            <h2 className="voice-title">Голосовая практика</h2>
            <p className="voice-sub">Произнеси фразу — я оценю точность</p>

            <div className="phrase-card">
              <div className="phrase-label">ПРОИЗНЕСИ ФРАЗУ</div>
              <div className="phrase-text">{VOICE_PHRASES[phraseIdx].text}</div>
              <div className="phrase-tags">
                <span className="tag-blue">{VOICE_PHRASES[phraseIdx].topic}</span>
                <span className="tag-green">{VOICE_PHRASES[phraseIdx].level}</span>
              </div>
            </div>

            <button
              className={`mic-btn ${recording ? "mic-active" : ""}`}
              onClick={toggleRecording}
            >
              <Icon name="Mic" size={32} />
            </button>
            <div className="mic-label">{recording ? "Слушаю…" : "Нажми и говори"}</div>

            <div className="phrase-dots">
              {VOICE_PHRASES.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === phraseIdx ? "dot-active" : ""}`}
                  onClick={() => setPhraseIdx(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── PROGRESS TAB ── */}
        {tab === "progress" && (
          <div className="tab-content">
            <div className="progress-card">
              <div className="profile-row">
                <div className="profile-avatar">🧑</div>
                <div>
                  <div className="profile-name">Мой профиль</div>
                  <div className="profile-level">Уровень {LEVEL_MAP[levelIdx]}</div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }} />
                  </div>
                  <div className="progress-bar-label">до {nextLevel}</div>
                </div>
              </div>
              <div className="stats-grid">
                {[
                  { icon: "🔥", label: "Дней подряд", value: stats.streak },
                  { icon: "📖", label: "Слов изучено", value: stats.words },
                  { icon: "💬", label: "Практик", value: stats.sessions },
                  { icon: "✅", label: "Исправлений", value: stats.corrections },
                ].map((s) => (
                  <div key={s.label} className="stat-cell">
                    <div className="stat-icon">{s.icon}</div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="progress-card" style={{ marginTop: 12 }}>
              <div className="section-title">Активность на неделе</div>
              <div className="week-grid">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                  <div key={d} className="week-col">
                    <div className="week-bar" />
                    <div className="week-label">{d}</div>
                  </div>
                ))}
              </div>
              {stats.sessions === 0 && (
                <div className="empty-hint">Начни практику — здесь появится твоя активность</div>
              )}
            </div>

            <div className="progress-card" style={{ marginTop: 12 }}>
              <div className="section-title">Достижения</div>
              {ACHIEVEMENTS.map((a) => (
                <div key={a.key} className="achievement-row">
                  <div className="achievement-icon">{a.icon}</div>
                  <div className="achievement-meta">
                    <div className="achievement-name">{a.name}</div>
                    <div className="achievement-desc">{a.desc}</div>
                  </div>
                  <Icon name="Lock" size={16} style={{ color: "var(--text-muted)", marginLeft: "auto" }} />
                </div>
              ))}
            </div>

            <div className="progress-card" style={{ marginTop: 12, marginBottom: 16 }}>
              <div className="xp-header">
                <span className="section-title">До уровня {nextLevel}</span>
                <span className="xp-count">{stats.xp} / {xpForNext} XP</span>
              </div>
              <div className="xp-bar-wrap">
                <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
              </div>
              <div className="xp-hint">Ещё {xpForNext - stats.xp} XP до уровня {nextLevel}</div>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
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

      {/* Bottom nav */}
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

      <style>{`
        :root {
          --bg: #f0ede8;
          --surface: #ffffff;
          --accent: #2563eb;
          --accent-light: #eff6ff;
          --text-primary: #1a1a1a;
          --text-muted: #6b7280;
          --border: #e5e0d8;
          --correction-bg: #fffbeb;
          --correction-border: #fde68a;
          --correction-title: #d97706;
          --correction-good: #16a34a;
          --green: #16a34a;
          --green-light: #dcfce7;
        }
        .app-shell { display:flex; flex-direction:column; height:100dvh; background:var(--bg); font-family:'Golos Text',sans-serif; max-width:480px; margin:0 auto; position:relative; }
        .main-scroll { flex:1; overflow-y:auto; }
        .tab-content { padding:16px; }
        .app-header { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--surface); border-bottom:1px solid var(--border); flex-shrink:0; }
        .main-header { justify-content:space-between; }
        .app-logo { font-family:'Montserrat',sans-serif; font-weight:800; font-size:20px; font-style:italic; color:var(--text-primary); }
        .app-sub { font-size:12px; color:var(--text-muted); margin-top:1px; }
        .streak-badge { background:#fff7ed; border:none; font-size:16px; font-weight:700; color:#d97706; cursor:pointer; padding:6px 12px; border-radius:20px; }
        .back-btn { background:none; border:none; cursor:pointer; color:var(--text-primary); padding:4px; display:flex; align-items:center; }
        .section-label { font-size:11px; font-weight:700; letter-spacing:.08em; color:var(--text-muted); margin-bottom:8px; padding:0 2px; }
        .section-title { font-size:15px; font-weight:700; color:var(--text-primary); }
        .card-list { background:var(--surface); border-radius:16px; overflow:hidden; }
        .progress-card { background:var(--surface); border-radius:16px; padding:16px; }
        .chat-item { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--surface); border:none; cursor:pointer; width:100%; text-align:left; border-bottom:1px solid var(--border); transition:background .15s; }
        .chat-item:last-child { border-bottom:none; }
        .chat-item:hover { background:#f9f8f5; }
        .chat-avatar { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
        .ai-avatar { background:#eff6ff; }
        .initials-avatar { background:#f3f4f6; font-size:14px; font-weight:700; color:var(--text-muted); }
        .partner-avatar { background:#f3f4f6; }
        .chat-meta { flex:1; min-width:0; }
        .chat-name { font-size:15px; font-weight:600; color:var(--text-primary); }
        .chat-preview { font-size:13px; color:var(--text-muted); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .chat-right { display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0; }
        .chat-time { font-size:12px; color:var(--text-muted); }
        .unread-dot { width:20px; height:20px; border-radius:10px; background:var(--accent); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; }
        .level-badge { display:inline-block; font-size:11px; font-weight:700; padding:2px 8px; border-radius:20px; margin-top:4px; }
        .blue { background:#eff6ff; color:var(--accent); }
        .green { background:var(--green-light); color:var(--green); }
        .voice-tab { display:flex; flex-direction:column; align-items:center; }
        .voice-title { font-family:'Montserrat',sans-serif; font-weight:900; font-size:28px; font-style:italic; color:var(--text-primary); margin-bottom:8px; text-align:center; }
        .voice-sub { font-size:14px; color:var(--text-muted); margin-bottom:28px; text-align:center; }
        .phrase-card { background:var(--surface); border-radius:20px; padding:24px; width:100%; text-align:center; margin-bottom:36px; }
        .phrase-label { font-size:11px; font-weight:700; letter-spacing:.08em; color:var(--text-muted); margin-bottom:16px; }
        .phrase-text { font-size:19px; font-weight:600; color:var(--text-primary); line-height:1.4; margin-bottom:16px; }
        .phrase-tags { display:flex; gap:8px; justify-content:center; }
        .tag-blue { background:#eff6ff; color:var(--accent); font-size:12px; font-weight:600; padding:4px 12px; border-radius:20px; }
        .tag-green { background:var(--green-light); color:var(--green); font-size:12px; font-weight:600; padding:4px 12px; border-radius:20px; }
        .mic-btn { width:80px; height:80px; border-radius:40px; background:var(--accent); border:none; cursor:pointer; color:#fff; display:flex; align-items:center; justify-content:center; transition:transform .15s; box-shadow:0 4px 20px rgba(37,99,235,.35); }
        .mic-btn:hover { transform:scale(1.06); }
        .mic-active { background:#dc2626; box-shadow:0 4px 24px rgba(220,38,38,.4); animation:pulse-mic 1s ease-in-out infinite; }
        @keyframes pulse-mic { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        .mic-label { margin-top:14px; font-size:14px; color:var(--text-muted); font-weight:500; }
        .phrase-dots { display:flex; gap:8px; margin-top:32px; }
        .dot { width:8px; height:8px; border-radius:4px; background:var(--border); border:none; cursor:pointer; transition:all .2s; padding:0; }
        .dot-active { width:24px; background:var(--accent); }
        .profile-row { display:flex; align-items:flex-start; gap:14px; margin-bottom:16px; }
        .profile-avatar { font-size:36px; width:52px; height:52px; background:#f3f4f6; border-radius:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .profile-name { font-size:16px; font-weight:700; color:var(--text-primary); }
        .profile-level { font-size:13px; color:var(--text-muted); margin-top:2px; margin-bottom:6px; }
        .progress-bar-wrap { height:4px; background:var(--border); border-radius:2px; width:140px; margin-bottom:4px; }
        .progress-bar-fill { height:100%; background:var(--accent); border-radius:2px; transition:width .4s; }
        .progress-bar-label { font-size:11px; color:var(--text-muted); }
        .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .stat-cell { background:#f8f7f4; border-radius:12px; padding:12px; }
        .stat-icon { font-size:16px; margin-bottom:4px; }
        .stat-label { font-size:11px; color:var(--text-muted); }
        .stat-value { font-size:24px; font-weight:800; color:var(--text-primary); }
        .week-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin:16px 0 8px; }
        .week-col { display:flex; flex-direction:column; align-items:center; gap:4px; }
        .week-bar { height:40px; width:100%; background:#f3f4f6; border-radius:6px; }
        .week-label { font-size:11px; color:var(--text-muted); }
        .empty-hint { text-align:center; font-size:12px; color:var(--text-muted); }
        .achievement-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border); }
        .achievement-row:last-child { border-bottom:none; }
        .achievement-icon { font-size:22px; width:36px; text-align:center; opacity:.35; }
        .achievement-name { font-size:14px; font-weight:600; color:var(--text-primary); }
        .achievement-desc { font-size:12px; color:var(--text-muted); }
        .xp-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .xp-count { font-size:13px; font-weight:700; color:var(--accent); }
        .xp-bar-wrap { height:6px; background:var(--border); border-radius:3px; }
        .xp-bar-fill { height:100%; background:var(--accent); border-radius:3px; transition:width .4s; }
        .xp-hint { font-size:12px; color:var(--text-muted); margin-top:8px; }
        .settings-row { display:flex; align-items:center; gap:10px; padding:12px 0; border-bottom:1px solid var(--border); }
        .settings-row:last-child { border-bottom:none; }
        .settings-icon { font-size:18px; width:28px; text-align:center; }
        .settings-label { font-size:14px; color:var(--text-primary); flex:1; }
        .settings-value { font-size:13px; color:var(--text-muted); }
        .bottom-nav { display:flex; background:var(--surface); border-top:1px solid var(--border); padding:8px 0 env(safe-area-inset-bottom,8px); flex-shrink:0; }
        .nav-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; border:none; background:none; cursor:pointer; padding:6px 0; color:var(--text-muted); font-size:11px; font-family:inherit; transition:color .15s; }
        .nav-active { color:var(--accent); }
        .chat-body { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:14px; }
        .msg-row { display:flex; gap:8px; align-items:flex-end; }
        .msg-ai { flex-direction:row; }
        .msg-user { flex-direction:row-reverse; }
        .msg-col { display:flex; flex-direction:column; gap:6px; max-width:78%; }
        .msg-ai .msg-col { align-items:flex-start; }
        .msg-user .msg-col { align-items:flex-end; }
        .bubble { padding:10px 14px; font-size:14px; line-height:1.5; }
        .bubble-ai { background:var(--surface); color:var(--text-primary); border-radius:18px 18px 18px 4px; }
        .bubble-user { background:var(--accent); color:#fff; border-radius:18px 18px 4px 18px; }
        .avatar-sm { width:32px; height:32px; border-radius:10px; background:#eff6ff; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
        .typing { display:flex; gap:5px; align-items:center; padding:14px; }
        .typing span { width:8px; height:8px; border-radius:4px; background:var(--border); display:inline-block; animation:bounce 1.2s ease-in-out infinite; }
        .typing span:nth-child(2) { animation-delay:.2s; }
        .typing span:nth-child(3) { animation-delay:.4s; }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        .correction-card { background:var(--correction-bg); border:1px solid var(--correction-border); border-radius:12px; padding:10px 12px; font-size:12px; }
        .correction-title { display:flex; align-items:center; gap:5px; font-weight:700; color:var(--correction-title); margin-bottom:6px; }
        .correction-body { display:flex; align-items:center; gap:6px; flex-wrap:wrap; color:var(--text-primary); }
        .correction-good { font-weight:700; color:var(--correction-good); }
        .correction-explanation { color:var(--text-muted); margin-top:5px; line-height:1.4; }
        .starters { padding:0 16px 8px; display:flex; flex-wrap:wrap; gap:8px; }
        .starter-btn { font-size:12px; padding:7px 14px; border-radius:20px; border:1px solid var(--border); background:var(--surface); color:var(--text-primary); cursor:pointer; font-family:inherit; }
        .input-bar { display:flex; align-items:flex-end; gap:10px; padding:10px 12px; background:var(--surface); border-top:1px solid var(--border); flex-shrink:0; }
        .chat-input { flex:1; resize:none; border:1.5px solid var(--border); border-radius:18px; padding:10px 14px; font-size:14px; font-family:inherit; outline:none; background:#f8f7f4; color:var(--text-primary); min-height:42px; max-height:120px; line-height:1.4; }
        .chat-input:focus { border-color:var(--accent); }
        .send-btn { width:42px; height:42px; border-radius:14px; background:var(--accent); border:none; cursor:pointer; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:opacity .15s; }
        .send-btn:disabled { opacity:.4; cursor:default; }
      `}</style>
    </div>
  );
}
