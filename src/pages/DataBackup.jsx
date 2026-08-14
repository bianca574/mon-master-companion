import { useState } from 'react';
import { exportAllData } from '../utils/storage';

function DataBackup() {
    const [message, setMessage] = useState('');

    async function handleExport() {
        try {
            const data = await exportAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `monmaster-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            setMessage("Échec de l'export : " + err.message);
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Sauvegarde des données</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Exportez régulièrement vos données en JSON.
            </p>

            <button
                onClick={handleExport}
                style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600 }}
            >
                Exporter (JSON)
            </button>

            {message && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{message}</p>}
        </div>
    );
}

export default DataBackup;