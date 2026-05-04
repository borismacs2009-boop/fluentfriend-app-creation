export type Tab = "chats" | "voice" | "progress" | "settings";

export interface Correction {
  original: string;
  fixed: string;
  explanation: string;
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  correction?: Correction | null;
}

export interface Stats {
  streak: number;
  words: number;
  sessions: number;
  corrections: number;
  xp: number;
}

export const AI_URL = "https://functions.poehali.dev/4439836c-a584-4b76-b30a-6432ee661613";

export const VOICE_PHRASES = [
  { text: '"The weather is lovely today, isn\'t it?"', topic: "Present Simple", level: "Лёгко" },
  { text: '"She has been studying English for five years."', topic: "Present Perfect", level: "Средне" },
  { text: '"If I had known, I would have told you."', topic: "Conditional II", level: "Сложно" },
  { text: '"Could you please pass me the salt?"', topic: "Polite request", level: "Лёгко" },
  { text: '"The meeting was postponed until next Monday."', topic: "Passive Voice", level: "Средне" },
];

export const ACHIEVEMENTS = [
  { icon: "🔥", name: "На огне", desc: "7 дней подряд", key: "streak7" },
  { icon: "💬", name: "Говорун", desc: "50 практик", key: "sessions50" },
  { icon: "📖", name: "Читатель", desc: "100 слов изучено", key: "words100" },
  { icon: "⚡", name: "Первый шаг", desc: "Начал практику", key: "first" },
  { icon: "🎯", name: "Точность", desc: "10 исправлений", key: "corrections10" },
];

export const LEVEL_MAP = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const STARTERS = [
  "Tell me about your hobby",
  "What did you do yesterday?",
  "Describe your favorite movie",
  "Talk about your dream trip",
];

export const APP_STYLES = `
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
`;
