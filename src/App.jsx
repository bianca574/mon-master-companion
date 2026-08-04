import { useEffect, useState } from 'react';
import { loadPrograms } from './utils/storage';

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('monmaster_theme') || 'light'
  );
  const [programCount, setProgramCount] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('monmaster_theme', theme);
  }, [theme]);

  useEffect(() => {
    setProgramCount(loadPrograms().length);
  }, []);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ color: 'var(--color-primary)' }}>MonMaster Companion</h1>
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '0.5rem 1rem',
            color: 'var(--color-text)',
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <p style={{ color: 'var(--color-text-secondary)' }}>
        Candidatures enregistrées : {programCount}
      </p>
    </div>
  );
}

export default App;