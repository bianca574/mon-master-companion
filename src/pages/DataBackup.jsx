import { useRef, useState } from 'react';
import { exportAllData, importAllData } from '../utils/storage';

function DataBackup() {
    const fileInputRef = useRef(null);
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

    function handleImportClick() {
        fileInputRef.current?.click();
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const data = JSON.parse(reader.result);
                const confirmed = confirm('Ceci va remplacer toutes vos données actuelles par celles du fichier. Cette action est irréversible. Continuer ?');
                if (!confirmed) return;

                await importAllData(data);
                setMessage('Import réussi. Rechargez la page pour voir vos données.');
            } catch (err) {
                console.error('Import failed', err);
                setMessage("Échec de l'import : " + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '2rem' }}>Sauvegarde des données</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem' }}>
                Exportez régulièrement vos données en JSON. L'import remplace intégralement vos données actuelles.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginRight: '3rem', marginBottom: '1rem' }}>
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