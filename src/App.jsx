import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import ProgramList from './pages/ProgramList';
import ProgramForm from './pages/ProgramForm';
import ProgramDetail from './pages/ProgramDetail';

function ProgramFormRoute() {
  const { id } = useParams();
  return <ProgramForm key={id ?? 'new'} />;
}

function ProgramDetailRoute() {
  const { id } = useParams();
  return <ProgramDetail key={id} />;
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem 0' }}>
        <button
          onClick={toggleTheme}
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', padding: '0.4rem 0.9rem', color: 'var(--color-text)' }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <Routes>
        <Route path="/" element={<ProgramList />} />
        <Route path="/programs/new" element={<ProgramFormRoute />} />
        <Route path="/programs/:id/edit" element={<ProgramFormRoute />} />
        <Route path="/programs/:id" element={<ProgramDetailRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;