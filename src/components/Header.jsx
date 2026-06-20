import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-pattern" />
      <div className="header-content">
        <div className="header-emoji-row">🌸 🐘 🌴 🛺 🌺</div>
        <h1 className="header-title">תאילנד 2026</h1>
        <p className="header-subtitle">משפחת בן ברוך</p>
        <div className="header-family">
          {['ישראל 👨', 'רינת 👩', 'גל 🧑', 'רועי 👦', 'אורי 🧒'].map(m => (
            <span key={m} className="family-chip">{m}</span>
          ))}
        </div>
        <p className="header-dates">28.6 — 15.7.2026</p>
      </div>
    </header>
  );
}
