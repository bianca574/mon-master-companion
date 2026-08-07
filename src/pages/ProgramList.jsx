import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPrograms, deleteProgram } from '../utils/storage';
import { STATUS_LABELS, STATUS_COLORS, PREDEFINED_TAGS } from '../utils/constants';

function ProgramList() {
    const [programs, setPrograms] = useState(() => loadPrograms());

    const navigate = useNavigate();
    const [activeFilters, setActiveFilters] = useState([]);

    const allTagsInUse = [...new Set(programs.flatMap((p) => p.tags || []))];
    const filterOptions = [...new Set([...PREDEFINED_TAGS, ...allTagsInUse])];

    const filteredPrograms = activeFilters.length === 0
        ? programs
        : programs.filter((p) => (p.tags || []).some((t) => activeFilters.includes(t)));

    function toggleFilter(tag) {
        setActiveFilters((f) => (f.includes(tag) ? f.filter((t) => t !== tag) : [...f, tag]));
    }

    function handleDelete(id) {
        if (confirm('Supprimer cette candidature ?')) {
            setPrograms(deleteProgram(id));
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ color: 'var(--color-primary)' }}>Mes candidatures</h1>
                <button
                    onClick={() => navigate('/programs/new')}
                    style={{
                        background: 'var(--color-secondary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 'var(--radius-pill)',
                        padding: '0.6rem 1.2rem',
                        fontWeight: 600,
                    }}
                >
                    + Nouvelle candidature
                </button>
            </div>

            {filterOptions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {filterOptions.map((tag) => {
                        const active = activeFilters.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => toggleFilter(tag)}
                                style={{
                                    background: active ? 'var(--color-primary)' : 'var(--color-surface)',
                                    color: active ? '#fff' : 'var(--color-text)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-pill)',
                                    padding: '0.3rem 0.7rem',
                                    fontSize: '0.8rem',
                                }}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            )}

            {filteredPrograms.length === 0 && (
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Aucune candidature pour le moment. Ajoutez votre première candidature.
                </p>
            )
            }

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer' }}>
                {filteredPrograms.map((p) => {
                    const color = STATUS_COLORS[p.status];
                    return (
                        <div
                            key={p.id}
                            onClick={() => navigate(`/programs/${p.id}`)}
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
                                <div style={{ fontWeight: 600 }}>{p.university}</div>
                                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                    {p.programName}
                                </div>
                                {p.deadline && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                        Échéance : {new Date(p.deadline).toLocaleDateString('fr-FR')}
                                    </div>
                                )}
                                {p.tags && p.tags.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.7rem', paddingRight: '3rem' }}>
                                        {p.tags.map((tag) => (
                                            <span key={tag} style={{ fontSize: '0.75rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', padding: '0.1rem 0.75rem' }}>{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                                    {STATUS_LABELS[p.status]}
                                </span>
                                <button onClick={(e) => { e.stopPropagation(); navigate(`/programs/${p.id}/edit`); }}>Modifier</button>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}>Supprimer</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}

export default ProgramList;