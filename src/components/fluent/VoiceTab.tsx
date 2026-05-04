import Icon from "@/components/ui/icon";
import { VOICE_PHRASES } from "./types";

interface Props {
  phraseIdx: number;
  recording: boolean;
  onRecord: () => void;
  onSelectPhrase: (i: number) => void;
}

export default function VoiceTab({ phraseIdx, recording, onRecord, onSelectPhrase }: Props) {
  return (
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
        onClick={onRecord}
      >
        <Icon name="Mic" size={32} />
      </button>
      <div className="mic-label">{recording ? "Слушаю…" : "Нажми и говори"}</div>

      <div className="phrase-dots">
        {VOICE_PHRASES.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === phraseIdx ? "dot-active" : ""}`}
            onClick={() => onSelectPhrase(i)}
          />
        ))}
      </div>
    </div>
  );
}
