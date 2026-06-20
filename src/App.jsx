import { useState } from 'react';
import { days, typeLabels } from './data/tripData';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import DayCard from './components/DayCard';
import DayDetail from './components/DayDetail';
import CountdownBanner from './components/CountdownBanner';
import FlightsPage from './components/FlightsPage';
import BottomNav from './components/BottomNav';
import './App.css';

function getTodayIndex() {
  const today = new Date();
  for (let i = 0; i < days.length; i++) {
    const [d, m] = days[i].date.split('.').map(Number);
    const dayDate = new Date(2026, m - 1, d);
    if (today <= dayDate) return i;
  }
  return days.length - 1;
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('days');

  const filteredDays = filter === 'all'
    ? days
    : days.filter(d => d.type === filter);

  if (selectedDay !== null) {
    return (
      <>
        <DayDetail
          day={days[selectedDay]}
          onBack={() => setSelectedDay(null)}
          onPrev={selectedDay > 0 ? () => setSelectedDay(selectedDay - 1) : null}
          onNext={selectedDay < days.length - 1 ? () => setSelectedDay(selectedDay + 1) : null}
        />
        <BottomNav active={tab} onChange={(t) => { setTab(t); setSelectedDay(null); }} />
      </>
    );
  }

  return (
    <div className="app">
      <Header />
      <CountdownBanner />

      {tab === 'days' && (
        <>
          <FilterBar active={filter} onChange={setFilter} typeLabels={typeLabels} />

          <div className="today-btn-wrap">
            <button className="today-btn" onClick={() => setSelectedDay(getTodayIndex())}>
              📍 מה קורה היום?
            </button>
          </div>

          <div className="days-grid">
            {filteredDays.map((day) => (
              <DayCard
                key={day.date}
                day={day}
                onClick={() => setSelectedDay(days.indexOf(day))}
              />
            ))}
          </div>
          <footer className="app-footer">
            🐘 משפחת בן ברוך • תאילנד 2026 🌺
          </footer>
        </>
      )}

      {tab === 'flights' && <FlightsPage />}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
