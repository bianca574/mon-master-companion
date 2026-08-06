import { useState } from 'react';
import { loadPrograms, loadLetters, addLetterVersion, deleteLetterVersion, getLettersForProgram } from '../utils/storage';

function LetterManager() {
    const [programs] = useState(() => loadPrograms());
    const [selectedProgramId, setSelectedProgramId] = useState(programs[0]?.id || '');
    const [, setRefreshTick] = useState(0);
    const [draft, setDraft] = useState('');

    const versions = getLettersForProgram(selectedProgramId);

    function refresh() {
        setRefreshTick((t) => t + 1);
    }

    function handleSave() {
        if (!draft.trim() || !selectedProgramId) return;
        addLetterVersion(selectedProgramId, draft.trim());
        setDraft('');
        refresh();
    }

    function handleDelete(id) {
        if (confirm('Supprimer cette version ?')) {
            deleteLetterVersion(id);
            refresh();
        }
    }

    const inputStyle = {
        width: '100%',
        padding: '0.6rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Lettres de motivation</h1>

            {programs.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>Ajoutez une candidature avant de rédiger une lettre.</p>
            ) : (
                <>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Candidature</label>
                    <select
                        style={{ ...inputStyle, marginBottom: '1.5rem' }}
                        value={selectedProgramId}
                        onChange={(e) => setSelectedProgramId(e.target.value)}
                    >
                        {programs.map((p) => (
                            <option key={p.id} value={p.id}>{p.university} — {p.programName}</option>
                        ))}
                    </select>

                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '0.75rem' }}>Nouvelle version</h3>
                        <textarea
                            style={{ ...inputStyle, minHeight: 160, marginBottom: '0.75rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Rédigez ou collez votre lettre ici..."
                        />
                        <button
                            onClick={handleSave}
                            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600 }}
                        >
                            Enregistrer comme nouvelle version
                        </button>
                    </div>

                    <h3 style={{ marginBottom: '0.75rem' }}>Historique des versions</h3>
                    {versions.length === 0 && (
                        <p style={{ color: 'var(--color-text-secondary)' }}>Aucune version pour cette candidature.</p>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {versions.map((v) => (
                            <details
                                key={v.id}
                                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}
                            >
                                <summary style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 600 }}>
                                    <span>
                                        Version {v.versionNumber}{' '}
                                        <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                                            — modifiée le {new Date(v.createdAt).toLocaleDateString('fr-FR')}
                                        </span>
                                    </span>
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleDelete(v.id); }}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-secondary)' }}
                                    >
                                        ✕
                                    </button>
                                </summary>
                                <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', marginTop: '0.75rem', color: 'var(--color-text-secondary)' }}>{v.content}</p>
                            </details>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default LetterManager;