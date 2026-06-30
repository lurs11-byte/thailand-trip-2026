import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import './DayDetail.css';

const tagConfig = {
  challenge: { emoji: '🎯', label: 'אתגר משפחתי', color: '#e74c3c', bg: '#fdedec' },
  photo:     { emoji: '📸', label: 'שווה צילום',    color: '#8e44ad', bg: '#f5eef8' },
  tip:       { emoji: '💡', label: 'טיפ',           color: '#d4a017', bg: '#fef9e7' },
  wow:       { emoji: '🤯', label: 'הידעת?',        color: '#2980b9', bg: '#eaf4fb' },
  dontmiss:  { emoji: '🌅', label: 'אל תפספסו',    color: '#27ae60', bg: '#eafaf1' },
};

const photoOwners = ['ישראל 👨', 'רינת 👩', 'גל 🧑', 'רועי 👦', 'אורי 🧒'];

function resizeImage(file, maxWidth = 800, quality = 0.75) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = url;
  });
}

function detectLinkType(url) {
  if (!url) return 'info';
  if (url.includes('maps.google') || url.includes('goo.gl/maps') || url.includes('waze')) return 'maps';
  if (url.includes('youtube') || url.includes('youtu.be')) return 'video';
  if (url.includes('booking.com')) return 'hotel';
  return 'info';
}

const linkConfig = {
  maps:  { icon: '📍', label: 'פתח במפות' },
  video: { icon: '🎥', label: 'סרטון' },
  hotel: { icon: '🏨', label: 'אתר המלון' },
  info:  { icon: '🌐', label: 'מידע נוסף' },
};

function TagBlock({ tag, tagText }) {
  const cfg = tagConfig[tag];
  if (!cfg) return null;
  return (
    <div className="tag-block" style={{ background: cfg.bg, borderColor: cfg.color + '40' }}>
      <span className="tag-emoji">{cfg.emoji}</span>
      <div>
        <span className="tag-label" style={{ color: cfg.color }}>{cfg.label}</span>
        <p className="tag-text">{tagText}</p>
      </div>
    </div>
  );
}

async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

function showNotification(title, body, imageUrl) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/pwa-192x192.png', image: imageUrl });
  }
}

