import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRecommendation, updateRecommendation, loadRecommendations, loadPrograms } from '../utils/storage';
import { REC_STATUS_LABELS } from '../utils/constants';

const EMPTY_FORM = {
    name: '',
    institution: '',
    status: 'not_asked',
    programIds: [],
    askedDate: '',
    notes: '',
};

function RecommendationForm() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            loadPrograms(),
            isEditing ? loadRecommendations() : Promise.resolve(null),
        ]).then(([programsData, recs]) => {
            setPrograms(programsData);
            if (isEditing && recs) {
                const existing = recs.find((r) => r.id === id);
                if (existing) {
                    setForm({
                        name: existing.name,
                        institution: existing.institution,
                        status: existing.status,
                        programIds: existing.programIds,
                        askedDate: existing.askedDate || '',
                        notes: existing.notes,
                    });
                }
            }
            setLoading(false);
        });
    }, [id, isEditing]);

    function handleChange(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function toggleProgram(programId) {
        setForm((f) => ({
            ...f,
            programIds: f.programIds.includes(programId)
                ? f.programIds.filter((id_) => id_ !== programId)
                : [...f.programIds, programId],
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            await updateRecommendation(id, form);
        } else {
            await createRecommendation(form);
        }
        navigate('/recommendations');
    }

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Chargement...</div>;
    }

    const inputStyle = {
        width: '100%',
        padding: '0.6rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        marginBottom: '1rem',
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                {isEditing ? 'Modifier la recommandation' : 'Nouvelle recommandation'}
            </h1>

            <form onSubmit={handleSubmit}>
                <label>Nom</label>
                <input style={inputStyle} value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />

                <label>Institution / poste</label>
                <input style={inputStyle} value={form.institution} onChange={(e) => handleChange('institution', e.target.value)} />

                <label>Statut</label>
                <select style={inputStyle} value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                    {Object.entries(REC_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <label>Date de la demande</label>
                <input type="date" style={inputStyle} value={form.askedDate} onChange={(e) => handleChange('askedDate', e.target.value)} />

                <label>Candidatures concernées</label>
                <div style={{ marginBottom: '1rem' }}>
                    {programs.length === 0 && (
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Aucune candidature enregistrée.</p>
                    )}
                    {programs.map((p) => (
                        <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <input type="checkbox" checked={form.programIds.includes(p.id)} onChange={() => toggleProgram(p.id)} />
                            {p.university} — {p.programName}
                        </label>
                    ))}
                </div>

                <label>Notes</label>
                <textarea style={{ ...inputStyle, minHeight: 80 }} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600 }}>
                        Enregistrer
                    </button>
                    <button type="button" onClick={() => navigate('/recommendations')}>Annuler</button>
                </div>
            </form>
        </div>
    );
}

export default RecommendationForm;