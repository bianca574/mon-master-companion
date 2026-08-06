import { useRef, useState } from 'react';
import { exportAllData, importAllData } from '../utils/storage';

function DataBackup() {
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState('');

    function handleExport() {
        const data = exportAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `monmaster-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function handleImportClick() {
        fileInputRef.current?.click();
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                if (!confirm('Cela va remplacer toutes vos données actuelles par celles du fichier. Continuer ?')) return;
                importAllData(data);
                setMessage('Import réussi. Rechargez la page pour voir vos données.');
            } catch (err) {
                console.error('Import failed', err);
                setMessage("Échec de l'import : fichier invalide.");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Sauvegarde des données</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Toutes vos données sont stockées localement dans votre navigateur. Exportez régulièrement pour éviter de les perdre.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <button
                    onClick={handleExport}
                    style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600 }}
                >
                    Exporter (JSON)
                </button>
                <button
                    onClick={handleImportClick}
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', color: 'var(--color-text)' }}
                >
                    Importer
                </button>
                <input type="file" accept="application/json" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            </div>

            {message && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{message}</p>}
        </div>
    );
}

export default DataBackup;