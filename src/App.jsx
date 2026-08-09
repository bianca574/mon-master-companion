import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProgramList from './pages/ProgramList';
import ProgramForm from './pages/ProgramForm';
import ProgramDetail from './pages/ProgramDetail';
import RecommendationList from './pages/RecommendationList';
import RecommendationForm from './pages/RecommendationForm';
import DecisionHelper from './pages/DecisionHelper';
import LetterManager from './pages/LetterManager';
import DataBackup from './pages/DataBackup';
import LetterDiff from './pages/LetterDiff';
import Calendar from './pages/Calendar';
import Journal from './pages/Journal';

function ProgramFormRoute() {
  const { id } = useParams();
  return <ProgramForm key={id ?? 'new'} />;
}

function ProgramDetailRoute() {
  const { id } = useParams();
  return <ProgramDetail key={id} />;
}

function RecommendationFormRoute() {
  const { id } = useParams();
  return <RecommendationForm key={id ?? 'new'} />;
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('monmaster_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('monmaster_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Tableau de bord</Link>
          <Link to="/programs" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Candidatures</Link>
          <Link to="/recommendations" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Recommandations</Link>
          <Link to="/decision" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Décision</Link>
          <Link to="/letters" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Lettres</Link>
          <Link to="/letters/compare" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Comparer</Link>
          <Link to="/calendar" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Calendrier</Link>
          <Link to="/journal" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Journal</Link>
          <Link to="/backup" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sauvegarde</Link>
        </div>
        <button
          onClick={toggleTheme}
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', padding: '0.4rem 0.9rem', color: 'var(--color-text)' }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/programs" element={<ProgramList />} />
        <Route path="/programs/new" element={<ProgramFormRoute />} />
        <Route path="/programs/:id/edit" element={<ProgramFormRoute />} />
        <Route path="/programs/:id" element={<ProgramDetailRoute />} />
        <Route path="/recommendations" element={<RecommendationList />} />
        <Route path="/recommendations/new" element={<RecommendationFormRoute />} />
        <Route path="/recommendations/:id/edit" element={<RecommendationFormRoute />} />
        <Route path="/decision" element={<DecisionHelper />} />
        <Route path="/letters" element={<LetterManager />} />
        <Route path="/letters/compare" element={<LetterDiff />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/backup" element={<DataBackup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;