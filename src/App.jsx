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
