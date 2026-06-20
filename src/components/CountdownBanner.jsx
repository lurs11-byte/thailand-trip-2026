import './CountdownBanner.css';

export default function CountdownBanner() {
  const tripStart = new Date('2026-06-28T20:10:00');
  const now = new Date();
  const diff = tripStart - now;

  if (diff <= 0) {
    const tripEnd = new Date('2026-07-15T00:15:00');
    if (now < tripEnd) {
      return (
        <div className="countdown-banner active">
          🌴 הטיול מתחיל! ยินดีต้อนรับ (ברוכים הבאים) לתאילנד!
        </div>
      );
    }
    return (
      <div className="countdown-banner ended">
        🏠 חזרנו — עם זיכרונות לכל החיים!
      </div>
    );
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="countdown-banner">
      <span className="countdown-num">{days}</span> ימים ו-<span className="countdown-num">{hours}</span> שעות עד שעולים על המטוס ✈️
    </div>
  );
}
