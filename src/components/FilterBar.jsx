import './FilterBar.css';

const filters = [
  { id: 'all', label: 'הכל', emoji: '🗺️' },
  { id: 'travel', label: 'נסיעות', emoji: '✈️' },
  { id: 'explore', label: 'עיר', emoji: '🏙️' },
  { id: 'beach', label: 'חוף', emoji: '🌊' },
  { id: 'unique', label: 'ייחודי', emoji: '⭐' },
];

export default function FilterBar({ active, onChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-scroll">
        {filters.map(f => (
          <button
            key={f.id}
            className={`filter-btn ${active === f.id ? 'active' : ''}`}
            onClick={() => onChange(f.id)}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