export default function DayDetail({ day, onBack, onPrev, onNext }) {
  const [photoMemory, setPhotoMemory] = useState('');
  const [captions, setCaptions] = useState({});
  const [dayMoment, setDayMoment] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const momentKey = `moment_${day.date}`;
  const docRef = doc(db, 'days', day.date);

  useEffect(() => {
    requestNotificationPermission();
    setDayMoment(localStorage.getItem(momentKey) || '');

    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.photo) setPhotoMemory(data.photo);
        if (data.captions) setCaptions(data.captions);
      }
    });
    return unsub;
  }, [day.date]);

  const saveCaption = async (member, text) => {
    setCaptions(prev => ({ ...prev, [member]: text }));
    await setDoc(docRef, { captions: { [member]: text } }, { merge: true });
  };

  const savePhoto = async (base64, uploader) => {
    setPhotoMemory(base64);
    await setDoc(docRef, { photo: base64, uploadedBy: uploader, updatedAt: new Date().toISOString() }, { merge: true });
    showNotification(
      `📸 תמונת היום עודכנה — ${day.date}`,
      `${uploader} העלה/ה תמונה ליום ${day.location}`,
      base64.startsWith('data:') ? undefined : base64
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    resizeImage(file).then(async (base64) => {
      await savePhoto(base64, photoOwner);
      setUploading(false);
    });
  };

  const saveMoment = (val) => { setDayMoment(val); localStorage.setItem(momentKey, val); };

  const photoOwner = photoOwners[(day.dayNum - 1) % 5];

  return (
    <div className="detail-page fade-in">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>← חזרה</button>
        <div className="detail-nav">
          <button className="nav-btn" onClick={onPrev} disabled={!onPrev}>‹</button>
          <button className="nav-btn" onClick={onNext} disabled={!onNext}>›</button>
        </div>
      </div>

      <div className="detail-hero">
        <div className="detail-emoji">{day.emoji}</div>
        <div className="detail-date-row">
          <span className="detail-date">{day.date}</span>
          <span className="detail-dayname">{day.dayName}</span>
          <span className="detail-daynum">יום {day.dayNum}</span>
        </div>
        <h2 className="detail-location">{day.location}</h2>
      </div>

      <div className="detail-body">

        {/* הידעת? */}
        {day.didYouKnow && (
          <div className="did-you-know">
            <div className="dyk-header">🤯 הידעת?</div>
            <p>{day.didYouKnow}</p>
          </div>
        )}

        {/* חובה לזכור */}
        {day.mustRemember?.length > 0 && (
          <div className="must-remember">
            <div className="must-remember-title">🎒 חובה לזכור היום</div>
            <ul className="must-remember-list">
              {day.mustRemember.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* הערה */}
        {day.note && (
          <div className="detail-note">
            <span className="note-icon">💬</span>
            <p style={{ whiteSpace: 'pre-line' }}>{day.note}</p>
          </div>
        )}

        {/* לינה */}
        {day.hotel && (
          <section className="detail-section">
            <h3 className="section-title">🏨 לינה</h3>
            <div className="hotel-card">
              <div className="hotel-name">{day.hotel.name}</div>
              {day.hotel.confirmation && (
                <div className="hotel-confirmation">אישור: <strong>{day.hotel.confirmation}</strong></div>
              )}
              {day.hotel.link && (
                <a className="smart-link" href={day.hotel.link} target="_blank" rel="noreferrer">
                  🏨 אתר המלון ↗
                </a>
              )}
            </div>
          </section>
        )}

        {/* לו"ז */}
        {day.events.length > 0 && (
          <section className="detail-section">
            <h3 className="section-title">📋 לו״ז</h3>
            <div className="timeline">
              {day.events.map((event, i) => {
                const linkType = detectLinkType(event.link);
                const linkCfg = linkConfig[linkType];
                return (
                  <div key={i} className="timeline-item">
                    <div className="timeline-icon">{event.icon}</div>
                    <div className="timeline-content">
                      {event.time && <div className="timeline-time">{event.time}</div>}
                      <div className="timeline-title">{event.title}</div>
                      {event.subtitle && <div className="timeline-subtitle">{event.subtitle}</div>}
                      {event.highlight && <div className="event-highlight">{event.highlight}</div>}
                      {event.tag && event.tagText && <TagBlock tag={event.tag} tagText={event.tagText} />}
                      {event.link && (
                        <a className="smart-link" href={event.link} target="_blank" rel="noreferrer">
                          {linkCfg.icon} {linkCfg.label} ↗
                        </a>
                      )}
                    </div>
                    {i < day.events.length - 1 && <div className="timeline-line" />}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* המשפחה */}
        <section className="detail-section">
          <h3 className="section-title">👨‍👩‍👧‍👦 המשפחה</h3>
          <div className="family-row">
            {['ישראל 👨', 'רינת 👩', 'גל 🧑', 'רועי 👦', 'אורי 🧒'].map(m => (
              <div key={m} className="family-member">{m}</div>
            ))}
          </div>
        </section>

        {/* תמונת היום */}
        <section className="detail-section photo-day-section">
          <h3 className="section-title">📸 תמונת היום</h3>
          <div className="photo-owner-badge">אחראי היום: <strong>{photoOwner}</strong></div>
          <p className="photo-day-desc">תמונה אחת שמייצגת את היום — בסוף הטיול אלבום של 17 רגעים.</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            className="upload-photo-btn"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? '⏳ שומר...' : photoMemory ? '🔄 החלף תמונה' : '📷 העלה תמונה מהגלריה'}
          </button>

          {photoMemory && (
            <img className="photo-preview" src={photoMemory} alt="תמונת היום"
              onError={e => e.target.style.display = 'none'} />
          )}
          {photoMemory && <div className="memory-saved">✅ נשמר ומסונכרן לכולם</div>}

          {photoMemory && (
            <div className="captions-section">
              <div className="captions-title">✍️ כותרות המשפחה</div>
              {photoOwners.map(member => (
                <div key={member} className="caption-row">
                  <span className="caption-member">{member}</span>
                  <input
                    className="caption-input"
                    placeholder="כותרת לתמונה..."
                    value={captions[member] || ''}
                    onChange={e => saveCaption(member, e.target.value)}
                    dir="rtl"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* רגע היום */}
        <section className="detail-section moment-section">
          <h3 className="section-title">💬 רגע היום</h3>
          <p className="moment-desc">משפט אחד — הרגע הכי בלתי נשכח מהיום.</p>
          <textarea
            className="photo-memory-input"
            placeholder={`"אורי קפץ ראשון למים" • "השקיעה הייתה מטורפת" • "אבא לא הלך לאיבוד"`}
            value={dayMoment}
            onChange={e => saveMoment(e.target.value)}
            rows={2}
          />
          {dayMoment && <div className="memory-saved">✅ נשמר</div>}
        </section>

      </div>
    </div>
  );
}
