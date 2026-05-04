import { useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Message, STARTERS } from "./types";

interface Props {
  messages: Message[];
  input: string;
  loading: boolean;
  onClose: () => void;
  onSend: (text?: string) => void;
  onInputChange: (value: string) => void;
}

export default function ChatScreen({ messages, input, loading, onClose, onSend, onInputChange }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <button onClick={onClose} className="back-btn">
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
            <button key={s} className="starter-btn" onClick={() => onSend(s)}>{s}</button>
          ))}
        </div>
      )}

      <div className="input-bar">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => {
            onInputChange(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={handleKey}
          placeholder="Type in English..."
          className="chat-input"
        />
        <button
          onClick={() => onSend()}
          disabled={!input.trim() || loading}
          className="send-btn"
        >
          <Icon name="Send" size={18} />
        </button>
      </div>
    </div>
  );
}
