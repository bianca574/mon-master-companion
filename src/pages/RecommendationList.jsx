import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadRecommendations, deleteRecommendation, loadPrograms } from '../utils/storage';
import { REC_STATUS_LABELS, REC_STATUS_COLORS } from '../utils/constants';

function RecommendationList() {
    const [recommendations, setRecommendations] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([loadRecommendations(), loadPrograms()]).then(([recs, progs]) => {
            setRecommendations(recs);
            setPrograms(progs);
            setLoading(false);
        });
    }, []);

    function programNames(ids) {
        return ids
            .map((id) => {
                const p = programs.find((p) => p.id === id);
                return p ? `${p.programName}, ${p.university}` : null;
            })
            .filter(Boolean)
            .join(' · ');
    }

    async function handleDelete(id) {
        if (confirm('Supprimer cette recommandation ?')) {
            await deleteRecommendation(id);
            setRecommendations((prev) => prev.filter((r) => r.id !== id));
        }
    }

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Chargement...</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ color: 'var(--color-primary)' }}>Recommandations</h1>
                <button
                    onClick={() => navigate('/recommendations/new')}
                    style={{ background: 'var(--color-secondary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600 }}
                >
                    + Ajouter
                </button>
            </div>

            {recommendations.length === 0 && (
                <p style={{ color: 'var(--color-text-secondary)' }}>Aucune recommandation pour le moment.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recommendations.map((r) => {
                    const color = REC_STATUS_COLORS[r.status];
                    return (
                        <div
                            key={r.id}
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 600 }}>{r.name}</div>
                                {r.institution && (
                                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{r.institution}</div>
                                )}
                                {r.programIds.length > 0 && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                        Pour : {programNames(r.programIds)}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ background: color.bg, color: color.text, borderRadius: 'var(--radius-pill)', padding: '0.3rem 0.75rem', fontSize: '0.8rem', fontWeight: 600 }}>
                                    {REC_STATUS_LABELS[r.status]}
                                </span>
                                <button onClick={() => navigate(`/recommendations/${r.id}/edit`)}>Modifier</button>
                                <button onClick={() => handleDelete(r.id)}>Supprimer</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RecommendationList;