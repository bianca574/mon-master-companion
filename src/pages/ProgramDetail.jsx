import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { loadProgram, addDocument, toggleDocument, removeDocument, loadLetters, loadRecommendations } from '../utils/storage';
import { STATUS_LABELS, STATUS_COLORS } from '../utils/constants';
import { getReadinessDetail } from '../utils/readiness';

function ProgramDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [readinessDetail, setReadinessDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newDoc, setNewDoc] = useState('');

    useEffect(() => {
        Promise.all([loadProgram(id), loadLetters(), loadRecommendations()]).then(
            ([prog, letters, recommendations]) => {
                setProgram(prog);
                setReadinessDetail(getReadinessDetail(prog, letters, recommendations));
                setLoading(false);
            }
        );
    }, [id]);

    async function refresh() {
        const [prog, letters, recommendations] = await Promise.all([
            loadProgram(id),
            loadLetters(),
            loadRecommendations(),
        ]);
        setProgram(prog);
        setReadinessDetail(getReadinessDetail(prog, letters, recommendations));
        setLoading(false);
    }

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Chargement...</div>;
    }

    if (!program) {
        return (
            <div style={{ padding: '2rem' }}>
                <p>Candidature introuvable.</p>
                <Link to="/programs">Retour à la liste</Link>
            </div>
        );
    }

    const color = STATUS_COLORS[program.status];
    const total = program.documents.length;
    const doneCount = program.documents.filter((d) => d.done).length;

    async function handleAddDoc(e) {
        e.preventDefault();
        if (!newDoc.trim()) return;
        await addDocument(program.id, newDoc.trim());
        setNewDoc('');
        refresh();
    }

    async function handleToggle(docId) {
        await toggleDocument(program.id, docId);
        refresh();
    }

    async function handleRemove(docId) {
        await removeDocument(program.id, docId);
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

                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
                        <span style={{ fontWeight: 600 }}>Préparation de la candidature</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{readinessDetail.score}%</span>
                    </div>
                    <div style={{ background: 'var(--color-border)', borderRadius: 'var(--radius-pill)', height: 10, overflow: 'hidden', marginBottom: '1.5rem' }}>
                        <div style={{ width: `${readinessDetail.score}%`, height: '100%', background: 'var(--color-primary)' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {readinessDetail.parts.map((part) => (
                            <div key={part.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                <span>{part.label}</span>
                                <span>{Math.round(part.score * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3>Documents</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        {doneCount} / {total}
                    </span>
                </div>

                {program.documents.map((doc) => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0' }}>
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