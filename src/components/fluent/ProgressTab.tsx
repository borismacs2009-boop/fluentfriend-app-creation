import Icon from "@/components/ui/icon";
import { Stats, ACHIEVEMENTS, LEVEL_MAP } from "./types";

interface Props {
  stats: Stats;
}

export default function ProgressTab({ stats }: Props) {
  const levelIdx = Math.min(Math.floor(stats.xp / 1000), 5);
  const nextLevel = LEVEL_MAP[Math.min(levelIdx + 1, 5)];
  const xpForNext = (levelIdx + 1) * 1000;
  const xpProgress = ((stats.xp % 1000) / 1000) * 100;

  return (
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
  );
}
