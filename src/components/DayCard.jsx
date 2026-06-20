import { typeLabels } from '../data/tripData';
import './DayCard.css';

const typeColors = {
  travel: '#f39c12',
  explore: '#27ae60',
  beach: '#2980b9',
  city: '#8e44ad',
  unique: '#e74c3c',
  home: '#95a5a6',
};

const mealIcon = {
  hotel: { icon: '🏨', color: '#1a6b3c', short: 'כלול במלון' },
  gadi: { icon: '🍽️', color: '#2980b9', short: 'עם גדי' },
  self: { icon: '🍴', color: '#7f8c8d', short: 'בעצמנו' },
  plane: { icon: '✈️', color: '#8e44ad', short: 'על המטוס' },
  special: { icon: '🌟', color: '#d4a017', short: 'מיוחד!' },
};

export default function DayCard({ day, onClick }) {
  const color = typeColors[day.type] || '#95a5a6';
  const label = typeLabels[day.type]?.label || '';

  const today = new Date();
  const [d, m] = day.date.split('.').map(Number);
  const dayDate = new Date(2026, m - 1, d);
  const isToday = today.toDateString() === dayDate.toDateString();
  const isPast = dayDate < today && !isToday;

  const dinner = day.meals?.dinner;
  const dinnerStyle = dinner ? (mealIcon[dinner.status] || mealIcon.self) : null;

  return (
    <div
      className={`day-card fade-in ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
      onClick={onClick}
      style={{ '--accent': color }}
    >
      {isToday && <div className="today-bar">היום! 🌟</div>}

      <div className="day-card-main">
        <div className="day-card-left">
          <div className="day-emoji">{day.emoji}</div>
          <div className="day-num-box">
            <span className="day-date">{day.date}</span>
            <span className="day-name">{day.dayName}</span>
          </div>
        </div>

        <div className="day-card-center">
          <div className="day-location">{day.location}</div>
          {day.events.length > 0 && (
            <div className="day-events-preview">
              {day.events.slice(0, 2).map((e, i) => (
                <span key={i} className="event-dot">{e.icon} {e.time && `${e.time} `}{e.title}</span>
              ))}
            </div>
          )}
        </div>

        <div className="day-card-right">
          <span className="type-badge" style={{ background: color + '20', color }}>
            {label}
          </span>
          <span className="day-num">יום {day.dayNum}</span>
          <span className="arrow">›</span>
        </div>
      </div>

      <div className="day-card-footer">
        <div className="footer-item">
          <span className="footer-label">🏨 לינה</span>
          <span className="footer-value">{day.hotel ? day.hotel.name : '—'}</span>
        </div>
        {dinnerStyle && (
          <div className="footer-item">
            <span className="footer-label">🌙 ערב</span>
            <span className="footer-value" style={{ color: dinnerStyle.color }}>
              {dinnerStyle.icon} {dinnerStyle.short}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
