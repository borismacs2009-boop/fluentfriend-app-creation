import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const AI_URL = "https://functions.poehali.dev/4439836c-a584-4b76-b30a-6432ee661613";

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

const STARTERS = [
  "Tell me about your hobby",
  "What did you do yesterday?",
  "Describe your favorite movie",
  "Talk about your dream trip",
];

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hey! I'm FluentFriend, your personal English tutor. Just start chatting in English — I'll reply and gently correct any mistakes. Ready when you are! 🎓",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now(), role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history = messages.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    try {
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: data.reply,
          correction: data.correction,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Oops, something went wrong. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-app)" }}>
      {/* Header */}
      <header className="flex-shrink-0 border-b" style={{ background: "var(--bg-header)", borderColor: "var(--clr-border)" }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-display font-black" style={{ background: "var(--clr-accent)", color: "#fff" }}>
            F
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none" style={{ color: "var(--clr-text-primary)" }}>
              FluentFriend
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--clr-text-muted)" }}>
              AI English Tutor · GigaChat
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "var(--clr-online-bg)", color: "var(--clr-online)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--clr-online)" }} />
            Online
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-display font-black" style={{ background: "var(--clr-accent)", color: "#fff" }}>
                  F
                </div>
              )}

              <div className={`flex flex-col gap-2 max-w-[80%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    m.role === "user"
                      ? { background: "var(--clr-accent)", color: "#fff", borderRadius: "18px 18px 4px 18px" }
                      : { background: "var(--bg-bubble)", color: "var(--clr-text-primary)", borderRadius: "18px 18px 18px 4px" }
                  }
                >
                  {m.text}
                </div>

                {/* Correction card */}
                {m.correction && (
                  <div className="rounded-xl px-4 py-3 text-xs w-full" style={{ background: "var(--bg-correction)", border: "1px solid var(--clr-correction-border)" }}>
                    <div className="flex items-center gap-1.5 font-semibold mb-2" style={{ color: "var(--clr-correction-title)" }}>
                      <Icon name="Pencil" size={13} />
                      Небольшая правка
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="line-through opacity-60" style={{ color: "var(--clr-text-primary)" }}>{m.correction.original}</span>
                        <Icon name="ArrowRight" size={12} style={{ color: "var(--clr-correction-title)", flexShrink: 0 }} />
                        <span className="font-semibold" style={{ color: "var(--clr-correction-good)" }}>{m.correction.fixed}</span>
                      </div>
                      <p className="mt-1 leading-relaxed" style={{ color: "var(--clr-text-muted)" }}>{m.correction.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-display font-black" style={{ background: "var(--clr-accent)", color: "#fff" }}>
                F
              </div>
              <div className="px-4 py-3 rounded-2xl flex items-center gap-1" style={{ background: "var(--bg-bubble)", borderRadius: "18px 18px 18px 4px" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 rounded-full" style={{ background: "var(--clr-text-muted)", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Starters */}
      {messages.length <= 1 && (
        <div className="flex-shrink-0 max-w-2xl mx-auto w-full px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-2 rounded-full border transition-all hover:scale-105"
                style={{ background: "var(--bg-bubble)", color: "var(--clr-text-primary)", borderColor: "var(--clr-border)" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 border-t" style={{ background: "var(--bg-header)", borderColor: "var(--clr-border)" }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-end gap-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKey}
            placeholder="Type in English..."
            className="flex-1 resize-none rounded-2xl px-4 py-2.5 text-sm outline-none leading-relaxed"
            style={{ background: "var(--bg-input)", color: "var(--clr-text-primary)", border: "1.5px solid var(--clr-border)", minHeight: "44px", maxHeight: "120px" }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40 disabled:scale-100"
            style={{ background: "var(--clr-accent)", color: "#fff" }}
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
      </div>

      <style>{`
        :root {
          --bg-app: #f5f4f0;
          --bg-header: #ffffff;
          --bg-bubble: #ffffff;
          --bg-input: #f5f4f0;
          --bg-correction: #fffbeb;
          --clr-accent: #2563eb;
          --clr-border: #e8e5df;
          --clr-correction-border: #fde68a;
          --clr-correction-title: #d97706;
          --clr-correction-good: #16a34a;
          --clr-text-primary: #1a1a1a;
          --clr-text-muted: #6b7280;
          --clr-online: #16a34a;
          --clr-online-bg: #dcfce7;
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
