import Icon from "@/components/ui/icon";
import { Message } from "./types";

interface Props {
  messages: Message[];
  onOpenChat: () => void;
}

export default function ChatsTab({ messages, onOpenChat }: Props) {
  return (
    <div className="tab-content">
      <div className="section-label">АКТИВНЫЕ ЧАТЫ</div>
      <div className="card-list">
        <button className="chat-item" onClick={onOpenChat}>
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
  );
}
