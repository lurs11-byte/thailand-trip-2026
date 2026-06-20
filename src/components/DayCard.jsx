import './DayCard.css';

const typeColors = {
  travel: '#f39c12',
  explore: '#27ae60',
  beach: '#2980b9',
  city: '#8e44ad',
  unique: '#e74c3c',
  home: '#95a5a6',
};

const vibeConfig = {
  travel: { icon: '✈️', label: 'טיסה' },
  explore: { icon: '🏔️', label: 'טבע' },
  beach: { icon: '🏝️', label: 'חוף' },
  city: { icon: '🏙️', label: 'עיר' },
  unique: { icon: '🪂', label: 'מיוחד' },
  home: { icon: '🏠', label: 'בית' },
};

const mealIcon = {
  hotel: { icon: '🏨', color: '#1a6b3c', short: 'כלול' },
  gadi: { icon: '🍽️', color: '#2980b9', short: 'עם גדי' },
  self: { icon: '🍴', color: '#7f8c8d', short: 'בעצמנו' },
  plane: { icon: '✈️', color: '#8e44ad', short: 'על המטוס' },
  special: { icon: '🌟', color: '#d4a017', short: 'מיוחד!' },
};

export default function DayCard({ day, onClick }) {
  const color = typeColors[day.type] || '#95a5a6';
  const vibe = vibeConfig[day.type] || vibeConfig.explore;

  const today = new Date();
  const [d, m] = day.date.split('.').map(Number);
  const dayDate = new Date(2026, m - 1, d);
  const isToday = today.toDateString() === dayDate.toDateString();
  const isPast = dayDate < today && !isToday;

  const dinner = day.meals?.dinner;
  const dinnerStyle = dinner ? (mealIcon[dinner.status] || mealIcon.self) : null;

  const topEvents = day.events.slice(0, 3);

  return (
    <div
      className={`day-card fade-in ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
      onClick={onClick}
      style={{ '--accent': color }}
    >
      {isToday && <div className="today-bar">היום! 🌟</div>}

      {/* רמה 1: גיבור */}
      <div className="card-hero">
        <span className="card-big-emoji">{day.emoji}</span>
        <div className="card-hero-text">
          <div className="card-location">{day.location}</div>
          <div className="card-meta">
            <span>{day.date}</span>
            <span className="meta-sep">·</span>
            <span>{day.dayName}</span>
            <span className="meta-sep">·</span>
            <span>יום {day.dayNum}</span>
          </div>
        </div>
        <span
          className="vibe-chip"
          style={{ color, background: color + '18', borderColor: color + '40' }}
        >
          {vibe.icon} {vibe.label}
        </span>
      </div>

      {/* רמה 2: הייליטים */}
      {topEvents.length > 0 && (
        <div className="card-events">
          {topEvents.map((e, i) => (
            <div key={i} className="card-event-row">
              <span className="card-event-icon">{e.icon}</span>
              <span className="card-event-title">{e.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* רמה 3: פוטר */}
      <div className="card-footer">
        {day.hotel && (
          <span className="footer-chip">🏨 {day.hotel.name}</span>
        )}
        {dinnerStyle && (
          <span className="footer-chip" style={{ color: dinnerStyle.color }}>
            {dinnerStyle.icon} {dinnerStyle.short}
          </span>
        )}
      </div>
    </div>
  );
}
