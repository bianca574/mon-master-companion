import { useEffect, useState } from 'react';
import {
    loadCriteria, createCriterion, updateCriterion, deleteCriterion,
    loadPrograms, updateProgramScore,
} from '../utils/storage';

function DecisionHelper() {
    const [criteria, setCriteria] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCriterionName, setNewCriterionName] = useState('');

    useEffect(() => {
        Promise.all([loadCriteria(), loadPrograms()]).then(([criteriaData, programsData]) => {
            setCriteria(criteriaData);
            setPrograms(programsData);
            setLoading(false);
        });
    }, []);

    const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight), 0);

    async function handleAddCriterion(e) {
        e.preventDefault();
        if (!newCriterionName.trim()) return;
        const created = await createCriterion({ name: newCriterionName.trim(), weight: 10 });
        setCriteria((c) => [...c, created]);
        setNewCriterionName('');
    }

    async function handleWeightChange(id, weight) {
        const updated = await updateCriterion(id, { weight: Number(weight), name: criteria.find((c) => c.id === id).name });
        setCriteria((c) => c.map((crit) => (crit.id === id ? updated : crit)));
    }

    async function handleNameChange(id, name) {
        const updated = await updateCriterion(id, { name, weight: criteria.find((c) => c.id === id).weight });
        setCriteria((c) => c.map((crit) => (crit.id === id ? updated : crit)));
    }

    async function handleDeleteCriterion(id) {
        await deleteCriterion(id);
        setCriteria((c) => c.filter((crit) => crit.id !== id));
    }

    async function handleScoreChange(programId, criteriaId, value) {
        const updated = await updateProgramScore(programId, criteriaId, Number(value));
        setPrograms((p) => p.map((prog) => (prog.id === programId ? updated : prog)));
    }

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Chargement...</div>;
    }

    function weightedTotal(program) {
        return criteria.reduce((sum, c) => sum + (c.weight / 100) * (program.scores?.[c.id] || 0), 0);
    }

    const ranked = [...programs].sort((a, b) => weightedTotal(b) - weightedTotal(a));
    const maxScore = Math.max(...ranked.map(weightedTotal), 1);

    const inputStyle = {
        padding: '0.4rem 0.6rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Aide à la décision</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Définissez les critères et leur poids, notez chaque candidature et l'app calcule.
            </p>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3>Critères et poids</h3>
                    <span style={{ fontSize: '0.85rem', color: totalWeight === 100 ? 'var(--color-status-ok)' : 'var(--color-status-urgent)', fontWeight: 600 }}>
                        Total : {totalWeight}%
                    </span>
                </div>

                {criteria.map((c) => (
                    <div key={c.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <input style={{ ...inputStyle, flex: 1 }} value={c.name} onChange={(e) => handleNameChange(c.id, e.target.value)} />
                        <input
                            type="number" min="0" max="100" style={{ ...inputStyle, width: 70 }}
                            value={c.weight} onChange={(e) => handleWeightChange(c.id, e.target.value)}
                        />
                        <span style={{ color: 'var(--color-text-secondary)' }}>%</span>
                        <button onClick={() => handleDeleteCriterion(c.id)} style={{ background: 'none', border: 'none', color: 'var(--color-secondary)' }}>✕</button>
                    </div>
                ))}

                <form onSubmit={handleAddCriterion} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <input
                        style={{ ...inputStyle, flex: 1 }}
                        value={newCriterionName}
                        onChange={(e) => setNewCriterionName(e.target.value)}
                        placeholder="Ex : Prestige, Insertion professionnelle, Opportunités de recherche, Location,..."
                    />
                    <button type="submit">+ Ajouter</button>
                </form>
            </div>

            {criteria.length > 0 && (
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem', overflowX: 'auto' }}>
                    <h3 style={{ marginBottom: '0.75rem' }}>Notes par candidature (0 à 10)</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '0.4rem' }}>Candidature</th>
                                {criteria.map((c) => (
                                    <th key={c.id} style={{ textAlign: 'center', padding: '0.4rem', fontSize: '0.85rem' }}>{c.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ padding: '0.4rem', fontWeight: 600 }}>{p.programName}, {p.university}</td>
                                    {criteria.map((c) => (
                                        <td key={c.id} style={{ padding: '0.4rem', textAlign: 'center' }}>
                                            <input
                                                type="number" min="0" max="10" style={{ ...inputStyle, width: 55, textAlign: 'center' }}
                                                value={p.scores?.[c.id] ?? ''}
                                                onChange={(e) => handleScoreChange(p.id, c.id, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {criteria.length > 0 && programs.length > 0 && (
                <div>
                    <h3 style={{ marginBottom: '0.75rem' }}>Classement personnalisé</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {ranked.map((p, i) => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ width: 20, fontWeight: 700, color: 'var(--color-text-secondary)' }}>{i + 1}</span>
                                <span style={{ width: 160 }}>{p.programName}, {p.university}</span>
                                <div style={{ flex: 1, background: 'var(--color-border)', borderRadius: 'var(--radius-pill)', height: 10, overflow: 'hidden' }}>
                                    <div style={{ width: `${(weightedTotal(p) / maxScore) * 100}%`, height: '100%', background: 'var(--color-primary)' }} />
                                </div>
                                <span style={{ width: 50, textAlign: 'right', fontWeight: 600 }}>{weightedTotal(p).toFixed(1)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DecisionHelper;