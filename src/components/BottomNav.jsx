import './BottomNav.css';

const tabs = [
  { id: 'days', label: 'לו"ז', icon: '🗓️' },
  { id: 'flights', label: 'טיסות', icon: '✈️' },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`bottom-tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="bottom-tab-icon">{t.icon}</span>
          <span className="bottom-tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
