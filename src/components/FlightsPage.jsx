import { useState } from 'react';
import { flights } from '../data/flightsData';
import './FlightsPage.css';

export default function FlightsPage() {
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div className="flights-page">
      <div className="flights-header">
        <h2>✈️ טיסות</h2>
        <p>5 טיסות • 3 חברות תעופה</p>
        <div className="flights-tip">
          💡 כשנפתח צ'ק-אין — לחצו "בדיקת טיסה" ► הוסיפו ל-Wallet
        </div>
      </div>

      <div className="flights-list">
        {flights.map((f) => {
          const isOpen = expanded === f.id;
          const today = new Date();
          const [d, m, y] = f.checkinOpens.split('.').map(Number);
          const checkinDate = new Date(y, m - 1, d);
          const checkinOpen = today >= checkinDate;
          const [fd, fm, fy] = f.date.split('.').map(Number);
          const flightDate = new Date(fy, fm - 1, fd);
          const isPast = flightDate < today;

          return (
            <div
              key={f.id}
              className={`flight-card ${isPast ? 'past' : ''}`}
              style={{ '--fcolor': f.color }}
            >
              <div className="flight-card-main" onClick={() => toggle(f.id)}>
                <div className="flight-num">{f.emoji}</div>
                <div className="flight-info">
                  <div className="flight-route">{f.route}</div>
                  <div className="flight-meta">{f.date} • {f.dayLabel}</div>
                  <div className="flight-airline">{f.airline}</div>
                  <div className="flight-segments-row">
                    {f.segments.map((seg, i) => (
                      <span key={i} className="seg-chip">
                        {seg.from} {seg.dep} → {seg.to} {seg.arr} <strong>{seg.flight}</strong>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flight-card-right">
                  {checkinOpen
                    ? <span className="checkin-badge open">צ'ק-אין פתוח!</span>
                    : <span className="checkin-badge">{f.checkinOpens}</span>
                  }
                  <span className="expand-arrow">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div className="flight-details fade-in">
                  <div className="detail-grid">
                    <div className="detail-row">
                      <span className="dl">📋 אישור</span>
                      <span className="dv mono">{f.confirmation}</span>
                    </div>
                    {f.pnr && f.pnr !== f.confirmation && (
                      <div className="detail-row">
                        <span className="dl">🔑 PNR</span>
                        <span className="dv mono">{f.pnr}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="dl">🏛️ טרמינל</span>
                      <span className="dv">{f.terminal}</span>
                    </div>
                    <div className="detail-row">
                      <span className="dl">🧳 מטען</span>
                      <span className="dv">{f.baggage}</span>
                    </div>
                  </div>

                  {f.tickets && (
                    <div className="tickets-section">
                      <div className="tickets-title">🎫 מספרי כרטיסים</div>
                      {f.tickets.map((t) => (
                        <div key={t.name} className="ticket-row">
                          <span className="ticket-name">{t.name}</span>
                          <span className="ticket-num mono">{t.number}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <a
                    className="checkin-btn"
                    href={f.airlineUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: f.color }}
                  >
                    בדיקת טיסה / צ'ק-אין ↗
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="wallet-tip">
        <div className="wallet-title">📱 כיצד להוסיף ל-Wallet?</div>
        <ol className="wallet-steps">
          <li>פתחו את מייל אישור ההזמנה מחברת התעופה</li>
          <li>לחצו "Add to Apple Wallet" / "הוסף לארנק"</li>
          <li>הכרטיס יעודכן אוטומטית עם שינויי שעה / שער</li>
        </ol>
      </div>
    </div>
  );
}
