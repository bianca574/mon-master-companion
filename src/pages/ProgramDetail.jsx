import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { loadPrograms, addDocument, toggleDocument, removeDocument, loadLetters, loadRecommendations } from '../utils/storage';
import { STATUS_LABELS, STATUS_COLORS } from '../utils/constants';
import { calculateReadiness } from '../utils/readiness';

function ProgramDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(() => loadPrograms().find((p) => p.id === id) || null);
    const [newDoc, setNewDoc] = useState('');

    function refresh() {
        const found = loadPrograms().find((p) => p.id === id);
        setProgram(found || null);
    }

    if (!program) {
        return (
            <div style={{ padding: '2rem' }}>
                <p>Candidature introuvable.</p>
                <Link to="/">Retour à la liste</Link>
            </div>
        );
    }

    const color = STATUS_COLORS[program.status];
    const total = program.documents.length;
    const doneCount = program.documents.filter((d) => d.done).length;

    const readiness = calculateReadiness(program, loadLetters(), loadRecommendations());

    function handleAddDoc(e) {
        e.preventDefault();
        if (!newDoc.trim()) return;
        addDocument(program.id, newDoc.trim());
        setNewDoc('');
        refresh();
    }

    function handleToggle(docId) {
        toggleDocument(program.id, docId);
        refresh();
    }

    function handleRemove(docId) {
        removeDocument(program.id, docId);
        refresh();
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
            <Link to="/programs" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                ← Retour
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                <div>
                    <h1 style={{ color: 'var(--color-primary)' }}>{program.university}</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{program.programName}</p>
                </div>
                <span
                    style={{
                        background: color.bg,
                        color: color.text,
                        borderRadius: 'var(--radius-pill)',
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {STATUS_LABELS[program.status]}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                {program.deadline && <span>Échéance : {new Date(program.deadline).toLocaleDateString('fr-FR')}</span>}
                {program.website && (
                    <a href={program.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                        Site web
                    </a>
                )}
                <button onClick={() => navigate(`/programs/${program.id}/edit`)} style={{ marginLeft: 'auto' }}>
                    Modifier
                </button>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3>Documents</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        {doneCount} / {total}
                    </span>
                </div>

                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>Préparation de la candidature</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{readiness}%</span>
                    </div>
                    <div style={{ background: 'var(--color-border)', borderRadius: 'var(--radius-pill)', height: 10, overflow: 'hidden' }}>
                        <div style={{ width: `${readiness}%`, height: '100%', background: 'var(--color-primary)' }} />
                    </div>
                </div>

                {program.documents.map((doc) => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0' }}>
                        <input type="checkbox" checked={doc.done} onChange={() => handleToggle(doc.id)} />
                        <span style={{ flex: 1, textDecoration: doc.done ? 'line-through' : 'none', color: doc.done ? 'var(--color-text-secondary)' : 'var(--color-text)' }}>
                            {doc.label}
                        </span>
                        <button onClick={() => handleRemove(doc.id)} style={{ background: 'none', border: 'none', color: 'var(--color-secondary)' }}>
                            ✕
                        </button>
                    </div>
                ))}

                <form onSubmit={handleAddDoc} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <input
                        value={newDoc}
                        onChange={(e) => setNewDoc(e.target.value)}
                        placeholder="Ex : portfolio, lettre de recommandation..."
                        style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                    />
                    <button type="submit">+ Ajouter</button>
                </form>
            </div>

            {program.notes && (
                <div>
                    <h3>Notes</h3>
                    <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{program.notes}</p>
                </div>
            )}
        </div>
    );
}

export default ProgramDetail;